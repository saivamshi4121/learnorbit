# 🎓 LearnOrbit LMS - Refactoring Complete

## ✅ Refactoring Summary

Successfully refactored **CyberOrbit365** backend into **LearnOrbit LMS** with unified user management and role-based access control.

---

## 🔄 What Changed

### 1. **Database Schema**
- ❌ **Removed**: `admin_users` table
- ✅ **Added**: Unified `users` table with role-based access
- ✅ **Updated**: `refresh_tokens` table (admin_id → user_id)
- ✅ **Updated**: `audit_logs` table (admin_id → user_id)

### 2. **User Roles**
- ✅ **admin** - Full system access
- ✅ **instructor** - Course creation and management
- ✅ **student** - Course enrollment and learning

### 3. **Authentication System**
- ✅ JWT includes: `id`, `email`, `role`, `name`
- ✅ Role-based authorization middleware
- ✅ Permission-based access control
- ✅ Email verification system
- ✅ Password reset functionality

### 4. **Security Features**
- ✅ Account locking (5 failed attempts)
- ✅ Password hashing (bcrypt)
- ✅ Refresh token rotation
- ✅ Audit logging
- ✅ Email verification
- ✅ Password reset tokens

---

## 📂 Files Created/Updated

### **Database**
```
database/schema/users.sql
```
- Unified users table schema
- Refresh tokens table
- Audit logs table
- Sample data

### **Repositories**
```
src/repositories/user.repository.js          (NEW)
src/repositories/refreshToken.repository.js  (UPDATED)
src/repositories/auditLog.repository.js      (UPDATED)
```

### **Services**
```
src/services/auth.service.js                 (UPDATED)
```
- Registration with role support
- Login with security features
- Token refresh
- Email verification
- Password reset

### **Controllers**
```
src/controllers/auth.controller.js           (UPDATED)
```
- Register endpoint
- Login endpoint
- Refresh endpoint
- Logout endpoint
- Email verification
- Password reset
- Get profile

### **Middleware**
```
src/middlewares/rbac.middleware.js           (NEW)
```
- `protect` - Authentication
- `authorizeRoles` - Role-based authorization
- `isAdmin`, `isInstructorOrAdmin`, `isStudent` - Convenience methods
- `isOwnerOrAdmin` - Resource ownership check
- `optionalAuth` - Optional authentication
- `hasPermission` - Permission-based access
- `rateLimitByRole` - Role-based rate limiting

---

## 🗄️ Database Migration

### **Step 1: Backup Current Database**
```bash
mysqldump -u root -p learnorbit > backup_$(date +%Y%m%d).sql
```

### **Step 2: Run Migration**
```bash
mysql -u root -p learnorbit < database/schema/users.sql
```

### **Step 3: Generate Admin Password Hash**
```javascript
// scripts/generate-hash.js
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'Admin@123'; // Change this!
  const hash = await bcrypt.hash(password, 10);
  console.log('Password hash:', hash);
}

generateHash();
```

```bash
node scripts/generate-hash.js
```

### **Step 4: Update Admin User**
```sql
UPDATE users 
SET password_hash = 'YOUR_GENERATED_HASH_HERE'
WHERE email = 'admin@learnorbit.com';
```

---

## 🔐 JWT Token Structure

### **Access Token Payload**
```javascript
{
  id: 123,
  email: 'user@example.com',
  role: 'student',
  name: 'John Doe',
  iat: 1234567890,
  exp: 1234568790
}
```

### **Token Expiration**
- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

---

## 🛡️ RBAC Middleware Usage

### **Basic Authentication**
```javascript
const { protect } = require('../middlewares/rbac.middleware');

// Require authentication
router.get('/profile', protect, getProfile);
```

### **Role-Based Authorization**
```javascript
const { protect, authorizeRoles } = require('../middlewares/rbac.middleware');

// Admin only
router.delete('/users/:id', protect, authorizeRoles('admin'), deleteUser);

// Admin or Instructor
router.post('/courses', protect, authorizeRoles('admin', 'instructor'), createCourse);

// Student only
router.post('/enrollments', protect, authorizeRoles('student'), enrollCourse);
```

### **Convenience Methods**
```javascript
const { protect, isAdmin, isInstructorOrAdmin, isStudent } = require('../middlewares/rbac.middleware');

// Admin only
router.get('/admin/dashboard', protect, isAdmin, getAdminDashboard);

// Instructor or Admin
router.put('/courses/:id', protect, isInstructorOrAdmin, updateCourse);

// Student only
router.get('/my-courses', protect, isStudent, getMyCourses);
```

### **Resource Ownership**
```javascript
const { protect, isOwnerOrAdmin } = require('../middlewares/rbac.middleware');

// User can only access their own profile (or admin can access any)
router.get('/users/:id', protect, isOwnerOrAdmin('id'), getUserProfile);
```

### **Permission-Based Access**
```javascript
const { protect, hasPermission } = require('../middlewares/rbac.middleware');

// Check specific permission
router.post('/courses/:id/publish', protect, hasPermission('publish_course'), publishCourse);
```

### **Optional Authentication**
```javascript
const { optionalAuth } = require('../middlewares/rbac.middleware');

// Different behavior for authenticated users
router.get('/courses', optionalAuth, (req, res) => {
  if (req.user) {
    // Show personalized courses
  } else {
    // Show public courses
  }
});
```

