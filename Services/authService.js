const { supabase, supabaseAdmin } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const { OAuth2Client } = require('google-auth-library');

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(googleClientId);


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
// Reset Password Function
async function resetPasswordForEmail(email) {
  // Check if user exists
  const { data: user, error: fetchError } = await supabase
    .from('users') // Your table name
    .select('*')
    .eq('email', email)
    .single();

  if (fetchError || !user) {
    throw new Error('Email does not exist');
  }

  // Send Reset Password Email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:4200/reset-password', // Your reset page
  });

  if (error) {
    console.error('Error sending reset password email:', error);
    throw error;
  }

  return { message: 'Password reset email sent successfully' };
}


async function updatePassword(resetToken, newPassword) {
  if (!resetToken || !newPassword) {
    throw new Error('Reset token and new password are required');
  }

  // Step 1: Get the user from the access token
  const { data: user, error: userError } = await supabaseAdmin.auth.getUser(resetToken);

  if (userError) {
    console.error('Error fetching user from token:', userError.message);
    throw userError;
  }

  // Step 2: Use admin API to update password
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.user.id, {
    password: newPassword,
  });

  if (updateError) {
    console.error('Error updating password:', updateError.message);
    throw updateError;
  }

  return { message: 'Password updated successfully' };
}
async function sendOtpToPhone(phone) {
  // Basic E.164 phone number format validation (e.g. +1234567890)
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error('Invalid phone number format. It should be in E.164 format.');
  }

  // Optional: Check if the phone number exists in your users table
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .contains('phone', [phone])
    .single();

  if (fetchError || !user) {
    throw new Error('Phone number not registered.');
  }

  // Send OTP
  const { data, error } = await supabase.auth.signInWithOtp({ phone });

  if (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }

  return { message: 'OTP sent successfully', data };
}
async function verifyOtpToken(phone, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });

  if (error) {
    console.error('OTP verification failed:', error);
    throw error;
  }

  return {
    session: data.session,
    user: data.user,
    message: 'OTP verified successfully'
  };
}
// ✅ Send only the 6-digit OTP code (no magic link access token)
async function sendOtpToEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email address format.');
  }

  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (fetchError || !user) {
    throw new Error('Email not registered.');
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Prevents new user creation
      // Don't use emailRedirectTo here — not needed for code-only
    }
  });

  if (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }

  return { message: 'OTP code sent to email', data };
}

// async function sendOtpToEmail1(email) {
//   // Basic email format check
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     throw new Error('Invalid email address format.');
//   }

//   // Optional: Check if the email exists in your users table
//   const { data: user, error: fetchError } = await supabase
//     .from('users')
//     .select('*')
//     .eq('email', email)
//     .single();

//   if (fetchError || !user) {
//     throw new Error('Email not registered.');
//   }

//   // Send OTP code to email
//   const { data, error } = await supabase.auth.api.sendOtp({
//     email,
//     type: 'email', // Indicate that it's an email-based OTP
//     emailRedirectTo: `https://your-frontend.com/verify-otp?email=${encodeURIComponent(email)}`
//   });

//   if (error) {
//     console.error('Error sending OTP:', error);
//     throw error;
//   }

//   return { message: 'OTP email sent successfully', data };
// }

// ✅ Verifies code from email and signs user in
async function verifyOtpCode(email, token) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'  // 👈 This ensures it's OTP-based, not magic link
  });

  if (error) {
    console.error('OTP verification failed:', error.message);
    throw new Error('Invalid or expired OTP code.');
  }

  return {
    message: 'OTP verified successfully',
    session: data.session,
    user: data.user
  };
}

async function verifyGoogleIdToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.error('Error verifying Google ID token:', error);
    return null;
  }
}

async function findOrCreateUserByGoogleProfile(googleProfile) {
  const { email: googleEmail, name, sub: googleId } = googleProfile;
  const normalizedGoogleEmail = googleEmail ? googleEmail.trim().toLowerCase() : null;

  if (!normalizedGoogleEmail) {
    console.error('Error: Google profile does not contain a valid email.');
    throw new Error('Invalid Google email.');
  }

  const { data: existingUser, error: fetchError } = await supabaseAdmin
    .from('auth.users')
    .select('id')
    .eq('email', normalizedGoogleEmail) // Using normalized email
    .single();

  if (fetchError) {
    console.error('Error fetching user:', fetchError);
    throw fetchError;
  }

  if (existingUser) {
    return existingUser.id;
  } else {
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedGoogleEmail, // Using normalized email for creation
      user_metadata: { full_name: name, google_id: googleId },
    });
    if (createError) {
      console.error('Error creating user:', createError);
      throw createError;
    }
    return newUser.id;
  }
}

async function createSupabaseSession(userId) {
  const { data: { session }, error } = await supabaseAdmin.auth.admin.createSession({
    uid: userId,
  });
  if (error) {
    console.error('Error creating Supabase session:', error);
    throw error;
  }
  return session;
}
const initiateGoogleOAuth = async (origin) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback/google`,
    },
  });

  if (error) {
    console.error('Error initiating Google OAuth:', error);
    throw new Error('Failed to initiate Google OAuth');
  }

  return data.url;
};

const exchangeCodeForSession = async (code) => {
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Error exchanging code for session:', error);
    throw new Error('Failed to exchange code for session');
  }

  return data;
};
module.exports = { signUp, signIn ,resetPasswordForEmail,updatePassword,
  sendOtpToPhone,verifyOtpToken,sendOtpToEmail,verifyOtpCode,findOrCreateUserByGoogleProfile,
  verifyGoogleIdToken,createSupabaseSession,initiateGoogleOAuth,exchangeCodeForSession};
