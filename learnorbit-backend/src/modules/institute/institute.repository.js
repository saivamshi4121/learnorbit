// src/modules/institute/institute.repository.js
const pool = require('../../config/database');

/**
 * Institute Repository – all queries scoped by institute_id for full multi-tenant isolation.
 */
class InstituteRepository {

    // ── Institute CRUD (super_admin only) ─────────────────────────

    async create({ name, email, createdBy }) {
        const { rows } = await pool.query(
            `INSERT INTO institutes (name, email, created_by)
             VALUES ($1, $2, $3) RETURNING *`,
            [name, email, createdBy]
        );
        return rows[0];
    }

    async findById(id) {
        const { rows } = await pool.query(
            `SELECT * FROM institutes WHERE id = $1`, [id]
        );
        return rows[0] || null;
    }

    async findAll({ limit = 20, offset = 0 } = {}) {
        const { rows } = await pool.query(
            `SELECT i.*,
                (SELECT COUNT(*) FROM institute_students s WHERE s.institute_id = i.id) AS student_count,
                (SELECT COUNT(*) FROM institute_courses  c WHERE c.institute_id = i.id) AS course_count
             FROM institutes i
             ORDER BY i.created_at DESC
             LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return rows;
    }

    async updateStatus(id, status) {
        const { rowCount } = await pool.query(
            `UPDATE institutes SET status = $1, updated_at = NOW() WHERE id = $2`,
            [status, id]
        );
        return rowCount > 0;
    }

    // ── Courses ───────────────────────────────────────────────────

    async createCourse({ instituteId, title, description, visibilityType }) {
        const { rows } = await pool.query(
            `INSERT INTO institute_courses (institute_id, title, description, visibility_type)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [instituteId, title, description || null, visibilityType || 'private']
        );
        return rows[0];
    }

    async getCoursesByInstitute(instituteId, { limit = 20, offset = 0 } = {}) {
        const { rows } = await pool.query(
            `SELECT ic.*,
                (SELECT COUNT(*) FROM institute_course_content cc WHERE cc.course_id = ic.id) AS content_count,
                (SELECT COUNT(*) FROM institute_course_access  ca WHERE ca.course_id = ic.id AND ca.access_status = 'active') AS student_count
             FROM institute_courses ic
             WHERE ic.institute_id = $1
             ORDER BY ic.created_at DESC
             LIMIT $2 OFFSET $3`,
            [instituteId, limit, offset]
        );
        return rows;
    }

    async getCourseById(courseId, instituteId) {
        const { rows } = await pool.query(
            `SELECT * FROM institute_courses WHERE id = $1 AND institute_id = $2`,
            [courseId, instituteId]
        );
        return rows[0] || null;
    }

    async updateCourse(courseId, instituteId, fields) {
        const allowed = ['title', 'description', 'visibility_type'];
        const updates = [];
        const vals = [];
        for (const k of allowed) {
            if (fields[k] !== undefined) {
                updates.push(`${k} = $${vals.length + 1}`);
                vals.push(fields[k]);
            }
        }
        if (!updates.length) return null;
        vals.push(courseId, instituteId);
        const { rows } = await pool.query(
            `UPDATE institute_courses
             SET ${updates.join(', ')}, updated_at = NOW()
             WHERE id = $${vals.length - 1} AND institute_id = $${vals.length}
             RETURNING *`,
            vals
        );
        return rows[0] || null;
    }

    async deleteCourse(courseId, instituteId) {
        const { rowCount } = await pool.query(
            `DELETE FROM institute_courses WHERE id = $1 AND institute_id = $2`,
            [courseId, instituteId]
        );
        return rowCount > 0;
    }

    // ── Content ───────────────────────────────────────────────────

