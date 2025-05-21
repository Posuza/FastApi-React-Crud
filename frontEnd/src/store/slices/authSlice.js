import { authService } from '../../services/auth.services';
import { API_CONFIG } from '../../config/api.config';

export const createAuthSlice = (set, get) => ({
  user: null,
  token: null,
  tokenType: "bearer",
  tokenExpiry: null,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(username, password);

      // Update Zustand store state with all relevant auth data
      set({
        user: response.user,
        token: response.access_token,
        tokenType: response.token_type,
        tokenExpiry: response.expires_at,
        loading: false
      });
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
      const token = get().token;

      if (token) {
        const isExpired = get().isTokenExpired();

        if (!isExpired) {
          try {
            console.log("Token is still valid, refreshing before logout");
            await get().refreshToken();
            const newToken = get().token;
            await authService.logout(newToken);
          } catch (refreshError) {
            console.error("Failed to refresh token before logout:", refreshError);
            try {
              await authService.logout(token);
            } catch (logoutError) {
              console.error("Logout failed after refresh attempt:", logoutError);
            }
          }
        } else {
          console.log("Token is expired, proceeding with logout");
          try {
            await authService.logout(token);
          } catch (error) {
            console.error("Logout API call failed:", error);
          }
        }
      }

      // Use the new clearStore method to reset all state
      get().clearStore();
    } catch (error) {
      console.error("Unexpected error during logout process:", error);
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  refreshToken: async () => {
    set({ loading: true });
    try {
      const currentToken = get().token;
      if (!currentToken) {
        throw new Error('No token available to refresh');
      }

      const response = await authService.refreshToken(currentToken);

      set({
        token: response.access_token,
        tokenType: response.token_type,
        tokenExpiry: response.expires_at,
        user: response.user, // Update user info if it's included in the response
        loading: false
      });

      return response;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  clearAuthError: () => set({ error: null }),

  // Helper method to get the auth header for API calls
  getAuthHeader: () => {
    const token = get().token;
    const tokenType = get().tokenType;
    return token ? {
      ...API_CONFIG.headers,
      'Authorization': `${tokenType.charAt(0).toUpperCase() + tokenType.slice(1)} ${token}`
    } : API_CONFIG.headers;
  },

  // Helper to check if token is expired
  isTokenExpired: () => {
    const tokenExpiry = get().tokenExpiry;
    if (!tokenExpiry) return true;

    return new Date(tokenExpiry) <= new Date();
  }
});
