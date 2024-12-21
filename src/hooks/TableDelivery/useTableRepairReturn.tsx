import { useNavigate } from 'react-router-dom';
import Table from '../../components/Tables/Table';
import Button from '../../components/Forms/Button/Button';
import { statusDelivery } from '../../utils/statusUtils';

export const useTableRepairReturn = ({
  data,
  selectedPageSize,
  paging,
  isFetching,
}: any) => {
  const tableRepairReturn = ({}) => {
    return (
      <Table
        isLoading={isFetching}
        headers={headers}
        data={data?.data?.data?.map((item: any, index: number) => ({
          ...item,
          no: (paging.currentPage - 1) * parseInt(selectedPageSize) + index + 1,
          repair_number: (
            <span>
              {
                item?.delivery_repair_return?.repair_return
                  ?.repair_return_number
              }
            </span>
          ),
          repair_return_unit: (
            <span>
              {
                item?.delivery_repair_return.repair_return?.repair_return_unit
                  .length
              }
            </span>
          ),
          delivery_status: <span>{statusDelivery(item?.delivery_status)}</span>,
          action: [
            <Button
              label="DETAIL"
              isButton={false}
              to={`/units/unit-delivery/${item.delivery_id}?type=repair_return`}
              className={'btn-detail'}
            />,
          ],
        }))}
      />
    );
  };

  const navigate = useNavigate();

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
      title: 'NO. KEMBALI REPAIR',
      key: 'repair_number',
    },
    {
      title: 'DRIVER',
      key: 'delivery_driver_name',
    },
    {
      title: 'UNIT',
      key: 'repair_return_unit',
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
  return { tableRepairReturn };
};
