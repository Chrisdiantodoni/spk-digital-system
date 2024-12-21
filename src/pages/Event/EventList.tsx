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
import Search from '../../components/Input/Search';
import { useDebounce } from '../../hooks/useDebounce';
import master from '../../Services/API/master';
import { dayJsFormatDate } from '../../utils/dayjs';
import SwitcherFour from '../../components/Switchers/Switcher';
import ModalEventForm from '../../components/Modal/Event/ModalEventForm';
import toast from 'react-hot-toast';

const EventList: React.FC = () => {
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const [selectedPageSize, setSelectedPageSize] = useState<string>('10');
  const [search, setSearch] = useState<string>('');

  const { handleModal } = createStore();

  const debouncedSearchValue = useDebounce(search, 500);
  const { setTitle } = createStore();
  useEffect(() => {
    setTitle('DAFTAR EVENT');
  }, []);

  const resultQueryString = queryString.stringified({
    page: paging.currentPage,
    limit: selectedPageSize,
    q: search,
    paginate: true,
  });

  const handleLoading = createStore((state: any) => state.handleLoading);
  const { data, isFetching, refetch, isSuccess, isRefetching } = useQuery({
    queryKey: ['eventList'],
    queryFn: () => {
      handleLoading(true);
      const response = master
        .getEventList(resultQueryString)
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

  const handleTotalUnitTransferEvent = (eventList: any) => {
    return eventList.reduce(
      (total: any, num: any) => total + num?.event_unit_total,
      0,
    );
  };

  const { mutate: handleSwitchChange, isPending } = useMutation({
    mutationFn: async (data: any) => {
      console.log(data?.master_event_status === 0 ? 1 : 0);
      const body = {
        master_event_status: data?.master_event_status === 0 ? 1 : 0,
      };
      const response = await master.updateEventStatus(
        data?.master_event_id,
        body,
      );
      return response;
    },
    onSuccess: async (res: any) => {
      if (res?.meta?.code === 200 && res?.data?.master_event_status === 1) {
        await refetch();
        toast.success('Event diaktifkan kembali');
      } else if (
        res?.meta?.code === 200 &&
        res?.data?.master_event_status === 0
      ) {
        await refetch();
        toast.error('Event dinonaktifkan');
      }
    },
  });

  const onSwitchChangeEvent = (item: any, value: any) => {
    handleSwitchChange(item, value);
  };

  return (
    <Container>
      <ModalEventForm />
      <div className="grid grid-cols-12 gap-x-5 gap-y-5">
        <div className="items-center flex col-span-12 lg:col-span-2">
          <Button
            className={'btn-add min-w-50'}
            label="ADD NEW EVENT"
            onClick={() => handleModal('modalEventForm', true)}
          />
        </div>
        <div className="col-span-10 lg:block hidden"></div>
        <div className="flex items-center gap-2 col-span-12 lg:col-span-6">
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
        <div className="flex items-center col-span-12 lg:col-span-6">
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
                master_event_date: (
                  <span>{dayJsFormatDate(item?.master_event_date)}</span>
                ),
                unit_total: (
                  <span>{handleTotalUnitTransferEvent(item?.event)}</span>
                ),
                action_event_active: (
                  <div className="flex justify-center items-center">
                    <SwitcherFour
                      id={index}
                      value={item?.master_event_status}
                      onChange={(newValue: boolean) => {
                        if (handleTotalUnitTransferEvent(item?.event) > 0) {
                          toast.error('Event masih digunakan.');
                        } else {
                          onSwitchChangeEvent(item, newValue);
                        }
                      }}
                      disabled={isPending}
                    />
                  </div>
                ),
                action: (
                  <Button
                    isButton={false}
                    to={`/events/event-list/${item?.master_event_id}`}
                    label="DETAIL"
                    className="btn-detail"
                  ></Button>
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
    title: 'TANGGAL MULAI',
    key: 'master_event_date',
  },
  {
    title: 'NAMA EVENT',
    key: 'master_event_name',
  },
  {
    title: 'LOKASI',
    key: 'master_event_location',
  },

  {
    title: 'JUMLAH UNIT',
    key: 'unit_total',
  },
  {
    title: 'STATUS EVENT',
    key: 'action_event_active',
  },

  {
    title: 'AKSI',
    key: 'action',
  },
];
export default EventList;
