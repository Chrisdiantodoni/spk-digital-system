import Select from 'react-select';
import type { Props } from './type.d.ts';
import { useEffect, useState } from 'react';
import queryString from '../../../utils/queryString.ts';
import { useDebounce } from '../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import repair from '../../../Services/API/repair.tsx';
import eventReturn from '../../../Services/API/eventReturn.tsx';
import neqReturn from '../../../Services/API/neqReturn.tsx';

export default function SelectUnitWithStatus({
  value,
  onChange,
  status,
  event_id,
  neq_id,
}: Props & { event_id?: any; neq_id?: any }) {
  const [search, setSearch] = useState('');
  const [optionsUnit, setOptionsUnit] = useState([]);
  const debouncedSearchValue = useDebounce(search, 1000);

  let resultQueryString = queryString.stringified({
    q: search,
    limit: 99,
  });

  const handleUnitAPI = () => {
    switch (status) {
      case 'repair':
        return repair.getRepairReturnUnitList(resultQueryString);
      case 'return_event':
        return eventReturn.getEventReturnUnitList(event_id);
      case 'return_neq':
        return neqReturn.getNeqReturnUnitList(neq_id);
      default:
        break;
    }
  };

  const { mutate: getUnit, isPending } = useMutation({
    mutationFn: async () => {
      const response = await handleUnitAPI();
      if (response?.meta?.code === 200) {
        setOptionsUnit(
          response?.data.map((unit: any) => ({
            label: `${unit.unit.unit_frame} (${unit.unit.motor.motor_name})`,
            value: unit,
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
    if (status) {
      getUnit();
    }
  }, [debouncedSearchValue, event_id, neq_id]);

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={true}
        isLoading={isPending}
        placeholder={'Pilih No. Rangka'}
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
        value={status ? value : null}
        options={optionsUnit}
        onInputChange={handleOnInput}
      />
    </div>
  );
}
