import React from 'react';
import { Controller } from 'react-hook-form';

const CheckboxGroup = ({ name, control, options }) => {
  return (
    <div>
      {options.map((option, index) => (
        <Controller
          key={index}
          name={`${name}[${index}]`}
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <label
              htmlFor={`${name}[${index}]`}
              className="flex cursor-pointer select-none items-center"
            >
              <div className="relative">
                <input
                  {...field}
                  type="checkbox"
                  id={`${name}[${index}]`}
                  value={option.value} // Set the value attribute to the option's value
                  className="sr-only"
                />
                <div
                  className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
                    field.value
                      ? 'border-primary bg-gray dark:bg-transparent'
                      : ''
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-sm ${
                      field.value ? 'bg-primary' : ''
                    }`}
                  ></span>
                </div>
              </div>
              {option.label}
            </label>
          )}
        />
      ))}
    </div>
  );
};

export default CheckboxGroup;
