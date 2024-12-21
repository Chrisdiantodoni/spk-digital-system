import React, { useState } from 'react';

interface Items {
  label: string | number;
  value: string | number | null;
  disabled?: boolean;
}

type SelectProps = {
  label?: string;
  divClassName?: string;
  items: Items[] | undefined;
  onChange?: (selectedOption: string) => void;
  className?: string;
  value?: string;
};

const SelectGroup: React.FC<SelectProps> = ({
  label,
  items,
  onChange,
  className,
  divClassName,
  value,
}: SelectProps) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
  const changeTextColor = () => {
    setIsOptionSelected(true);
  };

  return (
    <div className={`${divClassName}`}>
      {label && (
        <label
          htmlFor={label}
          className="mb-3 block text-base font-medium text-black dark:text-white"
        >
          {label}
        </label>
      )}

      <div className="relative bg-transparent dark:bg-form-input cursor-pointer">
        <label htmlFor={label} className="relative w-full">
          <select
            value={selectedOption || value}
            onChange={(e) => {
              setSelectedOption(e.target.value);
              changeTextColor();
              if (onChange) {
                onChange(e.target.value);
              }
            }}
            className={`appearance-none w-full rounded-lg border border-stroke bg-transparent text-black py-2 px-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary ${className} ${
              isOptionSelected ? 'text-black dark:text-white' : ''
            }`}
          >
            {items?.map((item, index) => (
              <option
                value={item.value}
                key={index}
                disabled={item?.disabled}
                className="text-body font-medium dark:text-bodydark "
              >
                {item.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center ml-3 text-gray-700">
            <span className="absolute top-1/2 right-4 -translate-y-1/2">
              <svg
                className="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.8">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                    fill=""
                  ></path>
                </g>
              </svg>
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default SelectGroup;
