import Select from 'react-select';
import type { Props } from '../type';
import { useEffect, useState } from 'react';
import queryString from '../../../../utils/queryString.ts';
import { useDebounce } from '../../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import master from '../../../../Services/OpenAPI/master.tsx';

export default function SelectIncome({
  value,
  onChange,
  disabled,
}: Props & { disabled?: boolean }) {
  const [search, setSearch] = useState('');
  const [incomeOption, setIncomeOption] = useState<any>([]);
  const debouncedSearchValue = useDebounce(search, 1000);

  const resultQueryString = queryString.stringified({
    q: search,
    limit: 99,
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const { mutate: getIncome, isPending } = useMutation({
    mutationKey: ['select_income'],
    mutationFn: async () => {
      const response = await master.getIncome(resultQueryString);
      if (response?.meta.code === 200) {
        setIncomeOption(
          response?.data?.data?.map((item: any) => ({
            label: item?.income_amount,
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
      getIncome();
    }
  }, [debouncedSearchValue, menuOpen]);

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={true}
        isLoading={isPending}
        isDisabled={disabled}
        placeholder="Pilih pendapatan"
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
        options={incomeOption}
        onInputChange={handleOnInput}
        onMenuOpen={() => setMenuOpen(true)}
      />
    </div>
  );
}
