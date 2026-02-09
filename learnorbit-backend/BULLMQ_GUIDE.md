# BullMQ Background Job System - Complete Guide

## 🎯 Overview

The LearnOrbit backend now includes a professional background job system using **BullMQ** and **Redis**. This allows you to process time-consuming tasks (like sending emails) asynchronously without blocking API responses.

## 📦 Architecture

```
┌─────────────────┐
│   API Request   │
│  (Contact Form) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controller    │ ─── Saves to DB
│ contact.controller │ ─── Adds job to queue (non-blocking)
└────────┬────────┘ ─── Returns response immediately
         │
         ▼
┌─────────────────┐
│  Redis Queue    │ ◄─── Jobs stored here
│  (email queue)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Email Worker   │ ◄─── Runs separately
│ (Background)    │ ─── Processes jobs
│                 │ ─── Sends emails
└─────────────────┘
```

## 🚀 Quick Start

### 1. Start Redis (if not running)

```bash
npm run docker:up
```

### 2. Start the API Server

```bash
# Terminal 1
npm run dev
```

### 3. Start the Email Worker

```bash
# Terminal 2 (separate terminal)
npm run worker
```

Or in development mode with auto-reload:

```bash
npm run worker:dev
```

## 📂 File Structure

```
src/
├── queues/
│   └── email.queue.js          # Queue configuration & job creators
├── workers/
│   └── email.worker.js         # Background worker process
└── controllers/
    └── contact.controller.js   # Updated to use queue
```

## 🔧 How It Works

### 1. Queue Configuration (`email.queue.js`)

**Purpose**: Defines the email queue and provides functions to add jobs.

**Key Features**:
- ✅ Retry logic (3 attempts with exponential backoff)
- ✅ Job retention (completed: 24h, failed: 7 days)
- ✅ Multiple job types (contact, welcome, password reset)
- ✅ Event monitoring
- ✅ Graceful shutdown

**Usage Example**:

```javascript
const { addContactEmailJob } = require('./queues/email.queue');

// Add a job to the queue
await addContactEmailJob({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello!',
  leadId: 123,
});
```

### 2. Worker Process (`email.worker.js`)

**Purpose**: Processes jobs from the queue in the background.

**Key Features**:
- ✅ Concurrent processing (5 jobs at once)
- ✅ Rate limiting (10 jobs/second)
- ✅ Automatic retries on failure
- ✅ Detailed logging
- ✅ Multiple job handlers
- ✅ Graceful shutdown

**Job Types**:
1. **contact-notification** - Sends admin notification + user confirmation
2. **welcome-email** - Sends welcome email to new users
3. **password-reset** - Sends password reset link

### 3. Updated Contact Controller

**Changes**:
- ✅ Saves contact to database
- ✅ Adds email job to queue (non-blocking)
- ✅ Returns response immediately
- ✅ Handles queue errors gracefully

