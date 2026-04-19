const BASE_Url = 'http://localhost:3001/api';

async function seedMore() {
    try {
        console.log('🌱 Seeding News and Publications...');

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

        // 2. Create News
        const newsItems = [
            {
                titleEn: 'New Cycling Route Opened',
                titleAr: 'تم افتتاح مسار جديد للدراجات',
                contentEn: 'We are thrilled to announce the opening of the new 20km cycling track along the coast. It features scenic views and rest stops.',
                contentAr: 'يسعدنا أن نعلن عن افتتاح مسار الدراجات الجديد بطول 20 كم على طول الساحل.',
                category: 'breaking',
                isPublished: true,
                authorId: 1
            },
            {
                titleEn: 'Monthly Free Workshop',
                titleAr: 'ورشة عمل مجانية شهرية',
                contentEn: 'Join us this Friday for a free bike maintenance workshop. Learn how to fix a flat tire and adjust your brakes.',
                contentAr: 'انضم إلينا يوم الجمعة لورشة عمل مجانية لصيانة الدراجات.',
                category: 'event',
                isPublished: true,
                authorId: 1
            }
        ];

        for (const item of newsItems) {
            const res = await fetch(`${BASE_Url}/news`, {
                method: 'POST',
                headers,
                body: JSON.stringify(item)
            });
            if (res.ok) console.log(`✅ Created News: ${item.titleEn}`);
            else console.error(`❌ Failed News: ${item.titleEn}`, await res.text());
        }

        // 3. Create Publications
        const publications = [
            {
                titleEn: 'Cyclist Safety Guide 2024',
                titleAr: 'دليل سلامة الدراجين 2024',
                descriptionEn: 'A comprehensive guide to staying safe on the roads. Includes traffic rules, hand signals, and equipment checklist.',
                descriptionAr: 'دليل شامل للبقاء آمنًا على الطرق.',
                type: 'guide',
                isPublished: true,
                authorId: 1
            },
            {
                titleEn: 'City Bike Map',
                titleAr: 'خريطة دراجات المدينة',
                descriptionEn: 'Detailed map of all bike lanes, parking spots, and repair stations in the city.',
                descriptionAr: 'خريطة تفصيلية لجميع ممرات الدراجات.',
                type: 'map',
                isPublished: true,
                authorId: 1
            }
        ];

        for (const item of publications) {
            const res = await fetch(`${BASE_Url}/publications`, {
                method: 'POST',
                headers,
                body: JSON.stringify(item)
            });
            if (res.ok) console.log(`✅ Created Publication: ${item.titleEn}`);
            else console.error(`❌ Failed Publication: ${item.titleEn}`, await res.text());
        }

        console.log('🎉 Seeding complete!');

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
}

seedMore();
