import React, { ChangeEvent, MouseEvent, ReactNode } from 'react';

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
}) => {
  return (
    <div className="flex items-center w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className=""
      />
      {Icon && <span className="relative right-10">{Icon}</span>}
    </div>
  );
};

export default Input;
