// validators.js

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validatePhone = (phone) => {
  if (!phone) {
    return true; // Allow empty or null phone if it's optional
  }
  if (Array.isArray(phone)) {
    return phone.every((num) => /^\+?\d+$/.test(num)); // Allows optional leading '+' and digits
  }
  return /^\+?\d+$/.test(phone);
};

const validateNonEmptyString = (str) => {
  return typeof str === 'string' && str.trim() !== '';
};

const validateArrayOfStrings = (arr) => {
  return Array.isArray(arr) && arr.every((item) => typeof item === 'string' && item.trim() !== '');
};

const validateInteger = (num) => {
  return Number.isInteger(num) && num > 0; // Assuming categoryId should be a positive integer
};

const validateDate = (dateString) => {
  if (!dateString) return true; // Allow empty date if optional
  return !isNaN(new Date(dateString));
};

const validateCoordinates = (coordinates) => {
  return Array.isArray(coordinates) &&
         coordinates.length === 2 &&
         typeof coordinates[0] === 'number' &&
         typeof coordinates[1] === 'number' &&
         !isNaN(coordinates[0]) &&
         !isNaN(coordinates[1]);
};

const validatePositiveNumber = (num) => {
  return typeof num === 'number' && !isNaN(num) && num >= 0;
};

const serviceProviderValidators = (data, files) => {
  const errors = {};

  if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format.';
  }
  if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters long.';
  }
  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = 'Invalid phone number format.';
  }
  if (!validateNonEmptyString(data.firstname)) {
    errors.firstname = 'First name is required.';
  }
  if (!validateNonEmptyString(data.lastname)) {
    errors.lastname = 'Last name is required.';
  }
  // We are no longer validating the 'gallery' string here.
  // The presence of files will be checked in the controller if needed.

  if (data.categoryId && !validateInteger(data.categoryId)) {
    errors.categoryId = 'Category ID must be a positive integer.';
  }
  if (!validateNonEmptyString(data.identification)) {
    errors.identification = 'Identification type is required.';
  }
  if (data.description && !validateNonEmptyString(data.description)) {
    errors.description = 'Description must be a non-empty string.';
  }
  if (data.birthDate && !validateDate(data.birthDate)) {
    errors.birthDate = 'Invalid birth date format.';
  }
  if (!validateNonEmptyString(data.serviceProviderType)) {
    errors.serviceProviderType = 'Service provider type is required.';
  }
  // We are no longer validating the 'identificationImage' string here.
  // The presence of the file will be checked in the controller if needed.

  return Object.keys(errors).length > 0 ? errors : null;
};

const clientValidators = (data) => {
  const errors = {};

  if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format.';
  }
  if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters long.';
  }
  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = 'Invalid phone number format.';
  }
  if (!validateNonEmptyString(data.firstname)) {
    errors.firstname = 'First name is required.';
  }
  if (!validateNonEmptyString(data.lastname)) {
    errors.lastname = 'Last name is required.';
  }
  if (data.googleid && !validateNonEmptyString(data.googleid)) { // Assuming 'goo' was a typo for 'googleid'
    errors.googleid = 'Google ID is required.';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

const locationValidators = (data) => {
  const errors = {};

  if (!data || typeof data !== 'object') {
    return { location: 'Location data is required.' };
  }

  if (!validateCoordinates(data.coordinates)) {
    errors.coordinates = 'Invalid coordinates format. Must be an array of two numbers [longitude, latitude].';
  }

  if (data.km !== undefined && data.km !== null && !validatePositiveNumber(data.km)) {
    errors.km = 'Kilometer radius must be a non-negative number.';
  }

  if (data.title && !validateNonEmptyString(data.title)) {
    errors.title = 'Location title must be a non-empty string.';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateNonEmptyString,
  validateArrayOfStrings,
  validateInteger,
  validateDate,
  validateCoordinates,
  validatePositiveNumber,
  serviceProviderValidators,
  clientValidators,
  locationValidators,
};