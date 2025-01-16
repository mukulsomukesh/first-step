import React from 'react';

const SelectCommon = ({ 
  label, 
  value, 
  onChange, 
  name, 
  options, 
  error 
}) => {
  return (
    <div className="">
      {label && <label className='block text-[16px] font-semibold ' htmlFor={name}>{label}</label>}
      <select 
        id={name} 
        value={value} 
        onChange={onChange} 
        name={name} 
        className={`p-3 h-[53px] w-full rounded-md text-[16px] border-2 bg-primary-50 border-primary-950 ${error ? 'text-danger-600 border-danger-600 bg-danger-50' : ''}`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message block text-[14px] font-semibold text-danger-600">{error}</span>}
    </div>
  );
};

export default SelectCommon;
