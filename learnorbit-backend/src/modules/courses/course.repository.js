// src/modules/courses/course.repository.js
const pool = require('../../config/db');
const logger = require('../../utils/logger');

/**
 * Course Repository – all DB interactions use prepared statements.
 */
class CourseRepository {
  async create(course) {
    const sql = `INSERT INTO courses (instructor_id, title, description, thumbnail_url, is_published) VALUES (?,?,?,?,?)`;
    const params = [course.instructor_id, course.title, course.description || null, course.thumbnail_url || null, course.is_published ? 1 : 0];
    const [result] = await pool.execute(sql, params);
    return result.insertId;
  }

  async findById(id) {
    const sql = `SELECT * FROM courses WHERE id = ? AND is_published = TRUE`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  }

  async findAnyById(id) {
    const sql = `SELECT * FROM courses WHERE id = ?`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  }

  async findAllPublished() {
    const sql = `SELECT id, title, description, thumbnail_url FROM courses WHERE is_published = TRUE`;
    const [rows] = await pool.execute(sql);
    return rows;
  }

  async update(id, updates) {
    const fields = [];
    const params = [];
    if (updates.title !== undefined) { fields.push('title = ?'); params.push(updates.title); }
    if (updates.description !== undefined) { fields.push('description = ?'); params.push(updates.description); }
    if (updates.thumbnail_url !== undefined) { fields.push('thumbnail_url = ?'); params.push(updates.thumbnail_url); }
    if (updates.is_published !== undefined) { fields.push('is_published = ?'); params.push(updates.is_published ? 1 : 0); }
    if (fields.length === 0) return; // nothing to update
    const sql = `UPDATE courses SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);
    const [result] = await pool.execute(sql, params);
    return result.affectedRows;
  }

  async publish(id) {
    const sql = `UPDATE courses SET is_published = TRUE WHERE id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows;
  }

  async delete(id) {
    // Hard delete
    const sql = `DELETE FROM courses WHERE id = ?`;
    const [result] = await pool.execute(sql, [id]);
    return result.affectedRows;
  }

  async findByInstructor(instructorId) {
    const sql = `
      SELECT c.*, 
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as enrollment_count
      FROM courses c 
      WHERE c.instructor_id = ?
      ORDER BY c.created_at DESC
    `;
    const [rows] = await pool.execute(sql, [instructorId]);
    return rows;
  }
}

module.exports = new CourseRepository();
