import Select from 'react-select';
import type { Props } from '../type';
import { useEffect, useState } from 'react';
import queryString from '../../../../utils/queryString.ts';
import { useDebounce } from '../../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import master from '../../../../Services/OpenAPI/master.tsx';

export default function SelectMainDealer({
  value,
  onChange,
  disabled,
}: Props & { disabled?: boolean }) {
  const [search, setSearch] = useState('');
  const [optionsMainDealer, setOptionsMainDealer] = useState<any>([]);
  const debouncedSearchValue = useDebounce(search, 1000);
  const [selectOpen, setSelectOpen] = useState(false);

  const resultQueryString = queryString.stringified({
    q: search,
    limit: 99,
  });

  const { mutate: getMainDealer, isPending } = useMutation({
    mutationKey: ['select_broker'],
    mutationFn: async () => {
      const response = await master.getMainDealer(resultQueryString);
      if (response?.meta.code === 200) {
        setOptionsMainDealer(
          response?.data?.data?.map((item: any) => ({
            label: item?.main_dealer_name,
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
    if (selectOpen) {
      getMainDealer();
    }
  }, [debouncedSearchValue, selectOpen]);

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={true}
        isLoading={isPending}
        isDisabled={disabled}
        placeholder="Pilih "
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
        options={optionsMainDealer}
        onInputChange={handleOnInput}
        onMenuOpen={() => setSelectOpen(true)}
      />
    </div>
  );
}
