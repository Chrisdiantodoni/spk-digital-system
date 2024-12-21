import Select from 'react-select';
import type { Props } from './type.d.ts';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import queryString from '../../../utils/queryString.ts';
import { useDebounce } from '../../../hooks/useDebounce.tsx';
import master from '../../../Services/API/master.tsx';
import createStore from '../../../context/index.ts';

const SelectNeq = ({
  value,
  onChange,
  neq_id,
  dealer_id,
}: Props & { neq_id?: string; dealer_id?: string }) => {
  const [search, setSearch] = useState('');
  const [optionsUnit, setOptions] = useState([]);
  const debouncedSearchValue = useDebounce(search, 500);
  const [menuOpen, setMenuOpen] = useState(false);

  const dealer = createStore((state) => state.account_dealer);
  // const dealer: any | null = JSON.parse(
  //   localStorage.getItem('account_dealer') || '{}',
  // );

  const resultQueryString = queryString.stringified({
    q: search,
    paginate: false,
    limit: 99,
    selected_dealer: dealer_id ? dealer_id : dealer?.dealer_id,
  });
  const { mutate: getNeq, isPending } = useMutation({
    mutationFn: async () => {
      const response = await master.getDealerNeq(resultQueryString);
      if (response?.meta?.code === 200) {
        setOptions(
          response?.data?.map((item: any) => ({
            value: item,
            label: item?.dealer_neq_name,
          })),
        );
        return response;
      }
    },
  });

  const handleOnInput = (e: any) => {
    setSearch(e);
  };

  useEffect(() => {
    if (menuOpen || dealer_id) {
      getNeq();
    }
  }, [debouncedSearchValue, dealer_id, menuOpen]);

  return (
    <div className=" w-full">
      <Select
        id="select_event"
        isClearable
        isLoading={isPending}
        placeholder="Pilih NEQ"
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
          optionsUnit.find(
            (option: any) => option.value?.dealer_neq_id === neq_id,
          ) || value
        }
        options={optionsUnit}
        onInputChange={handleOnInput}
        onMenuOpen={() => setMenuOpen(true)}
      />
    </div>
  );
};

export default SelectNeq;
