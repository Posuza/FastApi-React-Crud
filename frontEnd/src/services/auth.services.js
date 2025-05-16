import { API_URL } from '../config/api.config';

export const authService = {
  async login(username, password) {
    try {
      const response = await fetch(
        `${API_URL}/users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        {
          method: 'POST',
          headers: { 'accept': 'application/json' }
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
      const response = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  async logout(username) {
    try {
      const response = await fetch(`${API_URL}/users/logout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username: username })
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
  }
};