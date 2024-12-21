import Container from '../../../components/Container';
import DatePicker from '../../../components/Forms/DatePicker/DatePicker';
import SelectGroup from '../../../components/Forms/SelectGroup/SelectGroup';
import { PageSize, deliveryStatus } from '../../../types/dropdown';
import Search from '../../../components/Input/Search';
import Pagination from '../../../components/Tables/Pagination';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import delivery from '../../../Services/API/delivery';
import queryStrings from '../../../utils/queryString';
import queryString from 'query-string';
import dayjs from 'dayjs';
import { useDebounce } from '../../../hooks/useDebounce';
import { useTableRepair } from '../../../hooks/TableDelivery/useTableRepair';
import { useTableRepairReturn } from '../../../hooks/TableDelivery/useTableRepairReturn';
import { useTableTransferEvent } from '../../../hooks/TableDelivery/useTableTransferEvent';
import { useTableReturnEvent } from '../../../hooks/TableDelivery/useTableReturnEvent';
import { useTableTransferNeq } from '../../../hooks/TableDelivery/useTableTransferNeq';
import { useTableReturnNeq } from './../../../hooks/TableDelivery/useTableReturnNeq';
import { useTableSpk } from '../../../hooks/TableDelivery/useTableSpk';
import createStore from '../../../context';
import { ChevronLeft } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

export default function UnitDeliveryNote() {
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });

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

  const handlePage = async (newPage: any) => {
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: newPage,
    }));
    await refetch();
  };
  const { type } = queryString.parse(location.search) as { type: string };

  const resultQueryString = queryStrings.stringified({
    delivery_status: selectedStatus,
    delivery_type: type,
    page: paging.currentPage,
    start_date: dayjs(selectedDates?.startDate).format('YYYY-MM-DD'),
    end_date: dayjs(selectedDates?.endDate).format('YYYY-MM-DD'),
    limit: selectedPageSize,
    q: search,
  });
  const { data, refetch, isFetching, isSuccess, isRefetching } = useQuery({
    queryKey: ['deliveryRepair'],
    queryFn: async () => {
      const response = await delivery.getDeliveryList(resultQueryString);
      return response;
    },
  });

  const handleChangeStatus = async (selectedStatus: string) => {
    setSelectedStatus(selectedStatus);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
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
    setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    refetch();
  }, [debouncedSearchValue]);

  const handleSelectedPageSize = async (pageSize: string) => {
    setSelectedPageSize(pageSize);
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: 1,
    }));
    await refetch();
  };
  const { tableRepair } = useTableRepair({
    data,
    selectedPageSize,
    paging,
    isFetching,
  });

  const { tableRepairReturn } = useTableRepairReturn({
    data,
    selectedPageSize,
    paging,
    isFetching,
  });

  const { tableTransferEvent } = useTableTransferEvent({
    data,
    selectedPageSize,
    paging,
    isFetching,
  });

  const { tableReturnEvent } = useTableReturnEvent({
    data,
    selectedPageSize,
    paging,
    isFetching,
  });

  const { tableTransferNeq } = useTableTransferNeq({
    data,
    selectedPageSize,
    paging,
    isFetching,
  });

  const { tableReturnNeq } = useTableReturnNeq({
    data,
    selectedPageSize,
    paging,
    isFetching,
  });
  const { tableSpk } = useTableSpk({
    data,
    selectedPageSize,
    paging,
    isFetching,
  });

  function tableBasedType() {
    switch (type) {
      case 'repair':
        return tableRepair({
          data,
          isFetching,
          paging,
          selectedPageSize,
        });
      case 'repair_return':
        return tableRepairReturn({
          data,
          isFetching,
          paging,
          selectedPageSize,
        });
      case 'event':
        return tableTransferEvent({
          data,
          isFetching,
          paging,
          selectedPageSize,
        });
      case 'event_return':
        return tableReturnEvent({
          data,
          isFetching,
          paging,
          selectedPageSize,
        });
      case 'neq':
        return tableTransferNeq({
          data,
          isFetching,
          paging,
          selectedPageSize,
        });
      case 'neq_return':
        return tableReturnNeq({
          data,
          isFetching,
          paging,
          selectedPageSize,
        });
      case 'spk':
        return tableSpk({
          data,
          isFetching,
          paging,
          selectedPageSize,
        });
      default:
        break;
    }
  }

  useEffect(() => {
    if (type === 'repair') {
      setTitle('SURAT JALAN TRANSFER REPAIR');
    } else if (type === 'event') {
      setTitle('SURAT JALAN TRANSFER EVENT');
    } else if (type === 'repair_return') {
      setTitle('SURAT JALAN FINISH REPAIR ');
    } else if (type === 'event_return') {
      setTitle('SURAT JALAN KEMBALI EVENT ');
    } else if (type === 'neq') {
      setTitle('SURAT JALAN TRANSFER NEQ');
    } else if (type === 'neq_return') {
      setTitle('SURAT JALAN KEMBALI NEQ');
    } else if (type === 'spk') {
      setTitle('SURAT JALAN SPK');
    }
  }, []);

  const { setTitle } = createStore();

  const handleLinkNavigating = () => {
    switch (type) {
      case 'repair':
        return '/units/unit-repair';
      case 'repair_return':
        return '/units/unit-return-repair';
      case 'event':
        return '/units/transfer-event';
      case 'event_return':
        return '/events/return-event';
      case 'neq':
        return '/neqs/transfer-neq';
      case 'neq_return':
        return '/neqs/return-neq';
      case 'spk':
        return '/transaction/spk-regular';
      default:
        break;
    }
  };

  return (
    <Container>
      <div className="grid grid-cols-12 gap-x-5  gap-y-5">
        <div className="col-span-12">
          <div className="grid grid-cols-12">
            <div className="lg:col-span-4 col-span-12">
              <Link
                to={handleLinkNavigating() || '/'}
                className="detail-label text-lg flex items-center gap-2  hover:text-slate-500"
              >
                <ChevronLeft />
                BACK
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-6 lg:col-span-4">
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
        <div className="col-span-12 lg:col-span-4">
          <SelectGroup
            label="Status"
            className="text-secondary-color"
            items={deliveryStatus}
            onChange={(status: string) => handleChangeStatus(status)}
          />
        </div>
        {/* <div className="col-span-12 lg:col-span-3 lg:mt-5 items-center flex">
          <Button
            label="TAMBAH SURAT JALAN"
            className={'btn-add'}
            onClick={() => navigate('/units/unit-delivery/new?type=repair')}
            Icon={<PlusSquare size={24} />}
          />
        </div> */}
        <div className="flex items-center gap-2 col-span-12 lg:col-span-6 mb-5 lg:mb-0">
          <span>Show</span>
          <div className="min-w-20">
            <SelectGroup
              className="text-secondary-color"
              items={PageSize}
              onChange={(selectedOption: string) =>
                handleSelectedPageSize(selectedOption)
              }
            />
          </div>
          <span>entries</span>
        </div>
        <div className="flex items-center col-span-12 lg:col-span-6 mb-5 lg:mb-0">
          <Search value={search} onChange={(search) => setSearch(search)} />
        </div>
        <div className="col-span-12">{tableBasedType()}</div>
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
