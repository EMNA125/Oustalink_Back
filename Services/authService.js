const { supabase, supabaseAdmin } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

async function signUp(email, password, role, additionalDetails) {
  console.log('AuthService - Email:', email);
  let authUserId;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    authUserId = authData.user.id;

    const newUser = {
      auth_id: authUserId,
      email,
      role,
      firstname: additionalDetails.firstname,
      lastname: additionalDetails.lastname,
      phone: Array.isArray(additionalDetails.phone)
        ? `{${additionalDetails.phone.join(',')}}`
        : (additionalDetails.phone ? `{${additionalDetails.phone}}` : null),
    };

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([newUser])
      .select('id')
      .single();

    if (userError) {
      await supabase.auth.admin.deleteUser(authUserId);
      throw userError;
    }

    const userId = userData.id;
    let identificationImageUrl = null;
    let galleryUrls = [];

    if (role === 'SERVICE_PROVIDER' && additionalDetails.identificationImageFile) {
      const file = additionalDetails.identificationImageFile;
      const fileName = `identification-${userId}-${uuidv4()}${path.extname(file.originalname)}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from('identification-images')
        .upload(`${userId}/${fileName}`, file.buffer, { contentType: file.mimetype });

      if (uploadError) {
        await rollbackSignup(userId, authUserId);
        throw uploadError;
      }

      identificationImageUrl = supabaseAdmin.storage
        .from('identification-images')
        .getPublicUrl(`${userId}/${fileName}`).data.publicUrl;
    }

    if (role === 'SERVICE_PROVIDER' && Array.isArray(additionalDetails.galleryFiles)) {
      for (const file of additionalDetails.galleryFiles) {
        const fileName = `gallery-${userId}-${uuidv4()}${path.extname(file.originalname)}`;
        const { error: uploadError } = await supabaseAdmin.storage
          .from('service-provider-galleries')
          .upload(`${userId}/${fileName}`, file.buffer, { contentType: file.mimetype });

        if (uploadError) {
          await rollbackSignup(userId, authUserId);
          throw uploadError;
        }

        galleryUrls.push(supabaseAdmin.storage
          .from('service-provider-galleries')
          .getPublicUrl(`${userId}/${fileName}`).data.publicUrl);
      }
    }

    if (role === 'SERVICE_PROVIDER') {
      const { error: providerError } = await supabase
        .from('service_providers')
        .insert([{
          user_id: userId,
          ...additionalDetails.serviceProviderDetails,
          identification_image: identificationImageUrl,
          gallery: galleryUrls,
        }]);

      if (providerError) {
        await rollbackSignup(userId, authUserId);
        throw providerError;
      }
    } else if (role === 'CLIENT') {
      const { error: clientError } = await supabase
        .from('clients')
        .insert([{ user_id: userId, ...additionalDetails.clientDetails }]);

      if (clientError) {
        await rollbackSignup(userId, authUserId);
        throw clientError;
      }
    }

    if (additionalDetails.locationData && Array.isArray(additionalDetails.locationData.coordinates)) {
      const [longitude, latitude] = additionalDetails.locationData.coordinates;
      const coordinatesString = `POINT(${longitude} ${latitude})`;
      const locationInsertData = {
        user_id: userId,
        coordinates: coordinatesString,
        km: additionalDetails.locationData.km,
        title: additionalDetails.locationData.title || 'Default Location'
      };

      const { error: locationError } = await supabase
        .from('locations')
        .insert([locationInsertData]);

      if (locationError) {
        await rollbackSignup(userId, authUserId);
        throw locationError;
      }
    }

    return {
      message: 'Signup successful',
      user: userData,
      identificationImageUrl,
      galleryUrls
    };
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return {
    session: data.session,
    user: data.user
  };
}

async function rollbackSignup(userId, authUserId) {
  try {
    if (userId) {
      await supabase.from('users').delete().eq('id', userId);
      console.log(`User ${userId} deleted`);
    }
    if (authUserId) {
      await supabase.auth.admin.deleteUser(authUserId);
      console.log(`Supabase auth user ${authUserId} deleted`);
    }
  } catch (err) {
    console.error('Rollback error:', err);
  }
}

module.exports = { signUp, signIn };
