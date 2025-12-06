// Using built-in fetch (Node.js 18+)
// If you're using an older version, install node-fetch: npm install node-fetch

const BASE_URL = 'http://localhost:3001';

async function testEndpoints() {
    console.log('Testing Admin Endpoints...\n');

    try {
        // Test health endpoint
        console.log('1. Testing /admin/health...');
        const healthResponse = await fetch(`${BASE_URL}/admin/health`);
        const healthData = await healthResponse.json();
        console.log('Health Response:', healthData);
        console.log('Status:', healthResponse.status);
        console.log('');

        // Test users endpoint without auth (should fail)
        console.log('2. Testing /admin/users without auth...');
        try {
            const usersResponse = await fetch(`${BASE_URL}/admin/users`);
            console.log('Status:', usersResponse.status);
            if (!usersResponse.ok) {
                const errorText = await usersResponse.text();
                console.log('Expected error:', errorText);
            }
        } catch (error) {
            console.log('Error:', error.message);
        }
        console.log('');

        // Test report endpoint without auth (should fail)
        console.log('3. Testing /admin/report without auth...');
        try {
            const reportResponse = await fetch(`${BASE_URL}/admin/report`);
            console.log('Status:', reportResponse.status);
            if (!reportResponse.ok) {
                const errorText = await reportResponse.text();
                console.log('Expected error:', errorText);
            }
        } catch (error) {
            console.log('Error:', error.message);
        }
        console.log('');

        // Test login to get token
        console.log('4. Testing login to get auth token...');
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@jobportal.com',
                password: 'admin123'
            })
        });

        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            console.log('Login successful, token received');
            const token = loginData.access_token;

            // Test users endpoint with auth
            console.log('\n5. Testing /admin/users with auth...');
            const authUsersResponse = await fetch(`${BASE_URL}/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (authUsersResponse.ok) {
                const usersData = await authUsersResponse.json();
                console.log('Users Response:', usersData);
                console.log('Total users:', usersData.length);
            } else {
                const errorText = await authUsersResponse.text();
                console.log('Error:', errorText);
            }

            // Test report endpoint with auth
            console.log('\n6. Testing /admin/report with auth...');
            const authReportResponse = await fetch(`${BASE_URL}/admin/report`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (authReportResponse.ok) {
                const reportData = await authReportResponse.json();
                console.log('Report Response:', reportData);
            } else {
                const errorText = await authReportResponse.text();
                console.log('Error:', errorText);
            }
        } else {
            const errorText = await loginResponse.text();
            console.log('Login failed:', errorText);
        }

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testEndpoints(); 