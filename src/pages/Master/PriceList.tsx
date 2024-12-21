import React, { useEffect, useState } from 'react';
import SelectGroup from '../../components/Forms/SelectGroup/SelectGroup';
import Button from '../../components/Forms/Button/Button';
import Table from '../../components/Tables/Table';
import Pagination from '../../components/Tables/Pagination';
import Container from '../../components/Container';
import createStore from '../../context';
import { useMutation, useQuery } from '@tanstack/react-query';
import queryString from '../../utils/queryString';
import 'dayjs/locale/id';
import 'dayjs/plugin/timezone';
import { Link, useNavigate } from 'react-router-dom';
import Search from '../../components/Input/Search';
import { useDebounce } from '../../hooks/useDebounce';
import master from '../../Services/API/master';
import { dayJsFormatDate, dayjsFormatDateTime } from '../../utils/dayjs';
import SwitcherFour from '../../components/Switchers/Switcher';
import ModalEventForm from '../../components/Modal/Event/ModalEventForm';
import toast from 'react-hot-toast';
import priceList from '../../Services/API/priceList';
import { formatRupiah } from '../../utils/formatter';
import { Eye, Pencil, ThreeDotsVertical } from 'react-bootstrap-icons';
import {
  Menu,
  MenuItems,
  MenuButton,
  MenuItem,
  Transition,
} from '@headlessui/react';
import ModalPriceList from '../../components/Modal/PriceList/ModalPriceList';
import SelectLocation from '../../components/Forms/SelectGroup/Master/SelectLocation';
import ModalClonePriceList from '../../components/Modal/PriceList/ModalClonePriceList';

const PriceListMotorcycle: React.FC = () => {
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const dealer = createStore((state: any) => state.account_dealer);
  // const dealer: any | null = JSON.parse(
  //   localStorage.getItem('account_dealer') || '{}',
  // );
  const [selectedPageSize, setSelectedPageSize] = useState<string>('10');
  const [search, setSearch] = useState<string>('');
  const [selectLocation, setSelectLocation] = useState<any>({
    label: dealer?.dealer?.dealer_name,
    type: 'dealer',
    value: dealer?.dealer?.dealer_id,
  });

  const { handleModal } = createStore();

  const debouncedSearchValue = useDebounce(search, 500);
  const { setTitle } = createStore();
  useEffect(() => {
    setTitle('DAFTAR PRICE LIST');
  }, []);

  const resultQueryString = queryString.stringified({
    page: paging.currentPage,
    limit: selectedPageSize,
    q: search,
    location:
      selectLocation?.type === 'dealer'
        ? selectLocation?.value
        : selectLocation?.value?.dealer_neq_id,
  });

  const handleLoading = createStore((state: any) => state.handleLoading);

  const { data, isFetching, refetch, isSuccess, isRefetching } = useQuery({
    queryKey: ['masterPriceList'],
    queryFn: async () => {
      handleLoading(true);
      const response = await priceList
        .getPriceList(resultQueryString)
        .finally(() => handleLoading(false));
      return response;
    },
  });

  const handlePage = async (newPage: any) => {
    await handleLoading(true);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: newPage,
    }));
    await refetch();
  };
  const handleTotalItems = async (selectedSize: string) => {
    await handleLoading(true);
    setSelectedPageSize(selectedSize);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };

  const handleLocation = async (value: any) => {
    setSelectLocation(value);
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
  }, [isSuccess || isRefetching]);

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

  return (
    <Container>
      <ModalPriceList />
      <ModalClonePriceList />
      <div className="grid grid-cols-12 gap-x-5 gap-y-5">
        <div className="lg:col-span-3 col-span-6">
          <p className="detail-title font-medium text-base  mb-3">
            Dealer / NEQ
          </p>
          <SelectLocation
            is_clearable={false}
            value={selectLocation}
            onChange={(value: any) => handleLocation(value)}
          />
        </div>
        <div className="col-span-12">
          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <Button
                label="Clone Pricelist"
                onClick={() => handleModal('modalClonePriceList', true)}
                className="btn-confirm w-full lg:w-auto"
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
            onChange={(search: any) => setSearch(search)}
          />
        </div>
        <div className="col-span-12">
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
                off_the_road: (
                  <span className="whitespace-nowrap">
                    {formatRupiah(item?.off_the_road)}
                  </span>
                ),
                bbn: (
                  <span className="whitespace-nowrap">
                    {formatRupiah(item?.bbn)}
                  </span>
                ),
                on_the_road: (
                  <span className="whitespace-nowrap">
                    {formatRupiah(
                      parseInt(item?.off_the_road) + parseInt(item?.bbn),
                    )}
                  </span>
                ),
                discount: <span>{formatRupiah(item?.discount)}</span>,
                // motor_name: <div className="text-left">{item?.motor_name}</div>,
                updated_at: (
                  <span>{dayjsFormatDateTime(item?.updated_at)}</span>
                ),

                action: (
                  <Menu>
                    <MenuButton className="inline-flex items-center gap-2 rounded-md bg-white py-1.5 px-3 text-base text-primary-color shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-slate-50 data-[open]:bg-slate-50 data-[focus]:outline-1 data-[focus]:outline-white">
                      <ThreeDotsVertical />
                    </MenuButton>
                    <Transition
                      enter="transition ease-out duration-75"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <MenuItems
                        anchor="bottom end"
                        className="bg-white p-1 rounded-md border border-stroke hover:bg-white "
                      >
                        <MenuItem>
                          <button
                            onClick={() =>
                              handleModal(
                                'modalPriceList',
                                true,
                                item?.pricelist_motor_id,
                              )
                            }
                            className="group flex w-full text-base items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-slate-100 text-black"
                          >
                            Edit
                          </button>
                        </MenuItem>

                        <div className="my-1 h-px bg-slate-100" />
                        <MenuItem>
                          <Link
                            to={`/settings/pricelist/${item?.pricelist_motor_id}`}
                            className="group flex w-full text-base items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-slate-100 text-black"
                          >
                            Detail
                          </Link>
                        </MenuItem>
                      </MenuItems>
                    </Transition>
                  </Menu>
                  // <Button
                  //   onClick={() => handleModal('modalEventForm', true, item)}
                  //   label="DETAIL"
                  //   className="btn-detail"
                  // ></Button>
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
    title: 'TIPE',
    key: 'motor.motor_name',
  },
  {
    title: 'OFF THE ROAD',
    key: 'off_the_road',
  },
  {
    title: 'BBN',
    key: 'bbn',
  },
  {
    title: 'ON THE ROAD',
    key: 'on_the_road',
  },
  {
    title: 'DISCOUNT',
    key: 'discount',
  },
  {
    title: 'TANGGAL UPDATE',
    key: 'updated_at',
  },

  {
    title: 'AKSI',
    key: 'action',
  },
];
export default PriceListMotorcycle;
