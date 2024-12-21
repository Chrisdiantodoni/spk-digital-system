import { useEffect, useState } from 'react';
import Container from '../../components/Container';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import SelectGroup from '../../components/Forms/SelectGroup/SelectGroup';
import { useDebounce } from '../../hooks/useDebounce';
import createStore from '../../context';
import { useQuery } from '@tanstack/react-query';
import spk from '../../Services/API/transaction/spk';
import dayjs from 'dayjs';
import queryString from '../../utils/queryString';
import Search from '../../components/Input/Search';
import Pagination from '../../components/Tables/Pagination';
import Table from '../../components/Tables/Table';
import { dayJsFormatDate, dayjsFormatInputDate } from '../../utils/dayjs';
import Button from '../../components/Forms/Button/Button';
import { PageSize } from '../../types/dropdown';
import { formatRupiah } from '../../utils/formatter';

const OverPaymentRegular = () => {
  const [search, setSearch] = useState('');
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const { setTitle } = createStore();

  useEffect(() => {
    setTitle('OVERPAYMENT');
  }, []);

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
    page: paging.currentPage,
    start_date: dayjsFormatInputDate(selectedDates?.startDate),
    end_date: dayjsFormatInputDate(selectedDates?.endDate),
  });

  const [selectedPageSize, setSelectedPageSize] = useState<string>('10');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const debouncedSearchValue = useDebounce(search, 500);
  const [salesName, setSalesName] = useState<any>(null);
  const [motorName, setMotorName] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [methodPayment, setMethodPayment] = useState(null);

  const { data, isSuccess, refetch, isFetching, isRefetching } = useQuery({
    queryKey: ['getOverPaymentPaymentRegular'],
    queryFn: async () => {
      const response = await spk.getExcessSpkPayment(resultQueryString);
      return response;
    },
  });

  const handleStartDate = async (dates: any) => {
    await setSelectedDates((prev) => ({
      ...prev,
      startDate: dates,
    }));
    await setPaging((state) => ({ ...state, currentPage: 1 }));
    await refetch();
  };
  const handleEndDate = async (dates: any) => {
    await setSelectedDates((prev) => ({
      ...prev,
      endDate: dates,
    }));
    await setPaging((state) => ({ ...state, currentPage: 1 }));
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

  const handlePage = () => {};

  return (
    <Container>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-6 lg:col-span-3 ">
          <DatePicker
            label="Tanggal Awal"
            value={selectedDates?.startDate}
            onChange={handleStartDate}
          />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <DatePicker
            label="Tanggal Akhir"
            value={selectedDates?.endDate}
            onChange={handleEndDate}
          />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <SelectGroup
            label="Jenis Transaksi"
            items={[
              { label: 'SEMUA', value: '' },
              { label: 'CASH', value: 'cash' },
              { label: 'CREDIT', value: 'credit' },
            ]}
          />
        </div>
        {/* <div className="col-span-6 lg:col-span-3">
          <SelectGroup
            label="Jenis Pembayaran"
            items={[
              { label: 'SEMUA', value: '' },
              { label: 'CASH', value: 'cash' },
              { label: 'DOWN PAYMENT', value: 'dp' },
              { label: 'LEASING', value: 'leasing' },
            ]}
          />
        </div> */}
        <div className="col-span-6 lg:col-span-3">
          <SelectGroup
            label="Status SPK"
            items={[
              { label: 'UNPAID', value: 'unpaid' },
              { label: 'KASIR APPROVE', value: 'cashier_approve' },
              { label: 'FINANCE APPROVE', value: 'finance_approve' },
            ]}
          />
        </div>
        <div className="flex items-center gap-2 col-span-12 lg:col-span-6   ">
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
        <div className="flex items-center col-span-12 lg:col-span-6 my-5 lg:my-0">
          <Search value={search} onChange={(search) => setSearch(search)} />
        </div>
        <div className="col-span-12">
          <Table
            isLoading={isFetching}
            headers={headers}
            data={data?.data?.data?.map((item: any, index: number) => ({
              ...item,
              no:
                (paging.currentPage - 1) * parseInt(selectedPageSize) +
                index +
                1,
              spk_date: (
                <span>
                  {dayJsFormatDate(item?.spk?.spk_general?.spk_general_date)}
                </span>
              ),
              spk_number: <span>{item?.spk?.spk_number}</span>,
              spk_name: (
                <span>{item?.spk?.spk_customer?.spk_customer_name}</span>
              ),
              spk_legal_name: (
                <span>{item?.spk?.spk_legal?.spk_legal_name}</span>
              ),
              payment_type: <span>{item?.spk_payment_type}</span>,
              buy_method: (
                <span>
                  {item?.spk?.spk_transaction?.spk_transaction_method_payment.toUpperCase()}
                </span>
              ),
              nominal: (
                <span className="whitespace-nowrap">
                  {formatRupiah(item?.spk_payment_amount_total)}
                </span>
              ),
              payment_status: <span>{item?.spk_payment_status}</span>,
              action: [
                <Button
                  isButton={false}
                  label="DETAIL"
                  to={`/payment/payment-regular/${item.spk_payment_id}`}
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
};

const headers = [
  {
    title: 'NO.',
    key: 'no',
  },
  {
    title: 'TANGGAL SPK',
    key: 'spk_date',
  },
  {
    title: 'NOMOR SPK',
    key: 'spk_number',
  },
  {
    title: 'NAMA KONSUMEN',
    key: 'spk_name',
  },
  {
    title: 'NAMA STNK',
    key: 'spk_legal_name',
  },
  {
    title: 'NOMINAL HARGA',
    key: 'buy_method',
  },
  {
    title: 'NOMINAL PENGEMBALIAN',
    key: 'nominal',
  },
  {
    title: 'STATUS',
    key: 'payment_status',
  },
  {
    title: 'AKSI',
    key: 'action',
  },
];

export default OverPaymentRegular;
