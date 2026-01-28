const AppDataSource = require('./src/data-source');
const Document = require('./src/models/Document');

async function check() {
    try {
        console.log('--- DB INTEGRITY CHECK ---');
        await AppDataSource.initialize();
        const documentRepo = AppDataSource.getRepository(Document);

        const docs = await documentRepo.find();
        console.log(`Total documents: ${docs.length}`);
        docs.forEach(d => {
            const fCount = d.flashcards ? JSON.parse(d.flashcards).length : 0;
            const qCount = d.questions ? 'Exits' : 'Empty';
            console.log(`- ID: ${d.id}, File: ${d.filename}, Status: ${d.status}, Cards: ${fCount}, Questions: ${qCount}`);
        });

        const stuck = docs.filter(d => d.status === 'processing' || d.status === 'pending');
        console.log(`Stuck in "processing": ${stuck.length}`);

        if (stuck.length > 0) {
            console.log('Resetting stuck documents to "failed" to allow re-upload...');
            for (const doc of stuck) {
                doc.status = 'failed';
                await documentRepo.save(doc);
                console.log(`- Doc ${doc.id} (${doc.filename}) reset to FAILED.`);
            }
        }

        console.log('--- CHECK COMPLETE ---');
        process.exit(0);
    } catch (err) {
        console.error('Check failed:', err);
        process.exit(1);
    }
}

check();
