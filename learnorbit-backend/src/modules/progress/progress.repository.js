// src/modules/progress/progress.repository.js
const pool = require('../../config/db');
const logger = require('../../utils/logger');

class ProgressRepository {
  /**
   * Upsert progress record
   * @param {number} userId
   * @param {number} lessonId
   * @param {boolean} completed
   * @param {number} watchPercentage
   * @returns {Promise<number>} - Affected rows
   */
  async upsert(userId, lessonId, completed, watchPercentage) {
    const sql = `
      INSERT INTO lesson_progress (user_id, lesson_id, completed, watch_percentage)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        completed = VALUES(completed), 
        watch_percentage = VALUES(watch_percentage), 
        updated_at = CURRENT_TIMESTAMP
    `;
    const params = [userId, lessonId, completed ? 1 : 0, watchPercentage];
    const [result] = await pool.execute(sql, params);
    return result.affectedRows;
  }

  /**
   * Get progress for all lessons in a course for a user
   * Returns list of lessons with progress info attached
   * @param {number} userId
   * @param {number} courseId
   * @returns {Promise<Array>}
   */
  async getCourseProgress(userId, courseId) {
    const sql = `
      SELECT 
        l.id AS lesson_id, 
        l.order_index,
        COALESCE(lp.completed, 0) AS completed, 
        COALESCE(lp.watch_percentage, 0) AS watch_percentage,
        lp.updated_at
      FROM lessons l
      LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = ?
      WHERE l.course_id = ? AND l.is_deleted = FALSE
      ORDER BY l.order_index ASC
    `;
    const [rows] = await pool.execute(sql, [userId, courseId]);
    return rows;
  }

  /**
 * Get course progress summary
 * @param {number} userId
 * @param {number} courseId
 * @returns {Promise<Object>}
 */
  async getCourseProgressSummary(userId, courseId) {
    const sql = `
        SELECT 
            COUNT(l.id) as total_lessons,
            COUNT(lp.id) as completed_lessons
        FROM lessons l
        LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = ? AND lp.completed = 1
        WHERE l.course_id = ? AND l.is_deleted = FALSE
    `;
    const [rows] = await pool.execute(sql, [userId, courseId]);
    return rows[0];
  }
}

module.exports = new ProgressRepository();
