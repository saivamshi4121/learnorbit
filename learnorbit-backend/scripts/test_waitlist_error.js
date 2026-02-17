const axios = require('axios');

async function testWaitlist() {
    try {
        const response = await axios.post('http://localhost:5000/api/marketing/waitlist', {
            fullName: 'Debug User',
            email: 'debug_' + Date.now() + '@example.com',
            role: 'student',
            currentPlatform: 'Moodle',
            frustrations: ['Slow', 'Buggy'],
            desiredFeatures: ['Speed', 'AI'],
            pricingExpectation: '$10/mo',
            earlyAccessInterest: true,
            betaTester: true
        });
        console.log('Success:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Error Status:', error.response.status);
            console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
        }
    }
}

testWaitlist();
