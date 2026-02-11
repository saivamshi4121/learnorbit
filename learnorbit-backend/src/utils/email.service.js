const nodemailer = require('nodemailer');
const logger = require('./logger');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    async sendEnrollmentNotification({ instructorEmail, instructorName, courseTitle, studentName }) {
        try {
            const mailOptions = {
                from: `"LearnOrbit System" <${process.env.SMTP_USER}>`,
                to: instructorEmail,
                subject: 'New Enrollment Request - LearnOrbit',
                html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2c3e50;">New Enrollment Request</h2>
            <p>Hello <strong>${instructorName}</strong>,</p>
            <p>You have a new enrollment request for your course <strong>${courseTitle}</strong>.</p>
            <p><strong>Student:</strong> ${studentName}</p>
            <p>Please log in to your instructor dashboard to review and approve this request.</p>
            <br>
            <p>Best regards,<br>LearnOrbit Team</p>
          </div>
        `,
            };

            const info = await this.transporter.sendMail(mailOptions);
            logger.info(`Enrollment notification sent to ${instructorEmail}: ${info.messageId}`);
            return info;
        } catch (error) {
            logger.error('Error sending enrollment email', error);
            // Do not throw error to keep enrollment process intact
        }
    }
}

module.exports = new EmailService();
