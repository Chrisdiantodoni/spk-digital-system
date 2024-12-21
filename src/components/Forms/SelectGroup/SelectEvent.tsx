import Select from 'react-select';
import type { Props } from './type.d.ts';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import queryString from '../../../utils/queryString.ts';
import { useDebounce } from '../../../hooks/useDebounce.tsx';
import master from '../../../Services/API/master.tsx';

const SelectEvent = ({
  value,
  onChange,
  eventName,
}: Props & { eventName: string }) => {
  const [search, setSearch] = useState('');
  const [optionsUnit, setOptions] = useState([]);
  const debouncedSearchValue = useDebounce(search, 500);

  const resultQueryString = queryString.stringified({
    q: search,
  });
  const { mutate: getEvent, isPending } = useMutation({
    mutationFn: async () => {
      const response = await master.getEventList(resultQueryString);
      if (response?.meta?.code === 200) {
        setOptions(
          response?.data?.map((item: any) => ({
            value: item,
            label: item?.master_event_name,
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
    getEvent();
  }, [debouncedSearchValue]);

  return (
    <div className=" w-full">
      <Select
        id="select_event"
        isClearable
        isLoading={isPending}
        placeholder="Pilih Event"
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
          optionsUnit.find((option: any) => option.label === eventName) || value
        }
        options={optionsUnit}
        onInputChange={handleOnInput}
      />
    </div>
  );
};

export default SelectEvent;
