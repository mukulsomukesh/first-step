import React from 'react';

const ButtonCommon = ({ 
  label = "Submit", 
  onClick, 
  isLoading = false, 
  disabled = false, 
  className = '', 
  icon, 
  variant = 'solid' // Default variant is primary
}) => {
  // Define styles for different variants
  const variants = {
    solid: 'bg-primary-400 text-white border-primary-400 hover:bg-white hover:text-primary-400',
    outline: 'hover:bg-primary-400 hover:text-white border-primary-400 bg-white text-primary-400',
    danger: 'bg-red-500 text-white border-red-500 hover:bg-white hover:text-red-500',
    success: 'bg-green-600 text-white border-green-600 hover:bg-white hover:text-green-600',
    highlight: 'bg-yellow-500 text-white border-yellow-500 hover:bg-white hover:text-yellow-500',
    
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`p-3 text-[16px] rounded-md border-2 transition-all duration-300 ease-in-out 
        ${disabled ? 'bg-gray-400 cursor-not-allowed text-white border-gray-400' : variants[variant]} 
        ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <span className="spinner-border mr-2" />
          Please Wait...
        </span>
      ) : (
        <strong className="flex items-center justify-center">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </strong>
      )}
    </button>
  );
};

export default ButtonCommon;
