import { API_URL } from '../config/api.config';

export const apiService = {
    async fetchItems() {
        try {
            const res = await fetch(`${API_URL}/items/`);
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

    async createItem(newItem) {
        try {
            const res = await fetch(`${API_URL}/items/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

    async updateItem(id, updatedData) {
        try {
            const res = await fetch(`${API_URL}/items/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: updatedData.name,
                    description: updatedData.description
                }),
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

    async deleteItem(id) {
        try {
            const res = await fetch(`${API_URL}/items/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
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