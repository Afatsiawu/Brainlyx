require('dotenv').config();
const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: true,
    ssl: (process.env.DATABASE_URL && (process.env.DATABASE_URL.includes('render.com') || process.env.DATABASE_URL.includes('supabase.co') || process.env.DATABASE_URL.includes('supabase.com')))
        ? { rejectUnauthorized: false }
        : false,
    entities: [
        require('./models/User'),
        require('./models/Document'),
        require('./models/ChatSession'),
    ],
    subscribers: [],
    migrations: [],
});

module.exports = AppDataSource;
