const fs = require('fs');

async function testEndpoints() {
  const credentials = { email: 'admin@school.edu', password: 'admin123' };
  
  console.log('--- Logging in to get token ---');
  let token = null;
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    if (!loginRes.ok) {
        console.error('Failed to log in. Status:', loginRes.status);
        console.log(await loginRes.text());
        return;
    }
    
    const loginData = await loginRes.json();
    token = loginData.token;
    console.log('Login successful. Token acquired.');
  } catch (err) {
    console.error('Login error:', err);
    return;
  }

  const endpoints = [
    '/api/auth/verify',
    '/api/staff',
    '/api/admissions',
    '/api/queries',
    '/api/analytics/student-performance',
    '/api/analytics/admissions',
    '/api/analytics/retention',
    '/api/analytics/health-index',
    '/api/analytics/parent-trust',
    '/api/achievements',
    '/api/announcements',
    '/api/attendance',
    '/api/grades',
    '/api/health'
  ];

  console.log('\n--- Testing Endpoints ---');
  const results = [];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const success = res.ok;
      const status = res.status;
      results.push({ endpoint, status, success });
      console.log(`[${success ? 'OK' : 'FAILED'}] ${endpoint} (${status})`);
      
      if (!success) {
        const textText = await res.text();
        console.error(`  -> Error Response: ${textText.substring(0, 200)}`);
      }
    } catch (err) {
      console.error(`[ERROR] ${endpoint}: ${err.message}`);
      results.push({ endpoint, status: 'ERROR', success: false });
    }
  }

  console.log('\n--- Summary ---');
  const failed = results.filter(r => !r.success);
  if (failed.length === 0) {
    console.log('All endpoints are working!');
  } else {
    console.log(`${failed.length} endpoints failed:`);
    failed.forEach(f => console.log(`  - ${f.endpoint} (Status: ${f.status})`));
  }
}

testEndpoints();
