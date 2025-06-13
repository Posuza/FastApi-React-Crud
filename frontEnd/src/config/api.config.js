// Vite automatically loads .env from project root
export const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const API_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    getAuthHeader: () => ({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
};
