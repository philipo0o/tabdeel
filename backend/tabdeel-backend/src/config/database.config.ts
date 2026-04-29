import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
    const isProduction = process.env.NODE_ENV === 'production';
    const isSupabase = process.env.DB_HOST?.includes('supabase.co');

    return {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'biking_club', // Changed default to biking_club
        
        // Use a more robust way to load entities in both dev and prod
        entities: isProduction 
            ? ['dist/**/*.entity.js'] 
            : ['src/**/*.entity.ts'],

        // IMPORTANT: Disable synchronize in production for existing databases, 
        // but keep it true for now to initialize your VPS
        synchronize: true,

        // Enable logging to see the actual SQL queries causing the 500 error
        logging: true,

        // SSL configuration for cloud databases
        ssl: isSupabase ? { rejectUnauthorized: false } : false,

        // Connection pooling for better performance
        extra: {
            max: 20,
            min: 5,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000, // Increased timeout
        },
    };
};
