const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://brainlyx.onrender.com/api/v1'; // Deployed backend; override with VITE_API_URL=http://localhost:3000/api/v1 for local dev

export const api = {
    // Generic fetch wrapper
    request: async (endpoint, options = {}) => {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        try {
            const response = await fetch(url, { ...options, headers });
            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Waitlist signup
    joinWaitlist: (email) => {
        return api.request('/waitlist', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    checkHealth: () => {
        return api.request('/health');
    }
};

export default api;