---

## 🧪 Testing the System

### **1. Register a Student**
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

### **2. Register an Instructor**
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
      "yearsOfExperience": 5,
      "linkedinUrl": "https://linkedin.com/in/jane"
    }
  }'
```

### **3. Login**
```bash
curl -X POST http://localhost:65000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Student@123"
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **4. Access Protected Route**
```bash
curl -X GET http://localhost:65000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### **5. Test Role-Based Access**
```bash
# Student trying to access admin route (should fail)
curl -X GET http://localhost:65000/api/admin/users \
  -H "Authorization: Bearer STUDENT_TOKEN"

# Admin accessing admin route (should succeed)
curl -X GET http://localhost:65000/api/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 📊 Role Permissions Matrix

| Permission | Admin | Instructor | Student |
|------------|-------|------------|---------|
| Manage Users | ✅ | ❌ | ❌ |
| Create Course | ✅ | ✅ | ❌ |
| Edit Own Course | ✅ | ✅ | ❌ |
| Delete Course | ✅ | ❌ | ❌ |
| Publish Course | ✅ | ✅ | ❌ |
| Enroll Course | ✅ | ✅ | ✅ |
| View Analytics | ✅ | ✅ (own) | ✅ (own) |
| Manage Settings | ✅ | ❌ | ❌ |
| Submit Assignment | ✅ | ✅ | ✅ |

---

## 🔧 Example Routes

### **Public Routes**
```javascript
// No authentication required
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.get('/auth/verify-email/:token', authController.verifyEmail);
```

### **Authenticated Routes**
```javascript
// Require authentication
router.get('/auth/me', protect, authController.getProfile);
router.post('/auth/logout', protect, authController.logout);
router.post('/auth/refresh', authController.refresh);
```

### **Admin Routes**
```javascript
// Admin only
router.get('/admin/users', protect, isAdmin, adminController.getUsers);
router.delete('/admin/users/:id', protect, isAdmin, adminController.deleteUser);
router.put('/admin/settings', protect, isAdmin, adminController.updateSettings);
```

### **Instructor Routes**
```javascript
// Instructor or Admin
router.post('/courses', protect, isInstructorOrAdmin, courseController.create);
router.put('/courses/:id', protect, isInstructorOrAdmin, courseController.update);
router.post('/courses/:id/publish', protect, hasPermission('publish_course'), courseController.publish);
```

### **Student Routes**
```javascript
// Student only
router.post('/enrollments', protect, isStudent, enrollmentController.enroll);
router.get('/my-courses', protect, isStudent, courseController.getMyCourses);
router.post('/assignments/:id/submit', protect, isStudent, assignmentController.submit);
```

### **Mixed Access Routes**
```javascript
// Different behavior based on role
router.get('/courses', optionalAuth, (req, res) => {
  if (req.user && req.user.role === 'admin') {
    // Show all courses including drafts
  } else if (req.user && req.user.role === 'instructor') {
    // Show published courses + own drafts
  } else {
    // Show only published courses
  }
});
```

---

## 🚀 Next Steps

### **1. Update Routes**
Update your route files to use the new RBAC middleware:
```javascript
const { protect, authorizeRoles, isAdmin } = require('../middlewares/rbac.middleware');
```

### **2. Migrate Existing Data**
If you have existing admin_users data:
```sql
INSERT INTO users (name, email, password_hash, role, is_active, is_email_verified)
SELECT name, email, password, 'admin', 1, 1
FROM admin_users;
```

### **3. Update Frontend**
- Store access token in memory or secure storage
- Include token in Authorization header
- Handle token refresh
- Implement role-based UI rendering

### **4. Add Email Service**
Integrate email service for:
- Email verification
- Password reset
- Welcome emails

### **5. Add More Features**
- Course management
- Enrollment system
- Assignment submission
- Progress tracking
- Analytics dashboard

---

## 📚 Documentation

### **API Endpoints**

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|-------------|
| POST | `/api/auth/register` | No | - | Register new user |
| POST | `/api/auth/login` | No | - | Login user |
| POST | `/api/auth/refresh` | No | - | Refresh access token |
| POST | `/api/auth/logout` | Yes | All | Logout user |
| GET | `/api/auth/me` | Yes | All | Get current user |
| GET | `/api/auth/verify-email/:token` | No | - | Verify email |
| POST | `/api/auth/forgot-password` | No | - | Request password reset |
| POST | `/api/auth/reset-password` | No | - | Reset password |

---

## ✨ Key Features

✅ **Unified User Management** - Single table for all user types  
✅ **Role-Based Access Control** - Admin, Instructor, Student  
✅ **JWT Authentication** - Secure token-based auth  
✅ **Refresh Token Rotation** - Enhanced security  
✅ **Account Locking** - Brute force protection  
✅ **Email Verification** - Verify user emails  
✅ **Password Reset** - Secure password recovery  
✅ **Audit Logging** - Track security events  
✅ **Permission System** - Granular access control  
✅ **Clean Architecture** - Maintainable codebase  

---

## 🎊 Summary

The refactoring is complete! You now have:

1. ✅ Unified `users` table with role support
2. ✅ Updated authentication system
3. ✅ Comprehensive RBAC middleware
4. ✅ Role-based JWT tokens
5. ✅ Security best practices
6. ✅ Clean architecture maintained

**Ready for LearnOrbit LMS!** 🚀
