import Select from 'react-select';
import type { Props } from '../type';
import { useEffect, useState } from 'react';
import queryString from '../../../../utils/queryString.ts';
import { useDebounce } from '../../../../hooks/useDebounce.tsx';
import { useMutation } from '@tanstack/react-query';
import indent from '../../../../Services/API/transaction/indent.tsx';
import { SweetAlert } from '../../../../utils/Swal.ts';

export default function SelectIndent({
  value,
  onChange,
  disabled,
  indent_id,
}: Props & { disabled?: boolean; indent_id?: any }) {
  const [search, setSearch] = useState('');
  const [optionsIndent, setOptionsIndent] = useState<any>([]);
  const debouncedSearchValue = useDebounce(search, 1000);
  const [menuOpen, setMenuOpen] = useState(false);

  const resultQueryString = queryString.stringified({
    q: search,
    indent_status: 'finance_check',
    limit: 99,
  });

  const { mutate: getIndentList, isPending } = useMutation({
    mutationKey: ['select_indent'],
    mutationFn: async () => {
      const response = await indent.getIndentList(resultQueryString);
      if (response?.meta.code === 200) {
        setOptionsIndent(
          response?.data.data.map((item: any) => ({
            label: item?.indent_number,
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
    if (menuOpen || indent_id) {
      getIndentList();
    }
  }, [debouncedSearchValue, menuOpen, indent_id]);

  function onChangeIndent(event: any) {
    if (event?.value?.spk_general) {
      SweetAlert('warning', 'sudah ada SPK', 'perhatian');
      onChange('');
      return;
    }
    onChange(event);
  }

  return (
    <div className=" w-full">
      <Select
        id="select_unit"
        isClearable={true}
        isDisabled={disabled}
        isLoading={isPending}
        placeholder="Pilih Indent"
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#3C50E0 !important' : '#E2E8F0',
            paddingTop: '0.1rem',
            paddingBottom: '0.1rem',
            borderWidth: state.isFocused ? '1px' : '1px',
          }),
        }}
        onChange={onChangeIndent}
        value={
          optionsIndent.find(
            (find: any) => find?.value?.indent_id === indent_id,
          ) || value
        }
        options={optionsIndent}
        onInputChange={handleOnInput}
        onMenuOpen={() => setMenuOpen(true)}
      />
    </div>
  );
}
