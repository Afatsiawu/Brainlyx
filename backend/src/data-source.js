const { DataSource } = require('typeorm');

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: true,
    entities: [
        require('./models/User'),
        require('./models/Document'),
        require('./models/ChatSession'),
    ],
    subscribers: [],
    migrations: [],
});

module.exports = AppDataSource;
