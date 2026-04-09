import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';
import Toast from './Toast';

/**
 * Contenedor que renderiza todos los toasts activos
 * Debe ser incluido en el App.jsx
 */
export function ToastContainer() {
  const { toasts, removeToast } = useContext(ToastContext);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={0} // El contexto maneja la duración
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default ToastContainer;
