import Select from 'react-select';
import type { Props } from '../type';
import { useEffect, useState } from 'react';
import queryString from '../../../../utils/queryString.ts';
import { useDebounce } from '../../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import master from '../../../../Services/API/master.tsx';

export default function SelectSelectedDealer({
  value,
  onChange,
  disabled,
}: Props) {
  const [search, setSearch] = useState('');
  const [optionsSelectedDealer, setOptionsSelectedDealer] = useState<any>([]);
  const debouncedSearchValue = useDebounce(search, 1000);
  // const [menuOpen, setMenuOpen] = useState(false);

  const resultQueryString = queryString.stringified({
    q: search,
    limit: 99,
  });

  const { mutate: getResidence, isPending } = useMutation({
    mutationKey: ['select_residence'],
    mutationFn: async () => {
      const response = await master.getListDealerSelected(resultQueryString);
      if (response?.meta.code === 200) {
        setOptionsSelectedDealer(
          response?.data?.map((item: any) => ({
            label: item?.dealer?.dealer_name,
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
    getResidence();
  }, [debouncedSearchValue]);

  return (
    <div className=" w-full">
      <Select
        isLoading={isPending}
        isDisabled={disabled}
        placeholder="Pilih Dealer"
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#3C50E0 !important' : '#E2E8F0',
            paddingTop: '0.1rem',
            paddingBottom: '0.1rem',
            borderWidth: state.isFocused ? '1px' : '1px',
            fontSize: 14,
          }),
        }}
        onChange={onChange}
        value={value}
        options={optionsSelectedDealer}
        onInputChange={handleOnInput}
      />
    </div>
  );
}
