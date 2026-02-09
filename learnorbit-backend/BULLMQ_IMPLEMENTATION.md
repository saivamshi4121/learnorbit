# 🎉 BullMQ Background Job System - Complete Implementation

## ✅ Implementation Complete!

I've successfully extended the LearnOrbit backend with a **professional background job system** using **BullMQ** and **Redis**.

---

## 📦 What Was Delivered

### 1. **Email Queue** (`src/queues/email.queue.js`)

**Purpose**: Manages the email job queue with retry logic and monitoring.

**Features**:
- ✅ Retry logic: 3 attempts with exponential backoff (2s → 4s → 8s)
- ✅ Job retention: Completed (24h), Failed (7 days)
- ✅ Multiple job types: Contact, Welcome, Password Reset
- ✅ Event monitoring and logging
- ✅ Graceful shutdown handling

**Functions**:
```javascript
addContactEmailJob(data)       // Add contact notification job
addWelcomeEmailJob(data)        // Add welcome email job
addPasswordResetEmailJob(data)  // Add password reset job
getQueueStats()                 // Get queue statistics
cleanQueue()                    // Clean old jobs
```

---

### 2. **Email Worker** (`src/workers/email.worker.js`)

**Purpose**: Background process that processes email jobs from the queue.

**Features**:
- ✅ Runs separately from API server
- ✅ Concurrent processing: 5 jobs at once
- ✅ Rate limiting: 10 jobs/second
- ✅ Automatic retries on failure
- ✅ Beautiful HTML email templates
- ✅ Comprehensive error handling
- ✅ Detailed logging

**Job Handlers**:
1. **contact-notification**: Sends admin notification + user confirmation
2. **welcome-email**: Sends welcome email to new users
3. **password-reset**: Sends password reset link

**Email Templates**:
- Professional HTML design
- Responsive layout
- Branded styling
- Clear call-to-actions

---

### 3. **Updated Contact Controller** (`src/controllers/contact.controller.js`)

**Changes**:
```javascript
// Before: Just saved to database
const [result] = await pool.execute(sql, [name, email, message]);
res.json({ success: true, id: result.insertId });

// After: Saves to DB + Queues email (non-blocking)
const [result] = await pool.execute(sql, [name, email, message]);
const leadId = result.insertId;

// Add email job (async, don't wait)
addContactEmailJob({ name, email, message, leadId })
  .catch(err => logger.error('Failed to queue email', err));

// Return immediately
res.json({ 
  success: true, 
  id: leadId, 
  emailQueued: true 
});
```

**Flow**:
1. Save contact to database → Get `leadId`
2. Add email job to queue (non-blocking)
3. Return success response immediately
4. Worker processes email in background

---

### 4. **NPM Scripts** (Updated `package.json`)

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "worker": "node src/workers/email.worker.js",
    "worker:dev": "nodemon src/workers/email.worker.js",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f redis",
    "docker:restart": "docker-compose restart redis",
    "docker:status": "docker-compose ps"
  }
}
```

---

### 5. **Environment Configuration** (Updated `.env`)

```env
# Email Configuration
ADMIN_EMAIL=admin@learnorbit.com  # Receives contact form notifications
```

---

### 6. **Comprehensive Documentation**

| File | Purpose |
|------|---------|
| `BULLMQ_GUIDE.md` | Complete guide (50+ sections) |
| `BULLMQ_IMPLEMENTATION.md` | Implementation summary |
| `QUEUE_EXAMPLES.js` | 7 real-world code examples |
| `README.md` | Updated with BullMQ info |

---

## 🚀 How to Run

### Step 1: Unpause Docker Desktop

**Docker Desktop is currently paused.** You need to:
1. Open Docker Desktop
2. Click the whale icon in system tray
3. Click "Resume" or "Unpause"

Or just open the Docker Desktop application.

### Step 2: Start Redis

```bash
npm run docker:up
```

### Step 3: Start API Server

```bash
# Terminal 1
npm run dev
```

### Step 4: Start Email Worker

```bash
# Terminal 2 (separate terminal)
npm run worker
```

Or in development mode with auto-reload:

```bash
npm run worker:dev
```

---

## 🧪 How to Test

### Test Contact Form

```bash
curl -X POST http://localhost:65000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I need help with my account"
  }'
