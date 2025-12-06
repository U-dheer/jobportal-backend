const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function testAdminEndpoints() {
    console.log('Testing Admin Endpoints...\n');

    try {
        // Test health endpoint (no auth required)
        console.log('1. Testing /admin/health...');
        const healthResponse = await fetch(`${BASE_URL}/admin/health`);
        console.log('Health Status:', healthResponse.status);
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('Health Data:', healthData);
        } else {
            console.log('Health Error:', await healthResponse.text());
        }
        console.log('');

        // Test users endpoint (auth required)
        console.log('2. Testing /admin/users (without auth)...');
        const usersResponse = await fetch(`${BASE_URL}/admin/users`);
        console.log('Users Status:', usersResponse.status);
        if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            console.log('Users Data:', usersData);
        } else {
            console.log('Users Error:', await usersResponse.text());
        }
        console.log('');

        // Test report endpoint (auth required)
        console.log('3. Testing /admin/report (without auth)...');
        const reportResponse = await fetch(`${BASE_URL}/admin/report`);
        console.log('Report Status:', reportResponse.status);
        if (reportResponse.ok) {
            const reportData = await reportResponse.json();
            console.log('Report Data:', reportData);
        } else {
            console.log('Report Error:', await reportResponse.text());
        }
        console.log('');

        // Test with mock token
        console.log('4. Testing /admin/users (with mock token)...');
        const usersWithAuthResponse = await fetch(`${BASE_URL}/admin/users`, {
            headers: {
                'Authorization': 'Bearer mock-token',
                'Content-Type': 'application/json'
            }
        });
        console.log('Users with Auth Status:', usersWithAuthResponse.status);
        if (usersWithAuthResponse.ok) {
            const usersData = await usersWithAuthResponse.json();
            console.log('Users Data:', usersData);
        } else {
            console.log('Users with Auth Error:', await usersWithAuthResponse.text());
        }

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

// Run the test
testAdminEndpoints(); 