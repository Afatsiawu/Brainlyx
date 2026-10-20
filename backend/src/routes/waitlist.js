const express = require('express');
const router = express.Router();
const AppDataSource = require('../data-source');
const Waitlist = require('../models/Waitlist');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Join the waitlist (idempotent: re-subscribing returns success)
router.post('/', async (req, res) => {
    const { email } = req.body || {};
    if (!email || !EMAIL_RE.test(email)) {
        return res.status(400).json({ error: 'A valid email address is required' });
    }

    try {
        const repo = AppDataSource.getRepository(Waitlist);
        const normalized = email.trim().toLowerCase();
        const existing = await repo.findOne({ where: { email: normalized } });
        if (existing) {
            return res.json({ message: "You're already on the list — we'll be in touch!" });
        }
        await repo.save(repo.create({ email: normalized }));
        res.status(201).json({ message: "You're on the list — we'll be in touch!" });
    } catch (error) {
        console.error('Waitlist signup error:', error);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;
