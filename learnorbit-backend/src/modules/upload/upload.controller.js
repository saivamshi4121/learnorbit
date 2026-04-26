const { upload, isCloudinaryConfigured } = require('../../config/multer');

exports.uploadMiddleware = upload.single('file');

exports.uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    let fileUrl;
    
    if (isCloudinaryConfigured) {
        // Cloudinary returns the full URL in path
        fileUrl = req.file.path;
    } else {
        // Local storage returns filename or path. 
        // We want to return a clean relative URL like /uploads/filename
        const filename = req.file.filename || req.file.path.split(/[\\/]/).pop();
        fileUrl = `/uploads/${filename}`;
    }

    res.json({ 
        success: true, 
        url: fileUrl,
        storage: isCloudinaryConfigured ? 'cloudinary' : 'local'
    });
};
