import { useNavigate } from 'react-router-dom';
import Table from '../../components/Tables/Table';
import Button from '../../components/Forms/Button/Button';
import { statusDelivery } from '../../utils/statusUtils';

export const useTableRepair = ({
  data,
  selectedPageSize,
  paging,
  isFetching,
}: any) => {
  const tableRepair = ({}) => {
    return (
      <Table
        isLoading={isFetching}
        headers={headers}
        data={data?.data?.data?.map((item: any, index: number) => ({
          ...item,
          no: (paging.currentPage - 1) * parseInt(selectedPageSize) + index + 1,
          repair_unit: (
            <span>{item?.delivery_repair?.repair?.repair_unit?.length}</span>
          ),
          repair_number: (
            <span>{item?.delivery_repair?.repair?.repair_number}</span>
          ),
          delivery_status: <span>{statusDelivery(item?.delivery_status)}</span>,
          action: [
            <Button
              isButton={false}
              label="DETAIL"
              to={`/units/unit-delivery/${item.delivery_id}?type=repair`}
              className={'btn-detail'}
            />,
          ],
        }))}
      />
    );
  };

  const headers = [
    {
      title: 'NO.',
      key: 'no',
    },
    {
      title: 'NO. SURAT JALAN',
      key: 'delivery_number',
    },
    {
      title: 'NO. REPAIR',
      key: 'repair_number',
    },
    {
      title: 'DRIVER',
      key: 'delivery_driver_name',
    },
    {
      title: 'GUDANG',
      key: 'delivery_repair.repair.main_dealer.main_dealer_name',
    },
    {
      title: 'UNIT',
      key: 'repair_unit',
    },
    {
      title: 'STATUS',
      key: 'delivery_status',
    },
    {
      title: 'AKSI',
      key: 'action',
    },
  ];
  return { tableRepair };
};
