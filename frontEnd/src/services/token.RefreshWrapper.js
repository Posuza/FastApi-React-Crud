import { API_URL } from '../config/api.config';
import { useStore } from '../store/store';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

export const apiClient = async (endpoint, options = {}) => {
  const store = useStore.getState();
  
  // Check token expiration first
  const isExpired = store.isTokenExpired();
  
  // Only attempt refresh if token is actually expired
  if (isExpired) {
    console.log('Token expired, attempting to refresh...');
    try {
      await store.refreshToken();
      console.log('Token refreshed successfully');
    } catch (refreshError) {
      console.error('Failed to refresh token:', refreshError);
      window.location.href = '/auth';
      throw new Error('Authentication expired. Please login again.');
    }
  }

  try {
    // Merge headers in a single place
    const headers = {
      ...DEFAULT_HEADERS,
      ...store.getAuthHeader(),
      ...(options.headers || {})
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const status = response.status;
      
      if (status === 401) {
        window.location.href = '/auth';
        throw new Error('Authentication required. Please login.');
      }
      
      throw new Error(`API error: ${status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export default apiClient;
