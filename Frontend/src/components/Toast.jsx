import { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import '../Styles/Toast.css';

/**
 * Componente Toast para notificaciones
 */
export function Toast({ 
  message = '', 
  type = 'info', // 'success', 'error', 'info', 'warning'
  duration = 3000,
  onClose = () => {}
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertCircle size={20} />,
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {icons[type]}
        <span>{message}</span>
      </div>
      <button 
        className="toast-close"
        onClick={() => {
          setIsVisible(false);
          onClose();
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;
