const axios = require('axios');

class YouTubeService {
    constructor() {
        this.apiKey = process.env.YOUTUBE_API_KEY;
    }

    async searchStudyMusic(query = 'lofi study music 24/7') {
        if (!this.apiKey) {
            console.warn('YOUTUBE_API_KEY is missing. Using static fallback for now.');
            return this.getFallbacks();
        }

        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    q: query,
                    part: 'snippet',
                    type: 'video',
                    eventType: 'live', // Get live streams for continuous music
                    maxResults: 15,
                    key: this.apiKey
                }
            });

            return response.data.items.map(item => ({
                id: item.id.videoId,
                name: item.snippet.title,
                description: item.snippet.description,
                images: [{ url: item.snippet.thumbnails.high.url }],
                tracks: { total: 1 } // Represent as 1 stream
            }));
        } catch (error) {
            console.error('YouTube Search Error:', error.response?.data || error.message);
            return this.getFallbacks();
        }
    }

    getFallbacks() {
        return [
            {
                id: 'jfKfPfyJRdk',
                name: 'lofi hip hop radio - beats to relax/study to',
                description: 'Lofi Girl - The most famous study beats.',
                images: [{ url: 'https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg' }],
                tracks: { total: 1 }
            },
            {
                id: '4xDzrJKXOOY',
                name: 'synthetix - synthwave radio',
                description: 'Retro synthwave for focus.',
                images: [{ url: 'https://i.ytimg.com/vi/4xDzrJKXOOY/maxresdefault.jpg' }],
                tracks: { total: 1 }
            },
            {
                id: '5yx6BWbLrqY',
                name: 'Chillhop Radio - jazzy & lofi hip hop beats',
                description: 'Chillhop Music - Relaxing jazzy beats.',
                images: [{ url: 'https://i.ytimg.com/vi/5yx6BWbLrqY/maxresdefault.jpg' }],
                tracks: { total: 1 }
            }
        ];
    }
}

module.exports = new YouTubeService();
