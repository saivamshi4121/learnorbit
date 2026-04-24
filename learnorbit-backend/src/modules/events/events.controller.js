const db = require('../../config/database');

exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, image_url, status, registration_fields, is_paid, price, qr_code_url } = req.body;
        
        // Basic validation
        if (!title || !date) {
            return res.status(400).json({ success: false, error: 'Title and date are required' });
        }

        const result = await db.query(
            `INSERT INTO events (title, description, date, location, image_url, status, registration_fields, is_paid, price, qr_code_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [title, description, date, location, image_url, status || 'upcoming', JSON.stringify(registration_fields || []), is_paid || false, price || 0, qr_code_url]
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
        res.status(500).json({ success: false, error: 'Server error while deleting event' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, location, image_url, status, registration_fields, is_paid, price, qr_code_url } = req.body;

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
                updated_at = NOW()
             WHERE id = $11
             RETURNING *`,
            [title, description, date, location, image_url, status, JSON.stringify(registration_fields), is_paid, price, qr_code_url, id]
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
