type ItemProps = {
  label: string;
  value: string | null;
};

type RadioButtonProps = {
  items: ItemProps[];
  className: string;
  onChange: any;
  selectedItem: any;
  disabled?: boolean;
};

const RadioButton = ({
  items = [{ label: 'semua', value: 'semua' }],
  selectedItem,
  className,
  onChange,
  disabled,
}: RadioButtonProps) => {
  return (
    <div className={className}>
      {items.map((item: ItemProps, index) => (
        <label
          key={index}
          className="flex cursor-pointer select-none items-center px-2 text-black"
        >
          <div>
            <input
              type="radio"
              id={item.label}
              name="radioOption"
              className="sr-only "
              value={item?.value}
              checked={item?.value === selectedItem}
              onChange={() => onChange(item.value)}
              disabled={disabled}
            />
            <div
              className={`mr-4  flex h-4 w-4 items-center justify-center   rounded-full border ${
                selectedItem === item.value && 'border-[#1DC9A0]'
              }`}
            >
              <div
                className={`h-2.5 w-2.5 rounded-full text-center flex justify-center items-center bg-transparent ${
                  selectedItem === item.value && '!bg-[#1DC9A0]'
                }`}
              ></div>
            </div>
          </div>
          {item.label}
        </label>
      ))}
    </div>
  );
};

export default RadioButton;
