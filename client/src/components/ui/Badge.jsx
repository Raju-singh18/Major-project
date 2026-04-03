const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  rounded = true,
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold';
  
  const variants = {
    primary: 'bg-primary-100 text-primary-700',
    secondary: 'bg-secondary-100 text-secondary-700',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
    gradient: 'gradient-primary text-white',
    glass: 'glass text-dark-900',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const roundedClass = rounded ? 'rounded-full' : 'rounded-lg';

  return (
    <span
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${roundedClass}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
