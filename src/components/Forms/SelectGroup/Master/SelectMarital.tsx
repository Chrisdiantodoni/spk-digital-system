import Select from 'react-select';
import type { Props } from '../type';
import { useEffect, useState } from 'react';
import queryString from '../../../../utils/queryString.ts';
import { useDebounce } from '../../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import master from '../../../../Services/OpenAPI/master.tsx';

export default function SelectMarital({
  value,
  onChange,
  disabled,
  marital_id,
}: Props & { disabled?: boolean; marital_id?: any }) {
  const [search, setSearch] = useState('');
  const [optionsMarital, setOptionsMarital] = useState<any>([]);
  const debouncedSearchValue = useDebounce(search, 1000);
  const [menuOpen, setMenuOpen] = useState(false);

  const resultQueryString = queryString.stringified({
    q: search,
    limit: 99,
  });

  const { mutate: getMarital, isPending } = useMutation({
    mutationKey: ['select_marital'],
    mutationFn: async () => {
      const response = await master.getMaritalStatus(resultQueryString);
      if (response?.meta.code === 200) {
        setOptionsMarital(
          response?.data?.data?.map((item: any) => ({
            label: item?.marital_name,
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
    if (menuOpen || marital_id) {
      getMarital();
    }
  }, [debouncedSearchValue, menuOpen, marital_id]);

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={true}
        isLoading={isPending}
        isDisabled={disabled}
        placeholder="Pilih status pernikahan"
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
          optionsMarital.find(
            (find: any) => find?.value?.marital_id === marital_id,
          ) || value
        }
        options={optionsMarital}
        onInputChange={handleOnInput}
        onMenuOpen={() => setMenuOpen(true)}
      />
    </div>
  );
}
