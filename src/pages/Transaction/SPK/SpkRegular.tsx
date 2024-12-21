import Container from '../../../components/Container';
import Button from '../../../components/Forms/Button/Button';
import SelectGroup from '../../../components/Forms/SelectGroup/SelectGroup';
import { PageSize, indentPayment, spkStatus } from '../../../types/dropdown';
import { useEffect, useState } from 'react';
import Search from '../../../components/Input/Search';
import Table from '../../../components/Tables/Table';
import Pagination from '../../../components/Tables/Pagination';
import createStore from '../../../context';
import { useDebounce } from '../../../hooks/useDebounce';
import queryString from '../../../utils/queryString';
import { useQuery } from '@tanstack/react-query';
import spk from '../../../Services/API/transaction/spk';
import { dayJsFormatDate } from '../../../utils/dayjs';
import { formatRupiah } from '../../../utils/formatter';
import SelectSalesman from '../../../components/Forms/SelectGroup/SelectSalesman';
import SelectMotor from '../../../components/Forms/SelectGroup/SelectMotor';
import SelectLocation from '../../../components/Forms/SelectGroup/Master/SelectLocation';

function SpkRegular() {
  const [search, setSearch] = useState('');
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const { setTitle } = createStore();
  useEffect(() => {
    setTitle('LIST SPK REGULAR');
  }, []);

  const [selectedPageSize, setSelectedPageSize] = useState<string>('10');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const debouncedSearchValue = useDebounce(search, 500);
  const [salesName, setSalesName] = useState<any>(null);
  const [motorName, setMotorName] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [methodPayment, setMethodPayment] = useState(null);

  const resultQueryString = queryString.stringified({
    q: search,
    spk_status: selectedStatus,
    sales_name: salesName?.value?.salesman_name,
    motor_name: motorName?.label === 'SEMUA' ? '' : motorName?.label,
    spk_general_location:
      location?.type === 'dealer'
        ? location?.value
        : location?.value?.dealer_neq_id,
    spk_transaction_method_payment: methodPayment,
    // start_date: dayjs(selectedDates?.startDate).format('YYYY-MM-DD'),
    // end_date: dayjs(selectedDates?.endDate).format('YYYY-MM-DD'),
    limit: selectedPageSize,
    page: paging.currentPage,
  });

  const { data, isFetching, refetch, isSuccess, isRefetching } = useQuery({
    queryKey: ['list_indent'],
    queryFn: async () => {
      const response = await spk.getListSpkRegular(resultQueryString);
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

  const handlePageSize = async (value: any) => {
    setSelectedPageSize(value);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleLocation = async (value: any) => {
    setLocation(value);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleSalesman = async (value: any) => {
    setSalesName(value);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleMotor = async (value: any) => {
    setMotorName(value);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleMethodPayment = async (value: any) => {
    setMethodPayment(value);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  return (
    <Container>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-5">
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-title font-medium text-base  mb-3">
                Dealer / NEQ
              </p>
              <SelectLocation
                value={location}
                onChange={(value: any) => handleLocation(value)}
              />
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-title font-medium text-base  mb-3">
                Salesman
              </p>
              <SelectSalesman value={salesName} onChange={handleSalesman} />
            </div>
            <div className="lg:col-span-3 col-span-6 ">
              <p className="detail-title font-medium text-base  mb-3">
                Tipe Motor
              </p>
              <SelectMotor
                value={motorName}
                onChange={handleMotor}
                list={true}
              />
            </div>
            <div className="lg:col-span-3 col-span-6">
              <SelectGroup
                label="Jenis Transaksi"
                items={indentPayment}
                onChange={handleMethodPayment}
                className="text-secondary-color"
              />
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3">
          <SelectGroup
            label="Status"
            items={spkStatus}
            onChange={handleSelectedStatus}
            className="text-secondary-color"
          />
        </div>
        <div className="col-span-12 items-center ">
          <div className="grid grid-cols-1 lg:flex gap-5">
            <Button
              label="ADD NEW SPK"
              isButton={false}
              to={'/transaction/spk-regular/form'}
              className={`btn-add w-auto`}
            />
            <Button
              label="LIST SURAT JALAN"
              isButton={false}
              className={`bg-primary w-auto py-3 px-3 rounded-md  text-white items-center flex gap-x-2 hover:bg-blue-500`}
              to={`/units/delivery?type=spk`}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 col-span-12 lg:col-span-6 mb-5 lg:mb-0">
          <span>Show</span>
          <div className="min-w-20">
            <SelectGroup
              items={PageSize}
              className="text-secondary-color"
              onChange={(selectedSize: any) => handlePageSize(selectedSize)}
            />
          </div>
          <span>entries</span>
        </div>
        <div className="flex items-center col-span-12 lg:col-span-6 mb-6 lg:mb-0">
          <Search
            value={search}
            onChange={(search: any) => setSearch(search)}
          />
        </div>
        <div className="col-span-12">
          <Table
            headers={headers}
            isLoading={isFetching}
            data={data?.data?.data?.map((item: any, index: number) => ({
              ...item,
              no:
                (paging.currentPage - 1) * parseInt(selectedPageSize) +
                index +
                1,
              spk_general_date: (
                <span>
                  {dayJsFormatDate(item?.spk_general?.spk_general_date)}
                </span>
              ),
              spk_transaction: (
                <span>
                  {item?.spk_transaction?.spk_transaction_method_payment}
                </span>
              ),
              spk_customer: (
                <span>{item?.spk_customer?.spk_customer_name}</span>
              ),
              spk_legal: <span>{item?.spk_legal?.spk_legal_name}</span>,
              chassis_no: (
                <span>{item?.spk_unit?.unit?.unit_frame || '-'}</span>
              ),
              spk_salesman: <span>{item?.spk_general?.sales_name}</span>,
              spk_type: <span>{item?.spk_unit?.motor?.motor_name}</span>,
              spk_pricing: (
                <span>
                  {formatRupiah(
                    item?.spk_pricing?.spk_pricing_off_the_road +
                      item?.spk_pricing?.spk_pricing_bbn,
                  )}
                </span>
              ),
              action: [
                <Button
                  isButton={false}
                  label="DETAIL"
                  to={`/transaction/spk-regular/${item.spk_id}`}
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

const headers = [
  {
    title: 'NO.',
    key: 'no',
  },
  {
    title: 'TANGGAL',
    key: 'spk_general_date',
  },
  {
    title: 'SPK',
    key: 'spk_number',
  },
  {
    title: 'JENIS TRANSAKSI',
    key: 'spk_transaction',
  },
  {
    title: 'KONSUMEN',
    key: 'spk_customer',
  },
  {
    title: 'NAMA STNK',
    key: 'spk_legal',
  },
  {
    title: 'SALESMAN',
    key: 'spk_salesman',
  },
  {
    title: 'TIPE MOTOR',
    key: 'spk_type',
  },
  {
    title: 'No. RANGKA',
    key: 'chassis_no',
  },
  {
    title: 'HARGA',
    key: 'spk_pricing',
  },

  {
    title: 'STATUS',
    key: 'spk_status',
  },
  {
    title: 'AKSI',
    key: 'action',
  },
];

export default SpkRegular;
