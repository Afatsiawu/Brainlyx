const express = require('express');
const router = express.Router();
const AppDataSource = require('../data-source');
const Document = require('../models/Document');
const { extractText, generateContent, transcribeAudio, generateQuestionsByTopic, generateLectureInsights } = require('../services/aiService');
const multer = require('multer');
const path = require('path');

// Configure Multer for audio
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

router.post('/generate/:documentId', async (req, res) => {
    const { documentId } = req.params;
    const { type } = req.body;

    try {
        const documentRepository = AppDataSource.getRepository(Document);
        const doc = await documentRepository.findOneBy({ id: documentId });

        if (!doc) return res.status(404).json({ error: 'Document not found' });

        const text = await extractText(doc.path);
        const result = await generateContent(text, type);

        res.json(result);
    } catch (error) {
        console.error('Generation route failed:', error);
        res.status(500).json({ error: error.message || 'Failed to generate content' });
    }
});

router.post('/generate-topic', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const result = await generateQuestionsByTopic(topic);

        // Save as a document for future use
        const documentRepository = AppDataSource.getRepository(Document);
        const doc = documentRepository.create({
            filename: `${topic.charAt(0).toUpperCase() + topic.slice(1)} (Exam Predictor)`,
            path: `topic-questions-${Date.now()}`,
            status: 'completed',
            questions: JSON.stringify(result),
            flashcards: null
        });
        await documentRepository.save(doc);

        res.json({ ...result, id: doc.id });
    } catch (error) {
        console.error('Topic generation route failed:', error);
        res.status(500).json({ error: error.message || 'Failed to generate questions for topic' });
    }
});

router.post('/generate-by-topic', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const flashcards = await require('../services/aiService').generateFlashcardsByTopic(topic);
        res.json({ flashcards });
    } catch (error) {
        console.error('Flashcard generation by topic failed:', error);
        res.status(500).json({ error: error.message || 'Failed to generate flashcards for topic' });
    }
});

router.post('/transcribe-and-generate', upload.single('audio'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No audio file provided' });
    }

    try {
        // 1. Transcribe
        const transcript = await transcribeAudio(req.file.path);

        // 2. Generate Insights (Notes + Flashcards)
        const { topic } = req.body;
        const insights = await generateLectureInsights(transcript, topic);

        res.json({
            transcript,
            ...insights
        });
    } catch (error) {
        console.error('Transcription route failed:', error);
        res.status(500).json({ error: error.message || 'Failed to process audio' });
    }
});

router.post('/generate-podcast/:documentId', async (req, res) => {
    const { documentId } = req.params;

    try {
        const documentRepository = AppDataSource.getRepository(Document);
        const doc = await documentRepository.findOneBy({ id: documentId });

        if (!doc) return res.status(404).json({ error: 'Document not found' });

        // Audio recordings need transcription first (not yet available)
        if (doc.type === 'audio') {
            return res.status(400).json({ error: 'Podcast from audio recordings is coming soon. For now, upload a PDF or text document.' });
        }

        const text = await extractText(doc.path);
        const { generatePodcastScript } = require('../services/aiService');
        const result = await generatePodcastScript(text);

        // Save to document
        doc.questions = JSON.stringify(result); // reuse questions column for podcast data
        await documentRepository.save(doc);

        res.json({ ...result, id: doc.id });
    } catch (error) {
        console.error('Podcast generation route failed:', error);
        res.status(500).json({ error: error.message || 'Failed to generate podcast' });
    }
});

router.post('/generate-podcast-by-topic', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const { generatePodcastScript } = require('../services/aiService');
        const result = await generatePodcastScript(topic);
        res.json(result);
    } catch (error) {
        console.error('Podcast generation by topic failed:', error);
        res.status(500).json({ error: error.message || 'Failed to generate podcast' });
    }
});

// Stress Tester / Stress-Tester: challenge a document's claims
router.post('/stress-tester/:documentId', async (req, res) => {
    const { documentId } = req.params;
    try {
        const documentRepository = AppDataSource.getRepository(Document);
        const doc = await documentRepository.findOneBy({ id: documentId });
        if (!doc) return res.status(404).json({ error: 'Document not found' });
        if (doc.type === 'audio') {
            return res.status(400).json({ error: 'Stress Tester for audio recordings is coming soon. For now, upload a PDF or text document.' });
        }
        const text = await extractText(doc.path);
        const { generateStressTester } = require('../services/aiService');
        const result = await generateStressTester(text);
        res.json({ ...result, id: doc.id });
    } catch (error) {
        console.error('Stress Tester route failed:', error);
        res.status(500).json({ error: error.message || 'Failed to generate challenges' });
    }
});

// Stress Tester by topic
router.post('/stress-tester-by-topic', async (req, res) => {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: 'Topic is required' });
    try {
        const { generateStressTester } = require('../services/aiService');
        const result = await generateStressTester(topic);
        res.json(result);
    } catch (error) {
        console.error('Stress Tester by topic failed:', error);
        res.status(500).json({ error: error.message || 'Failed to generate challenges' });
    }
});

// Cross-Project Knowledge Mesh: aggregate all user documents and find connections
router.post('/knowledge-mesh', async (req, res) => {
    try {
        const documentRepository = AppDataSource.getRepository(Document);
        const docs = await documentRepository.find();
        if (!docs || docs.length === 0) {
            return res.status(400).json({ error: 'No documents found. Upload some first.' });
        }
        const withText = await Promise.all(docs.map(async (d) => {
            try {
                const text = d.type === 'audio' ? '' : await extractText(d.path);
                return { filename: d.filename, text };
            } catch {
                return { filename: d.filename, text: '' };
            }
        }));
        const { generateKnowledgeMesh } = require('../services/aiService');
        const result = await generateKnowledgeMesh(withText.filter(d => d.text));
        res.json(result);
    } catch (error) {
        console.error('Knowledge mesh route failed:', error);
        res.status(500).json({ error: error.message || 'Failed to generate knowledge mesh' });
    }
});

module.exports = router;
