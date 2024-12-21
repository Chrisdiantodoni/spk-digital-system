import Select from 'react-select';
import type { Props } from '../type';
import { useEffect, useState } from 'react';
import queryString from '../../../../utils/queryString.ts';
import { useDebounce } from '../../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import master from '../../../../Services/OpenAPI/master.tsx';

export default function SelectSubdistrict({
  value,
  onChange,
  district_id,
  disabled,
}: Props & { district_id: any }) {
  const [search, setSearch] = useState('');
  const [optionsSubDistrict, setOptionsSubDistrict] = useState<any>([]);
  const debouncedSearchValue = useDebounce(search, 1000);

  const resultQueryString = queryString.stringified({
    q: search,
    district_id: district_id,
    limit: 999,
  });

  const { mutate: getSubdistrict, isPending } = useMutation({
    mutationKey: ['select_sub_district'],
    mutationFn: async () => {
      const response = await master.getSubDistrict(resultQueryString);
      if (response?.meta.code === 200) {
        setOptionsSubDistrict(
          response?.data?.data?.map((item: any) => ({
            label: item?.sub_district_name,
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
    if (district_id) {
      getSubdistrict();
    }
  }, [debouncedSearchValue, district_id]);

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={true}
        isLoading={isPending}
        isDisabled={disabled}
        placeholder="Pilih kelurahan"
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
          optionsSubDistrict.find((find: any) => find?.value === district_id) ||
          value
        }
        options={optionsSubDistrict}
        onInputChange={handleOnInput}
      />
    </div>
  );
}
