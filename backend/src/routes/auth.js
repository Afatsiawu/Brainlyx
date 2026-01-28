const express = require('express');
const router = express.Router();
const AppDataSource = require('../data-source');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/signup', async (req, res) => {
    console.log('Signup request received:', req.body);
    const { email, password, username, name, university, major, year } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ error: 'Username, email and password required' });
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOne({
            where: [
                { email },
                { username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or username already exists' });
        }

        const user = userRepository.create({
            email,
            username,
            password,
            name: name || username || 'Student',
            university,
            major,
            year
        });
        await userRepository.save(user);

        console.log('User created successfully:', user.id);
        res.status(201).json({
            message: 'User created',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name,
                university: user.university,
                major: user.major,
                major: user.major,
                year: user.year,
                isPremium: user.isPremium
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { identifier, email, password } = req.body;
    const loginId = identifier || email; // Support both for backward compatibility

    if (!loginId || !password) {
        return res.status(400).json({ error: 'Identifier and password required' });
    }

    const userRepository = AppDataSource.getRepository(User);

    // Search by email OR username
    const user = await userRepository.findOne({
        where: [
            { email: loginId },
            { username: loginId }
        ]
    });

    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // In a real app, sign a JWT here
    res.json({
        token: 'mock-jwt-token',
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            university: user.university,
            major: user.major,
            major: user.major,
            year: user.year,
            isPremium: user.isPremium
        }
    });
});

router.post('/google', async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ error: 'ID token required' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        const userRepository = AppDataSource.getRepository(User);
        let user = await userRepository.findOne({ where: { email } });

        if (!user) {
            // Create new user if they don't exist
            // Generate a random username if not provided
            const baseUsername = email.split('@')[0];
            let username = baseUsername;

            // Check if username exists, if so append random string
            const existingUsername = await userRepository.findOne({ where: { username } });
            if (existingUsername) {
                username = `${baseUsername}_${Math.random().toString(36).substring(7)}`;
            }

            user = userRepository.create({
                email,
                name: name || 'Google User',
                username: username,
                // password remains null
            });
            await userRepository.save(user);
            console.log('New Google user created:', user.id);
        }

        res.json({
            token: 'mock-jwt-token', // Keeping it consistent with existing mock auth
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name,
                university: user.university,
                major: user.major,
                year: user.year,
                isPremium: user.isPremium,
                picture
            }
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(401).json({ error: 'Invalid Google token' });
    }
});

router.post('/upgrade', async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ id: userId });

        if (!user) return res.status(404).json({ error: 'User not found' });

        user.isPremium = true;
        await userRepository.save(user);

        console.log(`User ${userId} upgraded to Premium`);
        res.json({ success: true, message: 'Upgraded to Premium', isPremium: true });
    } catch (error) {
        console.error('Upgrade error:', error);
        res.status(500).json({ error: 'Failed to upgrade user' });
    }
});

module.exports = router;
