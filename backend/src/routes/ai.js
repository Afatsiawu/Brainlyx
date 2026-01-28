const express = require('express');
const router = express.Router();
const { getGroqClient } = require('../services/aiService');
const AppDataSource = require('../data-source');
const ChatSession = require('../models/ChatSession');

const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

// List all sessions
router.get('/sessions', async (req, res) => {
    try {
        const sessionRepo = AppDataSource.getRepository(ChatSession);
        const sessions = await sessionRepo.find({
            order: { updatedAt: 'DESC' },
            select: ['id', 'title', 'updatedAt']
        });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
});

// Get a single session's messages
router.get('/session/:id', async (req, res) => {
    try {
        const sessionRepo = AppDataSource.getRepository(ChatSession);
        const session = await sessionRepo.findOneBy({ id: req.params.id });
        if (!session) return res.status(404).json({ error: 'Session not found' });

        session.messages = session.messages ? JSON.parse(session.messages) : [];
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch session' });
    }
});

router.post('/chat', async (req, res) => {
    const { message, history, sessionId } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const groq = require('../services/aiService').getGroqClient();
        const sessionRepo = AppDataSource.getRepository(ChatSession);

        // Prepare context
        const messages = [
            {
                role: 'system',
                content: 'You are BrainlyxAI, a highly intelligent and encouraging academic study assistant. Your goal is to help students understand complex topics, provide further explanations, and offer study tips. Keep your responses concise, well-structured (use markdown), and focused on education. Use bold text, bullet points, and code blocks where appropriate to make answers easy to read.'
            },
            ...(history || []),
            { role: 'user', content: message }
        ];

        const completion = await groq.chat.completions.create({
            messages,
            model: DEFAULT_MODEL,
        });

        const reply = completion.choices[0].message.content;

        // Persist session
        let session;
        if (sessionId) {
            session = await sessionRepo.findOneBy({ id: sessionId });
        }

        if (!session) {
            session = sessionRepo.create({
                title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
                messages: JSON.stringify([...(history || []), { role: 'user', content: message }, { role: 'assistant', content: reply }])
            });
        } else {
            const currentMsgs = session.messages ? JSON.parse(session.messages) : [];
            session.messages = JSON.stringify([...currentMsgs, { role: 'user', content: message }, { role: 'assistant', content: reply }]);
        }

        await sessionRepo.save(session);

        res.json({ reply, sessionId: session.id });
    } catch (error) {
        console.error('BrainlyxAI Chat failed:', error);
        res.status(500).json({ error: 'BrainlyxAI is temporarily unavailable. Please try again later.' });
    }
});

module.exports = router;
