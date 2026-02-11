// src/modules/enrollments/enrollment.repository.js
const pool = require('../../config/db');
const logger = require('../../utils/logger');

class EnrollmentRepository {
  /**
   * Create a new enrollment record
   * @param {number} userId - ID of the user (active student)
   * @param {number} courseId - ID of the course
   * @param {string} status - 'active' or 'pending'
   * @returns {Promise<number>} - Insert ID
   */
  async create(userId, courseId, status = 'active') {
    const sql = `INSERT INTO enrollments (user_id, course_id, status) VALUES (?, ?, ?)`;
    const [result] = await pool.execute(sql, [userId, courseId, status]);
    return result.insertId;
  }

  /**
   * Check if a user is already enrolled in a course
   * @param {number} userId
   * @param {number} courseId
   * @returns {Promise<boolean>}
   */
  async exists(userId, courseId) {
    const sql = `SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?`;
    const [rows] = await pool.execute(sql, [userId, courseId]);
    return rows.length > 0;
  }

  /**
   * Get enrollment status ('active' or 'pending')
   * @param {number} userId
   * @param {number} courseId
   * @returns {Promise<string|null>}
   */
  async getStatus(userId, courseId) {
    const sql = `SELECT status FROM enrollments WHERE user_id = ? AND course_id = ?`;
    const [rows] = await pool.execute(sql, [userId, courseId]);
    if (rows.length === 0) return null;
    return rows[0].status;
  }

  /**
   * Get all active enrollments for a user
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  async findByCourse(courseId) {
    const sql = `
      SELECT e.*, u.name as student_name, u.email as student_email 
      FROM enrollments e 
      JOIN users u ON e.user_id = u.id 
      WHERE e.course_id = ?
      ORDER BY e.created_at DESC
    `;
    const [rows] = await pool.execute(sql, [courseId]);
    return rows;
  }

  async findById(id) {
    const sql = `SELECT * FROM enrollments WHERE id = ?`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  }

  async updateStatus(enrollmentId, status) {
    const sql = `UPDATE enrollments SET status = ? WHERE id = ?`;
    const [result] = await pool.execute(sql, [status, enrollmentId]);
    return result.affectedRows;
  }

  async deleteEnrollment(enrollmentId) {
    const sql = `DELETE FROM enrollments WHERE id = ?`;
    const [result] = await pool.execute(sql, [enrollmentId]);
    return result.affectedRows;
  }
}

module.exports = new EnrollmentRepository();
