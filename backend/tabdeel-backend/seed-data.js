const BASE_Url = 'http://76.13.15.98:3001/api'; // Pointing to your VPS

async function seed() {
    try {
        console.log('🌱 Seeding VPS database at ' + BASE_Url);

        // 1. Ensure admin user exists
        console.log('Ensuring admin user exists...');
        const userPayload = {
            username: 'admin',
            password: 'password', 
            email: 'admin@tabdeel.com',
            firstName: 'Admin',
            lastName: 'User'
        };

        const createUserRes = await fetch(`${BASE_Url}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userPayload)
        });

        let authorId = 1;
        if (createUserRes.ok) {
            const userData = await createUserRes.json();
            authorId = userData.id;
            console.log(`✅ Created/Found admin user with ID: ${authorId}`);
        } else {
            console.log('⚠️ Admin user might already exist, proceeding...');
        }

        // 2. Login to get token
        console.log('Login as admin...');
        const loginRes = await fetch(`${BASE_Url}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: '1234' })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status}`);
        }

        const { access_token } = await loginRes.json();
        console.log('✅ Logged in successfully');

        // 3. Create initial Article
        console.log('Creating initial article...');
        await fetch(`${BASE_Url}/articles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify({
                title: 'Welcome to Tabdeel Biking Club',
                content: 'We are excited to launch our new platform on the VPS!',
                excerpt: 'Join us for weekly rides properly organized through our website.',
                authorId: authorId,
                status: 'published',
                tags: ['announcement']
            })
        });

        console.log('🎉 VPS Seeding complete!');

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
}

seed();
