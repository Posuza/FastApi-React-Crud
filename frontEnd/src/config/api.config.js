export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// You can also add other API-related configurations here
export const API_CONFIG = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};
