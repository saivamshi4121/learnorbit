const express = require('express');
const router = express.Router();
const uploadController = require('./upload.controller');
const { protect } = require('../../middlewares/auth.middleware'); // Protect backend generally

// Route: /api/upload
// Since this is for instructor course create/edit, protect it.
router.post('/upload', protect, uploadController.uploadMiddleware, uploadController.uploadFile);

module.exports = router;
