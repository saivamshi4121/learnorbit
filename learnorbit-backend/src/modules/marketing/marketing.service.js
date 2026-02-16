const path = require('path');
const pool = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

class MarketingService {
    async addToWaitlist(data) {
        const {
            fullName,
            email,
            role,
            currentPlatform,
            frustrations,
            desiredFeatures,
            pricingExpectation,
            earlyAccessInterest,
            betaTester,
            source
        } = data;

        const id = uuidv4();
        const sql = `
            INSERT INTO marketing_waitlist_users 
            (id, full_name, email, role, current_lms, frustrations, desired_features, pricing_range, early_access, beta_tester, source, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')
        `;

        const values = [
            id,
            fullName,
            email,
            role,
            currentPlatform || null,
            JSON.stringify(frustrations || []),
            JSON.stringify(desiredFeatures || []),
            pricingExpectation || null,
            earlyAccessInterest ? 1 : 0, // Boolean to 1/0
            betaTester ? 1 : 0,        // Boolean to 1/0
            source || 'direct'
        ];

        console.log('Inserting into waitlist:', values); // Debug log

        await pool.execute(sql, values);

        return { id, email, status: 'new' };
    }

    async submitContactForm(data) {
        const { fullName, email, subject, message } = data;
        const id = uuidv4();

        // Check dups within last hour to prevent spam? (Simplified for now)

        const sql = `
      INSERT INTO marketing_contact_messages (id, full_name, email, subject, message, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `;

        await pool.execute(sql, [id, fullName, email, subject, message]);
        return { id, status: 'sent' };
    }

    async submitFeedback(data) {
        const { userType, biggestProblem, missingFeature, improvementSuggestion } = data;
        const id = uuidv4();

        const sql = `
      INSERT INTO marketing_feedback_submissions (id, user_type, biggest_problem, missing_feature, improvement_suggestion)
      VALUES (?, ?, ?, ?, ?)
    `;

        await pool.execute(sql, [id, userType, biggestProblem || null, missingFeature || null, improvementSuggestion || null]);
        return { id, status: 'received' };
    }
}

module.exports = new MarketingService();
