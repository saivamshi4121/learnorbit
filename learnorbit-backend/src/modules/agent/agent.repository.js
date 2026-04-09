// src/modules/agent/agent.repository.js
const pool = require('../../config/database');
const logger = require('../../utils/logger');

/**
 * Agent Repository – Queries courses & lessons to build context for the AI agent.
 */
class AgentRepository {
  /**
   * Get all published courses with their lesson count.
   */
  async getAllCoursesWithMeta() {
    const sql = `
      SELECT 
        c.id, c.title, c.description, c.start_date, c.end_date,
        COUNT(l.id) AS lesson_count
      FROM courses c
      LEFT JOIN lessons l ON l.course_id = c.id AND l.is_deleted = FALSE
      WHERE c.is_published = TRUE
      GROUP BY c.id
      ORDER BY c.title ASC
    `;
    const { rows } = await pool.query(sql);
    return rows;
  }

  /**
   * Get a single course by ID with full details.
   */
  async getCourseById(courseId) {
    const sql = `SELECT * FROM courses WHERE id = $1 AND is_published = TRUE`;
    const { rows } = await pool.query(sql, [courseId]);
    return rows[0] || null;
  }

  /**
   * Get lessons for a course (ordered).
   */
  async getLessonsByCourse(courseId) {
    const sql = `
      SELECT id, title, type, content, provider, embed_url, order_index
      FROM lessons
      WHERE course_id = $1 AND is_deleted = FALSE
      ORDER BY order_index ASC
    `;
    const { rows } = await pool.query(sql, [courseId]);
    return rows;
  }

  /**
   * Search courses by keyword (title or description).
   */
  async searchCourses(keyword) {
    const sql = `
      SELECT 
        c.id, c.title, c.description,
        COUNT(l.id) AS lesson_count
      FROM courses c
      LEFT JOIN lessons l ON l.course_id = c.id AND l.is_deleted = FALSE
      WHERE c.is_published = TRUE
        AND (LOWER(c.title) LIKE $1 OR LOWER(c.description) LIKE $1)
      GROUP BY c.id
      ORDER BY c.title ASC
    `;
    const { rows } = await pool.query(sql, [`%${keyword.toLowerCase()}%`]);
    return rows;
  }

  /**
   * Get enrollment info for a specific user.
   */
  async getUserEnrollments(userId) {
    const sql = `
      SELECT 
        e.course_id, e.status, e.created_at AS enrolled_at,
        c.title AS course_title
      FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      WHERE e.user_id = $1
      ORDER BY e.created_at DESC
    `;
    const { rows } = await pool.query(sql, [userId]);
    return rows;
  }

  /**
   * Get user's lesson progress for a course.
   */
  async getUserProgress(userId, courseId) {
    const sql = `
      SELECT 
        lp.lesson_id, lp.completed, lp.watch_percentage,
        l.title AS lesson_title
      FROM lesson_progress lp
      JOIN lessons l ON l.id = lp.lesson_id
      WHERE lp.user_id = $1 AND l.course_id = $2
      ORDER BY l.order_index ASC
    `;
    const { rows } = await pool.query(sql, [userId, courseId]);
    return rows;
  }
}

module.exports = new AgentRepository();
