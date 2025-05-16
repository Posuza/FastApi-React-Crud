import { create } from 'zustand';
import { apiService } from '../services/api.services';

export const useDataTableStore = create((set) => ({
    rows: [],
    loading: false,
    error: null,

    fetchItems: async () => {
        try {
            set({ loading: true, error: null });
            const data = await apiService.fetchItems();
            set({ rows: data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
            console.error('Error fetching items:', error);
        }
    },

    createItem: async (newItem) => {
        try {
            set({ loading: true, error: null });
            const data = await apiService.createItem(newItem);
            set((state) => ({
                rows: [...state.rows, data],
                loading: false
            }));
            return data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    updateItem: async (id, updatedData) => {
        try {
            set({ loading: true, error: null });
            const data = await apiService.updateItem(id, updatedData);
            set((state) => ({
                rows: state.rows.map((row) => 
                    row.id === id ? { ...row, ...data } : row
                ),
                loading: false
            }));
            return data;
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    deleteItem: async (id) => {
        try {
            set({ loading: true, error: null });
            await apiService.deleteItem(id);
            set((state) => ({
                rows: state.rows.filter((row) => row.id !== id),
                loading: false,
                error: null
            }));
        } catch (error) {
            set({ 
                error: error.message || 'Failed to delete item', 
                loading: false 
            });
            throw error;
        }
    },

    clearError: () => set({ error: null }),
}));