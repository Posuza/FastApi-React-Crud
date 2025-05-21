import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/store';
import { FiLogOut, FiMenu, FiX, FiAlertCircle } from "react-icons/fi";
import Container from '../Container';

const Header = () => {
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const logout = useStore(state => state.logout);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
    setIsMenuOpen(false); // Close mobile menu if open
    setLogoutError(null); // Clear any previous errors
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      setLogoutError(error.message || 'Failed to logout. Please try again.');
      // Don't close the confirmation dialog on error so user can try again
      return;
    }
    setShowLogoutConfirm(false);
  };

  return (
    <header className="py-3 bg-white">
      <Container>
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <h1 className="text-xl md:text-2xl font-bold text-sky-900 whitespace-nowrap">
              GUTS <span className="text-red-600 text-lg md:text-xl">Investigation</span>
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-medium text-sky-900">{user?.username}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                       transition-colors active:scale-95 text-sm"
            >
              <FiLogOut className="text-lg" /> Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-sky-900 hover:bg-sky-50 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <p className="text-sm font-medium text-sky-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogoutClick}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg 
                         hover:bg-red-700 transition-colors active:scale-95 text-sm w-full"
              >
                <FiLogOut className="text-lg" /> Logout
              </button>
            </div>
          </div>
        )}

        {/* Logout Confirmation Dialog */}
        {showLogoutConfirm && (
          <div className="fixed inset-0  bg-black/30 flex items-center justify-center p-4 z-50 transition-all duration-300">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full transform transition-all">
              <div className="flex items-center gap-3 text-sky-900 mb-4">
                <FiAlertCircle className="text-2xl" />
                <h3 className="text-lg font-semibold">Confirm Logout</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to log out? You'll need to login again to access your account.
              </p>
              
              {/* Show error message if logout failed */}
              {logoutError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                  <div className="flex items-center gap-2">
                    <FiAlertCircle />
                    <span>{logoutError}</span>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    setLogoutError(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                           transition-colors active:scale-95"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};

export default Header;
