const multer = require('multer');
const path = require('path');

// Configure storage (you can choose memoryStorage or diskStorage)
const storage = multer.memoryStorage();

// Or, to save files to disk (more configuration options available)
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, '../uploads')); // Specify your upload directory
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// Create the multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Optional: Add file type filtering
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false); // Reject the file
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // Optional: Limit file size (e.g., 5MB)
  }
});

module.exports = upload.fields([
  { name: 'identificationImage', maxCount: 1 }, // Expect one file with the field name 'identificationImage'
  { name: 'gallery', maxCount: 10 },          // Expect up to 10 files with the field name 'gallery'
  { name: 'serviceProviderData', maxCount: 1 }, // To handle the JSON data
  { name: 'clientData', maxCount: 1 },         // To handle the JSON data
  { name: 'location', maxCount: 1 },             // To handle the JSON data
]);