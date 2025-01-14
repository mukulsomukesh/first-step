import React from 'react';

const InputCommon = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  name, 
  error 
}) => {
  return (
    <div className="">
      {label && <label className='block text-[16px] font-semibold '   htmlFor={name}>{label}</label>}
      <input 
        id={name} 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        name={name} 
        className={` p-3 w-full rounded-md text-[16px] border-2 bg-primary-50 border-primary-950  ${error ? 'text-danger-600 border-danger-600 bg-danger-50' : ''}`} 
      />
      {error && <span className="error-message block text-[14px] font-semibold text-danger-600 ">{error}</span>}
    </div>
  );
};

export default InputCommon;
