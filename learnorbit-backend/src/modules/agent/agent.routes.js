// src/modules/agent/agent.routes.js
const express = require('express');
const router = express.Router();

const controller = require('./agent.controller');
const { optionalAuth } = require('../../middlewares/rbac.middleware');

// POST /api/agent/chat – authenticated users get personalized responses
router.post('/chat', optionalAuth, controller.chat);

module.exports = router;
