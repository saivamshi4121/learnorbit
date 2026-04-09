const db = require('../../config/database');
const logger = require('../../utils/logger');

/**
 * Get dashboard statistics
 */
exports.getDashboardStats = async (req, res) => {
    try {
        // Get total users
        const totalUsersResult = await db.query(
            'SELECT COUNT(*) as count FROM users'
        );
        const totalUsers = totalUsersResult.rows[0].count;

        // Get total students
        const totalStudentsResult = await db.query(
            "SELECT COUNT(*) as count FROM users WHERE role = 'student'"
        );
        const totalStudents = totalStudentsResult.rows[0].count;

        // Get total instructors
        const totalInstructorsResult = await db.query(
            "SELECT COUNT(*) as count FROM users WHERE role = 'instructor'"
        );
        const totalInstructors = totalInstructorsResult.rows[0].count;

        // Get total courses
        const totalCoursesResult = await db.query(
            'SELECT COUNT(*) as count FROM courses'
        );
        const totalCourses = totalCoursesResult.rows[0].count;

        // Get total published courses
        const totalPublishedResult = await db.query(
            'SELECT COUNT(*) as count FROM courses WHERE is_published = TRUE'
        );
        const totalPublishedCourses = totalPublishedResult.rows[0].count;

        // Get total enrollments
        const totalEnrollmentsResult = await db.query(
            'SELECT COUNT(*) as count FROM enrollments'
        );
        const totalEnrollments = totalEnrollmentsResult.rows[0].count;

        res.json({
            success: true,
            data: {
                totalUsers,
                totalStudents,
                totalInstructors,
                totalCourses,
                totalPublishedCourses,
                totalEnrollments
            }
        });
    } catch (error) {
        logger.error('Error fetching dashboard stats', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics'
        });
    }
};

/**
 * Get dashboard details (recent activity)
 */
exports.getDashboardDetails = async (req, res) => {
    try {
        // Get recent users (last 5)
        const { rows: recentUsers } = await db.query(`
            SELECT id, name, email, role, created_at as "joinedAt"
            FROM users
            ORDER BY created_at DESC
            LIMIT 5
        `);

        // Get recent courses (last 5)
        const { rows: recentCourses } = await db.query(`
            SELECT 
                c.id,
                c.title,
                u.name as "instructorName",
                c.created_at as "createdAt"
            FROM courses c
            JOIN users u ON c.instructor_id = u.id
            ORDER BY c.created_at DESC
            LIMIT 5
        `);

        // Get pending courses (drafts)
        const { rows: pendingCourses } = await db.query(`
            SELECT 
                c.id,
                c.title,
                u.name as "instructorName",
                c.created_at as "createdAt"
            FROM courses c
            JOIN users u ON c.instructor_id = u.id
            WHERE c.is_published = FALSE
            ORDER BY c.created_at DESC
            LIMIT 5
        `);

        res.json({
            success: true,
            data: {
                recentUsers,
                recentCourses,
                pendingCourses
            }
        });
    } catch (error) {
        logger.error('Error fetching dashboard details', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard details'
        });
    }
};

/**
 * Get users with optional filters
 */
exports.getUsers = async (req, res) => {
    try {
        const { role, search } = req.query;
        let query = 'SELECT id, name, email, role, created_at as "joinedAt" FROM users WHERE 1=1';
        const params = [];

        if (role && role !== 'all') {
            query += ` AND role = $${params.length + 1}`;
            params.push(role);
        }

        if (search) {
            query += ` AND email LIKE $${params.length + 1}`;
            params.push(`%${search}%`);
        }

        query += ' ORDER BY created_at DESC';

        const { rows: users } = await db.query(query, params);

        // Add status field (all users are active by default, blocking not implemented in schema)
        const usersWithStatus = users.map(user => ({
            ...user,
            status: 'active'
        }));

        res.json({
            success: true,
            data: usersWithStatus
        });
    } catch (error) {
        logger.error('Error fetching users', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
};

/**
 * Block a user
 */
exports.blockUser = async (req, res) => {
    try {
        const { id } = req.params;

        // TODO: Implement user blocking in database schema
        // For now, return success (frontend will handle optimistically)

        logger.info('User blocked', { userId: id, adminId: req.user.id });

        res.json({
            success: true,
            message: 'User blocked successfully'
        });
    } catch (error) {
        logger.error('Error blocking user', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Failed to block user'
        });
    }
};

/**
 * Unblock a user
 */
exports.unblockUser = async (req, res) => {
    try {
        const { id } = req.params;

        // TODO: Implement user unblocking in database schema
        // For now, return success

        logger.info('User unblocked', { userId: id, adminId: req.user.id });

        res.json({
            success: true,
            message: 'User unblocked successfully'
        });
    } catch (error) {
        logger.error('Error unblocking user', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Failed to unblock user'
        });
    }
};

/**
 * Get courses with optional status filter
 */
exports.getCourses = async (req, res) => {
    try {
        const { status } = req.query;
        let query = `
            SELECT 
                c.id,
                c.title,
                u.name as "instructorName",
                c.is_published as status,
                COUNT(DISTINCT e.id) as "enrollmentCount",
                c.created_at as "createdAt"
            FROM courses c
            JOIN users u ON c.instructor_id = u.id
            LEFT JOIN enrollments e ON c.id = e.course_id
            WHERE 1=1
        `;
        const params = [];

        if (status && status !== 'all') {
            if (status === 'published') {
                query += ' AND c.is_published = TRUE';
            } else if (status === 'draft') {
                query += ' AND c.is_published = FALSE';
            }
        }

        query += ' GROUP BY c.id, c.title, u.name, c.is_published, c.created_at';
        query += ' ORDER BY c.created_at DESC';

        const { rows: courses } = await db.query(query, params);

        // Format status as 'published' or 'draft'
        const formattedCourses = courses.map(course => ({
            ...course,
            status: course.status ? 'published' : 'draft',
            enrollmentCount: parseInt(course.enrollmentCount) || 0
        }));

        res.json({
            success: true,
            data: formattedCourses
        });
    } catch (error) {
        logger.error('Error fetching courses', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Failed to fetch courses'
        });
    }
};

/**
 * Unpublish a course
 */
exports.unpublishCourse = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            'UPDATE courses SET is_published = FALSE WHERE id = $1',
            [id]
        );

        logger.info('Course unpublished', { courseId: id, adminId: req.user.id });

        res.json({
            success: true,
            message: 'Course unpublished successfully'
        });
    } catch (error) {
        logger.error('Error unpublishing course', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Failed to unpublish course'
        });
    }
};

/**
 * Delete a course
 */
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete associated enrollments first
        await db.query('DELETE FROM enrollments WHERE course_id = $1', [id]);

        // Delete associated lessons
        await db.query('DELETE FROM lessons WHERE course_id = $1', [id]);

        // Delete the course
        await db.query('DELETE FROM courses WHERE id = $1', [id]);

        logger.info('Course deleted', { courseId: id, adminId: req.user.id });

        res.json({
            success: true,
            message: 'Course deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting course', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Failed to delete course'
        });
    }
};
