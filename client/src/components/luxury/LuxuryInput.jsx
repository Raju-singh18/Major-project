const LuxuryInput = ({
  label,
  error,
  icon,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-royal-text mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-royal-text-secondary">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-6 py-4 bg-white
            border-2 rounded-2xl
            text-royal-text placeholder-royal-text-secondary
            transition-all duration-300 outline-none
            ${icon ? 'pl-12' : ''}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
              : 'border-royal-border focus:border-royal-primary focus:ring-4 focus:ring-royal-primary/10'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-royal-text-secondary">{helperText}</p>
      )}
    </div>
  );
};

export default LuxuryInput;
