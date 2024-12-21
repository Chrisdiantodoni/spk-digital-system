import Select from 'react-select';
import type { Props } from '../type';
import { useEffect, useState } from 'react';
import queryString from '../../../../utils/queryString.ts';
import { useDebounce } from '../../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import master from '../../../../Services/OpenAPI/master.tsx';
import createStore from '../../../../context/index.ts';

export default function SelectProvince({ value, onChange, disabled }: Props) {
  const [search, setSearch] = useState('');
  const [optionsProvince, setOptionsProvince] = useState<any>([]);
  const debouncedSearchValue = useDebounce(search, 1000);
  const [menuOpen, setMenuOpen] = useState(false);

  const resultQueryString = queryString.stringified({
    q: search,
    limit: 999,
  });

  const { mutate: getProvince, isPending } = useMutation({
    mutationKey: ['select_province'],
    mutationFn: async () => {
      const response = await master.getProvince(resultQueryString);
      if (response?.meta.code === 200) {
        setOptionsProvince(
          response?.data?.data?.map((item: any) => ({
            label: item?.province_name,
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
      getProvince();
    }
  }, [debouncedSearchValue, menuOpen]);
  const { handleSpkFormChange } = createStore();

  const onChangeProvince = (e: any) => {
    handleSpkFormChange('provinceCustomer', true);
    onChange(e);
  };

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={true}
        isLoading={isPending}
        isDisabled={disabled}
        placeholder="Pilih provinsi"
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#3C50E0 !important' : '#E2E8F0',
            paddingTop: '0.1rem',
            paddingBottom: '0.1rem',
            borderWidth: state.isFocused ? '1px' : '1px',
          }),
        }}
        onChange={onChangeProvince}
        value={value}
        options={optionsProvince}
        onInputChange={handleOnInput}
        onMenuOpen={() => setMenuOpen(true)}
      />
    </div>
  );
}