```

### Expected Response (Immediate)

```json
{
  "success": true,
  "message": "Contact lead saved successfully. We will get back to you soon!",
  "data": {
    "id": 123,
    "emailQueued": true
  }
}
```

### Expected Worker Output (Background)

```
info: Contact email job added to queue {jobId: "1", leadId: 123}
info: Processing email job: contact-notification {jobId: "1", attempt: 1}
info: 📧 Email sent successfully {to: "admin@learnorbit.com", subject: "New Contact Form Submission - John Doe"}
info: 📧 Email sent successfully {to: "john@example.com", subject: "Thank you for contacting LearnOrbit"}
info: ✅ Email job completed successfully: contact-notification {jobId: "1"}
```

---

## 🎯 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Request                         │
│              POST /api/contact                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Contact Controller                         │
│  1. Save to database → Get leadId                       │
│  2. Add job to queue (non-blocking)                     │
│  3. Return response immediately ✅                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Redis Queue                            │
│  - Stores job data                                      │
│  - Manages retries                                      │
│  - Tracks job status                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Email Worker (Separate Process)            │
│  1. Picks up job from queue                             │
│  2. Sends admin notification email                      │
│  3. Sends user confirmation email                       │
│  4. Marks job as complete                               │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Key Features

### 1. Non-Blocking API
- ✅ API responds in milliseconds
- ✅ Email processing happens in background
- ✅ User doesn't wait for email to send

### 2. Automatic Retries
- ✅ 3 attempts on failure
- ✅ Exponential backoff: 2s → 4s → 8s
- ✅ Detailed error logging

### 3. Scalable
- ✅ Run multiple worker instances
- ✅ Horizontal scaling
- ✅ Load distribution across workers

### 4. Production-Ready
- ✅ Graceful shutdown
- ✅ Error handling
- ✅ Comprehensive logging
- ✅ Job retention policies
- ✅ Rate limiting

### 5. Clean Architecture
- ✅ Queue separate from controller
- ✅ Worker runs independently
- ✅ Easy to add new job types
- ✅ Testable components

---

## 📊 Job Configuration

### Retry Strategy

```javascript
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000  // 2s, 4s, 8s
  }
}
```

### Job Retention

```javascript
{
  removeOnComplete: {
    age: 24 * 3600,    // Keep 24 hours
    count: 1000        // Keep last 1000
  },
  removeOnFail: {
    age: 7 * 24 * 3600,  // Keep 7 days
    count: 5000          // Keep last 5000
  }
}
```

### Worker Concurrency

```javascript
{
  concurrency: 5,      // Process 5 jobs simultaneously
  limiter: {
    max: 10,           // Max 10 jobs
    duration: 1000     // Per second
  }
}
```

---

## 🔌 Email Service Integration

### Current Setup: Simulated

The worker currently **simulates** email sending:
- 1 second delay
- Logs email details
- Returns success

### Production: Integrate Real Service

**Option 1: SendGrid**
```bash
npm install @sendgrid/mail
```

**Option 2: AWS SES**
```bash
npm install @aws-sdk/client-ses
```

**Option 3: Nodemailer (SMTP)**
```bash
npm install nodemailer
```

See `BULLMQ_GUIDE.md` for complete integration examples.

---

## 🚀 Production Deployment

### Recommended: Separate Processes

```bash
# Server 1: API
npm start

# Server 2: Worker
npm run worker
```

### Docker Compose Example

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    # ... existing config

  api:
    build: .
    command: npm start
    depends_on:
      - redis

  worker:
    build: .
    command: npm run worker
    depends_on:
      - redis
    deploy:
      replicas: 2  # Run 2 worker instances
```

### PM2 Example

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'api',
      script: 'src/app.js',
      instances: 2,
      exec_mode: 'cluster',
    },
    {
      name: 'worker',
      script: 'src/workers/email.worker.js',
      instances: 2,
    },
  ],
};
```

```bash
pm2 start ecosystem.config.js
```

---

## 📈 Monitoring

### Queue Statistics

```javascript
const { getQueueStats } = require('./queues/email.queue');

const stats = await getQueueStats();
console.log(stats);
// {
//   waiting: 5,
//   active: 2,
//   completed: 1234,
//   failed: 12,
//   delayed: 0,
//   total: 1253
// }
```

### Redis Keys

```bash
# View all queue keys
docker exec cyberorbit-redis redis-cli KEYS "bull:email:*"

