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

async function resetPasswordController(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const result = await AuthService.resetPasswordForEmail(email);

    res.status(200).json(result);
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message });
  }
}
async function updatePasswordController(req, res) {
  const { resetToken, newPassword } = req.body;

  try {
    const result = await AuthService.updatePassword(resetToken, newPassword);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Error updating password in controller:', err.message);
    return res.status(500).json({ message: err.message });
  }
}

async function sendOtp(req, res) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const result = await AuthService.sendOtpToPhone(phone);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(400).json({ error: error.message });
  }
}
async function verifyOtp2(req, res) {
  try {
    const { phone, token } = req.body;

    if (!phone || !token) {
      return res.status(400).json({ error: 'Phone and OTP token are required' });
    }

    const result = await AuthService.verifyOtpToken(phone, token);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error verifying OTP:', error.message);
    res.status(400).json({ error: error.message });
  }
}

async function sendEmailOtp(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Call the service method to send OTP to email
    const result = await AuthService.sendOtpToEmail(email);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(400).json({ error: error.message });
  }
}

async function verifyOtp(req, res) {
  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({ error: 'Email and OTP token are required.' });
  }

  try {
    const result = await AuthService.verifyOtpCode(email, token);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}
async function googleLogin1(req, res) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'Google ID token is required.' });
    }

    const googleProfile = await AuthService.verifyGoogleIdToken(idToken);
    if (!googleProfile?.email) {
      return res.status(401).json({ error: 'Invalid Google ID token.' });
    }

    const supabaseUserId = await AuthService.findOrCreateUserByGoogleProfile(googleProfile);
    const supabaseSession = await AuthService.createSupabaseSession(supabaseUserId);

    // Send the Supabase session data back to the frontend
    res.json(supabaseSession);

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Failed to authenticate with Google.' });
  }
}
const googleLogin = async (req, res) => {
  try {
    const origin = `${req.protocol}://${req.get('host')}`;
    const authUrl = await AuthService.initiateGoogleOAuth(origin);
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error in googleLogin controller:', error);
    res.status(500).send('Error during login');
  }
};

const googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code not provided');
  }

  try {
    const sessionData = await AuthService.exchangeCodeForSession(code);
    const { access_token, refresh_token, user } = sessionData;

    // **Interaction with Frontend happens here (primarily via setting cookies or redirecting)**

    // Option 1: Set HTTP cookies (as before)
    res.cookie('supabase-auth-token', access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.cookie('supabase-auth-refresh-token', refresh_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.cookie('user-id', user?.id, { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

    // Redirect the user back to a specific page on the frontend
    res.redirect('http://localhost:4200/login'); // Adjust the URL as needed

    // Option 2: Send session data in the response (less common for initial login redirect)
    // res.json({ accessToken, refreshToken, user });
    // Frontend would then need to handle this JSON and potentially redirect itself.

  } catch (error) {
    console.error('Error in googleCallback controller:', error);
    res.status(500).send('Error during authentication');
  }
};
module.exports = { signUp, signIn ,refreshToken,resetPasswordController,
  updatePasswordController,sendOtp,verifyOtp,sendEmailOtp,googleLogin,googleCallback};
