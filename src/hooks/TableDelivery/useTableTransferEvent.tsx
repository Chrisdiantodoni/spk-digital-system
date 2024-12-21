import { useNavigate } from 'react-router-dom';
import Table from '../../components/Tables/Table';
import Button from '../../components/Forms/Button/Button';
import { statusDelivery } from '../../utils/statusUtils';

export const useTableTransferEvent = ({
  data,
  selectedPageSize,
  paging,
  isFetching,
}: any) => {
  const tableTransferEvent = ({}) => {
    return (
      <Table
        isLoading={isFetching}
        headers={headers}
        data={data?.data?.data?.map((item: any, index: number) => ({
          ...item,
          no: (paging.currentPage - 1) * parseInt(selectedPageSize) + index + 1,
          event_number: (
            <span>{item?.delivery_event?.event?.event_number}</span>
          ),
          event_unit: (
            <span>{item?.delivery_event?.event?.event_unit?.length}</span>
          ),
          delivery_status: <span>{statusDelivery(item?.delivery_status)}</span>,
          action: [
            <Button
              isButton={false}
              label="DETAIL"
              to={`/units/unit-delivery/${item.delivery_id}?type=event`}
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
      title: 'NO. TF EVENT',
      key: 'event_number',
    },
    {
      title: 'DRIVER',
      key: 'delivery_driver_name',
    },
    {
      title: 'UNIT',
      key: 'event_unit',
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
  return { tableTransferEvent };
};
