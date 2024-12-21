import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Container from '../../../components/Container';
import SelectGroup from '../../../components/Forms/SelectGroup/SelectGroup';
import Pagination from '../../../components/Tables/Pagination';
import Table from '../../../components/Tables/Table';
import createStore from '../../../context';

function UnitStockDetail() {
  const { status } = useParams<{ status: string | undefined }>();
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const [selectedPageSize, setSelectedPageSize] = useState<string>('10');

  const { setTitle } = createStore();

  useEffect(() => {
    setTitle('DETAIL UNIT STOCK');
  }, []);

  const statusLabel =
    status === 'amount'
      ? 'All'
      : status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : undefined;
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

  const handlePage = async (newPage: any) => {
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: newPage,
    }));
  };

  const data = [
    {
      id: 1,
      date: '2024-02-23',
      model_name: 'Model X',
      color: 'Blue',
      no_chassis: 'ABC123',
      no_engine: '123456',
      status: 'Available',
    },
    {
      id: 2,
      date: '2024-02-23',
      model_name: 'Model Y',
      color: 'Red',
      no_chassis: 'DEF456',
      no_engine: '789012',
      status: 'Sold',
    },
    {
      id: 3,
      date: '2024-02-23',
      model_name: 'Model Z',
      color: 'Green',
      no_chassis: 'GHI789',
      no_engine: '345678',
      status: 'Available',
    },
    {
      id: 4,
      date: '2024-02-23',
      model_name: 'Model A',
      color: 'Yellow',
      no_chassis: 'JKL012',
      no_engine: '901234',
      status: 'Sold',
    },
    {
      id: 5,
      date: '2024-02-23',
      model_name: 'Model B',
      color: 'Black',
      no_chassis: 'MNO345',
      no_engine: '567890',
      status: 'Available',
    },
    {
      id: 6,
      date: '2024-02-23',
      model_name: 'Model C',
      color: 'White',
      no_chassis: 'PQR678',
      no_engine: '123456',
      status: 'Sold',
    },
    {
      id: 7,
      date: '2024-02-23',
      model_name: 'Model D',
      color: 'Silver',
      no_chassis: 'STU901',
      no_engine: '789012',
      status: 'Available',
    },
    {
      id: 8,
      date: '2024-02-23',
      model_name: 'Model E',
      color: 'Purple',
      no_chassis: 'VWX234',
      no_engine: '345678',
      status: 'Sold',
    },
    {
      id: 9,
      date: '2024-02-23',
      model_name: 'Model F',
      color: 'Orange',
      no_chassis: 'YZA567',
      no_engine: '901234',
      status: 'Available',
    },
    {
      id: 10,
      date: '2024-02-23',
      model_name: 'Model G',
      color: 'Pink',
      no_chassis: 'BCD890',
      no_engine: '567890',
      status: 'Sold',
    },
  ];

  const headers = [
    'NO.',
    'TANGGAL',
    'MODEL',
    'COLORS',
    'NO. CHASSIS',
    'NO. ENGINE',
    'STATUS',
  ];

  return (
    <Container>
      <div className="grid grid-cols-12 gap-y-3">
        <div className="lg:col-span-6 xsm:col-span-12">
          <p className="detail-title ">Detail Unit</p>
        </div>
        <div className="lg:col-span-6 inline-block lg:justify-end xsm:col-span-12">
          <p className="font-bold lg:text-end xsm:text-start text-black-title text-3xl">
            INDEPENDENT - ALFA 1
          </p>
          <Breadcrumb
            items={[
              { label: 'Dashboard', link: '/' },
              { label: 'Unit', link: '/units/stock' },
              {
                label: statusLabel,
              },
            ]}
          />
        </div>
        <div className="lg:col-span-3 xsm:col-span-12">
          <p className="detail-label">Tanggal</p>
        </div>
        <div className="lg:col-span-9 xsm:col-span-12">
          <p className="detail-label">: 23 Februari 2024</p>
        </div>
        <div className="lg:col-span-3 xsm:col-span-12">
          <p className="detail-label">Status</p>
        </div>
        <div className="lg:col-span-9 xsm:col-span-12">
          <p className="detail-label">: {statusLabel}</p>
        </div>
        <div className="lg:col-span-3 xsm:col-span-12">
          <p className="detail-label">Model</p>
        </div>
        <div className="lg:col-span-9 xsm:col-span-12">
          <p className="detail-label">: ALL NEW AEROX 155 C/ABS</p>
        </div>
        <div className="flex items-center gap-2 col-span-8">
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
        <div className="flex items-center col-span-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-1 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            // value={searchQuery}
            // onChange={handleSearchChange}
          />
        </div>
        <div className="col-span-12">
          {/* <Table
            isLoading={false}
            data={data}
            linkUrlPrefix="/units/unit-order/"
            headers={headers}
            linkColumns={[4]}
            ColumnName="id"
          /> */}
        </div>
        <div className="col-span-12">
          <Pagination
            totalItems={selectedPageSize}
            totalData={10}
            currentPage={paging.currentPage}
            totalPage={paging.totalPage}
            handlePage={handlePage}
          />
        </div>
      </div>
    </Container>
  );
}

export default UnitStockDetail;
