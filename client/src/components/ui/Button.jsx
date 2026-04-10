import { FaSpinner } from 'react-icons/fa';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'bg-violet-700 text-white hover:bg-violet-800',
    outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white',
    ghost: 'text-purple-600 hover:bg-purple-50',
    glass: 'bg-white/30 text-gray-900 hover:bg-white/50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <FaSpinner className="animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span>{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span>{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
