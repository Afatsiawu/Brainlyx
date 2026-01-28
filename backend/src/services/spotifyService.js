const axios = require('axios');

class SpotifyService {
    constructor() {
        this.clientId = process.env.SPOTIFY_CLIENT_ID;
        this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    async getAccessToken() {
        if (this.accessToken && this.tokenExpiry > Date.now()) {
            return this.accessToken;
        }

        const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
        try {
            const response = await axios.post('https://accounts.spotify.com/api/token',
                'grant_type=client_credentials',
                {
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000;
            return this.accessToken;
        } catch (error) {
            console.error('Spotify Auth Error:', error.response?.data || error.message);
            throw new Error('Failed to authenticate with Spotify');
        }
    }

    async getStudyPlaylists(query = 'lofi study focus') {
        const token = await this.getAccessToken();
        try {
            // Search for focus/study playlists with optional custom query
            const response = await axios.get('https://api.spotify.com/v1/search', {
                params: {
                    q: query,
                    type: 'playlist',
                    limit: 15
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return response.data.playlists.items.filter(p => p !== null);
        } catch (error) {
            console.error('Spotify Search Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch playlists from Spotify');
        }
    }
}

module.exports = new SpotifyService();
