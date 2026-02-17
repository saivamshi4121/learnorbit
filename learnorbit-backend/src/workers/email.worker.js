// src/workers/email.worker.js
const path = require('path');
// Load env vars - crucial for worker process
const envPath = path.resolve(__dirname, '../../.env');
require('dotenv').config({ path: envPath });

const { Worker } = require('bullmq');
const redisClient = require('../config/redisClient');
const logger = require('../utils/logger');

/**
 * Email Worker
 * 
 * Processes email jobs from the email queue in the background.
 * This worker should run as a separate process from the main API server.
 * 
 * Run with: node src/workers/email.worker.js
 */

const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an actual email using Nodemailer
 * 
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} body - Email body (HTML)
 * @returns {Promise<Object>} Send result
 */
async function sendEmail(to, subject, body) {
  try {
    const info = await transporter.sendMail({
      from: `"LearnOrbit" <${process.env.SMTP_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      html: body, // html body
    });

    logger.info(`📧 Email sent successfully`, {
      to,
      subject,
      messageId: info.messageId,
    });

    return {
      success: true,
      messageId: info.messageId,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    throw error;
  }
}

/**
 * Process waitlist confirmation email
 * @param {Object} data - Job data
 */
async function processWaitlistEmail(data) {
  const { fullName, email } = data;

  const subject = 'Welcome to the LearnOrbit Waitlist! 🚀';
  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 40px 20px; text-align: center; }
        .content { padding: 40px 30px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .button { display: inline-block; padding: 14px 32px; background: #4F46E5; color: white !important; text-decoration: none; border-radius: 9999px; font-weight: 600; margin-top: 24px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2); transition: transform 0.2s; }
        .button:hover { transform: translateY(-1px); }
        h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; }
        p { margin-bottom: 16px; font-size: 16px; color: #475569; }
        .highlight { color: #4F46E5; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Only Upwards! 🚀</h1>
        </div>
        <div class="content">
          <p>Hi <span class="highlight">${fullName}</span>,</p>
          <p>You've successfully secured your spot on the LearnOrbit waitlist. We're building the future of learning, and we're thrilled to have you with us on this journey.</p>
          <p>We'll notify you as soon as early access opens. In the meantime, keep an eye on your inbox for exclusive updates and sneak peeks.</p>
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'https://learnorbit.com'}" class="button">Visit Our Website</a>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} LearnOrbit. All rights reserved.</p>
          <p>You received this email because you signed up for the LearnOrbit waitlist.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, subject, body);

  return {
    emailSent: true,
    recipient: email,
  };
}

/**
 * Process contact notification email
 * @param {Object} data - Job data
 */
async function processContactNotification(data) {
  const { name, email, message, leadId } = data;

  const subject = `New Contact Form Submission - ${name}`;
  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
        .label { font-weight: bold; color: #4F46E5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🚀 New Contact Form Submission</h2>
        </div>
        <div class="content">
          <p><span class="label">Lead ID:</span> #${leadId}</p>
          <p><span class="label">Name:</span> ${name}</p>
          <p><span class="label">Email:</span> ${email}</p>
          <p><span class="label">Message:</span></p>
          <p style="background: white; padding: 15px; border-left: 4px solid #4F46E5;">
            ${message || 'No message provided'}
          </p>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
            Submitted at: ${new Date().toLocaleString()}
          </p>
        </div>
        <div class="footer">
          <p>LearnOrbit - Automated Notification System</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send to admin email (configure in .env)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@learnorbit.com';
  await sendEmail(adminEmail, subject, body);

  // Optionally send confirmation to user
  const confirmationSubject = 'Thank you for contacting LearnOrbit';
  const confirmationBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Thank You for Reaching Out!</h2>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>We've received your message and our team will get back to you within 24 hours.</p>
          <p>Your reference ID is: <strong>#${leadId}</strong></p>
          <p>Best regards,<br>The LearnOrbit Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, confirmationSubject, confirmationBody);

  return {
    adminEmailSent: true,
    confirmationEmailSent: true,
    leadId,
  };
}

/**
 * Process welcome email
 * @param {Object} data - Job data
 */
async function processWelcomeEmail(data) {
  const { name, email, userId } = data;

  const subject = 'Welcome to LearnOrbit! 🚀';
  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .button { display: inline-block; padding: 12px 30px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to LearnOrbit!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Welcome aboard! We're thrilled to have you join the LearnOrbit community.</p>
          <p>Your account has been successfully created. Here's what you can do next:</p>
          <ul>
            <li>Complete your profile</li>
            <li>Explore our courses</li>
            <li>Join our community forums</li>
          </ul>
          <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Get Started</a>
          <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
            If you have any questions, feel free to reach out to our support team.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, subject, body);

  return {
    emailSent: true,
    userId,
  };
}

/**
 * Process paid enrollment notification email
 * @param {Object} data - Job data
 */
async function processPaidEnrollment(data) {
  const { student_name, student_email, course_title, instructor_email, admin_email, enrollment_id } = data;

  const subject = 'New Paid Enrollment Request – Approval Required';
  const approvalLink = `${process.env.ADMIN_DASHBOARD_URL || 'https://admin.learnorbit.com'}/enrollments/${enrollment_id}/approve`;
  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .button { display: inline-block; padding: 12px 25px; background: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h2>New Paid Enrollment Request</h2></div>
        <div class="content">
          <p><strong>Student Name:</strong> ${student_name}</p>
          <p><strong>Student Email:</strong> ${student_email}</p>
          <p><strong>Course Title:</strong> ${course_title}</p>
          <p><strong>Enrollment ID:</strong> ${enrollment_id}</p>
          <a href="${approvalLink}" class="button">Approve Enrollment</a>
        </div>
      </div>
    </body>
    </html>
    `;

  // Send email to admin (and optionally to instructor)
  const recipients = [admin_email || process.env.ADMIN_EMAIL];
  if (instructor_email) recipients.push(instructor_email);
  for (const to of recipients) {
    await sendEmail(to, subject, body);
  }
  return { emailSent: true, enrollment_id, recipients };
}

/**
 * Process password reset email
 * @param {Object} data - Job data
 */
async function processPasswordResetEmail(data) {
  const { email, resetToken, userId } = data;

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request - LearnOrbit';
  const body = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #DC2626; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .button { display: inline-block; padding: 12px 30px; background: #DC2626; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔒 Password Reset Request</h2>
        </div>
        <div class="content">
          <p>We received a request to reset your password.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <p>This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
            Or copy this link: ${resetUrl}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, subject, body);

  return {
    emailSent: true,
    userId,
  };
}

/**
 * Main job processor
 * Routes jobs to appropriate handlers based on job name
 */
async function processEmailJob(job) {
  const { name, data } = job;

  logger.info(`Processing email job: ${name}`, {
    jobId: job.id,
    attempt: job.attemptsMade + 1,
    maxAttempts: job.opts.attempts,
  });

  try {
    let result;

    switch (name) {
      case 'contact-notification':
        result = await processContactNotification(data);
        break;

      case 'welcome-email':
        result = await processWelcomeEmail(data);
        break;

      case 'password-reset':
        result = await processPasswordResetEmail(data);
        break;

      case 'waitlist-notification':
        result = await processWaitlistEmail(data);
        break;

      default:
        throw new Error(`Unknown job type: ${name}`);
    }

    logger.info(`✅ Email job completed successfully: ${name}`, {
      jobId: job.id,
      result,
    });

    // Update job progress to 100%
    await job.updateProgress(100);

    return result;

  } catch (error) {
    logger.error(`❌ Email job failed: ${name}`, {
      jobId: job.id,
      attempt: job.attemptsMade + 1,
      error: error.message,
      stack: error.stack,
    });

    // Re-throw to trigger retry mechanism
    throw error;
  }
}

// Create the worker
const emailWorker = new Worker('email', processEmailJob, {
  connection: redisClient,
  concurrency: 5,                 // Process up to 5 jobs concurrently
  limiter: {
    max: 10,                      // Max 10 jobs
    duration: 1000,               // Per second (rate limiting)
  },
});

// Worker event listeners
emailWorker.on('completed', (job, result) => {
  logger.info(`✅ Job completed`, {
    jobId: job.id,
    jobName: job.name,
    duration: Date.now() - job.timestamp,
    result,
  });
});

emailWorker.on('failed', (job, error) => {
  logger.error(`❌ Job failed`, {
    jobId: job?.id,
    jobName: job?.name,
    attempt: job?.attemptsMade,
    maxAttempts: job?.opts?.attempts,
    error: error.message,
    willRetry: job?.attemptsMade < job?.opts?.attempts,
  });
});

emailWorker.on('error', (error) => {
  logger.error(`Worker error: ${error.message}`, {
    error: error.stack,
  });
});

emailWorker.on('stalled', (jobId) => {
  logger.warn(`Job stalled: ${jobId}`);
});

emailWorker.on('progress', (job, progress) => {
  logger.debug(`Job progress: ${job.id} - ${progress}%`);
});

// Graceful shutdown
async function gracefulShutdown() {
  logger.info('Shutting down email worker gracefully...');

  try {
    await emailWorker.close();
    logger.info('Email worker closed successfully');
    process.exit(0);
  } catch (error) {
    logger.error(`Error during worker shutdown: ${error.message}`);
    process.exit(1);
  }
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Log worker startup
logger.info('🚀 Email worker started', {
  concurrency: 5,
  queueName: 'email',
  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPort: process.env.REDIS_PORT || 6379,
});

// Keep the process running
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', {
    promise,
    reason,
  });
});

module.exports = emailWorker;
