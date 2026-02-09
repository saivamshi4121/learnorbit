# LearnOrbit Backend

A secure, scalable Node.js backend with Redis-powered distributed rate limiting and caching.

## 🚀 Features

- ✅ **Distributed Rate Limiting** - Redis-based rate limiting across multiple instances
- ✅ **Response Caching** - 5-minute TTL caching for course endpoints
- ✅ **Background Jobs** - BullMQ for async email processing and task queuing
- ✅ **Security Headers** - Helmet.js for production-grade security
- ✅ **Request Logging** - Winston + Morgan for comprehensive logging
- ✅ **CORS Support** - Configurable cross-origin resource sharing
- ✅ **Graceful Shutdown** - Proper cleanup of Redis connections
- ✅ **Docker Compose** - Professional container orchestration

## 📋 Prerequisites

- **Node.js** 18+ 
- **Docker Desktop** (for Redis)
- **MySQL** 8+ (for database)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd learnorbit-backend
npm install
```

### 2. Configure Environment

Create a `.env` file:

```env
PORT=65000
NODE_ENV=production
FRONTEND_URL=https://app.learnorbit.com

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=system
DB_NAME=learnorbit

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 3. Start Redis with Docker Compose

```bash
npm run docker:up
```

Or manually:

```bash
docker-compose up -d
```

### 4. Start the Backend

```bash
npm run dev
```

## 📦 NPM Scripts

### Application Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run worker     # Start email worker (production)
npm run worker:dev # Start email worker (development)
```

### Docker Scripts

```bash
npm run docker:up       # Start Redis container
npm run docker:down     # Stop Redis container
npm run docker:logs     # View Redis logs (follow mode)
npm run docker:restart  # Restart Redis container
npm run docker:status   # Check container status
```

## 🐳 Docker Compose

The project uses Docker Compose for Redis management. See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed documentation.

### Quick Commands

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f redis

# Stop all services
docker-compose down
```

## 🔌 API Endpoints

### Health Check

```bash
GET /api/health
```

Response:
```json
{
  "success": true,
  "message": "LearnOrbit Backend Running Securely"
}
```

### Courses (with caching)

```bash
GET /api/courses
```

- **Cache**: 5-minute TTL
- **Rate Limit**: 100 requests per 15 minutes per IP

### Authentication

```bash
POST /api/auth/login
POST /api/auth/register
```

### Contact

```bash
POST /api/contact
```

## 📊 Architecture

```
src/
├── app.js                      # Express app setup & server startup
├── config/
│   └── redisClient.js         # Redis client configuration
├── controllers/
│   ├── auth.controller.js     # Authentication logic
│   ├── contact.controller.js  # Contact form handling
│   └── course.controller.js   # Course endpoints with caching
├── middlewares/
│   ├── redisRateLimiter.middleware.js  # Distributed rate limiting
│   └── requestId.middleware.js         # Request ID tracking
├── routes/
│   ├── auth.routes.js
│   ├── contact.routes.js
│   └── course.routes.js
└── utils/
    └── logger.js              # Winston logger configuration
```

## 🔒 Security Features

- **Helmet.js** - Security headers (CSP, HSTS, etc.)
- **Rate Limiting** - Distributed via Redis
- **CORS** - Configurable origin whitelist
- **Request IDs** - Trace requests across logs
- **Error Handling** - Centralized error handler with logging

## 🧪 Testing the Setup

### Test Health Endpoint

```bash
curl http://localhost:65000/api/health
```

### Test Rate Limiting

```powershell
# Make 10 rapid requests
for ($i=1; $i -le 10; $i++) { 
  curl http://localhost:65000/api/health 
}
```

### Test Redis Connection

```bash
docker exec cyberorbit-redis redis-cli ping
# Should return: PONG
```

### Monitor Redis

```bash
docker exec -it cyberorbit-redis redis-cli monitor
```

## 📈 Redis Features

### Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Storage**: Redis with automatic cleanup
- **Fallback**: In-memory if Redis fails

### Caching

- **Endpoint**: `/api/courses`
- **TTL**: 5 minutes (300 seconds)
- **Strategy**: Cache-aside pattern
- **Invalidation**: Automatic expiration

## 🔧 Configuration

### Redis Client

```javascript
// src/config/redisClient.js
const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 3,
});
```

### Rate Limiter

```javascript
// src/middlewares/redisRateLimiter.middleware.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({ client: redisClient }),
});
```

## 🐛 Troubleshooting

### Redis Connection Failed

```bash
# Check if Redis is running
docker-compose ps

# Check Redis logs
docker-compose logs redis

# Restart Redis
docker-compose restart redis
```

### Port Already in Use

```bash
# Find process using port 65000
netstat -ano | findstr :65000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Backend Won't Start

```bash
# Check Node version
node --version  # Should be 18+

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check .env file exists
ls .env
```

## 📚 Documentation

- [Docker Setup Guide](./DOCKER_SETUP.md) - Comprehensive Docker Compose documentation
- [BullMQ Guide](./BULLMQ_GUIDE.md) - Background job system with email workers
- [Queue Examples](./QUEUE_EXAMPLES.js) - Code examples for using the queue system
- [Redis Architecture](./REDIS_ARCHITECTURE.md) - System architecture overview
- [Redis Quick Reference](./REDIS_QUICK_REFERENCE.md) - Common Redis commands
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md) - Feature implementation details

## 🚀 Production Deployment

### 1. Update Environment

```env
NODE_ENV=production
FRONTEND_URL=https://your-production-domain.com
```

### 2. Add Redis Password

```yaml
# docker-compose.yml
services:
  redis:
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
```

```env
# .env
REDIS_PASSWORD=your_secure_password
```

### 3. Enable SSL/TLS

Configure reverse proxy (nginx/Apache) for HTTPS.

### 4. Resource Limits

Add to `docker-compose.yml`:

```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 👨‍💻 Author

LearnOrbit Team

---

**Need Help?** Check the documentation files or open an issue.
