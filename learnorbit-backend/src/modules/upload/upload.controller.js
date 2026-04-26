const { storage } = require('../../config/cloudinary');
const multer = require('multer');

// Configure upload middleware with Cloudinary storage
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

exports.uploadMiddleware = upload.single('file');

exports.uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // req.file.path will contain the Cloudinary URL automatically
    res.json({ success: true, url: req.file.path });
};
