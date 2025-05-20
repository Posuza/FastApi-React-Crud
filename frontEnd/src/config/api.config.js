export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

export const API_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    getAuthHeader: () => ({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
};