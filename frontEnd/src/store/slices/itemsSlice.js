import { apiService } from '../../services/item.services';

export const createItemsSlice = (set, get) => ({
  items: [],
  itemsLoading: false,
  itemsError: null,
  lastFetch: null, // Add this to track last fetch time

  fetchItems: async () => {
    const now = Date.now();
    const lastFetch = get().lastFetch;
    
    // Prevent fetching if data was loaded less than 30 seconds ago
    if (lastFetch && now - lastFetch < 30000) {
      return;
    }

    set({ itemsLoading: true, itemsError: null });
    try {
      const data = await apiService.fetchItems();
      set(state => ({ 
        items: data, 
        itemsLoading: false,
        lastFetch: now,
        itemsError: null
      }));
    } catch (error) {
      set(state => ({ 
        itemsError: error.message, 
        itemsLoading: false 
      }));
      throw error;
    }
  },

  createItem: async (newItem) => {
    try {
      const user = get().user;
      if (!user) {
        throw new Error('Authentication required');
      }

      set({ itemsLoading: true, itemsError: null });
      const data = await apiService.createItem(newItem);
      set((state) => ({
        items: [...state.items, data],
        itemsLoading: false
      }));
      return data;
    } catch (error) {
      set({ itemsError: error.message, itemsLoading: false });
      throw error;
    }
  },

  updateItem: async (id, updatedData) => {
    try {
      const user = get().user;
      if (!user) {
        throw new Error('Authentication required');
      }

      set({ itemsLoading: true, itemsError: null });
      const data = await apiService.updateItem(id, updatedData);
      set((state) => ({
        items: state.items.map((item) => 
          item.id === id ? { ...item, ...data } : item
        ),
        itemsLoading: false
      }));
      return data;
    } catch (error) {
      set({ itemsError: error.message, itemsLoading: false });
      throw error;
    }
  },

  deleteItem: async (id) => {
    try {
      const user = get().user;
      if (!user) {
        throw new Error('Authentication required');
      }

      set({ itemsLoading: true, itemsError: null });
      await apiService.deleteItem(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        itemsLoading: false
      }));
    } catch (error) {
      set({ itemsError: error.message, itemsLoading: false });
      throw error;
    }
  },

  // Clear items error
  clearItemsError: () => set({ itemsError: null }),

  // Reset items state
  resetItems: () => set({ 
    items: [], 
    itemsLoading: false, 
    itemsError: null 
  }),

  // Get single item
  getItemById: (id) => {
    const state = get();
    return state.items.find(item => item.id === id);
  }
});