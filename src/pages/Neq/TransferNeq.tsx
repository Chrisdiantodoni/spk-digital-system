import Container from '../../components/Container';
import Button from '../../components/Forms/Button/Button';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import SelectGroup from '../../components/Forms/SelectGroup/SelectGroup';
import Pagination from '../../components/Tables/Pagination';
import { useEffect, useState } from 'react';
import { PageSize } from '../../types/dropdown';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Tables/Table';
import Search from '../../components/Input/Search';
import { useQuery } from '@tanstack/react-query';
import queryString from '../../utils/queryString';
import dayjs from 'dayjs';
import { useDebounce } from '../../hooks/useDebounce';
import neq from '../../Services/API/neq';
import { dayJsFormatDate } from './../../utils/dayjs';
import { statusGeneral } from '../../utils/statusUtils';
import createStore from '../../context';
import master from '../../Services/API/master';

export default function TransferNeq() {
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const navigate = useNavigate();

  const [selectedPageSize, setSelectedPageSize] = useState<string>('10');
  const [selectedNeq, setSelectedNeq] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const debouncedSearchValue = useDebounce(search, 500);
  const { setTitle } = createStore();
  const now = dayjs();
  const oneMonthBefore = now.subtract(1, 'month');

  const [selectedDates, setSelectedDates] = useState<{
    startDate: string | Date;
    endDate: string | Date;
  }>({
    startDate: oneMonthBefore.toISOString(),
    endDate: now.toISOString(),
  });

  let resultQueryString = queryString.stringified({
    q: search,
    page: paging.currentPage,

    neq_status: selectedStatus,
    dealer_neq_id: selectedNeq,
    limit: selectedPageSize,
    start_date: dayjs(selectedDates?.startDate).format('YYYY-MM-DD'),
    end_date: dayjs(selectedDates?.endDate).format('YYYY-MM-DD'),
  });

  const { data, isFetching, refetch, isSuccess, isRefetching } = useQuery({
    queryKey: ['list_transfer_neq'],
    queryFn: async () => {
      const response = await neq.getNeqList(resultQueryString);
      return response;
    },
  });
  const { data: dataNeq, isFetching: isFetchingNeq } = useQuery({
    queryKey: ['list_neqs'],
    queryFn: async () => {
      const response = await master
        .getDealerNeq('paginate=false')
        .then((res: any) => {
          const newDataNeq = [
            {
              label: 'SEMUA',
              value: '',
            },
            ...(res?.data || []).map((item: any) => ({
              label: item?.dealer_neq_name,
              value: item?.dealer_neq_id,
            })),
          ];
          return newDataNeq;
        });
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
      startDate: startDate,
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
      endDate: endDate,
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

  const handleSelectedNeq = async (neq_id: string) => {
    setSelectedNeq(neq_id);
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
    setTitle('TRANSFER NEQ');
  }, []);

  return (
    <Container>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-6 lg:col-span-3">
              <DatePicker
                label="Tanggal Awal"
                value={selectedDates?.startDate}
                onChange={handleStartDate}
              />
            </div>
            <div className="col-span-6 lg:col-span-3 ">
              <DatePicker
                label="Tanggal Akhir"
                value={selectedDates?.endDate}
                onChange={handleEndDate}
              />
            </div>

            <div className="col-span-6 lg:col-span-3 ">
              <SelectGroup
                label="NEQ"
                className="text-secondary-color"
                items={dataNeq}
                onChange={(status) => handleSelectedNeq(status)}
              />
            </div>
            <div className="col-span-6 lg:col-span-3 ">
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
              label="TRANSFER NEQ"
              className={`btn-add w-auto`}
              isButton={false}
              to={`/neqs/transfer-neq/form`}
            />
            <Button
              label="LIST SURAT JALAN"
              isButton={false}
              className={`bg-primary py-3 px-3  w-auto rounded-md  text-white items-center flex gap-x-2 hover:bg-blue-500`}
              to={`/units/delivery?type=neq`}
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
            isLoading={isFetching || isFetchingNeq}
            headers={header}
            data={data?.data?.data?.map((item: any, index: number) => ({
              ...item,
              no:
                (paging.currentPage - 1) * parseInt(selectedPageSize) +
                index +
                1,
              transfer_date: (
                <span>{dayJsFormatDate(item?.neq_shipping_date)}</span>
              ),
              neq_status: <span>{statusGeneral(item?.neq_status)}</span>,
              action: [
                <Button
                  label="DETAIL"
                  isButton={false}
                  to={`/neqs/transfer-neq/${item.neq_id}`}
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
    key: 'transfer_date',
  },
  {
    title: 'NO. TF NEQ',
    key: 'neq_number',
  },
  {
    title: 'TUJUAN',
    key: 'dealer_neq.dealer_neq_name',
  },
  {
    title: 'TOTAL TRANSFER',
    key: 'neq_unit_total',
  },
  {
    title: 'STATUS',
    key: 'neq_status',
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
