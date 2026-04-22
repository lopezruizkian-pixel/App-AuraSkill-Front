import React from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Trash2 } from 'lucide-react';

export const AuraConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'danger' }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className='aura-modal-overlay' onClick={handleOverlayClick}>
      <div className='aura-modal-content'>
        <div className='aura-modal-icon' style={{ 
          background: type === 'danger' ? 'rgba(255, 0, 85, 0.1)' : 'rgba(255, 170, 0, 0.1)',
          color: type === 'danger' ? '#ff0055' : '#ffaa00'
        }}>
          {type === 'danger' ? <Trash2 size={40} /> : <AlertTriangle size={40} />}
        </div>
        <h3 className='aura-modal-title'>{title}</h3>
        <p className='aura-modal-text'>{message}</p>
        <div className='aura-modal-actions'>
          <button type='button' className='aura-modal-btn aura-btn-cancel' onClick={onClose}>
            {cancelText}
          </button>
          <button type='button' className='aura-modal-btn aura-btn-confirm' style={{ 
            background: type === 'danger' ? '#ff0055' : '#ffaa00',
            boxShadow: type === 'danger' ? '0 0 20px rgba(255, 0, 85, 0.4)' : '0 0 20px rgba(255, 170, 0, 0.4)'
          }} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