**Flow**:
1. Receive contact form submission
2. Save to database → Get `leadId`
3. Add email job to queue (async, don't wait)
4. Return success response to user
5. Worker processes email in background

## 🎯 Job Configuration

### Retry Strategy

```javascript
{
  attempts: 3,                    // Retry up to 3 times
  backoff: {
    type: 'exponential',          // 2s, 4s, 8s delays
    delay: 2000,
  }
}
```

### Job Retention

```javascript
{
  removeOnComplete: {
    age: 24 * 3600,               // Keep 24 hours
    count: 1000,                  // Keep last 1000
  },
  removeOnFail: {
    age: 7 * 24 * 3600,           // Keep 7 days
    count: 5000,                  // Keep last 5000
  }
}
```

## 📊 Monitoring

### View Queue Stats

Create a monitoring endpoint (optional):

```javascript
// src/routes/admin.routes.js
const { getQueueStats } = require('../queues/email.queue');

router.get('/queue/stats', async (req, res) => {
  const stats = await getQueueStats();
  res.json(stats);
});
```

Response:
```json
{
  "waiting": 5,
  "active": 2,
  "completed": 1234,
  "failed": 12,
  "delayed": 0,
  "total": 1253
}
```

### Monitor Redis Keys

```bash
# View all queue keys
docker exec cyberorbit-redis redis-cli KEYS "bull:email:*"

# Monitor real-time
docker exec -it cyberorbit-redis redis-cli monitor
```

### Worker Logs

The worker logs all activity:

```
info: 🚀 Email worker started
info: Processing email job: contact-notification
info: 📧 Email sent successfully
info: ✅ Job completed
```

## 🧪 Testing

### Test Contact Form

```bash
curl -X POST http://localhost:65000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

**Expected Response** (immediate):
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

**Worker Output** (in background):
```
info: Contact email job added to queue
info: Processing email job: contact-notification
info: 📧 Email sent successfully (to: admin@learnorbit.com)
info: 📧 Email sent successfully (to: test@example.com)
info: ✅ Email job completed successfully
```

## 🔄 Production Deployment

### Option 1: Separate Worker Process (Recommended)

Run the worker as a separate process/container:

```bash
# Server 1: API
npm start

# Server 2: Worker
npm run worker
```

**Docker Compose Example**:

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    # ... existing config

  api:
    build: .
    command: npm start
    ports:
      - "65000:65000"
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

### Option 2: PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Start both processes
pm2 start ecosystem.config.js
```

**ecosystem.config.js**:

```javascript
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

### Option 3: Systemd Service (Linux)

**API Service** (`/etc/systemd/system/cyberorbit-api.service`):

```ini
[Unit]
Description=LearnOrbit API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/learnorbit-backend
ExecStart=/usr/bin/node src/app.js
Restart=always

[Install]
WantedBy=multi-user.target
```

**Worker Service** (`/etc/systemd/system/cyberorbit-worker.service`):

```ini
[Unit]
Description=LearnOrbit Email Worker
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/learnorbit-backend
ExecStart=/usr/bin/node src/workers/email.worker.js
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start
sudo systemctl enable cyberorbit-api cyberorbit-worker
sudo systemctl start cyberorbit-api cyberorbit-worker

# Check status
sudo systemctl status cyberorbit-api cyberorbit-worker
```

## 🔌 Email Service Integration

### Current Setup (Simulated)

The worker currently **simulates** email sending. To integrate a real email service:

### Option 1: SendGrid

```bash
npm install @sendgrid/mail
```

**Update `email.worker.js`**:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, body) {
  const msg = {
    to,
    from: 'noreply@learnorbit.com',
    subject,
    html: body,
  };
  
  const result = await sgMail.send(msg);
  return result;
}
```

**Add to `.env`**:
```env
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Option 2: AWS SES

```bash
npm install @aws-sdk/client-ses
```

```javascript
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const sesClient = new SESClient({ region: 'us-east-1' });

async function sendEmail(to, subject, body) {
  const command = new SendEmailCommand({
    Source: 'noreply@learnorbit.com',
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Html: { Data: body } },
    },
  });
  
  return await sesClient.send(command);
}
```

### Option 3: Nodemailer (SMTP)

```bash
npm install nodemailer
```

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(to, subject, body) {
  return await transporter.sendMail({
    from: 'noreply@learnorbit.com',
    to,
    subject,
    html: body,
  });
}
```

## 🐛 Troubleshooting

### Worker Not Processing Jobs

```bash
# Check if worker is running
ps aux | grep "email.worker"

# Check Redis connection
docker exec cyberorbit-redis redis-cli ping

# View queue keys
docker exec cyberorbit-redis redis-cli KEYS "bull:email:*"

# Check for stalled jobs
docker exec cyberorbit-redis redis-cli HGETALL "bull:email:stalled"
```

### Jobs Failing

```bash
# View failed jobs
docker exec cyberorbit-redis redis-cli LRANGE "bull:email:failed" 0 -1

# Check worker logs
npm run worker  # View output
```

### Clear Queue

```javascript
// Create a script: scripts/clear-queue.js
const { emailQueue } = require('../src/queues/email.queue');

async function clearQueue() {
  await emailQueue.obliterate({ force: true });
  console.log('Queue cleared');
  process.exit(0);
}

clearQueue();
```

```bash
node scripts/clear-queue.js
```

## 📈 Performance Tuning

### Adjust Concurrency

```javascript
// In email.worker.js
const emailWorker = new Worker('email', processEmailJob, {
  connection: redisClient,
  concurrency: 10,  // Increase for more parallel processing
});
```

### Adjust Rate Limiting

```javascript
limiter: {
  max: 50,          // Max 50 jobs
  duration: 1000,   // Per second
}
```

### Scale Workers Horizontally

Run multiple worker instances:

```bash
# Terminal 1
npm run worker

# Terminal 2
npm run worker

# Terminal 3
npm run worker
```

BullMQ automatically distributes jobs across all workers.

## 🎊 Summary

### What You Get

✅ **Non-blocking API** - Responses return immediately  
✅ **Reliable delivery** - Jobs retry automatically  
✅ **Scalable** - Add more workers as needed  
✅ **Monitored** - Comprehensive logging  
✅ **Production-ready** - Graceful shutdown, error handling  
✅ **Flexible** - Easy to add new job types  

### NPM Scripts

```bash
npm run dev          # Start API server (development)
npm run worker       # Start email worker (production)
npm run worker:dev   # Start email worker (development)
npm run docker:up    # Start Redis
```

### Next Steps

1. ✅ Test the contact form
2. ✅ Monitor worker logs
3. ✅ Integrate real email service
4. ✅ Add more job types (welcome emails, etc.)
5. ✅ Set up monitoring dashboard (optional)

---

**Questions?** Check the logs or Redis queue status!
