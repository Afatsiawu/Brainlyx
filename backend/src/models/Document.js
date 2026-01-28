const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Document',
    tableName: 'documents',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        filename: {
            type: 'varchar',
        },
        path: {
            type: 'varchar',
        },
        status: {
            type: 'varchar', // pending, processing, completed, failed
            default: 'pending',
        },
        uploadedAt: {
            type: 'datetime',
            createDate: true,
        },
        flashcards: {
            type: 'text',
            nullable: true,
        },
        questions: {
            type: 'text',
            nullable: true,
        },
    },
});
