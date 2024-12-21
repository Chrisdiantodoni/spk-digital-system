import Container from '../../../../components/Container';
import Button from '../../../../components/Forms/Button/Button';
import SelectGroup from '../../../../components/Forms/SelectGroup/SelectGroup';
import { PageSize, spkStatus } from '../../../../types/dropdown';
import { useEffect, useState } from 'react';
import Search from '../../../../components/Input/Search';
import Table from '../../../../components/Tables/Table';
import Pagination from '../../../../components/Tables/Pagination';
import { useQuery } from '@tanstack/react-query';
import spk from '../../../../Services/API/transaction/spk';
import { dayJsFormatDate } from '../../../../utils/dayjs';
import DatePicker from '../../../../components/Forms/DatePicker/DatePicker';
import dayjs from 'dayjs';
import { useDebounce } from '../../../../hooks/useDebounce';
import queryString from '../../../../utils/queryString';
import createStore from '../../../../context';

function CroCheck() {
  const [search, setSearch] = useState('');
  const [selectedPageSize, setSelectedPageSize] = useState<string>('10');
  const debouncedSearchValue = useDebounce(search, 500);
  const [selectedStatusCRO, setSelectedStatusCRO] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectTransactionType, setSelectTransactionType] = useState<any>(null);

  const [selectedDates, setSelectedDates] = useState<{
    startDate: null | Date;
  }>({
    startDate: null,
  });
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const resultQueryString = queryString.stringified({
    page: paging.currentPage,
    limit: selectedPageSize,
    date:
      selectedDates?.startDate === null
        ? ''
        : dayjs(selectedDates?.startDate).format('YYYY-MM-DD'),
    q: search,
    spk_status: selectedStatus,
    spk_transaction_method_payment: selectTransactionType,
    is_cro_check:
      selectedStatusCRO === '0'
        ? '0'
        : selectedStatusCRO === '1'
        ? 1
        : selectedStatusCRO === '0'
        ? 0
        : '',
  });

  const handlePage = async (newPage: any) => {
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: newPage,
    }));
    refetch();
  };
  useEffect(() => {
    setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    refetch();
  }, [debouncedSearchValue]);

  const { setTitle } = createStore();

  useEffect(() => {
    setTitle('CRO CHECK');
  }, []);
  const {
    data: data,
    isFetching,
    refetch,
    isRefetching,
    isSuccess,
  } = useQuery({
    queryKey: ['cro_list'],
    queryFn: async () => {
      const response = await spk.getListSpkRegular(resultQueryString);
      return response;
    },
  });

  useEffect(() => {
    if (isSuccess || isRefetching) {
      setPaging((state: any) => ({
        ...state,
        totalPage: data?.data?.last_page,
        currentPage: data?.data?.current_page,
      }));
    }
  }, [isSuccess, isRefetching]);

  const handleSelectedStatus = async (status: string) => {
    setSelectedStatus(status);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleSelectCro = async (status: string) => {
    setSelectedStatusCRO(status);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleSelectedDates = async (value: any) => {
    setSelectedDates(value);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handlePageSize = async (value: any) => {
    setSelectedPageSize(value);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleTransactionType = async (value: any) => {
    setSelectTransactionType(value);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  return (
    <Container>
      <div className="grid grid-cols-12 gap-y-5">
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-x-5 gap-y-5">
            <div className="lg:col-span-3 col-span-6">
              <DatePicker
                label="Tanggal"
                value={selectedDates?.startDate}
                onChange={handleSelectedDates}
              />
            </div>

            <div className="lg:col-span-3 col-span-6">
              <SelectGroup
                label="Status"
                items={spkStatus}
                className="text-secon dary-color"
                onChange={handleSelectedStatus}
              />
            </div>
            <div className="lg:col-span-3 col-span-6">
              <SelectGroup
                label="Status CRO"
                items={croStatus}
                className="text-secondary-color"
                onChange={handleSelectCro}
              />
            </div>
            <div className="lg:col-span-3 col-span-6">
              <SelectGroup
                label="Jenis Transaksi"
                items={[
                  { label: 'SEMUA', value: '' },
                  { label: 'CASH', value: 'cash' },
                  { label: 'CREDIT', value: 'credit' },
                ]}
                className="text-secondary-color"
                value={selectTransactionType}
                onChange={handleTransactionType}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-x-5 gap-y-5">
            <div className="col-span-12 flex items-center gap-2 lg:col-span-6">
              <span>Show</span>
              <div className="min-w-20">
                <SelectGroup
                  items={PageSize}
                  className="text-secondary-color"
                  onChange={handlePageSize}
                />
              </div>
              <span>entries</span>
            </div>
            <div className="flex items-center col-span-12 lg:col-span-6 my-5 lg:my-0">
              <Search
                value={search}
                onChange={(search: any) => setSearch(search)}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <Table
            headers={headers}
            data={data?.data?.data?.map((item: any, index: number) => ({
              ...item,
              no:
                (paging.currentPage - 1) * parseInt(selectedPageSize) +
                index +
                1,
              date: <span>{dayJsFormatDate(item?.created_at)}</span>,
              spk_no: <span>{item?.spk_number}</span>,
              spk_status: <span>{item?.spk_status}</span>,
              customer_name: (
                <span>{item?.spk_customer?.spk_customer_name}</span>
              ),
              cro_status: (
                <span>
                  {item?.is_cro_check == '1'
                    ? 'Sudah Terverifikasi'
                    : item?.is_cro_check === '0'
                    ? 'Tidak Terverifikasi'
                    : 'Belum Terverifikasi'}
                </span>
              ),
              transaction_type: (
                <span>
                  {item?.spk_transaction?.spk_transaction_method_payment}
                </span>
              ),
              stnk_name: <span>{item?.spk_legal?.spk_legal_name}</span>,
              action: [
                <Button
                  label="DETAIL"
                  isButton={false}
                  to={`/transaction/spk-regular/${item.spk_id}`}
                  className={'btn-detail'}
                />,
              ],
            }))}
            isLoading={isFetching}
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

const headers = [
  {
    title: 'NO.',
    key: 'no',
  },
  {
    title: 'TANGGAL',
    key: 'date',
  },
  {
    title: 'NOMOR SPK',
    key: 'spk_no',
  },
  {
    title: 'STATUS SPK',
    key: 'spk_status',
  },
  {
    title: 'STATUS CHECK CRO',
    key: 'cro_status',
  },
  {
    title: 'JENIS TRANSAKSI',
    key: 'transaction_type',
  },
  {
    title: 'NAMA STNK',
    key: 'stnk_name',
  },
  {
    title: 'AKSI',
    key: 'action',
  },
];

const croStatus = [
  {
    label: 'SEMUA',
    value: '',
  },
  {
    label: 'Terverifikasi',
    value: '1',
  },
  {
    label: 'Belum Terverifikasi',
    value: 'null',
  },
  {
    label: 'Tidak Terverifikasi',
    value: '0',
  },
];

export default CroCheck;
