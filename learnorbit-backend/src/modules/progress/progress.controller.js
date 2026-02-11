// src/modules/progress/progress.controller.js
const progressService = require('./progress.service');
const logger = require('../../utils/logger');

exports.markProgress = async (req, res) => {
  try {
    const lessonId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { watch_percentage } = req.body;

    if (!lessonId || isNaN(lessonId)) {
      return res.status(400).json({ success: false, error: 'Invalid lesson ID' });
    }

    const result = await progressService.markProgress(userId, lessonId, watch_percentage);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Progress update error', error);
    if (error.status) {
      return res.status(error.status).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

exports.getCourseProgress = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    if (!courseId || isNaN(courseId)) {
      return res.status(400).json({ success: false, error: 'Invalid course ID' });
    }

    const data = await progressService.getCourseProgress(userId, courseId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    logger.error('Get course progress error', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};
