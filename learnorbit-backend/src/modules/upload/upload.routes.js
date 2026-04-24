const express = require('express');
const router = express.Router();
const uploadController = require('./upload.controller');
const { protect } = require('../../middlewares/auth.middleware'); // Protect backend generally

// Route: /api/upload
router.post('/upload', uploadController.uploadMiddleware, uploadController.uploadFile);

module.exports = router;
