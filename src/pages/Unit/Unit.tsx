import React, { useEffect, useState } from 'react';
// import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import SelectGroup from '../../components/Forms/SelectGroup/SelectGroup';
import Button from '../../components/Forms/Button/Button';
import Table from '../../components/Tables/Table';
import Pagination from '../../components/Tables/Pagination';
import Container from '../../components/Container';
import { PageSize } from '../../types/dropdown';
import { Link } from 'react-router-dom';
import queryString from '../../utils/queryString';
// import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import unit from '../../Services/API/unit';
import { useDebounce } from '../../hooks/useDebounce';
import createStore from '../../context';
import Search from '../../components/Input/Search';
import master from '../../Services/API/master';
import { statusUnit } from '../../utils/statusUtils';
import SelectMotor from '../../components/Forms/SelectGroup/SelectMotor';

const Unit: React.FC = () => {
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  // const navigate = useNavigate();

  // const [selectedDates, setSelectedDates] = useState<{
  //   startDate: string | Date | undefined | null;
  // }>({
  //   startDate: null,
  // });

  const [search, setSearch] = useState<string>('');
  const debouncedSearchValue = useDebounce(search, 500);

  const { data, isFetching, refetch, isSuccess, isRefetching } = useQuery({
    queryKey: ['stockUnitList'],
    queryFn: () => {
      const response = unit.getStockUnit(resultQueryString);
      return response;
    },
  });

  const [selectedPageSize, setSelectedPageSize] = useState<string>('10');
  const [selectedMotorType, setSelectedMotorType] = useState<
    | {
        label: string;
      }
    | string
  >();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const resultQueryString = queryString.stringified({
    motor: selectedMotorType === 'SEMUA' ? '' : selectedMotorType,
    unit_status: selectedStatus,
    location: selectedLocation,
    page: paging.currentPage,
    limit: selectedPageSize,
    q: search,
  });
  // const queryStringMotorcycle = queryString.stringified({
  //   paginate: false,
  // });
  // //

  // const { data: motorcycleData, isFetching: isFetchingMotorcycle } = useQuery({
  //   queryKey: ['motorcycle'],
  //   queryFn: async () => {
  //     const response = await master
  //       .getMotorcycle(queryStringMotorcycle)
  //       .then((responseNew: any) => {
  //         const newResponse = [
  //           {
  //             label: 'SEMUA',
  //             value: '',
  //           },
  //           ...responseNew?.data?.map((item: any) => ({
  //             value: item.motor_name,
  //             label: item.motor_name,
  //           })),
  //         ];
  //         return newResponse;
  //       })
  //       .finally();
  //     return response;
  //   },
  // });

  const { isFetching: isFetchingLocationCurrent, data: locationData } =
    useQuery({
      queryKey: ['locationCurrent'],
      queryFn: async () => {
        const response = await master
          .getLocationCurrent('spk_location=false')
          .then((res: any) => {
            const newResponseLocation = [
              {
                label: 'SEMUA',
                value: '',
              },
              {
                label: res?.data?.dealer?.dealer?.dealer_name,
                value: res?.data?.dealer?.dealer_id,
              },
              ...(res?.data?.dealer_neq || []).map((item: any) => ({
                label: item?.dealer_neq_name,
                value: item?.dealer_neq_id,
              })),
              ...(res?.data?.event_list || []).map((item: any) => ({
                label: item?.event_name,
                value: item?.event_id,
              })),
            ];
            return newResponseLocation;
          })
          .finally();
        return response;
      },
    });

  // const handlPagination = async (newPage: any) => {
  //   await setPaging((state) => ({
  //     ...state,
  //     currentPage: newPage,
  //   }));
  //   await refetch();
  // };

  const handleSelectedMotorType = async (motorType: { label: string }) => {
    setSelectedMotorType(motorType?.label);
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
  const handleSelectedLocation = async (location: string) => {
    setSelectedLocation(location);
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

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
      await setPaging((prevState) => ({
        ...prevState,
        currentPage: 1,
      }));
    };
    fetchData();
  }, [debouncedSearchValue]);

  const { setTitle } = createStore();
  useEffect(() => {
    setTitle('STOCK UNIT');
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
      {/* <Breadcrumb pageName="Unit Order" /> */}
      <div className="grid grid-cols-12 gap-x-5  gap-y-5">
        {/* <div className="col-span-2">
          <DatePicker label={'Tanggal Akhir'} />
        </div> */}
        <div className="col-span-12">
          <div className="grid grid-cols-12 gap-x-5 gap-y-5">
            <div className="col-span-12 lg:col-span-4 md:col-span-6">
              <p className="detail-title font-medium text-base  mb-3">
                Tipe Motor
              </p>
              <SelectMotor onChange={handleSelectedMotorType} list={true} />
            </div>
            <div className="col-span-12 lg:col-span-4 md:col-span-6">
              <SelectGroup
                label={'Lokasi'}
                items={locationData}
                className="text-secondary-color"
                onChange={(selectedLocation) =>
                  handleSelectedLocation(selectedLocation)
                }
              />
            </div>
            <div className="col-span-12 lg:col-span-4 md:col-span-6">
              <SelectGroup
                label={'Status'}
                items={items}
                className="text-secondary-color"
                onChange={(selectedStatus) =>
                  handleSelectedStatus(selectedStatus)
                }
              />
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <div className="grid grid-cols-1 lg:flex gap-x-5 gap-y-5">
            <div className="col-span-1">
              <Button
                className={
                  'flex w-full gap-5 text-white hover:bg-green-800 bg-success py-3 px-2 rounded-md min-w-50 items-center'
                }
                label="EXPORT EXCEL"
                onClick={() => window.alert('Sync')}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 col-span-12 lg:col-span-6 mb-5 lg:mb-0">
          <span>Show</span>
          <div className="min-w-20">
            <SelectGroup
              items={PageSize}
              className="text-secondary-color"
              onChange={(selectedSize) => handleTotalItems(selectedSize)}
            />
          </div>
          <span>entries</span>
        </div>
        <div className="flex items-center col-span-12 lg:col-span-6 mb-5 lg:mb-0">
          <Search
            value={search}
            onChange={(search: string) => setSearch(search)}
          />
        </div>
        <div className="col-span-12">
          <Table
            isLoading={isFetching || isFetchingLocationCurrent}
            headers={header}
            data={data?.data?.data?.map((item: any, index: number) => ({
              ...item,
              id:
                (paging.currentPage - 1) * parseInt(selectedPageSize) +
                index +
                1,
              unit_color: <span>{item?.color?.color_name}</span>,
              motor_type: <span>{item.motor.motor_name}</span>,
              unit_status: <span>{statusUnit(item?.unit_status)}</span>,
              unit_location_status: (
                <span>
                  {item?.unit_location_status === 'event'
                    ? 'EVENT'
                    : item?.unit_location_status === 'neq'
                    ? 'NEQ'
                    : 'MDS'}
                </span>
              ),
              action: [
                <Link
                  to={`/units/unit-list/${item.unit_id}`}
                  className="btn-detail inline-block"
                >
                  DETAIL
                </Link>,
                // <Button
                //   label="DETAIL"
                //   onClick={() => navigate(`/units/unit-list/${item.id}`)}
                //   className={'btn-detail'}
                // />,
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

const items = [
  { label: 'SEMUA', value: 'all' },
  {
    label: 'ON HAND',
    value: 'on_hand',
  },
  {
    label: 'HOLD',
    value: 'hold',
  },
  {
    label: 'SPK',
    value: 'spk',
  },
  {
    label: 'RETUR',
    value: 'retur',
  },
  {
    label: 'REPAIR',
    value: 'repair',
  },
  {
    label: 'EVENT',
    value: 'event',
  },
];

const header = [
  { title: 'NO.', key: 'id' },
  { title: 'TIPE MOTOR', key: 'motor_type' },
  { title: 'WARNA', key: 'unit_color' },
  { title: 'NO. RANGKA', key: 'unit_frame' },
  { title: 'NO MESIN', key: 'unit_engine' },
  { title: 'LOKASI', key: 'unit_location_status' },
  { title: 'STATUS', key: 'unit_status' },
  { title: 'AKSI', key: 'action' },
];
export default Unit;
