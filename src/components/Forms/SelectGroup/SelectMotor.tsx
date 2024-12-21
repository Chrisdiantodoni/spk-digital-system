import Select from 'react-select';
import type { Props } from './type.d.ts';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import queryString from '../../../utils/queryString.ts';
import { useDebounce } from '../../../hooks/useDebounce.tsx';
import master from '../../../Services/API/master.tsx';
// import unitService from '../../../services/unit.tsx';

const SelectMotor = ({
  value,
  onChange,
  motor_id,
  list = false,
}: Props & { list?: boolean }) => {
  const [search, setSearch] = useState('');
  const [optionsUnit, setOptions] = useState([]);
  const debouncedSearchValue = useDebounce(search, 500);
  const [menuOpen, setMenuOpen] = useState(false);

  const resultQueryString = queryString.stringified({
    q: search,
    limit: 99,
  });
  const { mutate: getMotor, isPending } = useMutation({
    mutationFn: async () => {
      const response = await master.getMotorcycle(resultQueryString);
      if (response?.meta?.code === 200) {
        setOptions(
          list
            ? [
                {
                  label: 'SEMUA',
                  value: '',
                },
                ...response?.data?.map((item: any) => ({
                  value: item?.motor_id,
                  label: item?.motor_name,
                })),
              ]
            : response?.data?.map((item: any) => ({
                value: item?.motor_id,
                label: item?.motor_name,
              })),
        );
        return response;
      }
    },
  });

  const handleOnInput = (e: any) => {
    setSearch(e);
  };

  useEffect(() => {
    if (menuOpen || motor_id) {
      getMotor();
    }
  }, [debouncedSearchValue, menuOpen]);

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable
        isLoading={isPending}
        placeholder="Pilih Tipe Motor"
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
        value={
          optionsUnit.find((find: any) => find?.value === motor_id) || value
        }
        options={optionsUnit}
        onInputChange={handleOnInput}
        onMenuOpen={() => setMenuOpen(true)}
      />
    </div>
  );
};

export default SelectMotor;
