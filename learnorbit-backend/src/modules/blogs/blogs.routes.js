const express = require('express');
const router = express.Router();
const blogsController = require('./blogs.controller');
const { protect } = require('../../middlewares/auth.middleware');

// Public routes
router.get('/', blogsController.getPublishedBlogs);
router.get('/:slug', blogsController.getBlogBySlug);

// Protected routes
router.use(protect);
router.post('/', blogsController.createBlog);
router.get('/user/me', blogsController.getUserBlogs);
router.get('/id/:id', blogsController.getBlogById);
router.patch('/:id', blogsController.updateBlog);
router.delete('/:id', blogsController.deleteBlog);

module.exports = router;
