import React, { useEffect, useState } from 'react';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import SelectGroup from '../../components/Forms/SelectGroup/SelectGroup';
import Button from '../../components/Forms/Button/Button';
import Table from '../../components/Tables/Table';
import Pagination from '../../components/Tables/Pagination';
import Container from '../../components/Container';
import createStore from '../../context';
import { useQuery } from '@tanstack/react-query';
import unit from '../../Services/API/unit';
import queryString from '../../utils/queryString';
import dayjs from 'dayjs';
import 'dayjs/locale/id'; // Import Indonesian locale for Day.js
import 'dayjs/plugin/timezone'; // Import timezone plugin for Day.js
import Search from '../../components/Input/Search';
import { useDebounce } from '../../hooks/useDebounce';
import { shiopingOrderStatus } from '../../types/dropdown';
import ModalSyncData from '../../components/Modal/Unit/ModalSyncData';

const UnitOrder: React.FC = () => {
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const { setTitle } = createStore();

  const now = dayjs();
  const oneMonthBefore = now.subtract(1, 'month');
  const handleModal = createStore((state: any) => state.handleModal);

  const [selectedDates, setSelectedDates] = useState<{
    startDate: string | Date;
    endDate: string | Date;
  }>({
    startDate: oneMonthBefore.toISOString(),
    endDate: now.toISOString(),
  });
  const [selectedPageSize, setSelectedPageSize] = useState<string>('10');
  const [search, setSearch] = useState<string>('');
  const debouncedSearchValue = useDebounce(search, 500);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const resultQueryString = queryString.stringified({
    page: paging.currentPage,
    limit: selectedPageSize,
    start_date_shipping: dayjs(selectedDates?.startDate).format(),
    end_date_shipping: dayjs(selectedDates?.endDate).format(),
    q: search,
    shipping_order_status: selectedStatus,
  });

  const { data, isFetching, refetch, isSuccess, isRefetching } = useQuery({
    queryKey: ['unitOrder'],
    queryFn: () => {
      const response = unit.getUnitOrder(resultQueryString);
      return response;
    },
  });
  const handleSelectStartDate = async (startDate: Date) => {
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

  const handleSelectEndDate = async (endDate: Date) => {
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

  const handlePage = async (newPage: any) => {
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: newPage,
    }));
    await refetch();
  };
  const handleTotalItems = async (selectedSize: string) => {
    setSelectedPageSize(selectedSize);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleSelectedStatus = async (selectedStatus: string) => {
    setSelectedStatus(selectedStatus);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

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
    setTitle('SHIPPING ORDER');
    const fetchData = async () => {
      await setPaging((prevState) => ({
        ...prevState,
        currentPage: 1,
      }));
      await refetch();
    };
    fetchData();
  }, [debouncedSearchValue]);

  return (
    <Container>
      <ModalSyncData />
      <div className="grid grid-cols-12 gap-x-5 gap-y-5">
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-x-5 gap-y-5">
            <div className="col-span-12 lg:col-span-4 md:col-span-6">
              <DatePicker
                label={'Tanggal Awal'}
                value={selectedDates?.startDate}
                onChange={handleSelectStartDate}
              />
            </div>
            <div className="col-span-12 lg:col-span-4 md:col-span-6">
              <DatePicker
                label={'Tanggal Akhir'}
                value={selectedDates?.endDate}
                onChange={handleSelectEndDate}
              />
            </div>
            <div className="col-span-12 lg:col-span-4 md:col-span-6">
              <SelectGroup
                label={'Status'}
                items={shiopingOrderStatus}
                className="text-secondary-color"
                onChange={(selectedStatus) =>
                  handleSelectedStatus(selectedStatus)
                }
              />
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <div className="grid grid-cols-1 lg:flex gap-5">
            <Button
              className={
                'inline-flex gap-2 text-md w-auto bg-secondary-color  py-3 text-white rounded-lg hover:bg-indigo-800 text-secondary-color px-3 min-w-50'
              }
              label="SYNC DATA"
              onClick={() => handleModal('modalSyncData', true)}
            />
          </div>
        </div>
        <div className="lg:col-span-6 flex items-center gap-2 col-span-12 mb-5 lg:mb-0">
          <span>Show</span>
          <div className="min-w-20 items-center">
            <SelectGroup
              items={PageSize}
              className="text-secondary-color"
              divClassName=""
              onChange={(selectedSize) => handleTotalItems(selectedSize)}
            />
          </div>
          <span>entries</span>
        </div>
        <div className="flex items-center col-span-12 lg:col-span-6 gap-2 mb-5 lg:mb-0">
          <Search
            value={search}
            onChange={(search: any) => setSearch(search)}
          />
        </div>
        <div className="col-span-12 gap-2">
          <Table
            isLoading={isFetching}
            headers={header}
            data={
              data?.data?.data.map((item: any, index: number) => ({
                ...item,
                id:
                  (paging.currentPage - 1) * parseInt(selectedPageSize) +
                  index +
                  1,
                shipping_order_shipping_date: (
                  <span>
                    {dayjs(item.shipping_order_shipping_date).format(
                      'DD MMM YYYY',
                    )}
                  </span>
                ),
                shipping_order_status: (
                  <span
                    className={`${
                      item.shipping_order_status === 'transit'
                        ? 'text-primary-color font-bold'
                        : item.shipping_order_status === 'complete'
                        ? 'text-success font-bold'
                        : 'text-amber-400 font-bold'
                    }`}
                  >
                    {item.shipping_order_status.toUpperCase()}
                  </span>
                ),

                action: (
                  <Button
                    isButton={false}
                    to={`/units/shipping-order/${item.shipping_order_id}`}
                    label="DETAIL"
                    className="btn-detail"
                  ></Button>
                ),
              })) || []
            }
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
          {/* <Pagination
                currentPage={paging.currentPage}
                totalPage={paging.totalPage}
                handlePage={handlPagination}
              /> */}
        </div>
      </div>
    </Container>
  );
};

const PageSize = [
  {
    label: '10',
    value: '10',
  },
  {
    label: '25',
    value: '25',
  },
  {
    label: '50',
    value: '50',
  },
];

const header = [
  {
    title: 'NO.',
    key: 'id',
  },
  {
    title: 'TANGGAL SHIPPING',
    key: 'shipping_order_shipping_date',
  },
  {
    title: 'SALES ORDER',
    key: 'shipping_order_number',
  },
  {
    title: 'NOMOR DELIVERY',
    key: 'shipping_order_delivery_number',
  },
  {
    title: 'DEALER',
    key: 'dealer.dealer_name',
  },
  {
    title: 'JUMLAH UNIT',
    key: 'unit_total',
  },
  {
    title: 'JUMLAH TERIMA',
    key: 'unit_received_total',
  },
  {
    title: 'STATUS',
    key: 'shipping_order_status',
  },
  {
    title: 'AKSI',
    key: 'action',
  },
];
export default UnitOrder;
