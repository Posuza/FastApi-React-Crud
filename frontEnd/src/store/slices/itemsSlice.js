import { apiService } from '../../services/item.services';

export const createItemsSlice = (set, get) => ({
  items: [],
  itemsLoading: false,
  itemsError: null,
  lastFetch: null, // Track last fetch time

  fetchItems: async () => {
    const now = Date.now();
    const lastFetch = get().lastFetch;
    
    // Prevent fetching if data was loaded less than 30 seconds ago
    if (lastFetch && now - lastFetch < 30000) {
      return;
    }

    set({ itemsLoading: true, itemsError: null });
    try {
      // Get auth header from auth slice
      const getAuthHeader = get().getAuthHeader;
      const authHeader = getAuthHeader ? getAuthHeader() : {};
      
      const data = await apiService.fetchItems(authHeader);
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

  getItemById: async (id) => {
    try {
      set({ itemsLoading: true, itemsError: null });
      
      // Get auth header from auth slice
      const getAuthHeader = get().getAuthHeader;
      const authHeader = getAuthHeader ? getAuthHeader() : {};
      
      const data = await apiService.getItemById(id, authHeader);
      set({ itemsLoading: false });
      return data;
    } catch (error) {
      set({ itemsError: error.message, itemsLoading: false });
      throw error;
    }
  },

  createItem: async (newItem) => {
    try {
      // Check if user is authenticated
      const user = get().user;
      if (!user) {
        throw new Error('Authentication required');
      }

      // Get auth header from auth slice
      const getAuthHeader = get().getAuthHeader;
      const authHeader = getAuthHeader ? getAuthHeader() : {};

      set({ itemsLoading: true, itemsError: null });
      const data = await apiService.createItem(newItem, authHeader);
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
      // Check if user is authenticated
      const user = get().user;
      if (!user) {
        throw new Error('Authentication required');
      }

      // Get auth header from auth slice
      const getAuthHeader = get().getAuthHeader;
      const authHeader = getAuthHeader ? getAuthHeader() : {};

      set({ itemsLoading: true, itemsError: null });
      const data = await apiService.updateItem(id, updatedData, authHeader);
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
      // Check if user is authenticated
      const user = get().user;
      if (!user) {
        throw new Error('Authentication required');
      }

      // Get auth header from auth slice
      const getAuthHeader = get().getAuthHeader;
      const authHeader = getAuthHeader ? getAuthHeader() : {};

      set({ itemsLoading: true, itemsError: null });
      await apiService.deleteItem(id, authHeader);
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
    itemsError: null,
    lastFetch: null
  })
});
