import DetailRepairUnit from '../../pages/DeliveryNote/DetailUnit/DetailRepairUnit';
import DetailRepairReturnUnit from '../../pages/DeliveryNote/DetailUnit/DetailRepairReturnUnit';
import DetailTransferEventUnit from '../../pages/DeliveryNote/DetailUnit/DetailTransferEventUnit';
import DetailReturnEventUnit from '../../pages/DeliveryNote/DetailUnit/DetailReturnEventUnit';
import DetailTransferNeqUnit from '../../pages/DeliveryNote/DetailUnit/DetailTransferNeqUnit';
import DetailReturnNeqUnit from '../../pages/DeliveryNote/DetailUnit/DetailReturnNeqUnit';
import DetailSpkUnit from '../../pages/DeliveryNote/DetailUnit/DetailSpkUnit';

export const useListDeliveryUnitTable = () => {
  const listDeliveryUnit = (type: string, data: any) => {
    switch (type) {
      case 'repair':
        return <DetailRepairUnit data={data} />;
      case 'repair_return':
        return <DetailRepairReturnUnit data={data?.data || data} />;
      case 'event':
        return <DetailTransferEventUnit data={data?.data || data} />;
      case 'event_return':
        return <DetailReturnEventUnit data={data?.data || data} />;
      case 'neq':
        return <DetailTransferNeqUnit data={data?.data || data} />;
      case 'neq_return':
        return <DetailReturnNeqUnit data={data?.data || data} />;
      case 'spk':
        return <DetailSpkUnit data={data?.data || data} />;
      default:
        return null;
    }
  };
  return { listDeliveryUnit };
};
