// src/middlewares/loginRateLimiter.js
const rateLimit = require('express-rate-limit');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = rateLimit({
  windowMs: 10 * 60 * 1000,          // 10-minute window
  max: isDev ? 50 : 10,              // 50 in dev, 10 in production
  message: {
    success: false,
    error: 'Too many login attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev && false,        // set to `true` to fully disable in dev
});

