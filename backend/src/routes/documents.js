const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const AppDataSource = require('../data-source');
const Document = require('../models/Document');
const { extractText, generateComprehensiveInsights } = require('../services/aiService');
const { log, error: logError } = require('../utils/logger');
const { promiseWithTimeout } = require('../utils/promiseHelper');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const isAudio = req.file.mimetype.startsWith('audio/');
        const documentRepository = AppDataSource.getRepository(Document);

        const doc = documentRepository.create({
            filename: req.file.originalname,
            path: req.file.path,
            status: isAudio ? 'completed' : 'processing', // Audio is instantly available for listening
            type: isAudio ? 'audio' : 'pdf',
            metadata: isAudio ? JSON.stringify({
                mimeType: req.file.mimetype,
                size: req.file.size
            }) : null
        });

        await documentRepository.save(doc);

        if (!isAudio) {
            // Background Processing for PDFs: Extract Text -> AI Generation
            (async () => {
                try {
                    log(`[PROCESS] Starting doc ${doc.id}: ${doc.filename}`);

                    log(`[PROCESS] Step 1: Extracting text from ${doc.path}...`);
                    const text = await promiseWithTimeout(
                        extractText(doc.path),
                        60000,
                        'Text extraction from PDF timed out (max 1 min)'
                    );

                    if (!text || text.trim().length < 50) {
                        throw new Error('Extracted text is too short or empty. Ensure the document is not an image-only PDF.');
                    }

                    log(`[PROCESS] Text extraction successful. Length: ${text.length} chars.`);

                    log(`[PROCESS] Step 2: Generating AI insights with Groq...`);
                    const insights = await promiseWithTimeout(
                        generateComprehensiveInsights(text),
                        120000,
                        'AI insight generation timed out (max 2 mins)'
                    );
                    log(`[PROCESS] AI generation successful.`);

                    doc.flashcards = JSON.stringify(insights.flashcards);
                    doc.questions = JSON.stringify(insights.questions);
                    doc.status = 'completed';

                    await documentRepository.save(doc);
                    log(`[PROCESS] Document ${doc.id} database update confirmed. STATUS: COMPLETED`);
                } catch (err) {
                    logError(`[PROCESS ERROR] Critical failure for doc ${doc.id}`, err);
                    doc.status = 'failed';
                    await documentRepository.save(doc);
                    log(`[PROCESS] Document ${doc.id} marked as FAILED in DB.`);
                }
            })();
        }

        res.status(201).json({ message: 'File uploaded successfully', document: doc });
    } catch (error) {
        console.error('Upload route major error:', error);
        res.status(500).json({
            error: 'Failed to upload document',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

router.get('/', async (req, res) => {
    const documentRepository = AppDataSource.getRepository(Document);
    const documents = await documentRepository.find();
    res.json(documents);
});

router.get('/:id', async (req, res) => {
    const documentRepository = AppDataSource.getRepository(Document);
    const doc = await documentRepository.findOneBy({ id: req.params.id });
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.json(doc);
    // ... (existing get/:id)
});

router.delete('/:id', async (req, res) => {
    try {
        const documentRepository = AppDataSource.getRepository(Document);
        const result = await documentRepository.delete(req.params.id);

        if (result.affected === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
});

router.post('/save-topic', async (req, res) => {
    try {
        const { topic, flashcards } = req.body;

        if (!topic || !flashcards) {
            return res.status(400).json({ error: 'Topic and flashcards are required' });
        }

        const documentRepository = AppDataSource.getRepository(Document);
        const doc = documentRepository.create({
            filename: `${topic} (AI Generated)`,
            path: `topic-${Date.now()}`, // Virtual path since there's no actual file
            status: 'completed',
            flashcards: JSON.stringify(flashcards),
            questions: null, // No questions for topic-only generation
        });

        await documentRepository.save(doc);
        res.status(201).json({ message: 'Topic flashcards saved successfully', document: doc });
    } catch (error) {
        console.error('Save topic error:', error);
        res.status(500).json({ error: 'Failed to save topic flashcards: ' + error.message });
    }
});

module.exports = router;
