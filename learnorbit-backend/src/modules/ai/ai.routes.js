const express = require('express');
const { generateCourseOutline, generateInsights, generateQuiz } = require('./ai.controller');

const router = express.Router();

router.post('/course-outline', generateCourseOutline);
router.get('/insights', generateInsights);
router.post('/generate-quiz', generateQuiz);

module.exports = router;
