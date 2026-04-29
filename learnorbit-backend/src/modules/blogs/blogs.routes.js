const express = require('express');
const router = express.Router();
const blogsController = require('./blogs.controller');
const { protect } = require('../../middlewares/auth.middleware');

// Public routes (no auth required)
router.get('/', blogsController.getPublishedBlogs);

// Protected routes — must be registered BEFORE '/:slug'
// to prevent Express from treating 'user' or 'id' as a slug param
router.post('/', protect, blogsController.createBlog);
router.get('/user/me', protect, blogsController.getUserBlogs);
router.get('/id/:id', protect, blogsController.getBlogById);
router.patch('/:id', protect, blogsController.updateBlog);
router.delete('/:id', protect, blogsController.deleteBlog);

// Public slug route — MUST come last (wildcard param)
router.get('/:slug', blogsController.getBlogBySlug);

module.exports = router;
