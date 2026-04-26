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
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
// const redisRateLimiter = require('./middlewares/redisRateLimiter.middleware');

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
const instituteRoutes = require('./modules/institute/institute.routes');
const agentRoutes = require('./modules/agent/agent.routes');
const aiRoutes = require('./modules/ai/ai.routes');
const blogsRoutes = require('./modules/blogs/blogs.routes');
const eventsRoutes = require('./modules/events/events.routes');

const app = express();

// Attach request ID early so downstream middleware can use it
app.use(requestIdMiddleware);

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // implementation for serving static images to frontend
}));

// Body parser & cookie parser
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(cookieParser());

// Compression for performance
app.use(compression());

// Data sanitization against XSS
app.use(xss());

// CORS configuration – origin from .env or fallback
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://learnorbit.vercel.app', // Adding a likely production URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply limiter to all api routes
app.use('/api/', limiter);

// Serve uploads directory using absolute path from project root
// This must be before other routes but after CORS/Security headers
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// HTTP request logging – pipe through Winston
app.use(morgan('combined', {
  stream: {
    write: (msg) => logger.info(msg.trim()),
  },
}));

// Distributed rate limiting via Redis
// app.use(redisRateLimiter);



// Health check
app.get('/api/health', (req, res) => {
  const dbHost = process.env.DB_HOST || 'not set';
  const maskedDbHost = dbHost === 'localhost' || dbHost === '127.0.0.1' ? dbHost : dbHost.substring(0, 3) + '***';
  res.json({
    success: true,
    message: 'LearnOrbit Backend Running Securely',
    startedAt: new Date().toISOString(),
    env: process.env.NODE_ENV,
    dbHost: maskedDbHost
  });
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
app.use('/api', instituteRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/events', eventsRoutes);

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
  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔒 CORS origin: ${process.env.FRONTEND_URL || '*'}`);
    logger.info(`📂 Uploads path: ${path.join(process.cwd(), 'uploads')}`);

    // Delay migration by 3s so the pool has time to establish its first connection
    // before we run DDL. PgBouncer can reject connections attempted too early at startup.
    const runAutoMigration = require('./utils/migrate');
    setTimeout(() => {
      runAutoMigration().catch(err => {
        logger.warn('Startup migration failed (non-critical): ' + err.message);
      });
    }, 3000);
  });

  // Graceful shutdown
  const gracefulShutdown = async () => {
    logger.info('Received shutdown signal, closing server gracefully...');
    server.close(async () => {
      logger.info('HTTP server closed');

      // Close Redis connection
      // const redisClient = require('./config/redis');
      // if (redisClient && redisClient.status === 'ready') {
      //   await redisClient.quit();
      //   logger.info('Redis connection closed');
      // }

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
