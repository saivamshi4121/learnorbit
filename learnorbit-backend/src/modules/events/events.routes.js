const express = require('express');
const router = express.Router();
const eventsController = require('./events.controller');
const registrationsController = require('./registrations.controller');
const { protect, authorize } = require('../../middlewares/auth.middleware');

// Public routes
router.get('/', eventsController.getEvents);
router.post('/register', registrationsController.registerForEvent); // Guest or User can register

// Protected routes (Admin / Super Admin only)
router.use(protect);
router.post('/', eventsController.createEvent);
router.patch('/:id', eventsController.updateEvent);
router.delete('/:id', eventsController.deleteEvent);

// Admin registration management
router.get('/:event_id/registrations', registrationsController.getRegistrationsForEvent);
router.patch('/registrations/:id/status', registrationsController.updateRegistrationStatus);

module.exports = router;
