const LuxuryBadge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  dot = false,
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300';
  
  const variants = {
    primary: 'bg-royal-primary/10 text-royal-primary border border-royal-primary/20',
    gold: 'bg-royal-gold/10 text-royal-gold-dark border border-royal-gold/20',
    success: 'bg-green-50 text-green-700 border border-green-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    gradient: 'gradient-luxury text-white shadow-luxury',
    glass: 'glass-luxury text-royal-primary',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2',
  };

  return (
    <span
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        rounded-full
        ${className}
      `}
    >
      {dot && (
        <span className={`
          w-1.5 h-1.5 rounded-full
          ${variant === 'primary' ? 'bg-royal-primary' : ''}
          ${variant === 'gold' ? 'bg-royal-gold' : ''}
          ${variant === 'success' ? 'bg-green-500' : ''}
          ${variant === 'danger' ? 'bg-red-500' : ''}
          ${variant === 'warning' ? 'bg-yellow-500' : ''}
          ${variant === 'info' ? 'bg-blue-500' : ''}
        `} />
      )}
      {children}
    </span>
  );
};

export default LuxuryBadge;
