import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/**
 * Hook para usar el sistema de notificaciones Toast
 */
export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast debe ser usado dentro de ToastProvider');
  }

  return context;
};

export default useToast;
