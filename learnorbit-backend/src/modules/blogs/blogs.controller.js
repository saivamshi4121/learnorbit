const BlogsRepository = require('./blogs.repository');
const logger = require('../../utils/logger');

exports.createBlog = async (req, res) => {
  try {
    const { title, slug, content, coverImage, published } = req.body;
    const authorId = req.user.id;

    if (!title || !slug) {
      return res.status(400).json({ success: false, message: 'Title and slug are required' });
    }

    // Check slug uniqueness
    const existing = await BlogsRepository.findBySlug(slug);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Slug already exists' });
    }

    const blog = await BlogsRepository.create({
      title,
      slug,
      content,
      cover_image: coverImage,
      author_id: authorId,
      published
    });

    res.status(201).json({ success: true, blog });
  } catch (error) {
    logger.error('Error in createBlog:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getPublishedBlogs = async (req, res) => {
  try {
    const blogs = await BlogsRepository.findPublished();
    res.json({ success: true, blogs });
  } catch (error) {
    logger.error('Error in getPublishedBlogs:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await BlogsRepository.findBySlug(slug);
    
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    
    res.json({ success: true, blog });
  } catch (error) {
    logger.error('Error in getBlogBySlug:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getUserBlogs = async (req, res) => {
  try {
    const authorId = req.user.id;
    const blogs = await BlogsRepository.findByAuthor(authorId);
    res.json({ success: true, blogs });
  } catch (error) {
    logger.error('Error in getUserBlogs:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogsRepository.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    
    if (blog.author_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    res.json({ success: true, blog });
  } catch (error) {
    logger.error('Error in getBlogById:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, coverImage, published } = req.body;
    
    const blog = await BlogsRepository.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    
    if (blog.author_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    if (slug && slug !== blog.slug) {
      const existing = await BlogsRepository.findBySlug(slug);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Slug already exists' });
      }
    }

    const updated = await BlogsRepository.update(id, {
      title,
      slug,
      content,
      cover_image: coverImage,
      published
    });
    
    res.json({ success: true, blog: updated });
  } catch (error) {
    logger.error('Error in updateBlog:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await BlogsRepository.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    
    if (blog.author_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    
    await BlogsRepository.delete(id);
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    logger.error('Error in deleteBlog:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
