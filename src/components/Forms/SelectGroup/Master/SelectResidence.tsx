import Select from 'react-select';
import type { Props } from '../type';
import { useEffect, useState } from 'react';
import queryString from '../../../../utils/queryString.ts';
import { useDebounce } from '../../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import master from '../../../../Services/OpenAPI/master.tsx';

export default function SelectResidence({ value, onChange, disabled }: Props) {
  const [search, setSearch] = useState('');
  const [optionsResidence, setOptionsResidence] = useState<any>([]);
  const debouncedSearchValue = useDebounce(search, 1000);
  const [menuOpen, setMenuOpen] = useState(false);

  const resultQueryString = queryString.stringified({
    q: search,
    limit: 99,
  });

  const { mutate: getResidence, isPending } = useMutation({
    mutationKey: ['select_residence'],
    mutationFn: async () => {
      const response = await master.getResidence(resultQueryString);
      if (response?.meta.code === 200) {
        setOptionsResidence(
          response?.data?.data?.map((item: any) => ({
            label: item?.residence_name,
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
      getResidence();
    }
  }, [debouncedSearchValue, menuOpen]);

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={true}
        isLoading={isPending}
        isDisabled={disabled}
        placeholder="Pilih status rumah"
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
        options={optionsResidence}
        onInputChange={handleOnInput}
        onMenuOpen={() => setMenuOpen(true)}
      />
    </div>
  );
}