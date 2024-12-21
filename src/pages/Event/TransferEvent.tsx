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
import { useDebounce } from '../../hooks/useDebounce';
import event from '../../Services/API/event';
import { dayJsFormatDate } from './../../utils/dayjs';
import { statusGeneral } from '../../utils/statusUtils';
import createStore from '../../context';

export default function TransferEvent() {
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const [selectedPageSize, setSelectedPageSize] = useState<string>('10');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const debouncedSearchValue = useDebounce(search, 500);
  const { setTitle } = createStore();

  const [selectedDates, setSelectedDates] = useState<{
    date: string | Date | undefined | null;
  }>({
    date: null,
  });

  let resultQueryString = queryString.stringified({
    q: search,
    event_status: selectedStatus,
    limit: selectedPageSize,
    page: paging.currentPage,
  });
  if (selectedDates?.date) {
    resultQueryString +=
      '&date=' + dayjs(selectedDates?.date).format('YYYY-MM-DD');
  }

  const { data, isFetching, refetch, isSuccess, isRefetching } = useQuery({
    queryKey: ['list_transfer_event'],
    queryFn: async () => {
      const response = await event.getEvent(resultQueryString);
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
      date: startDate,
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

  useEffect(() => {
    setTitle('TRANSFER EVENT');
  }, []);

  return (
    <Container>
      <div className="grid grid-cols-12  gap-5">
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 lg:col-span-4 ">
              <DatePicker
                label="Tanggal"
                value={selectedDates?.date}
                onChange={handleStartDate}
              />
            </div>

            <div className="col-span-12 lg:col-span-4 ">
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
              label="TRANSFER EVENT"
              isButton={false}
              className={`btn-add w-auto`}
              to={`/events/transfer-event/form`}
            />
            <Button
              isButton={false}
              label="LIST SURAT JALAN"
              className={`bg-primary w-auto py-3 px-3 rounded-md text-white items-center flex gap-x-2 hover:bg-blue-500`}
              to={`/units/delivery?type=event`}
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
        <div className="flex items-center col-span-12 lg:col-span-6 lg:mb-0 mb-5">
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
              event_start: <span>{dayJsFormatDate(item?.created_at)}</span>,
              event_status: <span>{statusGeneral(item?.event_status)}</span>,
              action: [
                <Button
                  label="DETAIL"
                  to={`/events/transfer-event/${item.event_id}`}
                  className={'btn-detail'}
                  isButton={false}
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
    key: 'event_start',
  },
  {
    title: 'NO. TF EVENT',
    key: 'event_number',
  },
  {
    title: 'NAMA EVENT',
    key: 'master_event.master_event_name',
  },
  {
    title: 'LOKASI',
    key: 'master_event.master_event_location',
  },
  {
    title: 'JUMLAH UNIT',
    key: 'event_unit_total',
  },
  {
    title: 'JUMLAH KEMBALI',
    key: 'event_unit_return_total',
  },
  {
    title: 'STATUS',
    key: 'event_status',
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