# Monitor real-time
docker exec -it cyberorbit-redis redis-cli monitor
```

### Worker Logs

All activity is logged via Winston:
- Job received
- Processing started
- Emails sent
- Job completed/failed
- Retry attempts

---

## 📚 Code Examples

### Example 1: Contact Form (Implemented)

```javascript
async function createContact(req, res) {
  const { name, email, message } = req.body;
  
  // Save to database
  const [result] = await pool.execute(sql, [name, email, message]);
  const leadId = result.insertId;
  
  // Queue email (non-blocking)
  addContactEmailJob({ name, email, message, leadId })
    .catch(err => logger.error('Failed to queue email', err));
  
  // Return immediately
  res.json({ success: true, id: leadId, emailQueued: true });
}
```

### Example 2: User Registration

```javascript
async function registerUser(req, res) {
  const { name, email, password } = req.body;
  
  // Save user
  const [result] = await pool.execute(sql, [name, email, hashedPassword]);
  const userId = result.insertId;
  
  // Queue welcome email
  addWelcomeEmailJob({ name, email, userId })
    .catch(err => logger.error(err));
  
  // Return immediately
  res.json({ success: true, userId });
}
```

### Example 3: Password Reset

```javascript
async function requestPasswordReset(req, res) {
  const { email } = req.body;
  
  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Save token to DB
  await pool.execute(sql, [userId, tokenHash, expiresAt]);
  
  // Queue password reset email
  addPasswordResetEmailJob({ email, resetToken, userId })
    .catch(err => logger.error(err));
  
  // Return immediately
  res.json({ success: true });
}
```

See `QUEUE_EXAMPLES.js` for 7 complete examples!

---

## 🐛 Troubleshooting

### Worker Not Processing Jobs

```bash
# Check if worker is running
ps aux | grep "email.worker"

# Check Redis connection
docker exec cyberorbit-redis redis-cli ping

# View queue keys
docker exec cyberorbit-redis redis-cli KEYS "bull:email:*"
```

### Jobs Failing

```bash
# View failed jobs
docker exec cyberorbit-redis redis-cli LRANGE "bull:email:failed" 0 -1

# Check worker logs
npm run worker
```

### Clear Queue

```javascript
// scripts/clear-queue.js
const { emailQueue } = require('../src/queues/email.queue');

async function clearQueue() {
  await emailQueue.obliterate({ force: true });
  console.log('Queue cleared');
  process.exit(0);
}

clearQueue();
```

---

## ✨ Next Steps

### 1. Start Everything

```bash
# 1. Unpause Docker Desktop
# 2. Start Redis
npm run docker:up

# 3. Start API (Terminal 1)
npm run dev

# 4. Start Worker (Terminal 2)
npm run worker
```

### 2. Test Contact Form

```bash
curl -X POST http://localhost:65000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Hello!"}'
```

### 3. Monitor Logs

- **API logs**: Terminal 1
- **Worker logs**: Terminal 2
- **Redis logs**: `npm run docker:logs`

### 4. Integrate Real Email Service

- Choose provider (SendGrid recommended)
- Install package
- Update `sendEmail()` function in worker
- Add API key to `.env`

### 5. Add More Job Types

See `QUEUE_EXAMPLES.js` for:
- Welcome emails
- Bulk campaigns
- Scheduled emails
- Custom notifications

---

## 🎊 Summary

### What You Have Now

✅ **Professional background job system** using BullMQ  
✅ **Non-blocking API** - responses return immediately  
✅ **Automatic retries** - 3 attempts with exponential backoff  
✅ **Scalable architecture** - run multiple workers  
✅ **Production-ready** - error handling, logging, graceful shutdown  
✅ **Clean code** - queue separate from controller  
✅ **Comprehensive docs** - 3 detailed guides  

### Files Created

1. `src/queues/email.queue.js` - Queue configuration
2. `src/workers/email.worker.js` - Background worker
3. `src/controllers/contact.controller.js` - Updated controller
4. `BULLMQ_GUIDE.md` - Complete guide
5. `BULLMQ_IMPLEMENTATION.md` - Implementation summary
6. `QUEUE_EXAMPLES.js` - Code examples

### How It Works

1. **User submits contact form**
2. **Controller saves to database** → Gets `leadId`
3. **Controller adds job to queue** (non-blocking)
4. **API returns success** immediately
5. **Worker picks up job** from queue
6. **Worker sends emails** (admin + user)
7. **Worker marks job complete**

---

## 📖 Documentation

- **[BULLMQ_GUIDE.md](./BULLMQ_GUIDE.md)** - Complete guide (architecture, deployment, monitoring)
- **[BULLMQ_IMPLEMENTATION.md](./BULLMQ_IMPLEMENTATION.md)** - Implementation summary
- **[QUEUE_EXAMPLES.js](./QUEUE_EXAMPLES.js)** - 7 real-world code examples
- **[README.md](./README.md)** - Main project documentation

---

## 🎯 Quick Reference

```bash
# Start Redis
npm run docker:up

# Start API
npm run dev

# Start Worker
npm run worker

# Check status
npm run docker:status

# View logs
npm run docker:logs
```

---

**Everything is ready!** Just unpause Docker Desktop and run the commands above. 🚀

**Questions?** Check the comprehensive guides in the documentation files!
