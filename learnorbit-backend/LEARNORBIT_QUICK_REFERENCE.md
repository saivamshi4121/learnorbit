# 🎓 LearnOrbit LMS - Quick Reference Guide

## 🚀 Quick Start

### 1. Generate Password Hash
```bash
node scripts/generate-hash.js "YourPassword123"
```

### 2. Run Database Migration
```bash
mysql -u root -p learnorbit < database/schema/users.sql
```

### 3. Update Admin Password
```sql
UPDATE users 
SET password_hash = 'YOUR_GENERATED_HASH'
WHERE email = 'admin@learnorbit.com';
```

### 4. Test Login
```bash
curl -X POST http://localhost:65000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@learnorbit.com","password":"YourPassword123"}'
```

---

## 🔐 Authentication Flow

```
1. Register/Login → Get Access Token + Refresh Token (cookie)
2. Use Access Token in Authorization header
3. When Access Token expires (15 min) → Refresh
4. Logout → Revoke Refresh Token
```

---

## 🛡️ RBAC Middleware Cheat Sheet

### Import
```javascript
const {
  protect,
  authorizeRoles,
  isAdmin,
  isInstructorOrAdmin,
  isStudent,
  isOwnerOrAdmin,
  optionalAuth,
  hasPermission,
} = require('../middlewares/rbac.middleware');
```

### Basic Usage
```javascript
// Require authentication
router.get('/profile', protect, handler);

// Admin only
router.delete('/users/:id', protect, isAdmin, handler);

// Admin or Instructor
router.post('/courses', protect, isInstructorOrAdmin, handler);

// Student only
router.post('/enroll', protect, isStudent, handler);

// Multiple roles
router.get('/dashboard', protect, authorizeRoles('admin', 'instructor'), handler);

// Resource ownership
router.get('/users/:id', protect, isOwnerOrAdmin('id'), handler);

// Permission-based
router.post('/courses/:id/publish', protect, hasPermission('publish_course'), handler);

// Optional auth
router.get('/courses', optionalAuth, handler);
```

---

## 📋 User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **admin** | System administrator | Full access to all features |
| **instructor** | Course creator | Create/manage courses, view analytics |
| **student** | Learner | Enroll courses, submit assignments |

---

## 🔑 JWT Token Structure

```javascript
{
  id: 123,              // User ID
  email: "user@example.com",
  role: "student",      // admin, instructor, or student
  name: "John Doe",
  iat: 1234567890,      // Issued at
  exp: 1234568790       // Expires at (15 minutes)
}
```

---

## 📡 API Endpoints

### Public Endpoints (No Auth)
```bash
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/verify-email/:token
```

### Authenticated Endpoints
```bash
GET    /api/auth/me                    # Get current user
POST   /api/auth/logout                # Logout
POST   /api/auth/refresh               # Refresh token
```

### Admin Endpoints
```bash
GET    /api/admin/users                # List all users
DELETE /api/admin/users/:id            # Delete user
PUT    /api/admin/users/:id/role       # Change user role
GET    /api/admin/analytics            # View analytics
```

### Instructor Endpoints
```bash
POST   /api/courses                    # Create course
PUT    /api/courses/:id                # Update course
POST   /api/courses/:id/publish        # Publish course
GET    /api/instructor/analytics       # View own analytics
```

### Student Endpoints
```bash
POST   /api/enrollments                # Enroll in course
GET    /api/my-courses                 # View enrolled courses
POST   /api/assignments/:id/submit     # Submit assignment
GET    /api/my-progress                # View progress
```

---

## 🧪 Testing Examples

### Register Student
```bash
curl -X POST http://localhost:65000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Student",
    "email": "john@example.com",
    "password": "Student@123",
    "role": "student"
  }'
```

### Register Instructor
```bash
curl -X POST http://localhost:65000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Instructor",
    "email": "jane@example.com",
    "password": "Instructor@123",
    "role": "instructor",
    "profile": {
      "expertise": "Web Development,JavaScript",
      "yearsOfExperience": 5
    }
  }'
```

