import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Componente para proteger rutas que requieren autenticación
 */
export function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, getUser } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Validar rol si es requerido
  if (requiredRole) {
    const { userRole } = getUser();
    if (userRole !== requiredRole) {
      return <Navigate to="/home" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
