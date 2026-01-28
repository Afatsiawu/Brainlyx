import axios from 'axios';

// Use local IP for real device testing, localhost for simulator
// Machine IP: 172.20.10.2
const YOUR_IP = '172.20.10.2';

const BASE_URL = `http://${YOUR_IP}:3000/api/v1`;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token: string) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;
