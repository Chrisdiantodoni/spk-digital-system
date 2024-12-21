import Container from '../../../components/Container';
import Button from '../../../components/Forms/Button/Button';
import DatePicker from '../../../components/Forms/DatePicker/DatePicker';
import SelectGroup from '../../../components/Forms/SelectGroup/SelectGroup';
import Pagination from '../../../components/Tables/Pagination';
import { useEffect, useState } from 'react';
import { PageSize } from '../../../types/dropdown';
import Table from '../../../components/Tables/Table';
import Search from '../../../components/Input/Search';
import { useQuery } from '@tanstack/react-query';
import queryString from '../../../utils/queryString';
import dayjs from 'dayjs';
import { statusIndent } from '../../../utils/statusUtils';
import { useDebounce } from '../../../hooks/useDebounce';
import { dayJsFormatDate } from '../../../utils/dayjs';
import createStore from '../../../context';
import indent from '../../../Services/API/transaction/indent';
import { formatRupiah } from '../../../utils/formatter';

export default function IndentInstance() {
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const { setTitle } = createStore();
  useEffect(() => {
    setTitle('LIST INDENT INSTANSI');
  }, []);

  const [selectedPageSize, setSelectedPageSize] = useState<string>('10');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const debouncedSearchValue = useDebounce(search, 500);

  const now = dayjs();
  const oneMonthBefore = now.subtract(1, 'month');

  const [selectedDates, setSelectedDates] = useState<{
    startDate: string | Date;
    endDate: string | Date;
  }>({
    startDate: oneMonthBefore.toISOString(),
    endDate: now.toISOString(),
  });

  const resultQueryString = queryString.stringified({
    q: search,
    indent_instansi_status: selectedStatus,
    start_date: dayjs(selectedDates?.startDate).format('YYYY-MM-DD'),
    end_date: dayjs(selectedDates?.endDate).format('YYYY-MM-DD'),
    page: paging.currentPage,
    limit: selectedPageSize,
  });

  const { data, isFetching, refetch, isSuccess, isRefetching } = useQuery({
    queryKey: ['list_indent'],
    queryFn: async () => {
      const response = await indent.getListIndentInstance(resultQueryString);
      return response;
    },
  });

  const handlePage = async (newPage: any) => {
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: newPage,
    }));
    await refetch();
  };

  const handleStartDate = async (startDate: string) => {
    setSelectedDates((prevState) => ({
      ...prevState,
      startDate,
    }));
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleEndDate = async (endDate: string) => {
    setSelectedDates((prevState) => ({
      ...prevState,
      endDate,
    }));
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleSelectedStatus = async (status: string) => {
    setSelectedStatus(status);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  useEffect(() => {
    setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    refetch();
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (isSuccess || isRefetching) {
      setPaging((state: any) => ({
        ...state,
        totalPage: data?.data?.last_page,
        currentPage: data?.data?.current_page,
      }));
    }
  }, [isSuccess, isRefetching]);

  return (
    <Container>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-6 lg:col-span-4">
              <DatePicker
                label="Tanggal Awal"
                value={selectedDates?.startDate}
                onChange={handleStartDate}
              />
            </div>
            <div className="col-span-6 lg:col-span-4">
              <DatePicker
                label="Tanggal Akhir"
                value={selectedDates?.endDate}
                onChange={handleEndDate}
              />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <SelectGroup
                label="Status"
                className="text-secondary-color"
                items={statusLabel}
                onChange={(status) => handleSelectedStatus(status)}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:flex">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-4 2xl:col-span-2">
              <Button
                isButton={false}
                label="INDENT"
                className={`btn-add min-w-50`}
                to={`/transaction/indent-instance/form`}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 col-span-12 lg:col-span-6 mb-5 lg:mb-0">
          <span>Show</span>
          <div className="min-w-20">
            <SelectGroup
              className="text-secondary-color"
              items={PageSize}
              onChange={(selectedOption: string) =>
                setSelectedPageSize(selectedOption)
              }
            />
          </div>
          <span>entries</span>
        </div>
        <div className="flex items-center col-span-12 lg:col-span-6 mb-5 lg:mb-0">
          <Search value={search} onChange={(search) => setSearch(search)} />
        </div>
        <div className="col-span-12">
          <Table
            isLoading={isFetching}
            headers={header}
            data={data?.data?.data?.map((item: any, index: number) => ({
              ...item,
              no:
                (paging.currentPage - 1) * parseInt(selectedPageSize) +
                index +
                1,
              indent_date: (
                <span>{dayJsFormatDate(item?.indent_instansi_date)}</span>
              ),
              po_date: (
                <span>{dayJsFormatDate(item?.indent_instansi_po_date)}</span>
              ),
              amount_total: (
                <span>{formatRupiah(item?.indent_instansi_nominal)}</span>
              ),
              indent_status: (
                <span>{statusIndent(item?.indent_instansi_status)}</span>
              ),
              action: [
                <Button
                  isButton={false}
                  label="DETAIL"
                  to={`/transaction/indent-instance/${item.indent_instansi_id}`}
                  className={'btn-detail'}
                />,
              ],
            }))}
          />
        </div>
        <div className="col-span-12">
          <Pagination
            totalItems={selectedPageSize}
            totalData={data?.data?.total}
            currentPage={paging.currentPage}
            totalPage={paging.totalPage}
            handlePage={handlePage}
          />
        </div>
      </div>
    </Container>
  );
}

const header = [
  {
    title: 'NO.',
    key: 'no',
  },
  {
    title: 'TANGGAL INDENT',
    key: 'indent_date',
  },
  {
    title: 'TANGGAL PO',
    key: 'po_date',
  },
  {
    title: 'NOMOR PO',
    key: 'indent_instansi_number_po',
  },
  {
    title: 'NAMA INSTANSI',
    key: 'indent_instansi_name',
  },
  {
    title: 'NOMINAL',
    key: 'amount_total',
  },
  {
    title: 'STATUS PEMBAYARAN',
    key: 'indent_status',
  },
  {
    title: 'AKSI',
    key: 'action',
  },
];

const statusLabel = [
  {
    label: 'SEMUA',
    value: '',
  },
  {
    label: 'KASIR CHECK',
    value: 'kasir_check',
  },
  {
    label: 'PAID',
    value: 'finance_check',
  },
  {
    label: 'UNPAID',
    value: 'unpaid',
  },
  {
    label: 'SPK',
    value: 'spk',
  },
  {
    label: 'CANCEL',
    value: 'cancel',
  },
];