### Login
```bash
curl -X POST http://localhost:65000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Student@123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:65000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Logout
```bash
curl -X POST http://localhost:65000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -b "refreshToken=YOUR_REFRESH_TOKEN"
```

---

## 🗄️ Database Queries

### Count Users by Role
```sql
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;
```

### Find Active Admins
```sql
SELECT id, name, email, last_login_at 
FROM users 
WHERE role = 'admin' AND is_active = TRUE;
```

### Find Locked Accounts
```sql
SELECT id, name, email, locked_until 
FROM users 
WHERE locked_until > NOW();
```

### Find Unverified Emails
```sql
SELECT id, name, email, created_at 
FROM users 
WHERE is_email_verified = FALSE;
```

### Active Sessions
```sql
SELECT u.name, u.email, rt.created_at, rt.ip_address
FROM refresh_tokens rt
JOIN users u ON rt.user_id = u.id
WHERE rt.revoked = FALSE AND rt.expires_at > NOW();
```

### Recent Audit Logs
```sql
SELECT u.name, al.event_type, al.ip_address, al.created_at
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.id
ORDER BY al.created_at DESC
LIMIT 50;
```

---

## 🔧 Common Tasks

### Change User Role
```sql
UPDATE users 
SET role = 'instructor' 
WHERE email = 'user@example.com';
```

### Unlock Account
```sql
UPDATE users 
SET locked_until = NULL, failed_login_attempts = 0 
WHERE email = 'user@example.com';
```

### Deactivate User
```sql
UPDATE users 
SET is_active = FALSE 
WHERE email = 'user@example.com';
```

### Revoke All Sessions
```sql
UPDATE refresh_tokens 
SET revoked = TRUE, revoked_at = NOW() 
WHERE user_id = 123 AND revoked = FALSE;
```

### Verify Email Manually
```sql
UPDATE users 
SET is_email_verified = TRUE,
    email_verification_token = NULL,
    email_verification_expires_at = NULL
WHERE email = 'user@example.com';
```

---

## 🛠️ Troubleshooting

### "Invalid credentials" on login
- Check password hash is correct
- Verify user exists in database
- Check if account is locked or deactivated

### "Token expired"
- Access token expires after 15 minutes
- Use refresh endpoint to get new token
- Check system time is correct

### "Forbidden" error
- Verify user has correct role
- Check route requires correct role
- Ensure JWT includes role field

### Account locked
- Wait 15 minutes or unlock manually
- Reset failed login attempts
- Check audit logs for suspicious activity

---

## 📊 Permission Matrix

| Action | Admin | Instructor | Student |
|--------|-------|------------|---------|
| Create User | ✅ | ❌ | ❌ |
| Delete User | ✅ | ❌ | ❌ |
| Create Course | ✅ | ✅ | ❌ |
| Edit Own Course | ✅ | ✅ | ❌ |
| Delete Course | ✅ | ❌ | ❌ |
| Publish Course | ✅ | ✅ | ❌ |
| Enroll Course | ✅ | ✅ | ✅ |
| Submit Assignment | ✅ | ✅ | ✅ |
| View All Analytics | ✅ | ❌ | ❌ |
| View Own Analytics | ✅ | ✅ | ✅ |
| Manage Settings | ✅ | ❌ | ❌ |

---

## 📝 Environment Variables

```env
# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=system
DB_NAME=learnorbit

# Server
PORT=65000
NODE_ENV=production

# Email (for verification/reset)
ADMIN_EMAIL=admin@learnorbit.com
```

---

## 🎯 Best Practices

1. **Always use HTTPS in production**
2. **Store JWT in memory or secure storage (not localStorage)**
3. **Implement token refresh before expiration**
4. **Log security events**
5. **Use strong passwords (min 8 chars)**
6. **Enable email verification**
7. **Monitor failed login attempts**
8. **Regular security audits**
9. **Keep dependencies updated**
10. **Use environment variables for secrets**

---

## 📚 Related Files

- `database/schema/users.sql` - Database schema
- `src/repositories/user.repository.js` - User data access
- `src/services/auth.service.js` - Authentication logic
- `src/controllers/auth.controller.js` - HTTP handlers
- `src/middlewares/rbac.middleware.js` - Authorization
- `LEARNORBIT_REFACTORING.md` - Complete guide

---

## 🆘 Support

For issues or questions:
1. Check `LEARNORBIT_REFACTORING.md`
2. Review audit logs
3. Check application logs
4. Verify database schema

---

**LearnOrbit LMS - Ready to Learn!** 🚀
