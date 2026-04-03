const LuxuryCard = ({ 
  children, 
  variant = 'default', 
  hover = true, 
  padding = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'rounded-3xl overflow-hidden transition-all duration-500';
  
  const variants = {
    default: 'bg-white shadow-luxury border border-royal-border',
    glass: 'glass-card-luxury border border-white/30',
    gradient: 'gradient-luxury text-white',
    elevated: 'bg-white shadow-luxury-xl border border-royal-border',
    outline: 'bg-white border-2 border-royal-primary',
    dark: 'bg-royal-primary text-white',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };

  const hoverClasses = hover ? 'hover-lift-luxury cursor-pointer' : '';

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

export default LuxuryCard;
