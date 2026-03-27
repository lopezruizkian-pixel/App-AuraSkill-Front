import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook para gestionar autenticación
 */
export const useAuth = () => {
  const navigate = useNavigate();

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem('token');
  }, []);

  const getUser = useCallback(() => {
    return {
      userId: localStorage.getItem('userId'),
      userName: localStorage.getItem('userName'),
      userRole: localStorage.getItem('userRole'),
      token: localStorage.getItem('token'),
    };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    navigate('/login');
  }, [navigate]);

  const setAuthUser = useCallback((userData) => {
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    if (userData.userId) {
      localStorage.setItem('userId', userData.userId);
    }
    if (userData.userName) {
      localStorage.setItem('userName', userData.userName);
    }
    if (userData.userRole) {
      localStorage.setItem('userRole', userData.userRole);
    }
  }, []);

  return {
    isAuthenticated: isAuthenticated(),
    getUser,
    logout,
    setAuthUser,
  };
};

export default useAuth;
