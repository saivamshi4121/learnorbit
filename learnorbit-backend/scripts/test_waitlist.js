const service = require('../src/modules/marketing/marketing.service');
const pool = require('../src/config/db');

async function testAddToWaitlist() {
    try {
        const dummyData = {
            fullName: 'Test User',
            email: `test_${Date.now()}@example.com`,
            role: 'student',
            currentPlatform: 'Canvas',
            frustrations: ['Interface', 'Speed'],
            desiredFeatures: ['AI', 'Dark Mode'],
            pricingExpectation: '$10/mo',
            earlyAccessInterest: true,
            betaTester: false,
            source: 'test_script'
        };

        console.log('Testing addToWaitlist with:', dummyData);
        const result = await service.addToWaitlist(dummyData);
        console.log('Success:', result);

    } catch (error) {
        console.error('FAILED:', error);
    } finally {
        await pool.end(); // Close connection
    }
}

testAddToWaitlist();
