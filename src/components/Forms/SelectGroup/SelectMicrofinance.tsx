import Select from 'react-select';
import type { Props } from './type';
import { useEffect, useState } from 'react';
import queryString from '../../../utils/queryString.ts';
import { useDebounce } from '../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import master from '../../../Services/OpenAPI/master.tsx';

export default function SelectMicrofinance({
  value,
  onChange,
  microfinance_id,
  isDisabled,
}: Props & { microfinance_id?: any; isDisabled?: boolean }) {
  const [search, setSearch] = useState('');
  const [optionsUnit, setOptionsUnit] = useState([]);
  const debouncedSearchValue = useDebounce(search, 1000);
  const [menuOpen, setMenuOpen] = useState(false);

  const resultQueryString = queryString.stringified({
    q: search,
    limit: 99,
  });

  const { mutate: getMicrofinance, isPending } = useMutation({
    mutationFn: async () => {
      const response = await master.getMicrofinance(resultQueryString);
      if (response?.meta.code === 200) {
        setOptionsUnit(
          response?.data.data.map((item: any) => ({
            label: item?.microfinance_name,
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
    if (menuOpen) {
      getMicrofinance();
    }
  }, [debouncedSearchValue, menuOpen]);

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={true}
        isLoading={isPending}
        placeholder="Microfinance"
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
            (find: any) => find?.value?.microfinance_id === microfinance_id,
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
