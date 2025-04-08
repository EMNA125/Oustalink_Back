const AuthService = require('../Services/authService');

async function signUp(req, res) {
  try {
    const serviceProviderDataString = req.body.serviceProviderData;
    const clientDataString = req.body.clientData;
    const locationString = req.body.location;
    const files = req.files;

    let serviceProviderData, clientData, location;

    if (serviceProviderDataString) {
      serviceProviderData = JSON.parse(serviceProviderDataString);
      if (locationString) location = JSON.parse(locationString);

      const { email, password } = serviceProviderData;
      const role = 'SERVICE_PROVIDER';
      const additionalDetails = {
        firstname: serviceProviderData.firstname,
        lastname: serviceProviderData.lastname,
        phone: serviceProviderData.phone,
        serviceProviderDetails: {
          gallery: serviceProviderData.gallery,
          category_id: serviceProviderData.categoryId,
          identification: serviceProviderData.identification,
          description: serviceProviderData.description,
          birth_date: serviceProviderData.birthDate,
          service_provider_type: serviceProviderData.serviceProviderType,
        },
        locationData: location,
        identificationImageFile: files?.identificationImage?.[0],
        galleryFiles: files?.gallery,
      };

      const result = await AuthService.signUp(email, password, role, additionalDetails);
      return res.status(201).json(result);

    } else if (clientDataString) {
      clientData = JSON.parse(clientDataString);
      if (locationString) location = JSON.parse(locationString);

      const { email, password } = clientData;
      const role = 'CLIENT';
      const additionalDetails = {
        firstname: clientData.firstname,
        lastname: clientData.lastname,
        phone: clientData.phone,
        clientDetails: { googleid: clientData.googleid },
        locationData: location,
      };

      const result = await AuthService.signUp(email, password, role, additionalDetails);
      return res.status(201).json(result);
    } else {
      return res.status(400).json({ error: 'Invalid request body.' });
    }
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(error.status || 500).json({ error: error.message });
  }
}

async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    const result = await AuthService.signIn(email, password);

    return res.status(200).json({
      message: 'Sign in successful',
      session: result.session,
      user: result.user
    });
  } catch (error) {
    return res.status(error.status || 401).json({ error: error.message });
  }
}
async function refreshToken(req, res) {
  try {
    const { refresh_token } = req.body;
    const { data, error } = await supabase.auth.refreshSession({ refresh_token });

    if (error) throw error;

    return res.status(200).json({ session: data.session });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
}


module.exports = { signUp, signIn ,refreshToken};
