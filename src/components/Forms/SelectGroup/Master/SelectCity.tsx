import Select from 'react-select';
import type { Props } from '../type';
import { useEffect, useState } from 'react';
import queryString from '../../../../utils/queryString.ts';
import { useDebounce } from '../../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import master from '../../../../Services/OpenAPI/master.tsx';
import createStore from '../../../../context/index.ts';

export default function SelectCity({
  value,
  onChange,
  province_id,
  disabled,
  city,
}: Props & { province_id: any; disabled: boolean; city?: any }) {
  const [search, setSearch] = useState('');
  const [optionsCity, setOptionsCity] = useState<any>([]);
  const debouncedSearchValue = useDebounce(search, 1000);

  const resultQueryString = queryString.stringified({
    q: search,
    province_id: province_id,
    limit: 99,
  });

  const { mutate: getCity, isPending } = useMutation({
    mutationKey: ['select_city'],
    mutationFn: async () => {
      const response = await master.getCity(resultQueryString);
      if (response?.meta.code === 200) {
        setOptionsCity(
          response?.data?.data?.map((item: any) => ({
            label: item?.city_name,
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
    if (province_id || city) {
      getCity();
    }
  }, [debouncedSearchValue, province_id]);

  const { handleSpkFormChange } = createStore();

  const onChangeCity = (e: any) => {
    handleSpkFormChange('cityCustomer', true);
    onChange(e);
  };

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={true}
        isLoading={isPending}
        isDisabled={disabled}
        placeholder="Pilih kabupaten"
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#3C50E0 !important' : '#E2E8F0',
            paddingTop: '0.1rem',
            paddingBottom: '0.1rem',
            borderWidth: state.isFocused ? '1px' : '1px',
          }),
        }}
        onChange={onChangeCity}
        value={value}
        options={optionsCity}
        onInputChange={handleOnInput}
      />
    </div>
  );
}
