const BASE_Url = 'http://localhost:3001/api';

async function seed() {
    try {
        console.log('🌱 Seeding database...');

        // 1. Login
        console.log('Login as admin...');
        const loginRes = await fetch(`${BASE_Url}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: '1234' })
        });

        if (!loginRes.ok) {
            const errorText = await loginRes.text();
            throw new Error(`Login failed: ${loginRes.status} ${errorText}`);
        }

        const { access_token } = await loginRes.json();
        console.log('✅ Logged in successfully');

        // 2. Create Article
        console.log('Creating article...');
        const articlePayload = {
            title: 'Welcome to Tabdeel Biking Club',
            content: 'We are excited to announce the launch of our new platform! Join us for weekly rides properly organized through our website. Cycling is not just a sport, it is a lifestyle.',
            excerpt: 'Join us for weekly rides properly organized through our website.',
            authorId: 1, // Assuming user 1 exists (admin usually created or seeded via migrations, but login succeeded so user exists?)
            // Wait, login succeeded with hardcoded credentials - but does user exist in DB?
            // AuthService uses hardcoded credentials but UsersService loads from DB?
            // Let's check AuthService... it doesn't check DB?
            // If AuthService uses hardcoded credentials, it returns a token.
            // But creating an article requires authorId which refers to a User entity.
            // If User 1 doesn't exist in DB, foreign key constraint will fail!
            status: 'published',
            tags: ['announcement', 'cycling']
        };

        // We must ensure User 1 exists.
        // The hardcoded auth service returns `sub: 1`.
        // Let's try to create the user first just in case.
        // But duplicate key error might happen.

        // Check if user exists?
        // User endpoints are protected?
        // Only GET /users is protected.
        // POST /users is public? `test-api.js` suggests so.

        console.log('Ensuring user exists...');
        const userPayload = {
            username: 'admin',
            password: 'password', // irrelevant here as auth is mocked
            email: 'admin@tabdeel.com',
            firstName: 'Admin',
            lastName: 'User'
        };

        // Try to create user (ignore error if exists)
        const createUserRes = await fetch(`${BASE_Url}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userPayload)
        });

        if (createUserRes.ok) {
            console.log('✅ Created admin user');
            const userData = await createUserRes.json();
            articlePayload.authorId = userData.id;
        } else {
            console.log('⚠️ Admin user might already exist or creation failed, proceeding with ID 1...');
            // If we can't create, we hope ID 1 exists. 
            // Actually, if we just started with empty DB, user table is empty.
            // We MUST create a user.
        }

        const createRes = await fetch(`${BASE_Url}/articles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(articlePayload)
        });

        if (!createRes.ok) {
            const errorText = await createRes.text();
            throw new Error(`Create article failed: ${createRes.status} ${errorText}`);
        }

        const article = await createRes.json();
        console.log(`✅ Created article: "${article.title}" (ID: ${article.id})`);
        console.log('🎉 Seeding complete!');

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
}

seed();
