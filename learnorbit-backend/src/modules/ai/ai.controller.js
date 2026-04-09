const aiService = require('./ai.service');
const quizService = require('./quiz-generator.service');
const pool = require('../../config/database');

const generateCourseOutline = async (req, res, next) => {
  try {
    const { topic } = req.body;
    if (!topic) {
        return res.status(400).json({ success: false, error: 'Topic is required in the request body.' });
    }
    
    const outline = await aiService.generateCourseOutline(topic);
    
    // Return structured JSON as requested
    return res.status(200).json(outline);
  } catch (error) {
    console.error('AI Controller Error:', error);
    return res.status(500).json({ error: 'Failed to generate outline from AI service.' });
  }
};

const generateInsights = async (req, res, next) => {
  try {
    // 1. Fetch platform stats from PostgreSQL
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'student')::int as "totalStudents",
        (SELECT COUNT(*) FROM enrollments WHERE created_at >= NOW() - INTERVAL '7 days')::int as "newEnrollments",
        (SELECT COUNT(*) FROM courses WHERE is_published = false)::int as "inactiveCourses",
        15 as "dropoutRate", -- typical default or mocked calculation
        (SELECT COUNT(DISTINCT user_id) FROM lesson_progress WHERE updated_at >= NOW() - INTERVAL '7 days')::int as "activeUsers"
    `;
    const { rows } = await pool.query(statsQuery);
    const dbStats = rows[0] || {};
    
    // 2. Call AI service with those stats
    const insightData = await aiService.generateInsight(dbStats);
    
    // 3. Return insight JSON
    return res.status(200).json(insightData);
  } catch (error) {
    console.error('AI Insight Controller Error:', error);
    return res.status(500).json({ error: 'Failed to generate AI insight.' });
  }
};

const generateQuiz = async (req, res, next) => {
  try {
    const { lessonText } = req.body;
    if (!lessonText) {
        return res.status(400).json({ success: false, error: 'lessonText is required in the request body.' });
    }
    
    const quizData = await quizService.generateQuiz(lessonText);
    
    // Return structured JSON as requested
    return res.status(200).json(quizData);
  } catch (error) {
    console.error('AI Quiz Controller Error:', error);
    return res.status(500).json({ error: 'Failed to generate quiz from AI service.' });
  }
};

module.exports = {
  generateCourseOutline,
  generateInsights,
  generateQuiz
};
