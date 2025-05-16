import { create } from 'zustand';
import { createAuthSlice } from './slices/authSlice';
import { createItemsSlice } from './slices/itemsSlice';

const useStore = create((set, get) => ({
  ...createAuthSlice(set, get),
  ...createItemsSlice(set, get)
}));

export { useStore };