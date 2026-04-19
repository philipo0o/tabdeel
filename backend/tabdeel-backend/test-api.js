// Simple API testing script
const baseURL = 'http://localhost:3001/api';

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  firstName: 'Test',
  lastName: 'User'
};

const adminUser = {
  username: 'admin',
  password: '1234'
};

// Helper function to make HTTP requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    console.log(`${options.method || 'GET'} ${url}`);
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('---');
    return { response, data };
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// Test functions
async function testCreateUser() {
  console.log('🧪 Testing: Create User');
  return await makeRequest(`${baseURL}/users`, {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
}

async function testLogin() {
  console.log('🧪 Testing: Login');
  return await makeRequest(`${baseURL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(adminUser)
  });
}

async function testGetUsers(token) {
  console.log('🧪 Testing: Get All Users (Protected)');
  return await makeRequest(`${baseURL}/users`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

async function testGetUserById(userId) {
  console.log('🧪 Testing: Get User by ID (Public)');
  return await makeRequest(`${baseURL}/users/${userId}`, {
    method: 'GET'
  });
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  // 1. Create a user
  const createResult = await testCreateUser();
  if (!createResult) return;
  
  // 2. Login to get token
  const loginResult = await testLogin();
  if (!loginResult || !loginResult.data.access_token) {
    console.log('❌ Login failed, cannot test protected endpoints');
    return;
  }
  
  const token = loginResult.data.access_token;
  console.log('✅ Got access token');
  
  // 3. Test get all users (protected)
  await testGetUsers(token);
  
  // 4. Test get user by ID (public)
  if (createResult.data && createResult.data.id) {
    await testGetUserById(createResult.data.id);
  }
  
  console.log('✅ All tests completed!');
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ or you need to install node-fetch');
  console.log('Run: npm install node-fetch');
  process.exit(1);
}

runTests().catch(console.error);