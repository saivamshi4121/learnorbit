const db = require('../../config/database');
const emailService = require('../../utils/email.service');
const logger = require('../../utils/logger');
const { format } = require('date-fns');

exports.registerForEvent = async (req, res) => {
    try {
        const { event_id, form_data, payment_screenshot_url, transaction_id } = req.body;
        const user_id = req.user ? req.user.id : null; // logged in user or guest

        if (!event_id || !form_data) {
            return res.status(400).json({ success: false, error: 'Event ID and form data are required' });
        }

        // Duplication check for Transaction ID (if provided)
        if (transaction_id) {
            const duplicateCheck = await db.query(
                'SELECT id FROM event_registrations WHERE event_id = $1 AND transaction_id = $2',
                [event_id, transaction_id]
            );
            if (duplicateCheck.rows.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'DUPLICATE_TRANSACTION: This Transaction ID has already been used for this event.' 
                });
            }
        }

        // Try to extract name, email, and phone from form_data for easier access later
        let user_email = '';
        let user_name = '';
        let user_phone = '';

        Object.keys(form_data).forEach(key => {
            const lowerKey = key.toLowerCase();
            const val = String(form_data[key]).trim();
            
            if (lowerKey.includes('email') && !user_email) user_email = val.toLowerCase();
            if ((lowerKey.includes('name') || lowerKey.includes('full name')) && !user_name) user_name = val;
            if ((lowerKey.includes('phone') || lowerKey.includes('mobile') || lowerKey.includes('contact')) && !user_phone) {
                // Remove spaces and special chars for consistent phone comparison
                user_phone = val.replace(/[\s\-\(\)\+]/g, '');
            }
        });

        // Duplication check for User (Prioritizing Phone, then Email)
        const userDuplicateCheck = await db.query(
            `SELECT id FROM event_registrations 
             WHERE event_id = $1 AND (
                (user_id IS NOT NULL AND user_id = $2) OR 
                (user_phone IS NOT NULL AND user_phone = $3 AND user_phone != '') OR
                (user_email IS NOT NULL AND user_email = $4 AND user_email != '')
             )`,
            [event_id, user_id, user_phone, user_email]
        );

        if (userDuplicateCheck.rows.length > 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'ALREADY_REGISTERED',
                message: 'You are already registered for this event! 🌟 We can\'t wait to see you there.' 
            });
        }

        const result = await db.query(
            `INSERT INTO event_registrations (event_id, user_id, user_name, user_email, user_phone, form_data, payment_screenshot_url, transaction_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [event_id, user_id, user_name, user_email, user_phone, JSON.stringify(form_data), payment_screenshot_url, transaction_id]
        );

        // Optional: Send admin notification for new registration
        try {
            const eventRes = await db.query('SELECT title FROM events WHERE id = $1', [event_id]);
            if (eventRes.rows.length > 0) {
                await emailService.sendAdminRegistrationNotification({
                    eventTitle: eventRes.rows[0].title,
                    userName: user_name,
                    userEmail: user_email,
                    userPhone: user_phone
                });
            }
        } catch (adminNotifyErr) {
            logger.warn('Failed to send admin registration notification:', adminNotifyErr.message);
        }

        res.status(201).json({ success: true, registration: result.rows[0] });
    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ success: false, error: 'Server error during registration' });
    }
};

exports.getRegistrationsForEvent = async (req, res) => {
    try {
        const { event_id } = req.params;
        const result = await db.query(
            `SELECT er.*, u.name as user_name, u.email as user_email 
             FROM event_registrations er
             LEFT JOIN users u ON er.user_id = u.id
             WHERE er.event_id = $1
             ORDER BY 
                CASE 
                    WHEN status = 'pending' THEN 1
                    WHEN status = 'approved' THEN 2
                    WHEN status = 'rejected' THEN 3
                    ELSE 4
                END ASC,
                er.created_at DESC`,
            [event_id]
        );
        res.status(200).json({ success: true, registrations: result.rows });
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({ success: false, error: 'Server error fetching registrations' });
    }
};

exports.updateRegistrationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await db.query(
            'UPDATE event_registrations SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Registration not found' });
        }

        const registration = result.rows[0];

        // Fetch event and user details for the email
        const eventRes = await db.query(
            'SELECT title, date, location FROM events WHERE id = $1',
            [registration.event_id]
        );
        const event = eventRes.rows[0];

        let email = registration.user_email;
        let name = registration.user_name;

        if (registration.user_id && (!email || !name)) {
            const userRes = await db.query('SELECT email, name FROM users WHERE id = $1', [registration.user_id]);
            if (userRes.rows.length > 0) {
                email = email || userRes.rows[0].email;
                name = name || userRes.rows[0].name;
            }
        }

        // Fallback to form_data search if still empty
        if (!email) {
            const formData = registration.form_data;
            Object.keys(formData).forEach(key => {
                const lowerKey = key.toLowerCase();
                if (lowerKey.includes('email') && !email) email = formData[key];
                if ((lowerKey.includes('name') || lowerKey.includes('full name')) && !name) name = formData[key];
            });
        }

        // Send email notification
        if (email && (status === 'approved' || status === 'rejected')) {
            logger.info(`Attempting to send ${status} email to ${email}`);
            try {
                const mailRes = await emailService.sendEventStatusEmail({
                    email,
                    name: name || 'Guest',
                    eventTitle: event.title,
                    status,
                    eventDate: format(new Date(event.date), 'PPP p'),
                    location: event.location
                });
                logger.info(`Email service response for ${email}: ${JSON.stringify(mailRes)}`);
            } catch (emailErr) {
                logger.error(`Failed to send status email to ${email}: ${emailErr.message}`);
            }
        } else {
            logger.warn(`Skipping email: email=${email}, status=${status}`);
        }

        res.status(200).json({ success: true, registration: result.rows[0] });
    } catch (error) {
        console.error('Error updating registration status:', error);
        res.status(500).json({ success: false, error: 'Server error updating status' });
    }
};
