import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

interface SwalProps {
  title: string;
  text: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'question';
  show: boolean;
  onClose?: () => void;
  confirmText?: string;
  showConfirmButton?: boolean;
}

const SweetAlert: React.FC<SwalProps> = ({
  title,
  text,
  type,
  show,
  onClose,
  confirmText,
  showConfirmButton,
}) => {
  useEffect(() => {
    if (show) {
      Swal.fire({
        title: title || '',
        text: text || '',
        icon: type || 'info',
        confirmButtonText: confirmText || '',
        showConfirmButton: showConfirmButton || false,
        timer: 1000,
      }).then(() => {
        if (onClose) {
          onClose();
        }
      });
    }
  }, [show, title, text, type, onClose]);

  return null;
};

export default SweetAlert;
