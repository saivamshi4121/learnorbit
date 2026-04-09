// src/modules/agent/agent.controller.js
const agentService = require('./agent.service');
const logger = require('../../utils/logger');

/**
 * Agent Controller – Handles the chat endpoint for the course assistant.
 */
exports.chat = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || typeof question !== 'string' || !question.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Question is required',
                message: 'Please provide a question to ask the assistant.',
            });
        }

        // User may or may not be authenticated (optionalAuth)
        const user = req.user || null;

        const result = await agentService.processQuestion(question.trim(), user);

        return res.status(200).json({
            success: true,
            data: {
                answer: result.answer,
                sources: result.sources || [],
                suggestions: result.suggestions || [],
            },
        });
    } catch (error) {
        logger.error(`Agent chat error: ${error.message}`, { error: error.stack });
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
            message: 'Failed to process your question. Please try again.',
        });
    }
};
