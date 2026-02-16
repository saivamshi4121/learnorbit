const marketingService = require('./marketing.service');

// Add Waitlist User
exports.addToWaitlist = async (req, res) => {
    try {
        const { fullName, email, role } = req.body;

        // Validate required fields
        if (!fullName || !email || !role) {
            return res.status(400).json({ success: false, error: 'Full name, email, and role are required.' });
        }

        // Validate Role Enum
        const validRoles = ['student', 'instructor', 'course_creator', 'institute', 'corporate_trainer'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ success: false, error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
        }

        const result = await marketingService.addToWaitlist(req.body);

        res.status(201).json({
            success: true,
            message: 'Successfully joined waitlist.'
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'You are already on the waitlist.' });
        }
        console.error('Waitlist Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Contact Form
exports.submitContact = async (req, res) => {
    try {
        const { email, message } = req.body;
        if (!email || !message) {
            return res.status(400).json({ success: false, error: 'Email and message are required' });
        }

        const result = await marketingService.submitContactForm(req.body);
        res.status(201).json({ success: true, message: 'Message sent successfully!', data: result });
    } catch (error) {
        console.error('Contact Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// Feedback Submission
exports.submitFeedback = async (req, res) => {
    try {
        // Basic validtion
        if (!req.body.userType) {
            return res.status(400).json({ success: false, error: 'User type is required' });
        }

        const result = await marketingService.submitFeedback(req.body);
        res.status(201).json({ success: true, message: 'Feedback received, thank you!', data: result });
    } catch (error) {
        console.error('Feedback Error:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
