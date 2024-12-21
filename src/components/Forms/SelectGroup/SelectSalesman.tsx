import Select from 'react-select';
import type { Props } from './type.d.ts';
import { useEffect, useState } from 'react';
import queryString from '../../../utils/queryString.ts';
import { useDebounce } from '../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import master from '../../../Services/OpenAPI/master.tsx';

export default function SelectSalesman({
  value,
  onChange,
  sales_id,
  isDisabled,
}: Props & { isDisabled?: boolean }) {
  const [search, setSearch] = useState('');
  const [optionsUnit, setOptionsUnit] = useState([]);
  const debouncedSearchValue = useDebounce(search, 1000);
  const [menuOpen, setMenuOpen] = useState(false);

  const resultQueryString = queryString.stringified({
    q: search,
    limit: 99,
  });

  const { mutate: getSales, isPending } = useMutation({
    mutationFn: async () => {
      const response = await master.getSalesman(resultQueryString);
      if (response?.meta.code === 200) {
        setOptionsUnit(
          response?.data.data.map((item: any) => ({
            label: item?.salesman_name,
            value: item,
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
    if (menuOpen || sales_id) {
      getSales();
    }
  }, [debouncedSearchValue, menuOpen]);

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={true}
        isLoading={isPending}
        placeholder="Sales"
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
          optionsUnit?.find(
            (find: any) => find?.value?.salesman_id === sales_id,
          ) || value
        }
        options={optionsUnit}
        onInputChange={handleOnInput}
        isDisabled={isDisabled}
        onMenuOpen={() => setMenuOpen(true)}
      />
    </div>
  );
}
