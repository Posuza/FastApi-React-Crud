import { API_URL, API_CONFIG } from '../config/api.config';

export const apiService = {
    async fetchItems(authHeader = {}) {
        try {
            const res = await fetch(`${API_URL}/items/`, {
                headers: {
                    ...API_CONFIG.headers,
                    ...authHeader
                }
            });
            
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || 'Failed to fetch items');
            }
            return res.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw new Error('Network error: Unable to connect to the server');
        }
    },

    async createItem(newItem, authHeader = {}) {
        try {
            const res = await fetch(`${API_URL}/items/`, {
                method: 'POST',
                headers: {
                    ...API_CONFIG.headers,
                    ...authHeader
                },
                body: JSON.stringify(newItem),
            });
            
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || 'Failed to create item');
            }
            return res.json();
        } catch (error) {
            console.error('Create error:', error);
            throw error;
        }
    },

    async getItemById(id, authHeader = {}) {
        try {
            const res = await fetch(`${API_URL}/items/${id}`, {
                headers: {
                    ...API_CONFIG.headers,
                    ...authHeader
                }
            });
            
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || 'Failed to fetch item');
            }
            return res.json();
        } catch (error) {
            console.error('Fetch item error:', error);
            throw error;
        }
    },

    async updateItem(id, updatedData, authHeader = {}) {
        try {
            const res = await fetch(`${API_URL}/items/${id}`, {
                method: 'PUT',
                headers: {
                    ...API_CONFIG.headers,
                    ...authHeader
                },
                body: JSON.stringify(updatedData),
            });

            if (!res.ok) {
                if (res.status === 500) {
                    throw new Error('Internal server error');
                }
                const errorData = await res.json().catch(() => ({
                    detail: 'Failed to update item'
                }));
                throw new Error(errorData.detail || 'Failed to update item');
            }

            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Update error:', error);
            throw new Error(error.message || 'Failed to update item');
        }
    },

    async deleteItem(id, authHeader = {}) {
        try {
            const res = await fetch(`${API_URL}/items/${id}`, {
                method: 'DELETE',
                headers: {
                    ...API_CONFIG.headers,
                    ...authHeader
                }
            });

            if (!res.ok) {
                if (res.status === 500) {
                    throw new Error('Internal server error');
                }
                const errorData = await res.json().catch(() => ({
                    detail: 'Failed to delete item'
                }));
                throw new Error(errorData.detail || 'Failed to delete item');
            }

            return true;
        } catch (error) {
            console.error('Delete error:', error);
            throw new Error(error.message || 'Failed to delete item');
        }
    }
};
