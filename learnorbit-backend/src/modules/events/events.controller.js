const db = require('../../config/database');

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, image_url, status, registration_fields, is_paid, price, qr_code_url, certificate_settings } = req.body;
        
        // Basic validation
        if (!title) {
            return res.status(400).json({ success: false, error: 'Event title is required' });
        }

        const result = await db.query(
            `INSERT INTO events (title, description, date, location, image_url, status, registration_fields, is_paid, price, qr_code_url, certificate_settings)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             RETURNING *`,
            [title, description, date || null, location, image_url, status || 'upcoming', JSON.stringify(registration_fields || []), is_paid || false, price || 0, qr_code_url, JSON.stringify(certificate_settings || {})]
        );

        res.status(201).json({ success: true, event: result.rows[0] });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ success: false, error: 'Server error while creating event' });
    }
};

exports.getEvents = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT * FROM events ORDER BY date ASC`
        );
        res.status(200).json({ success: true, events: result.rows });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, error: 'Server error while fetching events' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM events WHERE id = $1 RETURNING id', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }
        res.status(200).json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ success: false, error: 'Server error deleting event' });
    }
};

exports.sendEventCertificates = async (req, res) => {
    try {
        const { id } = req.params;
        const emailService = require('../../utils/email.service');
        const logger = require('../../utils/logger');
        
        // 1. Fetch Event
        const eventRes = await db.query('SELECT * FROM events WHERE id = $1', [id]);
        if (eventRes.rows.length === 0) return res.status(404).json({ success: false, error: 'Event not found' });
        const event = eventRes.rows[0];
        
        if (!event.certificate_settings?.enabled) {
            return res.status(400).json({ success: false, error: 'Certificates are not enabled for this event' });
        }
        
        // 2. Fetch Approved Registrations
        const regRes = await db.query(
            "SELECT * FROM event_registrations WHERE event_id = $1 AND status = 'approved'",
            [id]
        );
        
        if (regRes.rows.length === 0) {
            return res.status(400).json({ success: false, error: 'No approved registrations found for this event' });
        }
        
        // 3. Trigger Bulk Email (Async)
        emailService.sendBulkCertificates({
            eventTitle: event.title,
            registrations: regRes.rows,
            certificateSettings: event.certificate_settings
        }).then(stats => {
            logger.info(`Bulk certificates sent for event ${id}: ${JSON.stringify(stats)}`);
        }).catch(err => {
            logger.error(`Bulk certificate failed for event ${id}: ${err.message}`);
        });
        
        res.status(200).json({ 
            success: true, 
            message: `Certificate delivery triggered for ${regRes.rows.length} approved participants.` 
        });
        
    } catch (error) {
        console.error('Error triggering bulk certificates:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, location, image_url, status, registration_fields, is_paid, price, qr_code_url, certificate_settings } = req.body;

        const result = await db.query(
            `UPDATE events SET 
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                date = COALESCE($3, date),
                location = COALESCE($4, location),
                image_url = COALESCE($5, image_url),
                status = COALESCE($6, status),
                registration_fields = COALESCE($7, registration_fields),
                is_paid = COALESCE($8, is_paid),
                price = COALESCE($9, price),
                qr_code_url = COALESCE($10, qr_code_url),
                certificate_settings = COALESCE($11, certificate_settings),
                updated_at = NOW()
             WHERE id = $12
             RETURNING *`,
            [
                title || null, 
                description || null, 
                date || null, 
                location || null, 
                image_url || null, 
                status || null, 
                registration_fields ? JSON.stringify(registration_fields) : null, 
                is_paid !== undefined ? is_paid : null, 
                price !== undefined ? price : null, 
                qr_code_url || null, 
                certificate_settings ? JSON.stringify(certificate_settings) : null, 
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        res.status(200).json({ success: true, event: result.rows[0] });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ success: false, error: 'Server error while updating event' });
    }
};
