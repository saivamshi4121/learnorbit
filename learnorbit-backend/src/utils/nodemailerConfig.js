// Example Nodemailer configuration for sending emails
// Update with your actual SMTP credentials and preferred defaults.

const nodemailer = require('nodemailer');

// Create a reusable transporter object using SMTP transport.
// For production, consider using environment variables to store credentials securely.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'username@example.com',
    pass: process.env.SMTP_PASS || 'yourpassword',
  },
  tls: {
    // Do not fail on invalid certs (useful for self‑signed certificates in dev)
    rejectUnauthorized: false,
  },
});

// Wrapper function to send an email. Returns the result from Nodemailer.
async function sendMail({ to, subject, html }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@learnorbit.com',
    to,
    subject,
    html,
  };

  // Send mail and return the info object.
  const info = await transporter.sendMail(mailOptions);
  return info;
}

module.exports = { transporter, sendMail };
