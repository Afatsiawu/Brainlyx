const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: true,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    entities: [
        require('./models/User'),
        require('./models/Document'),
        require('./models/ChatSession'),
    ],
    subscribers: [],
    migrations: [],
});

module.exports = AppDataSource;
