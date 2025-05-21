import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createAuthSlice } from './slices/authSlice';
import { createItemsSlice } from './slices/itemsSlice';

// Define initial state to use for resets
const initialState = {
  // Auth initial state
  user: null,
  token: null,
  tokenType: "bearer",
  tokenExpiry: null,
  loading: false,
  error: null,
  
  // Items initial state
  items: [],
  itemsLoading: false,
  itemsError: null,
  lastFetch: null,
  
  // Hydration state
  _hasHydrated: false
};

const useStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Add a hydration flag to track when persistence is ready
        _hasHydrated: false,
        setHasHydrated: (state) => {
          set({
            _hasHydrated: state
          });
        },
        
        // Add clearStore method to reset all state
        clearStore: () => {
          set(initialState);
          // Optional: clear localStorage completely
          // localStorage.removeItem('auth-storage');
        },
        
        ...createAuthSlice(set, get),
        ...createItemsSlice(set, get)
      }),
      {
        name: 'auth-storage', // unique name for localStorage key
        getStorage: () => localStorage,
        // This runs when rehydration is complete
        onRehydrateStorage: () => (state) => {
          // When rehydration is finished, update the flag
          useStore.getState().setHasHydrated(true);
          console.log('Rehydration complete', state);
        },
        partialize: (state) => ({
          // Auth data to persist
          user: state.user,
          token: state.token,
          tokenType: state.tokenType,
          tokenExpiry: state.tokenExpiry,
          
          // Items data to persist
          items: state.items,
          lastFetch: state.lastFetch,
        }),
      }
    ),
    {
      name: 'FastApi-React-Crud Store',
      enabled: process.env.NODE_ENV !== 'production'
    }
  )
);

export { useStore };