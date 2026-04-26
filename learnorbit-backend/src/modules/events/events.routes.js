const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Production Rate Limiter: Prevent spam registrations
const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 registrations per 15 mins
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: "Too many registration attempts. Please try again after 15 minutes."
  }
});
const eventsController = require('./events.controller');
const registrationsController = require('./registrations.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

// Public routes
router.get('/', eventsController.getEvents);
router.post('/register', registrationLimiter, registrationsController.registerForEvent); // Guest or User can register
router.get('/registrations/my', protect, registrationsController.getMyRegistrations); // User's own registrations
router.get('/registrations/:id/details', registrationsController.getRegistrationDetailsForCertificate); // For certificate generation

// Protected routes (Admin / Super Admin only)
router.use(protect);
router.post('/', eventsController.createEvent);
router.patch('/:id', eventsController.updateEvent);
router.delete('/:id', eventsController.deleteEvent);
router.post('/:id/send-certificates', eventsController.sendEventCertificates);

// Admin registration management
router.get('/:event_id/registrations', registrationsController.getRegistrationsForEvent);
router.patch('/registrations/:id/status', registrationsController.updateRegistrationStatus);

module.exports = router;
