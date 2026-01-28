const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'ChatSession',
    tableName: 'chat_sessions',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        title: {
            type: 'varchar',
            default: 'New Chat',
        },
        messages: {
            type: 'text', // JSON stringified array of messages
            nullable: true,
        },
        createdAt: {
            type: 'datetime',
            createDate: true,
        },
        updatedAt: {
            type: 'datetime',
            updateDate: true,
        },
    },
});
