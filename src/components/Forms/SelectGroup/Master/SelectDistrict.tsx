import Select from 'react-select';
import type { Props } from '../type';
import { useEffect, useState } from 'react';
import queryString from '../../../../utils/queryString.ts';
import { useDebounce } from '../../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import master from '../../../../Services/OpenAPI/master.tsx';

export default function SelectDistrict({
  value,
  onChange,
  city_id,
  disabled,
}: Props & { city_id: any; disabled?: boolean }) {
  const [search, setSearch] = useState('');
  const [optionsDistrict, setOptionsDistrict] = useState<any>([]);
  const debouncedSearchValue = useDebounce(search, 1000);

  const resultQueryString = queryString.stringified({
    q: search,
    city_id: city_id,
    limit: 999,
  });

  const { mutate: getDistrict, isPending } = useMutation({
    mutationKey: ['select_district'],
    mutationFn: async () => {
      const response = await master.getDistrict(resultQueryString);
      if (response?.meta.code === 200) {
        setOptionsDistrict(
          response?.data?.data?.map((item: any) => ({
            label: item?.district_name,
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
    if (city_id) {
      getDistrict();
    }
  }, [debouncedSearchValue, city_id]);

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={true}
        isLoading={isPending}
        isDisabled={disabled}
        placeholder="Pilih kecamatan"
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
          optionsDistrict.find((find: any) => find?.value === city_id) || value
        }
        options={optionsDistrict}
        onInputChange={handleOnInput}
      />
    </div>
  );
}
