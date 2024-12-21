import { Controller, ControllerProps } from 'react-hook-form';
import { inputCurrency } from './formatter';

export const ControllerInput = ({
  control,
  name = '',
  defaultValue,
  rules,
  type,
  disabled,
  maxLength,
}: Partial<ControllerProps> & { type: any; maxLength?: number }) => {
  const transformTextNumber = (value: any) => {
    return isNaN(value) ? '' : value;
  };

  const transformCurrencyNumber = (value: any) => {
    return isNaN(value) ? '' : inputCurrency(value) || '0';
  };

  return (
    <Controller
      defaultValue={defaultValue}
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <input
          maxLength={maxLength}
          disabled={disabled}
          className="text-input"
          onChange={(e) => {
            if (type === 'currency') {
              const output = parseFloat(e.target.value.replace(/\D/g, ''));
              field.onChange(isNaN(output) ? '' : output);
            } else if (type === 'text-number') {
              const output = e.target.value.replace(/\D/g, '');
              field.onChange(transformTextNumber(output));
            }
          }}
          value={
            type === 'currency'
              ? transformCurrencyNumber(field?.value)
              : transformTextNumber(field.value)
          }
        />
      )}
    />
  );
};
