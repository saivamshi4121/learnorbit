const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Check if Cloudinary is fully configured
const isCloudinaryConfigured = 
    process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET;

let storage;

if (isCloudinaryConfigured) {
    console.log('☁️  Using Cloudinary for file storage');
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'learnorbit_uploads',
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'jfif'],
            transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
        },
    });
} else {
    console.warn('⚠️  Cloudinary not configured. Falling back to local disk storage.');
    
    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = { upload, isCloudinaryConfigured };
