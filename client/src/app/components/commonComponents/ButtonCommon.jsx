import React from 'react';

const ButtonCommon = ({ 
  label = "Submit", 
  onClick, 
  isLoading = false, 
  disabled = false, 
  className = '', 
  icon 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`p-3 text-[16px] rounded-md text-primary-100 bg-primary-950 
        border-2 border-primary-950 hover:bg-primary-100 hover:text-primary-950 transition-all duration-300 ease-in-out 
        ${disabled ? 'bg-gray-400 cursor-not-allowed' : ''} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <span className="spinner-border mr-2" />
          Loading...
        </span>
      ) : (
        <strong className="mx-auto">
          {icon && <span className="mr-2">{icon}</span>}
          {label}
        </strong>
      )}
    </button>
  );
};

export default ButtonCommon;
