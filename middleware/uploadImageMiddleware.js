const multer = require('multer');
const path = require('path');
const supabase = require('../config/db'); // Assuming you have the Supabase client set up

const storage = multer.memoryStorage(); // Store in memory temporarily
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }).single('image');

function uploadImageMiddleware(req, res, next) {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'File upload failed: ' + err.message });
    }

    try {
      // Now we have the image in memory, so let's upload it to Supabase Storage
      const file = req.file;
      const fileName = `${Date.now()}_${file.originalname}`;
      const bucket = 'service-provider-galleries'; // e.g., 'identification-images'

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false, // Set to true if you want to overwrite existing files
        });

      if (error) {
        return res.status(500).json({ error: 'Failed to upload image: ' + error.message });
      }

      // Generate a public URL for the uploaded image
      const imageUrl = supabase.storage.from(bucket).getPublicUrl(fileName).publicURL;

      // Attach the image URL to the request (to be saved in the database)
      req.imageUrl = imageUrl;
      next(); // Proceed to the next step (e.g., saving to the DB)
    } catch (error) {
      console.error('Error uploading image:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
}

module.exports = uploadImageMiddleware;
