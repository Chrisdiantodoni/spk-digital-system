import Select from 'react-select';
import type { Props } from '../type';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import queryString from '../../../../utils/queryString.ts';
import { useDebounce } from '../../../../hooks/useDebounce.tsx';
import master from '../../../../Services/API/master.tsx';
// import unitService from '../../../services/unit.tsx';

const SelectMotor = ({
  value,
  onChange,
  motor_id,
  location,
}: Props & { location: any }) => {
  const [search, setSearch] = useState('');
  const [optionsUnit, setOptions] = useState([]);
  const debouncedSearchValue = useDebounce(search, 500);
  const [menuOpen, setMenuOpen] = useState(false);
  const resultQueryString = queryString.stringified({
    q: search,
    limit: 99,
    location:
      location &&
      (location?.type === 'mds'
        ? location?.value?.dealer_id
        : location?.type === 'neq'
        ? location?.value?.dealer_neq_id
        : ''),
  });

  const { mutate: getMotor, isPending } = useMutation({
    mutationKey: ['select_motor'],
    mutationFn: async () => {
      const response = await master.getMotorcycle(resultQueryString);
      if (response?.meta?.code === 200) {
        setOptions(
          response?.data?.map((item: any) => ({
            value: item,
            label: item?.motor_name,
          })),
        );
        return response;
      }
    },
  });

  const { mutate: getMotorByLocation, isPending: isPendingLocationMotor } =
    useMutation({
      mutationKey: ['select_motor'],
      mutationFn: async () => {
        const response = await master.getMotorcycle(resultQueryString);
        if (response?.meta?.code === 200) {
          const availableMotorcycle = response?.data?.filter?.(
            (filter: any) => filter?.motor_pricelist?.length != 0,
          );
          const availablePriceList = availableMotorcycle?.map((item: any) => {
            if (item?.motor_pricelist?.off_the_road !== 0) {
              return item;
            }
          });
          setOptions(
            availablePriceList?.map((item: any) => ({
              value: item,
              label: item?.motor_name,
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
    if (location || menuOpen) {
      getMotorByLocation();
    } else if (menuOpen || motor_id) {
      getMotor();
    }
  }, [debouncedSearchValue, menuOpen, location]);

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable
        isLoading={isPending || isPendingLocationMotor}
        placeholder="Pilih Tipe Motor"
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
          optionsUnit.find((find: any) => find?.value?.motor_id === motor_id) ||
          value
        }
        options={optionsUnit}
        onInputChange={handleOnInput}
        onMenuOpen={() => setMenuOpen(true)}
      />
    </div>
  );
};

export default SelectMotor;
