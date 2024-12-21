import { useEffect, useState } from 'react';
import Loader2 from '../../../common/Loader/Loader';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Container from '../../../components/Container';
import Search from '../../../components/Input/Search';
import Table from '../../../components/Tables/Table';
import { useDebounce } from '../../../hooks/useDebounce';

function UnitHistory() {
  const data = [
    {
      time: '2024-02-23T09:00:00',
      sales_order: 'SO12345',
      action: 'Received',
      staff: 'John Doe',
      branch: 'Branch A',
      neq_event: 'None',
      status: 'In Stock',
    },
    {
      time: '2024-02-22T15:30:00',
      sales_order: 'SO67890',
      action: 'Delivered',
      staff: 'Alice Smith',
      branch: 'Branch B',
      neq_event: 'Installed',
      status: 'Sold',
    },
    {
      time: '2024-02-21T11:45:00',
      sales_order: 'SO24680',
      action: 'Transferred',
      staff: 'Bob Johnson',
      branch: 'Branch C',
      neq_event: 'None',
      status: 'In Transit',
    },
  ];

  const dataSpk = [
    {
      time: '2024-02-21T11:45:00',
      staff: 'Someone',
      Notes: '-',
      action: '-',
      status: 'create',
    },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearchValue = useDebounce(search, 500);

  useEffect(() => {
    setIsLoading(true); // Set loading state
    const fetchData = setTimeout(() => {
      setIsLoading(false);
      console.log('Fetching data with search value:', debouncedSearchValue);
    }, 1000); // Simulated delay

    return () => clearTimeout(fetchData);
  }, [debouncedSearchValue]);

  const handleSearchChange = (value: any) => {
    setSearch(value); // Update search state
  };
  return (
    <Container>
      <div className="grid grid-cols-12 gap-x-5 gap-y-5">
        <div className="lg:col-span-4 xsm:col-span-2 mb-5">
          <label className="text-black mb-4 block">No. Rangka</label>
          <Search value={search} onChange={handleSearchChange} />
        </div>
        <div className="lg:col-span-8 items-end">
          <Breadcrumb
            items={[{ label: 'Dashboard', link: '/' }, { label: 'History' }]}
          />
        </div>
        {isLoading ? (
          <div className="col-span-12 mx-auto justify-content-center flex h-75">
            <Loader2 />
          </div>
        ) : (
          <>
            <div className="lg:col-span-3 xsm:col-span-12">
              <p className="detail-label">Tanggal</p>
            </div>
            <div className="col-span-9">
              <p className="detail-label">: TRANSIT</p>
            </div>
            <div className="lg:col-span-3 xsm:col-span-12">
              <p className="detail-label">Nama Motor</p>
            </div>
            <div className="col-span-9">
              <p className="detail-label">: NMAX A</p>
            </div>
            <div className="lg:col-span-3 xsm:col-span-12">
              <p className="detail-label">Tanggal</p>
            </div>
            <div className="col-span-9">
              <p className="detail-label">: HITAM</p>
            </div>
            <div className="lg:col-span-3 xsm:col-span-12">
              <p className="detail-label">Nomor Rangka</p>
            </div>
            <div className="col-span-9">
              <p className="detail-label">: MH3RG7860PK123456</p>
            </div>
            <div className="lg:col-span-3 xsm:col-span-12">
              <p className="detail-label">Nomor Mesin</p>
            </div>
            <div className="col-span-9">
              <p className="detail-label">: G3S7E-0123456</p>
            </div>
            <div className="lg:col-span-3 xsm:col-span-12">
              <p className="detail-label">Status</p>
            </div>
            <div className="col-span-9">
              <p className="detail-label">: AVAILABLE</p>
            </div>
            <div className="col-span-12 mt-5">
              <p className="detail-title text-2xl">LOG UNIT</p>
            </div>
            <div className="col-span-12">
              {/* <Table
                ColumnName="sales_order"
                data={data}
                headers={[
                {  title :'WAKTU',},
                  {title: 'SALES ORDER',}
                {  title: 'AKSI',}
                  title'STAFF',
                  'CABANG',
                  'NEQ/EVENT',
                  'STATUS',
                ]}
                linkUrlPrefix="/units/unit-order/"
                isLoading={false}
                linkColumns={[1, 1]}
              /> */}
            </div>
            <div className="col-span-12 mt-5">
              <p className="detail-title text-2xl">
                SPK - 0220/TEMP/SYMDN/02/2024
              </p>
            </div>
            <div className="col-span-12">
              {/* <Table
                ColumnName="sales_order"
                data={dataSpk}
                headers={['WAKTU', 'STAFF', 'CATATAN', 'AKSI', 'STATUS']}
                isLoading={false}
              /> */}
            </div>
            <div className="col-span-12 mt-5">
              <p className="detail-title text-2xl">
                POOLING - 0156/PC/SYMDN/02/2024
              </p>
            </div>
            <div className="col-span-12">
              {/* <Table
                ColumnName="sales_order"
                data={dataSpk}
                headers={['WAKTU', 'PERUBAHAN', 'STAFF', 'JABATAN', 'STATUS']}
                isLoading={false}
              /> */}
            </div>
            <div className="col-span-12 mt-5">
              <p className="detail-title text-2xl">DOKUMEN</p>
            </div>
            <div className="col-span-12">
              {/* <Table
                ColumnName="sales_order"
                data={dataSpk}
                headers={['WAKTU', 'AKSI', 'NOMOR', 'CATATAN', 'STATUS']}
                isLoading={false}
              /> */}
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

export default UnitHistory;
