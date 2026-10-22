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
                maxResults: 15,
                key: this.apiKey
            }
        });

        return response.data.items.map(item => ({
            id: item.id.videoId,
            name: this.sanitize(item.snippet.title),
            description: this.sanitize(item.snippet.description),
            images: [{ url: item.snippet.thumbnails.high.url }],
            tracks: { total: 1 } // Represent as 1 stream
        }));
    } catch (error) {
        console.error('YouTube Search Error:', error.response?.data || error.message);
        return this.getFallbacks();
    }
}

sanitize(text) {
    if (!text) return '';
    // Strip emoji and other non-text symbols
    return text
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2300}-\u{23FF}\u{FE00}-\u{FEFF}\u{1F900}-\u{1F9FF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{25AA}-\u{25FE}\u{2934}\u{2935}\u{2B05}-\u{2B07}\u{2B1B}\u{2B1C}\u{3030}\u{303D}\u{3297}\u{3299}]/gu, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
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
