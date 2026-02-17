// src/queues/email.queue.js
const { Queue } = require('bullmq');
const redisClient = require('../config/redisClient');
const logger = require('../utils/logger');

/**
 * Email Queue Configuration
 * 
 * This queue handles all email-related background jobs including:
 * - Contact form notifications
 * - Welcome emails
 * - Password reset emails
 * - Marketing campaigns
 */

// Create email queue with Redis connection
let emailQueue;

try {
    // Only initialize real queue if we expect Redis to work
    emailQueue = new Queue('email', {
        connection: redisClient,
        defaultJobOptions: {
            attempts: 3,
            backoff: { type: 'exponential', delay: 2000 },
            removeOnComplete: { age: 24 * 3600, count: 1000 },
            removeOnFail: { age: 7 * 24 * 3600, count: 5000 },
        },
    });

    // Attach error handler to prevent unhandled rejection crashes
    emailQueue.on('error', (err) => {
        // logger.error('Email Queue Error:', err.message); 
        // check connection
    });

} catch (err) {
    logger.error('Failed to initialize email queue', err);
    // Fallback?
}

/**
 * Add a contact notification email job to the queue
 * @param {Object} data - Email data
 * @param {string} data.name - Contact name
 * @param {string} data.email - Contact email
 * @param {string} data.message - Contact message
 * @param {number} data.leadId - Database lead ID
 * @returns {Promise<Job>} The created job
 */
async function addContactEmailJob(data) {
    try {
        const job = await emailQueue.add('contact-notification', data, {
            priority: 1,                  // High priority for contact forms
            delay: 0,                     // Send immediately
        });

        logger.info(`Contact email job added to queue`, {
            jobId: job.id,
            leadId: data.leadId,
            email: data.email,
        });

        return job;
    } catch (error) {
        logger.error(`Failed to add contact email job to queue: ${error.message}`, {
            error: error.stack,
            data,
        });
        throw error;
    }
}

/**
 * Add a welcome email job to the queue
 * @param {Object} data - Email data
 * @param {string} data.name - User name
 * @param {string} data.email - User email
 * @param {number} data.userId - Database user ID
 * @returns {Promise<Job>} The created job
 */
async function addWelcomeEmailJob(data) {
    try {
        const job = await emailQueue.add('welcome-email', data, {
            priority: 2,                  // Medium priority
            delay: 5000,                  // Delay 5 seconds to ensure DB commit
        });

        logger.info(`Welcome email job added to queue`, {
            jobId: job.id,
            userId: data.userId,
            email: data.email,
        });

        return job;
    } catch (error) {
        logger.error(`Failed to add welcome email job to queue: ${error.message}`, {
            error: error.stack,
            data,
        });
        throw error;
    }
}

/**
 * Add a password reset email job to the queue
 * @param {Object} data - Email data
 * @param {string} data.email - User email
 * @param {string} data.resetToken - Password reset token
 * @param {number} data.userId - Database user ID
 * @returns {Promise<Job>} The created job
 */
async function addPasswordResetEmailJob(data) {
    try {
        const job = await emailQueue.add('password-reset', data, {
            priority: 1,                  // High priority for security
            delay: 0,
        });

        logger.info(`Password reset email job added to queue`, {
            jobId: job.id,
            userId: data.userId,
            email: data.email,
        });

        return job;
    } catch (error) {
        logger.error(`Failed to add password reset email job to queue: ${error.message}`, {
            error: error.stack,
            data,
        });
        throw error;
    }
}

/**
 * Get queue statistics
 * @returns {Promise<Object>} Queue stats
 */
async function getQueueStats() {
    try {
        const [waiting, active, completed, failed, delayed] = await Promise.all([
            emailQueue.getWaitingCount(),
            emailQueue.getActiveCount(),
            emailQueue.getCompletedCount(),
            emailQueue.getFailedCount(),
            emailQueue.getDelayedCount(),
        ]);

        return {
            waiting,
            active,
            completed,
            failed,
            delayed,
            total: waiting + active + completed + failed + delayed,
        };
    } catch (error) {
        logger.error(`Failed to get queue stats: ${error.message}`);
        throw error;
    }
}

/**
 * Clean old jobs from the queue
 * @param {number} gracePeriod - Grace period in milliseconds
 * @returns {Promise<void>}
 */
async function cleanQueue(gracePeriod = 24 * 3600 * 1000) {
    try {
        await emailQueue.clean(gracePeriod, 1000, 'completed');
        await emailQueue.clean(7 * 24 * 3600 * 1000, 1000, 'failed');
        logger.info('Queue cleaned successfully');
    } catch (error) {
        logger.error(`Failed to clean queue: ${error.message}`);
        throw error;
    }
}

async function addPaidEnrollmentJob(data) {
    try {
        const job = await emailQueue.add('paid-enrollment', data, {
            priority: 3,               // Medium priority for admin notifications
            delay: 0,
        });
        logger.info(`Paid enrollment email job added`, {
            jobId: job.id,
            enrollmentId: data.enrollment_id,
            studentEmail: data.student_email,
            instructorEmail: data.instructor_email,
        });
        return job;
    } catch (error) {
        logger.error(`Failed to add paid enrollment email job: ${error.message}`, { error: error.stack, data });
        throw error;
    }
}


// Only attach listeners if it's a real queue (has .on method)
if (emailQueue.on) {
    emailQueue.on('error', (error) => {
        logger.error(`Email queue error: ${error.message}`, { error: error.stack });
    });

    emailQueue.on('waiting', (jobId) => {
        logger.debug(`Job ${jobId} is waiting`);
    });

    emailQueue.on('active', (job) => {
        logger.debug(`Job ${job.id} is now active`);
    });

    emailQueue.on('stalled', (jobId) => {
        logger.warn(`Job ${jobId} has stalled`);
    });

    emailQueue.on('progress', (job, progress) => {
        logger.debug(`Job ${job.id} progress: ${progress}%`);
    });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, closing email queue...');
    if (emailQueue.close) await emailQueue.close();
    logger.info('Email queue closed');
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received, closing email queue...');
    if (emailQueue.close) await emailQueue.close();
    logger.info('Email queue closed');
});

async function addWaitlistEmailJob(data) {
    try {
        const job = await emailQueue.add('waitlist-notification', data, {
            priority: 2,                  // Medium priority
            delay: 0,
        });

        logger.info(`Waitlist email job added to queue`, {
            jobId: job.id,
            email: data.email,
        });

        return job;
    } catch (error) {
        logger.error(`Failed to add waitlist email job to queue: ${error.message}`, {
            error: error.stack,
            data,
        });
        // Don't throw logic error to user if email queue fails, just log it
        // throw error; 
    }
}

module.exports = {
    emailQueue,
    addContactEmailJob,
    addWelcomeEmailJob,
    addPasswordResetEmailJob,
    getQueueStats,
    addPaidEnrollmentJob,
    addWaitlistEmailJob,
};
