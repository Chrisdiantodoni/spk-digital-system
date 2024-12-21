import Container from '../../components/Container';
import Button from '../../components/Forms/Button/Button';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import SelectGroup from '../../components/Forms/SelectGroup/SelectGroup';
import Pagination from '../../components/Tables/Pagination';
import { useEffect, useState } from 'react';
import { PageSize } from '../../types/dropdown';

import Table from '../../components/Tables/Table';
import Search from '../../components/Input/Search';
import { useQuery } from '@tanstack/react-query';
import queryString from '../../utils/queryString';
import dayjs from 'dayjs';
import { statusRepair } from '../../utils/statusUtils';
import { useDebounce } from '../../hooks/useDebounce';
import repair from '../../Services/API/repair';
import { dayJsFormatDate } from '../../utils/dayjs';
import createStore from '../../context';

export default function UnitRepair() {
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const { setTitle } = createStore();
  useEffect(() => {
    setTitle('REPAIR UNIT');
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
    repair_status: selectedStatus,
    start_date: dayjs(selectedDates?.startDate).format('YYYY-MM-DD'),
    end_date: dayjs(selectedDates?.endDate).format('YYYY-MM-DD'),
    limit: selectedPageSize,
    page: paging.currentPage,
  });

  const { data, isFetching, refetch, isSuccess, isRefetching } = useQuery({
    queryKey: ['list_repair'],
    queryFn: async () => {
      const response = await repair.getRepairUnit(resultQueryString);
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
        <div className="col-span-12">
          <div className="grid grid-cols-1 lg:flex gap-5">
            <Button
              label="ADD NEW REPAIR"
              className={`btn-add w-auto`}
              isButton={false}
              to={`/units/unit-repair/unit-repair-form`}
            />
            <Button
              label="LIST SURAT JALAN"
              isButton={false}
              className={`bg-primary w-auto py-3 px-3 rounded-md  text-white items-center flex gap-x-2 hover:bg-blue-500`}
              to={`/units/delivery?type=repair`}
            />
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
              created_at: <span>{dayJsFormatDate(item?.created_at)}</span>,
              repair_status: <span>{statusRepair(item?.repair_status)}</span>,
              action: [
                <Button
                  isButton={false}
                  label="DETAIL"
                  to={`/units/unit-repair/${item.repair_id}`}
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
    title: 'No',
    key: 'no',
  },
  {
    title: 'TANGGAL',
    key: 'created_at',
  },
  {
    title: 'NOMOR REPAIR',
    key: 'repair_number',
  },
  {
    title: 'GUDANG',
    key: 'main_dealer_name',
  },
  {
    title: 'JUMLAH UNIT',
    key: 'repair_unit_total',
  },
  {
    title: 'JUMLAH KEMBALI',
    key: 'repair_return_unit_total',
  },
  {
    title: 'ALASAN',
    key: 'repair_reason',
  },
  {
    title: 'STATUS',
    key: 'repair_status',
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
    label: 'CREATE',
    value: 'create',
  },
  {
    label: 'CONFIRM',
    value: 'approve',
  },

  {
    label: 'BATAL',
    value: 'batal',
  },
];
