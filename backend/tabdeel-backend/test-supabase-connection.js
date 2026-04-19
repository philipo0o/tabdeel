// Simple script to test Supabase connection
// Run with: node test-supabase-connection.js

require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_HOST?.includes('supabase.co') 
    ? { rejectUnauthorized: false } 
    : false,
});

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  console.log('Configuration:');
  console.log('  Host:', process.env.DB_HOST);
  console.log('  Port:', process.env.DB_PORT);
  console.log('  User:', process.env.DB_USER);
  console.log('  Database:', process.env.DB_NAME);
  console.log('  Password:', process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-4) : 'NOT SET');
  console.log('  SSL:', process.env.DB_HOST?.includes('supabase.co') ? 'Enabled' : 'Disabled');
  console.log('\n');

  try {
    console.log('⏳ Connecting to Supabase...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    console.log('📊 Testing query...');
    const result = await client.query('SELECT version()');
    console.log('✅ Query successful!');
    console.log('   PostgreSQL version:', result.rows[0].version.split(' ')[0], result.rows[0].version.split(' ')[1]);
    console.log('\n');

    console.log('🎉 Supabase connection test PASSED!');
    console.log('✅ Your backend is ready to start!');
    console.log('\n');
    console.log('Next step: Run "npm run start:dev"');

  } catch (error) {
    console.error('❌ Connection test FAILED!\n');
    console.error('Error:', error.message);
    console.log('\n');
    console.log('💡 Troubleshooting:');
    console.log('1. Check your .env file has correct values');
    console.log('2. Verify DB_HOST (should be: db.xxxxx.supabase.co)');
    console.log('3. Verify DB_PASSWORD is correct (no quotes)');
    console.log('4. Check your internet connection');
    console.log('5. Make sure Supabase project is active');
    console.log('\n');
    console.log('📖 See SUPABASE_SETUP.md for detailed guide');
  } finally {
    await client.end();
  }
}

testConnection();
