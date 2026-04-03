const Card = ({ 
  children, 
  variant = 'default', 
  hover = true, 
  padding = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'rounded-3xl overflow-hidden transition-all duration-300';
  
  const variants = {
    default: 'bg-white shadow-card border border-gray-100',
    glass: 'glass-card border border-white/30',
    gradient: 'gradient-card border border-white/20',
    elevated: 'bg-white shadow-2xl border border-gray-50',
    outline: 'bg-white border-2 border-primary-200',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };

  const hoverClasses = hover ? 'hover-lift cursor-pointer' : '';

  return (
    <div
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${paddings[padding]}
        ${hoverClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
