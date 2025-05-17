import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store/store';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const user = useStore(state => state.user);
  const loading = useStore(state => state.loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-700"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;