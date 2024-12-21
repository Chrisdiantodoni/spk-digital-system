// import flatpickr from 'flatpickr';
// import { useEffect, useRef } from 'react'; // Import useRef for accessing DOM element
// import { Calendar3 } from 'react-bootstrap-icons';
// import { DatePicker as DatePickerComponent } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker as DatePickerAntd } from 'antd';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
type DatePickerProps = {
  label?: string;
  value: any;
  onChange: any;
  divClassName?: string;
  frontIcon?: boolean;
  backIcon?: boolean;
  isDisabled?: boolean;
};

const DatePicker = ({
  label,
  value,
  onChange,
  divClassName,
  isDisabled,
  frontIcon = true,
  backIcon = false,
}: DatePickerProps) => {
  // const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input element
  // useEffect(() => {
  //   if (inputRef.current) {
  //     flatpickr(inputRef.current, {
  //       mode: 'single',
  //       static: true,
  //       monthSelectorType: 'static',
  //       dateFormat: 'M j, Y',

  //       prevArrow:
  //         '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
  //       nextArrow:
  //         '<svg className="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
  //       onChange: (selectedDates) => {
  //         if (selectedDates.length > 1) {
  //           onChange(selectedDates[0]);
  //         } else {
  //           onChange(selectedDates);
  //         }
  //       },
  //     });
  //   }
  // }, [inputRef]);
  // const defaultValue = value instanceof Date ? value.toISOString() : value;
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="relative ">
        {label && (
          <label
            htmlFor={label}
            className={` mb-3.5 block text-base font-semibold text-black dark:text-white  ${divClassName}`}
          >
            {label}
          </label>
        )}
        <div className="relative w-full">
          {/* <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            {frontIcon && <Calendar3 color="#000000" size={20} />}
          </div>

          <input
            ref={inputRef}
            defaultValue={defaultValue}
            id={label}
            type="text"
            className="w-full rounded-md border px-2 border-stroke bg-transparent pl-10 py-2 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            placeholder="mm/dd/yyyy"
            disabled={isDisabled}
          /> */}
          <DatePickerAntd
            className="w-full rounded-md border border-stroke bg-transparent text-lg py-2 font-normal outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            defaultValue={dayjs(value)}
            value={value && dayjs(value)}
            format={'MMM DD, YYYY'}
            allowClear={false}
            onChange={(value: any) => onChange(value)}
            disabled={isDisabled}
          />
          {/* <DatePickerComponent
            sx={{
              width: '100%',
              height: '1%',
              borderRadius: 8,
            }}
            ref={inputRef}
            value={dayjs(value)}
            format="MMM DD, YYYY"
            onChange={(value) => onChange(value)}
            disabled={isDisabled}
          /> */}
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default DatePicker;
