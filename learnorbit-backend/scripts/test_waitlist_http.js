async function testWaitlistHttp() {
    const url = 'http://localhost:5000/api/marketing/waitlist';
    const payload = {
        fullName: 'Http Test User',
        email: 'unique_' + Date.now() + '@example.com',
        role: 'student',
        currentPlatform: 'Canvas',
        frustrations: ['Interface'],
        desiredFeatures: ['Speed'],
        pricingExpectation: '$10/mo',
        earlyAccessInterest: true,
        betaTester: false,
        source: 'test_script_http'
    };

    console.log(`POST request to ${url} with payload:`, payload);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', data);

    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testWaitlistHttp();
