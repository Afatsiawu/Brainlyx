const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Waitlist',
    tableName: 'waitlist',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        email: {
            type: 'varchar',
            unique: true,
        },
        createdAt: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
    },
});
