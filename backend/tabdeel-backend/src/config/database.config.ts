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
        database: process.env.DB_NAME || 'postgres',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],

        // IMPORTANT: Disable synchronize in production to prevent automatic schema changes
        synchronize: true,

        // Enable logging in development only
        logging: true,

        // SSL configuration for cloud databases
        ssl: isSupabase ? { rejectUnauthorized: false } : false,

        // Connection pooling for better performance
        extra: {
            max: 20, // Maximum number of connections in the pool
            min: 5,  // Minimum number of connections in the pool
            idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
            connectionTimeoutMillis: 2000, // Timeout for establishing a connection
        },
    };
};
