import Container from '../../components/Container';
import Button from '../../components/Forms/Button/Button';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import SelectGroup from '../../components/Forms/SelectGroup/SelectGroup';
import Pagination from '../../components/Tables/Pagination';
import { useEffect, useState } from 'react';
import { PageSize } from '../../types/dropdown';
import Table from '../../components/Tables/Table';
import Search from '../../components/Input/Search';
import { useDebounce } from '../../hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import retur from '../../Services/API/retur';
import dayjs from 'dayjs';
import queryString from '../../utils/queryString';
import { dayjsFormatInputDate } from '../../utils/dayjs';
import createStore from '../../context';

export default function UnitRetur() {
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const now = dayjs();
  const oneMonthBefore = now.subtract(1, 'month');
  const [search, setSearch] = useState('');
  const [selectStatus, setSelectStatus] = useState(null);
  const debouncedSearchValue = useDebounce(search, 500);

  const [selectedDates, setSelectedDates] = useState<{
    startDate: string | Date;
    endDate: string | Date;
  }>({
    startDate: oneMonthBefore.toISOString(),
    endDate: now.toISOString(),
  });

  const [selectedPageSize, setSelectedPageSize] = useState<string>('10');

  const resultQueryString = queryString.stringified({
    q: search,
    start_date: dayjsFormatInputDate(selectedDates?.startDate),
    end_date: dayjsFormatInputDate(selectedDates?.endDate),
    retur_unit_status: selectStatus,
    limit: selectedPageSize,
    page: paging.currentPage,
  });

  const handlePage = async (newPage: any) => {
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: newPage,
    }));
    await refetch();
  };

  const { data, isFetching, refetch, isRefetching, isSuccess } = useQuery({
    queryKey: ['unitReturList'],
    queryFn: async () => {
      const response = await retur.getListRetur(resultQueryString);
      return response;
    },
  });

  const handleStartDate = async (value: any) => {
    setSelectedDates((state) => ({
      ...state,
      startDate: value,
    }));
    await setPaging((prev) => ({
      ...prev,
      currentPage: 1,
    }));
    await refetch();
  };
  const handleEndDate = async (value: any) => {
    setSelectedDates((state) => ({
      ...state,
      endDate: value,
    }));
    await setPaging((prev) => ({
      ...prev,
      currentPage: 1,
    }));
    await refetch();
  };
  const handleStatus = async (value: any) => {
    setSelectStatus(value);
    await setPaging((prev) => ({
      ...prev,
      currentPage: 1,
    }));
    await refetch();
  };

  const { setTitle } = createStore();

  useEffect(() => {
    setTitle('RETUR UNIT');
  }, []);

  useEffect(() => {
    setPaging((prev) => ({
      ...prev,
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

  const handlePageSize = async (value: any) => {
    setSelectedPageSize(value);
    await setPaging((prev) => ({
      ...prev,
      currentPage: 1,
    }));
    await refetch();
  };

  return (
    <Container>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-3">
              <DatePicker
                label="Tanggal Awal"
                value={selectedDates?.startDate}
                onChange={handleStartDate}
              />
            </div>
            <div className="col-span-12 lg:col-span-3">
              <DatePicker
                label="Tanggal Akhir"
                value={selectedDates?.endDate}
                onChange={handleEndDate}
              />
            </div>
            <div className="col-span-12 lg:col-span-3">
              <SelectGroup
                label="Status"
                onChange={handleStatus}
                className="text-secondary-color"
                items={[
                  { label: 'SEMUA', value: '' },
                  { label: 'CREATE', value: 'create' },
                  { label: 'CONFIRM', value: 'confirm' },
                  { label: 'APPROVED', value: 'approve' },
                  { label: 'TOLAK', value: 'reject' },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:flex gap-x-5 gap-y-5">
            <Button
              label="ADD NEW RETUR"
              className={`btn-add w-full lg:w-auto`}
              isButton={false}
              to={`/units/unit-return/form`}
            />
            {/* <Button
              label="LIST SURAT JALAN"
              isButton={false}
              to={'/units/unit-return/delivery'}
              className={`btn-list-delivery w-full lg:w-auto`}
            /> */}
          </div>
        </div>
        <div className="flex items-center gap-2 col-span-12 lg:col-span-6 mb-5 lg:mb-0">
          <span>Show</span>
          <div className="min-w-20">
            <SelectGroup
              className="text-secondary-color"
              items={PageSize}
              onChange={handlePageSize}
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
            data={data?.data?.data.map((item: any) => ({
              ...item,
              no: (paging.currentPage - 1) * parseInt(selectedPageSize) + 1,
              action: [
                <Button
                  isButton={false}
                  label="DETAIL"
                  to={`/units/unit-return/${item.retur_unit_id}`}
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
    title: 'NOMOR RETUR',
    key: 'retur_unit_number',
  },

  {
    title: 'TUJUAN ANTAR',
    key: 'main_dealer_name',
  },
  {
    title: 'DEALER TUJUAN',
    key: 'retur_unit_dealer_destination_name',
  },
  {
    title: 'ALASAN',
    key: 'retur_unit_reason',
  },
  {
    title: 'JUMLAH UNIT',
    key: 'retur_unit_list_total',
  },
  {
    title: 'STATUS',
    key: 'retur_unit_status',
  },
  {
    title: 'AKSI',
    key: 'action',
  },
];
