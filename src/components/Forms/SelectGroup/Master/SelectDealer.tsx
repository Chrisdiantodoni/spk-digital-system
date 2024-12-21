import Select from 'react-select';
import type { Props } from '../type';
import { useEffect, useState } from 'react';
import queryString from '../../../../utils/queryString.ts';
import { useDebounce } from '../../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import master from '../../../../Services/OpenAPI/master.tsx';

export default function SelectDealer({
  value,
  onChange,
  disabled,
  dealer_type,
}: Props & { dealer_type: any }) {
  const [search, setSearch] = useState('');
  const [optionsDealer, setOptionsDealer] = useState<any>([]);
  const debouncedSearchValue = useDebounce(search, 1000);
  const [menuOpen, setMenuOpen] = useState(false);

  const resultQueryString = queryString.stringified({
    q: search,
    dealer_type: dealer_type,
    limit: 99,
  });

  console.log({ dealer_type });

  const { mutate: getDealer, isPending } = useMutation({
    mutationKey: ['select_dealer'],
    mutationFn: async () => {
      const response = await master.getDealerList(resultQueryString);
      if (response?.meta.code === 200) {
        setOptionsDealer(
          response?.data?.data?.map((item: any) => ({
            label: item?.dealer_name,
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
    if (menuOpen || dealer_type) {
      getDealer();
    }
  }, [debouncedSearchValue, menuOpen, dealer_type]);

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={true}
        isLoading={isPending}
        isDisabled={disabled}
        placeholder="Pilih dealer"
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
        value={value}
        options={optionsDealer}
        onInputChange={handleOnInput}
        onMenuOpen={() => setMenuOpen(true)}
      />
    </div>
  );
}
