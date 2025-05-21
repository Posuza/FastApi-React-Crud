import { API_URL, API_CONFIG } from '../config/api.config';

export const authService = {
  async login(username, password) {
    try {
      const response = await fetch(
        `${API_URL}/users/login`,
        {
          method: 'POST',
          headers: API_CONFIG.headers,
          body: JSON.stringify({
            login: username,
            password: password
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  async logout(token) {
    try {
      const response = await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        headers: { 
          ...API_CONFIG.headers,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Logout failed');
      }

      return response.json();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async refreshToken(token) {
    try {
      const response = await fetch(`${API_URL}/users/token/refresh`, {
        method: 'POST',
        headers: { 
          ...API_CONFIG.headers,
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Token refresh failed');
      }

      return response.json();
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
};
