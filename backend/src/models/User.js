const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        name: {
            type: 'varchar',
            nullable: true,
        },
        username: {
            type: 'varchar',
            unique: true,
            nullable: true,
        },
        email: {
            type: 'varchar',
            unique: true,
        },
        password: {
            type: 'varchar',
            nullable: true,
        },
        university: {
            type: 'varchar',
            nullable: true,
        },
        major: {
            type: 'varchar',
            nullable: true,
        },
        year: {
            type: 'varchar',
            nullable: true,
        },
        isPremium: {
            type: 'boolean',
            default: false,
        },
    },
});
