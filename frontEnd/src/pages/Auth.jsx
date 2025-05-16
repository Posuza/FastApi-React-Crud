import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';
import Container from '../components/Container'; // Make sure this matches the actual file name
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Separate selectors to prevent unnecessary re-renders
  const user = useStore(state => state.user);
  const login = useStore(state => state.login);
  const register = useStore(state => state.register);
  const error = useStore(state => state.error);
  const clearAuthError = useStore(state => state.clearAuthError);
  const loading = useStore(state => state.loading);
  
  const [isLogin, setIsLogin] = useState(true);

  // Memoize navigation logic
  const handleNavigation = useCallback(() => {
    if (user?.username) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, location.state?.from?.pathname, navigate]);

  useEffect(() => {
    handleNavigation();
  }, [handleNavigation]);

  const handleLogin = async (formData) => {
    clearAuthError();
    try {
      await login(formData.username, formData.password);
      // Navigation handled by useEffect
    } catch (err) {
      console.error('Login error:', err);
      // Error state handled by store
    }
  };

  const handleRegister = async (formData) => {
    clearAuthError();
    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      setIsLogin(true); // Switch to login after successful registration
    } catch (err) {
      console.error('Register error:', err);
      // Error state handled by store
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
        </div>
      </Container>
    );
  }

  // Show auth form
  return (
    <Container>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-sky-900">
              GUTS <span className="text-red-600 text-2xl">Investigation</span>
            </h1>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {isLogin ? (
            <Login
              onSubmit={handleLogin}
              onSwitchToRegister={() => {
                clearAuthError();
                setIsLogin(false);
              }}
            />
          ) : (
            <Register
              onSubmit={handleRegister}
              onSwitchToLogin={() => {
                clearAuthError();
                setIsLogin(true);
              }}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default Auth;