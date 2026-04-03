import Toast from './Toast';

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-20 right-4 z-[200] space-y-3">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            animation: `slide-down 0.3s ease-out ${index * 0.1}s both`
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={0} // Duration handled by useToast hook
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
