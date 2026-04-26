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
  async sendWaitlistEmail({ fullName, email, role, currentPlatform, pricingExpectation }) {
    try {
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

      const info = await this.transporter.sendMail({
        from: `"LearnOrbit" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html: body
      });
      logger.info(`Waitlist email sent to ${email} - MessageID: ${info.messageId}`);

      // Send Admin Notification
      const adminSubject = `New Waitlist Signup: ${fullName}`;
      const adminBody = `
            <!DOCTYPE html>
            <html>
            <body>
              <h2>New Waitlist Signup 🚀</h2>
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Role:</strong> ${role || 'N/A'}</p>
              <p><strong>Current Platform:</strong> ${currentPlatform || 'None'}</p>
              <p><strong>Pricing Expectation:</strong> ${pricingExpectation || 'N/A'}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </body>
            </html>
          `;

      const adminEmail = process.env.ADMIN_EMAIL || 'admin@learnorbit.com';
      const adminInfo = await this.transporter.sendMail({
        from: `"LearnOrbit System" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: adminSubject,
        html: adminBody
      });
      logger.info(`Admin notification sent to ${adminEmail} - MessageID: ${adminInfo.messageId}`);

      logger.info(`Waitlist confirmation sent to ${email} and admin notification sent.`);
      return true;

    } catch (error) {
      logger.error(`Failed to send waitlist email to ${email}: ${error.message}`);
      // Don't throw, just log
      return false;
    }
  }
  async sendContactNotification({ name, email, message, leadId }) {
    try {
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

      const adminEmail = process.env.ADMIN_EMAIL || 'admin@learnorbit.com';
      await this.transporter.sendMail({
        from: `"LearnOrbit System" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject,
        html: body
      });

      // Confirmation email to user
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

      await this.transporter.sendMail({
        from: `"LearnOrbit" <${process.env.SMTP_USER}>`,
        to: email,
        subject: confirmationSubject,
        html: confirmationBody
      });

      return true;
    } catch (error) {
      logger.error(`Failed to send contact notification: ${error.message}`);
      return false;
    }
  }

  async sendEventStatusEmail({ email, name, eventTitle, status, eventDate, location }) {
    try {
      const isApproved = status === 'approved';
      const subject = isApproved 
        ? `Confirmed! You're attending ${eventTitle} 🎉` 
        : `Update regarding your registration for ${eventTitle}`;
      
      const body = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f5; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
                .header { background: ${isApproved ? '#10B981' : '#EF4444'}; color: white; padding: 40px 20px; text-align: center; }
                .content { padding: 40px 30px; }
                .details { background: #F3F4F6; padding: 20px; border-radius: 12px; margin: 20px 0; }
                .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                h1 { margin: 0; font-size: 24px; font-weight: 800; }
                .highlight { color: ${isApproved ? '#10B981' : '#EF4444'}; font-weight: 700; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>${isApproved ? 'Registration Approved!' : 'Registration Update'}</h1>
                </div>
                <div class="content">
                  <p>Hi <span class="highlight">${name}</span>,</p>
                  <p>
                    ${isApproved 
                      ? `We are excited to confirm your registration for <strong>${eventTitle}</strong>! We look forward to seeing you there.` 
                      : `Thank you for your interest in <strong>${eventTitle}</strong>. Unfortunately, we are unable to approve your registration at this time.`}
                  </p>
                  
                  ${isApproved ? `
                  <div class="details">
                    <p style="margin: 0; font-weight: bold; color: #374151;">Event Details:</p>
                    <p style="margin: 5px 0 0 0;">📅 ${eventDate}</p>
                    <p style="margin: 5px 0 0 0;">📍 ${location || 'Online'}</p>
                  </div>
                  ` : ''}
                  
                  <p>If you have any questions, please feel free to reply to this email.</p>
                  <p>Best regards,<br>The LearnOrbit Team</p>
                </div>
                <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} LearnOrbit. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `;

      await this.transporter.sendMail({
        from: `"LearnOrbit Events" <${process.env.SMTP_USER}>`,
        to: email,
        subject,
        html: body
      });
      logger.info(`Event status (${status}) email sent to ${email}`);
      return true;
    } catch (error) {
      logger.error(`Failed to send event status email: ${error.message}`);
      return false;
    }
  }

  async sendAdminRegistrationNotification({ eventTitle, userName, userEmail, userPhone }) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@learnorbit.com';
      const subject = `New Registration: ${eventTitle} 🚀`;
      const body = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; }
                .header { background: #4F46E5; color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
                .content { padding: 20px; background: #f9fafb; }
                .label { font-weight: bold; color: #4F46E5; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2 style="margin:0;">New Event Registration! 🚀</h2>
                </div>
                <div class="content">
                  <p><span class="label">Event:</span> ${eventTitle}</p>
                  <p><span class="label">Name:</span> ${userName || 'Guest'}</p>
                  <p><span class="label">Email:</span> ${userEmail || 'N/A'}</p>
                  <p><span class="label">Phone:</span> ${userPhone || 'N/A'}</p>
                  <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                  <p style="font-size: 12px; color: #6b7280; text-align: center;">
                    Please log in to the Admin Dashboard to review the payment and details.
                  </p>
                </div>
              </div>
            </body>
            </html>
          `;

      await this.transporter.sendMail({
        from: `"LearnOrbit System" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject,
        html: body
      });
      return true;
    } catch (error) {
      logger.error(`Failed to send admin event notification: ${error.message}`);
      return false;
    }
  }


  async sendBulkCertificates({ eventTitle, registrations, certificateSettings }) {
    try {
      const results = { success: 0, failed: 0 };
      
      for (const reg of registrations) {
        try {
          const email = reg.user_email || reg.form_data?.email || reg.form_data?.Email || reg.form_data?.['Email Address'];
          const name = reg.user_name || reg.form_data?.name || reg.form_data?.['Full Name'] || reg.form_data?.['Name'];
          
          if (!email) {
            logger.warn(`No email found for registration ${reg.id}`);
            results.failed++;
            continue;
          }

          const certificateBody = this._generateCertificateHtml({
            name: name || 'Participant',
            eventTitle,
            college: reg.form_data?.['College Name'] || reg.form_data?.college || 'N/A',
            branch: reg.form_data?.Branch || reg.form_data?.branch || 'N/A',
            year: reg.form_data?.Year || reg.form_data?.year || 'N/A',
            issuedBy: certificateSettings.issued_by || 'LearnOrbit Team',
            sponsorLogos: certificateSettings.sponsor_logos || []
          });

          await this.transporter.sendMail({
            from: `"LearnOrbit Events" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Certificate of Participation: ${eventTitle} 🎓`,
            html: certificateBody
          });
          
          results.success++;
        } catch (err) {
          logger.error(`Failed to send certificate to registration ${reg.id}: ${err.message}`);
          results.failed++;
        }
      }
      return results;
    } catch (error) {
      logger.error('Error in sendBulkCertificates', error);
      return { success: 0, failed: registrations.length };
    }
  }

  _generateCertificateHtml({ name, eventTitle, college, branch, year, issuedBy, sponsorLogos }) {
    const sponsorsHtml = sponsorLogos.map(logo => `<img src="${logo}" style="height: 40px; margin: 0 10px; opacity: 0.8;" />`).join('');
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .cert-container { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            width: 800px;
            margin: 0 auto;
            padding: 40px;
            border: 20px solid #4F46E5;
            background: white;
            text-align: center;
            position: relative;
          }
          .logo { height: 60px; margin-bottom: 20px; }
          .title { color: #4F46E5; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 30px; }
          .name { font-size: 42px; font-weight: 900; color: #111827; margin: 20px 0; border-bottom: 2px solid #E5E7EB; display: inline-block; padding: 0 40px; }
          .context { font-size: 18px; color: #4B5563; line-height: 1.6; margin: 20px 0; }
          .event-name { font-size: 28px; font-weight: 800; color: #4F46E5; margin: 20px 0; }
          .footer { margin-top: 50px; display: table; width: 100%; }
          .footer-col { display: table-cell; vertical-align: bottom; }
          .signature { border-top: 2px solid #111827; width: 200px; margin: 0 auto; padding-top: 10px; font-weight: bold; }
          .sponsors { margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="cert-container">
          <div style="text-align: left; margin-bottom: 30px;">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135664.png" style="height: 40px;" />
            <span style="font-size: 20px; font-weight: 900; color: #111827; vertical-align: middle; margin-left: 10px;">LearnOrbit</span>
          </div>

          <div class="title">Certificate of Participation</div>
          
          <div class="context">This is to certify that</div>
          
          <div class="name">${name}</div>
          
          <div class="context">
            of <strong>${college}</strong>, studying <strong>${branch}</strong> (${year} Year),<br>
            has successfully participated in the event
          </div>
          
          <div class="event-name">${eventTitle}</div>
          
          <div class="context" style="font-size: 14px; color: #9CA3AF;">
            Issued on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>

          <div class="footer">
            <div class="footer-col" style="text-align: left;">
               <div class="signature">${issuedBy}</div>
               <div style="font-size: 12px; color: #6B7280; margin-top: 5px;">Authorized Signatory</div>
            </div>
            <div class="footer-col" style="text-align: right;">
                <div class="sponsors">
                  ${sponsorsHtml}
                </div>
            </div>
          </div>
          
          <div style="margin-top: 40px; font-size: 10px; color: #D1D5DB; text-align: center;">
            Verification ID: ${Math.random().toString(36).substring(2, 10).toUpperCase()}
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p style="font-size: 14px; color: #6B7280;">Tip: You can print this email or save it as a PDF for your records.</p>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
