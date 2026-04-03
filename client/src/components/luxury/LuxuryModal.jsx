import { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const LuxuryModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div 
        className={`
          bg-white rounded-3xl ${sizes[size]} w-full max-h-[90vh] overflow-y-auto 
          shadow-luxury-xl animate-scale-in
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-royal-border">
            {title && (
              <h2 className="text-2xl font-bold text-royal-text">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl hover:bg-royal-bg flex items-center justify-center transition-colors"
              >
                <FaTimes className="w-5 h-5 text-royal-text-secondary" />
              </button>
            )}
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-royal-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default LuxuryModal;
