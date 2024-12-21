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
import { statusGeneral } from '../../utils/statusUtils';
import { useDebounce } from '../../hooks/useDebounce';
import { dayJsFormatDate } from '../../utils/dayjs';
import createStore from '../../context';
import eventReturn from '../../Services/API/eventReturn';

export default function ReturnEvent() {
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const { setTitle } = createStore();
  useEffect(() => {
    setTitle('KEMBALI EVENT');
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
    event_return_status: selectedStatus,
    start_date: dayjs(selectedDates?.startDate).format('YYYY-MM-DD'),
    end_date: dayjs(selectedDates?.endDate).format('YYYY-MM-DD'),
    limit: selectedPageSize,
    page: paging.currentPage,
  });

  const { data, isFetching, refetch, isSuccess, isRefetching } = useQuery({
    queryKey: ['list_event_return'],
    queryFn: async () => {
      const response = await eventReturn.getEventReturnList(resultQueryString);
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
            <div className="col-span-6 lg:col-span-4 ">
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
        <div className="col-span-12 ">
          <div className="grid grid-cols-1 lg:flex gap-5">
            <Button
              isButton={false}
              label="KEMBALI EVENT"
              className={`btn-add w-auto`}
              to={`/events/return-event/form`}
            />
            <Button
              isButton={false}
              label="LIST SURAT JALAN"
              className={`bg-primary py-3 w-auto px-3 rounded-md  text-white items-center flex gap-x-2 hover:bg-blue-500`}
              to={`/units/delivery?type=event_return`}
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
              created_at: (
                <span className="w-20">
                  {dayJsFormatDate(item?.created_at)}
                </span>
              ),
              event_return_status: (
                <span>{statusGeneral(item?.event_return_status)}</span>
              ),
              action: [
                <Button
                  isButton={false}
                  label="DETAIL"
                  to={`/events/return-event/${item.event_return_id}`}
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
    title: 'NO. KEMBALI EVENT',
    key: 'event_return_number',
  },
  {
    title: 'EVENT',
    key: 'master_event.master_event_name',
  },
  {
    title: 'LOKASI',
    key: 'master_event.master_event_location',
  },
  {
    title: 'TOTAL UNIT',
    key: 'event_return_unit_total',
  },
  {
    title: 'STATUS',
    key: 'event_return_status',
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
];
