import Select from 'react-select';
import type { Props } from '../type';
import { useEffect, useState } from 'react';
import queryString from '../../../../utils/queryString.ts';
import { useDebounce } from '../../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import master from '../../../../Services/API/master.tsx';

export default function SelectLocation({
  value,
  onChange,
  disabled,
  location_id,
  is_clearable = true,
}: Props & { disabled?: boolean; location_id?: any; is_clearable?: boolean }) {
  const [search, setSearch] = useState('');
  const [optionsLocation, setOptionsLocation] = useState<any>([]);
  const debouncedSearchValue = useDebounce(search, 1000);
  const [menuOpened, setMenuOpened] = useState(false); // Track if the menu is opened

  const resultQueryString = queryString.stringified({
    q: search,
    spk_location: true,
    limit: 99,
  });

  const { mutate: getLocationCurrent, isPending } = useMutation({
    mutationKey: ['select_location'],
    mutationFn: async () => {
      const response = await master.getLocationCurrent(resultQueryString);
      if (response?.meta.code === 200) {
        setOptionsLocation([
          {
            label: response?.data?.dealer?.dealer?.dealer_name,
            value: response?.data?.dealer?.dealer_id,
            type: 'dealer',
          },
          ...(response?.data?.dealer_neq || []).map((item: any) => ({
            label: item?.dealer_neq_name,
            value: item,
            type: 'neq',
          })),
        ]);
      } else {
        return [];
      }
    },
  });

  const handleOnInput = (e: any) => {
    setSearch(e);
  };

  useEffect(() => {
    if (menuOpened || location_id) {
      getLocationCurrent();
    }
  }, [menuOpened, debouncedSearchValue]);

  const handleMenuOpen = () => {
    setMenuOpened(true);
  };

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={is_clearable}
        isDisabled={disabled}
        isLoading={isPending}
        placeholder="Pilih lokasi"
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
        options={optionsLocation}
        onInputChange={handleOnInput}
        onMenuOpen={handleMenuOpen}
      />
    </div>
  );
}
