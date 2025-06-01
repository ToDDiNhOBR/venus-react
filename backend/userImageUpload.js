const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const uploadDir = path.join(__dirname, '../src/user-perfil-images');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use userId + timestamp + original extension for uniqueness
    const userId = req.body.userId || 'unknown';
    const ext = path.extname(file.originalname);
    const filename = `${userId}-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

// POST endpoint to upload user image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const oldImage = req.body.oldImage; // filename of old image to delete

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    // Delete old image if provided
    if (oldImage) {
      const oldImagePath = path.join(uploadDir, oldImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Error deleting old image:', err);
          } else {
            console.log('Old image deleted:', oldImage);
          }
        });
      }
    }

    // Return the filename of the uploaded image
    res.json({ success: true, filename: req.file.filename });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});

module.exports = router;
