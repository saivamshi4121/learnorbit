// src/app.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const requestIdMiddleware = require('./middlewares/requestId.middleware');
const logger = require('./utils/logger');
const redisRateLimiter = require('./middlewares/redisRateLimiter.middleware');

const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const courseRoutes = require('./modules/courses/course.routes');
const enrollmentRoutes = require('./modules/enrollments/enrollment.routes');
const progressRoutes = require('./modules/progress/progress.routes');
const instructorRoutes = require('./modules/instructor/instructor.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const lessonRoutes = require('./modules/lessons/lesson.routes');
const authRoutes = require('./routes/auth.routes');
const contactRoutes = require('./routes/contact.routes');
const uploadRoutes = require('./modules/upload/upload.routes');
const marketingRoutes = require('./modules/marketing/marketing.routes');

const app = express();

// Attach request ID early so downstream middleware can use it
app.use(requestIdMiddleware);

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // implementation for serving static images to frontend
}));

// CORS configuration – origin from .env or fallback to '*'
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser & cookie parser
app.use(express.json());
app.use(cookieParser());

// HTTP request logging – pipe through Winston
app.use(morgan('combined', {
  stream: {
    write: (msg) => logger.info(msg.trim()),
  },
}));

// Distributed rate limiting via Redis
app.use(redisRateLimiter);

// Serve uploads directory specifically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'LearnOrbit Backend Running Securely', startedAt: new Date().toISOString() });
});

// Mount feature routes
app.use('/api', uploadRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api', progressRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/instructor', instructorRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use(lessonRoutes);
app.use('/api/contact', contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not Found', message: 'The requested endpoint does not exist.' });
});

// Global error handler – log with request ID
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const requestId = req.id || '';
  logger.error(`${err.message}\n${err.stack}`, { requestId });
  const response = {
    success: false,
    error: process.env.NODE_ENV !== 'production' ? err.message : 'Internal Server Error',
    requestId,
  };
  res.status(status).json(response);
});

const PORT = process.env.PORT || 5000;

// Start server only if not being imported as a module
if (require.main === module) {
  /* Auto-migration for marketing tables */
  const runAutoMigration = require('./utils/migrate');
  runAutoMigration();

  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔒 CORS origin: ${process.env.FRONTEND_URL || '*'}`);
  });

  // Graceful shutdown
  const gracefulShutdown = async () => {
    logger.info('Received shutdown signal, closing server gracefully...');
    server.close(async () => {
      logger.info('HTTP server closed');

      // Close Redis connection
      const redisClient = require('./config/redis');
      if (redisClient && redisClient.status === 'ready') {
        await redisClient.quit();
        logger.info('Redis connection closed');
      }

      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

module.exports = app;
