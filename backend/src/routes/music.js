const express = require('express');
const router = express.Router();
const spotifyService = require('../services/spotifyService');

router.get('/playlists', async (req, res) => {
    try {
        const query = req.query.q || undefined;
        const playlists = await spotifyService.getStudyPlaylists(query);
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
