import { authService } from '../../services/auth.services';

export const createAuthSlice = (set, get) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(username, password);
      const userData = response.user;
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData, loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  register: async (userData) => {
    try {
      set({ loading: true, error: null });
      const response = await authService.register(userData);
      set({ loading: false });
      return response;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const user = get().user;
      if (user?.username) {
        await authService.logout(user.username);
      }
      localStorage.removeItem('user');
      set({ user: null, loading: false, error: null });
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  clearAuthError: () => set({ error: null }),

  checkSession: async () => {
    try {
      const user = get().user;
      if (!user?.username) return;

      const response = await authService.checkSession(user.username);
      if (!response.is_active) {
        localStorage.removeItem('user');
        set({ user: null });
      }
    } catch (error) {
      console.error('Session check failed:', error);
      localStorage.removeItem('user');
      set({ user: null });
    }
  }
});