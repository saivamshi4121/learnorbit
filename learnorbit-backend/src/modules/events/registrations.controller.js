const db = require('../../config/database');
const emailService = require('../../utils/email.service');
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

        const result = await db.query(
            `INSERT INTO event_registrations (event_id, user_id, form_data, payment_screenshot_url, transaction_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [event_id, user_id, JSON.stringify(form_data), payment_screenshot_url, transaction_id]
        );

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

        let email = '';
        let name = '';

        if (registration.user_id) {
            const userRes = await db.query('SELECT email, name FROM users WHERE id = $1', [registration.user_id]);
            email = userRes.rows[0]?.email;
            name = userRes.rows[0]?.name;
        } else {
            // Guest registration - email/name is in form_data
            const formData = registration.form_data;
            email = formData['Email Address'] || formData['email'] || formData['Email'];
            name = formData['Full Name'] || formData['name'] || formData['Name'] || 'Guest';
        }

        // Send email notification
        if (email && (status === 'approved' || status === 'rejected')) {
            try {
                await emailService.sendEventStatusEmail({
                    email,
                    name,
                    eventTitle: event.title,
                    status,
                    eventDate: format(new Date(event.date), 'PPP p'),
                    location: event.location
                });
            } catch (emailErr) {
                console.error('Failed to send status email:', emailErr);
            }
        }

        res.status(200).json({ success: true, registration: result.rows[0] });
    } catch (error) {
        console.error('Error updating registration status:', error);
        res.status(500).json({ success: false, error: 'Server error updating status' });
    }
};
