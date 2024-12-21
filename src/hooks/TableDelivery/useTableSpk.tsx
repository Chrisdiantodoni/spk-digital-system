import { useNavigate } from 'react-router-dom';
import Table from '../../components/Tables/Table';
import Button from '../../components/Forms/Button/Button';
import { statusDelivery } from '../../utils/statusUtils';

export const useTableSpk = ({
  data,
  selectedPageSize,
  paging,
  isFetching,
}: any) => {
  const tableSpk = ({}) => {
    return (
      <Table
        isLoading={isFetching}
        headers={headers}
        data={data?.data?.data?.map((item: any, index: number) => ({
          ...item,
          no: (paging.currentPage - 1) * parseInt(selectedPageSize) + index + 1,
          spk_customer: (
            <span>
              {item?.delivery_spk?.spk?.spk_customer.spk_customer_name}
            </span>
          ),
          spk_number: <span>{item?.delivery_spk?.spk?.spk_number}</span>,
          delivery_type: (
            <span>
              {handleDeliveryType(item?.delivery_spk?.spk?.spk_delivery_type)}
            </span>
          ),
          delivery_status: <span>{statusDelivery(item?.delivery_status)}</span>,
          action: [
            <Button
              isButton={false}
              label="DETAIL"
              to={`/units/unit-delivery/${item.delivery_id}?type=spk`}
              className={'btn-detail'}
            />,
          ],
        }))}
      />
    );
  };

  const handleDeliveryType = (type: string) => {
    if (type === 'ktp') {
      return 'Pengantaran KTP';
    } else if (type === 'dealer') {
      return 'Self Pick Up Dealer';
    } else if (type === 'neq') {
      return 'Self Pick Up NEQ';
    } else {
      return 'Pengantaran Alamat Domisili';
    }
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
      title: 'KONSUMEN',
      key: 'spk_customer',
    },
    {
      title: 'NO. SPK',
      key: 'spk_number',
    },
    {
      title: 'JENIS PENGANTARAN',
      key: 'delivery_type',
    },
    {
      title: 'DRIVER',
      key: 'delivery_driver_name',
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
  return { tableSpk };
};
