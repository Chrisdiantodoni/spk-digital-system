import Select from 'react-select';
import type { Props } from './type.d.ts';
import { useEffect, useState } from 'react';
import queryString from '../../../utils/queryString.ts';
import { useDebounce } from '../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import unit from '../../../Services/API/unit.tsx';

export default function SelectUnit({ value, onChange, motor_id }: Props) {
  const [search, setSearch] = useState('');
  const [optionsUnit, setOptionsUnit] = useState([]);
  const debouncedSearchValue = useDebounce(search, 1000);

  const resultQueryString = queryString.stringified({
    unit_status: 'on_hand',
    unit_frame: search,
    motor_id: motor_id,
    limit: 99,
  });

  const { mutate: getUnit, isPending } = useMutation({
    mutationFn: async () => {
      const response = await unit.getStockUnit(resultQueryString);
      if (response?.meta.code === 200) {
        setOptionsUnit(
          response?.data.data.map((unit: any) => ({
            label: unit.unit_frame,
            value: unit.unit_frame,
          })),
        );
      } else {
        return [];
      }
    },
  });

  const handleOnInput = (e: any) => {
    setSearch(e);
  };

  useEffect(() => {
    if (motor_id) {
      getUnit();
    } else {
      setOptionsUnit([]);
    }
  }, [debouncedSearchValue, motor_id]);

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={true}
        isLoading={isPending}
        isDisabled={optionsUnit?.length === 0 ? true : false}
        placeholder={
          optionsUnit?.length === 0 ? 'No Rangka tidak tersedia' : 'Unit'
        }
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#3C50E0 !important' : '#E2E8F0',
            paddingTop: '0.1rem',
            paddingBottom: '0.1rem',
            borderWidth: state.isFocused ? '1px' : '1px',
          }),
        }}
        onChange={onChange}
        value={motor_id ? value : null}
        options={optionsUnit}
        onInputChange={handleOnInput}
      />
    </div>
  );
}
