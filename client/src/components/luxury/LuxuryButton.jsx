import { FaSpinner } from 'react-icons/fa';

const LuxuryButton = ({ 
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
  const baseClasses = 'font-semibold rounded-2xl transition-all duration-400 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variants = {
    primary: `
      bg-gradient-to-r from-royal-primary to-royal-primary-light
      text-white
      shadow-luxury
      hover:shadow-luxury-lg
      hover:-translate-y-1
      active:translate-y-0
    `,
    secondary: `
      bg-white
      text-royal-primary
      border-2 border-royal-primary
      hover:bg-royal-primary hover:text-white
      shadow-md
      hover:shadow-lg
    `,
    gold: `
      bg-gradient-to-r from-royal-gold to-royal-gold-light
      text-white
      shadow-luxury
      hover:shadow-luxury-lg
      hover:-translate-y-1
    `,
    outline: `
      bg-transparent
      text-royal-primary
      border-2 border-royal-primary
      hover:bg-royal-primary/10
    `,
    ghost: `
      bg-transparent
      text-royal-primary
      hover:bg-royal-primary/10
    `,
    glass: `
      glass-luxury
      text-royal-primary
      hover:bg-white/90
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      text-white
      shadow-lg shadow-red-500/25
      hover:shadow-xl hover:shadow-red-500/40
      hover:-translate-y-1
    `,
    success: `
      bg-gradient-to-r from-green-500 to-green-600
      text-white
      shadow-lg shadow-green-500/25
      hover:shadow-xl hover:shadow-green-500/40
      hover:-translate-y-1
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
    xl: 'px-12 py-6 text-xl',
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
      {/* Shimmer effect */}
      {!loading && (
        <span className="absolute inset-0 shimmer-luxury pointer-events-none" />
      )}
      
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

export default LuxuryButton;
