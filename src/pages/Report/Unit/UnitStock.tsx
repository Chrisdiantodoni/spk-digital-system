import { useState } from 'react';
import Container from '../../../components/Container';
import DatePicker from '../../../components/Forms/DatePicker/DatePicker';
import Pagination from '../../../components/Tables/Pagination';
import Table from '../../../components/Tables/Table';
import SelectGroup from '../../../components/Forms/SelectGroup/SelectGroup';

function UnitStock() {
  const [paging, setPaging] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const [selectedPageSize, setSelectedPageSize] = useState<string>('10');
  const units = [
    {
      id: 1,
      model: 'Model A',
      amount: 100,
      available: 80,
      spk: 10,
      retour: 5,
      repair: 3,
      hold: 2,
      sold: 60,
    },
    {
      id: 2,
      model: 'Model B',
      amount: 150,
      available: 120,
      spk: 20,
      retour: 8,
      repair: 5,
      hold: 3,
      sold: 100,
    },
    {
      id: 3,
      model: 'Model C',
      amount: 200,
      available: 160,
      spk: 30,
      retour: 10,
      repair: 8,
      hold: 4,
      sold: 140,
    },
    {
      id: 4,
      model: 'Model D',
      amount: 180,
      available: 150,
      spk: 25,
      retour: 7,
      repair: 4,
      hold: 3,
      sold: 120,
    },
    {
      id: 5,
      model: 'Model E',
      amount: 250,
      available: 200,
      spk: 40,
      retour: 12,
      repair: 10,
      hold: 6,
      sold: 180,
    },
    {
      id: 6,
      model: 'Model F',
      amount: 120,
      available: 100,
      spk: 15,
      retour: 6,
      repair: 3,
      hold: 2,
      sold: 80,
    },
    {
      id: 7,
      model: 'Model G',
      amount: 180,
      available: 150,
      spk: 25,
      retour: 8,
      repair: 5,
      hold: 3,
      sold: 120,
    },
    {
      id: 8,
      model: 'Model H',
      amount: 200,
      available: 160,
      spk: 30,
      retour: 10,
      repair: 8,
      hold: 5,
      sold: 140,
    },
    {
      id: 9,
      model: 'Model I',
      amount: 150,
      available: 120,
      spk: 20,
      retour: 7,
      repair: 4,
      hold: 3,
      sold: 100,
    },
    {
      id: 10,
      model: 'Model J',
      amount: 220,
      available: 180,
      spk: 35,
      retour: 12,
      repair: 9,
      hold: 6,
      sold: 160,
    },
  ];
  const headers = [
    'NO.',
    'MODEL',
    'JUMLAH',
    'AVAILABLE',
    'SPK',
    'RETOUR',
    'REPAIR',
    'HOLD',
    'SOLD',
  ];

  const handlePage = async (newPage: any) => {
    await setPaging((prevState) => ({
      ...prevState,
      currentPage: newPage,
    }));
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

  return (
    <Container>
      <div className="grid grid-cols-4 gap-x-5 gap-y-3">
        <div className="col-span-1">
          <DatePicker label="Tanggal" />
        </div>
        <div className="col-span-3"></div>
        <div className="flex items-center gap-2 col-span-3">
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
        <div className="flex items-center col-span-1">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-1 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            // value={searchQuery}
            // onChange={handleSearchChange}
          />
        </div>
        <div className="col-span-4">
          <Table
            isLoading={false}
            data={units}
            headers={headers}
            linkColumns={[2, 3, 4, 5, 6, 7, 8]}
            ColumnName="status"
            linkUrlPrefix="/units/stock/"
          />
        </div>
        <div className="col-span-4">
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

export default UnitStock;