    async addContent({ courseId, title, contentType, contentUrl, orderIndex }) {
        const { rows } = await pool.query(
            `INSERT INTO institute_course_content (course_id, title, content_type, content_url, order_index)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [courseId, title, contentType, contentUrl, orderIndex ?? 0]
        );
        return rows[0];
    }

    async getContentByCourse(courseId) {
        const { rows } = await pool.query(
            `SELECT * FROM institute_course_content
             WHERE course_id = $1
             ORDER BY order_index ASC, created_at ASC`,
            [courseId]
        );
        return rows;
    }

    async deleteContent(contentId, courseId) {
        const { rowCount } = await pool.query(
            `DELETE FROM institute_course_content WHERE id = $1 AND course_id = $2`,
            [contentId, courseId]
        );
        return rowCount > 0;
    }

    async reorderContent(contentId, courseId, orderIndex) {
        const { rowCount } = await pool.query(
            `UPDATE institute_course_content SET order_index = $1
             WHERE id = $2 AND course_id = $3`,
            [orderIndex, contentId, courseId]
        );
        return rowCount > 0;
    }

    // ── Students (institute roster) ───────────────────────────────

    async addStudent(instituteId, userId) {
        const { rows } = await pool.query(
            `INSERT INTO institute_students (institute_id, user_id)
             VALUES ($1, $2) ON CONFLICT (institute_id, user_id) DO NOTHING RETURNING *`,
            [instituteId, userId]
        );
        return rows[0] || null;
    }

    async getStudentsByInstitute(instituteId, { limit = 50, offset = 0 } = {}) {
        const { rows } = await pool.query(
            `SELECT u.id, u.name, u.email, u.avatar_url, u.created_at AS joined_at,
                    s.created_at AS enrolled_at
             FROM institute_students s
             JOIN users u ON u.id = s.user_id
             WHERE s.institute_id = $1
             ORDER BY s.created_at DESC
             LIMIT $2 OFFSET $3`,
            [instituteId, limit, offset]
        );
        return rows;
    }

    async removeStudent(instituteId, userId) {
        const { rowCount } = await pool.query(
            `DELETE FROM institute_students WHERE institute_id = $1 AND user_id = $2`,
            [instituteId, userId]
        );
        return rowCount > 0;
    }

    async isStudentInInstitute(instituteId, userId) {
        const { rows } = await pool.query(
            `SELECT id FROM institute_students WHERE institute_id = $1 AND user_id = $2`,
            [instituteId, userId]
        );
        return rows.length > 0;
    }

    // ── Course Access ─────────────────────────────────────────────

    /**
     * Grant access to an existing user by user_id.
     */
    async grantAccess(courseId, studentId) {
        const { rows } = await pool.query(
            `INSERT INTO institute_course_access (course_id, student_id, access_status)
             VALUES ($1, $2, 'active')
             ON CONFLICT (course_id, student_id) DO UPDATE SET access_status = 'active'
             RETURNING *`,
            [courseId, studentId]
        );
        return rows[0];
    }

    /**
     * Invite by email (user may not yet exist).
     */
    async inviteByEmail(courseId, email) {
        const { rows } = await pool.query(
            `INSERT INTO institute_course_access (course_id, invited_email, access_status)
             VALUES ($1, $2, 'pending')
             ON CONFLICT (course_id, invited_email) DO UPDATE SET access_status = 'pending'
             RETURNING *`,
            [courseId, email]
        );
        return rows[0];
    }

    /**
     * When a user registers, activate any pending invites for their email.
     */
    async activatePendingInvites(email, userId) {
        const { rowCount } = await pool.query(
            `UPDATE institute_course_access
             SET student_id = $1, access_status = 'active', invited_email = NULL
             WHERE invited_email = $2 AND access_status = 'pending'`,
            [userId, email]
        );
        return rowCount;
    }

    async revokeAccess(courseId, studentId) {
        const { rowCount } = await pool.query(
            `UPDATE institute_course_access
             SET access_status = 'revoked'
             WHERE course_id = $1 AND student_id = $2`,
            [courseId, studentId]
        );
        return rowCount > 0;
    }

    async getCourseAccessList(courseId) {
        const { rows } = await pool.query(
            `SELECT ca.*, u.name AS student_name, u.email AS student_email
             FROM institute_course_access ca
             LEFT JOIN users u ON u.id = ca.student_id
             WHERE ca.course_id = $1
             ORDER BY ca.created_at DESC`,
            [courseId]
        );
        return rows;
    }

    async hasActiveAccess(courseId, studentId) {
        const { rows } = await pool.query(
            `SELECT id FROM institute_course_access
             WHERE course_id = $1 AND student_id = $2 AND access_status = 'active'`,
            [courseId, studentId]
        );
        return rows.length > 0;
    }

    // ── Student: My Courses ───────────────────────────────────────
    /**
     * Fetch all courses visible to a student.
     * Visibility rules:
     *   public   → all institute students
     *   private  → nobody (admin only)
     *   selected → students with active access grant
     *
     * Single query, no N+1.
     */
    async getCoursesForStudent(userId) {
        const { rows } = await pool.query(
            `SELECT DISTINCT ON (ic.id)
                ic.*,
                (SELECT COUNT(*) FROM institute_course_content cc WHERE cc.course_id = ic.id) AS content_count
             FROM institute_courses ic
             -- Student must belong to this institute
             JOIN institute_students ist
               ON ist.institute_id = ic.institute_id AND ist.user_id = $1
             -- Access filter
             WHERE (
               ic.visibility_type = 'public'
               OR (
                 ic.visibility_type = 'selected'
                 AND EXISTS (
                   SELECT 1 FROM institute_course_access ica
                   WHERE ica.course_id = ic.id
                     AND ica.student_id = $1
                     AND ica.access_status = 'active'
                 )
               )
             )
             ORDER BY ic.id, ic.created_at DESC`,
            [userId]
        );
        return rows;
    }

    // ── Stats ─────────────────────────────────────────────────────

    async getInstituteStats(instituteId) {
        const { rows } = await pool.query(
            `SELECT
               (SELECT COUNT(*) FROM institute_courses  WHERE institute_id = $1)                       AS total_courses,
               (SELECT COUNT(*) FROM institute_courses  WHERE institute_id = $1 AND visibility_type <> 'private') AS published_courses,
               (SELECT COUNT(*) FROM institute_students WHERE institute_id = $1)                       AS total_students,
               (SELECT COUNT(*) FROM institute_course_access ca
                JOIN institute_courses ic ON ic.id = ca.course_id
                WHERE ic.institute_id = $1 AND ca.access_status = 'pending')                           AS pending_invites`,
            [instituteId]
        );
        return rows[0];
    }

    // ── Lookup by email for invite flow ──────────────────────────

    async findUserByEmail(email) {
        const { rows } = await pool.query(
            `SELECT id, name, email FROM users WHERE email = $1`, [email]
        );
        return rows[0] || null;
    }
}

module.exports = new InstituteRepository();
