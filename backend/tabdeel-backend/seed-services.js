const BASE_Url = 'http://localhost:3001/api';

async function seedServices() {
    try {
        console.log('🌱 Seeding Services...');

        // 1. Login
        console.log('Login as admin...');
        const loginRes = await fetch(`${BASE_Url}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: '1234' })
        });

        if (!loginRes.ok) throw new Error('Login failed');
        const { access_token } = await loginRes.json();
        console.log('✅ Logged in successfully');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        };

        // 2. Create Services
        const sampleServices = [
            {
                name: 'Professional Tune-up',
                title: 'Full Bike Maintenance',
                description: 'Comprehensive maintenance including derailleur adjustment, brake bleed, and wheel trueing.',
                type: 'maintenance'
            },
            {
                name: 'City Bike Share',
                title: 'Daily Rental',
                description: 'Affordable daily rental for city commuters. Pick up and drop off at any station.',
                type: 'sharing'
            },
            {
                name: 'Biking Helmet',
                title: 'Safety Gear',
                description: 'Lightweight and durable helmets with MIPS technology for maximum safety.',
                type: 'accessories'
            },
            {
                name: 'Bicycle Fundamentals',
                title: 'Training Course',
                description: 'Learn the basics of cycling, including balance, shifting, and road safety.',
                type: 'training'
            },
            {
                name: 'Mountain Bike Pro',
                title: 'Bike Sales',
                description: 'High-performance mountain bikes for off-road adventures. Carbon fiber frame.',
                type: 'sales'
            },
            {
                name: 'Downtown Garage',
                title: 'Secure Parking',
                description: 'Secure, indoor bicycle parking with 24/7 access and CCTV surveillance.',
                type: 'garage'
            }
        ];

        for (const service of sampleServices) {
            const res = await fetch(`${BASE_Url}/services`, {
                method: 'POST',
                headers,
                body: JSON.stringify(service)
            });
            if (res.ok) {
                console.log(`✅ Created Service: ${service.name}`);
            } else {
                console.error(`❌ Failed to create Service: ${service.name}`, await res.text());
            }
        }

        console.log('🎉 Services seeding complete!');

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
}

seedServices();
