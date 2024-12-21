import { useNavigate, useParams } from 'react-router-dom';
import Container from '../../../components/Container';
import createStore from '../../../context';
import Button from '../../../components/Forms/Button/Button';
import ModalUnitOrder from '../../../components/Modal/Unit/ModalUnitOrder';
import { useEffect, useState } from 'react';
import unit from '../../../Services/API/unit';
import Loader2 from '../../../common/Loader/Loader';
import { dayJsFormatDate } from '../../../utils/dayjs';
import { useQuery } from '@tanstack/react-query';

function UnitOrderDetail() {
  let { id } = useParams();
  const handleModal = createStore((state: any) => state.handleModal);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [shippingData, setShippingData] = useState<{ [key: string]: any }>({});

  const { setTitle } = createStore();

  useEffect(() => {
    setTitle('DETAIL UNIT ORDER');
  }, []);

  const { isPending } = useQuery({
    queryKey: ['detail_unit_order'],
    queryFn: async () => {
      const response = await unit.getUnitOrderDetail(id);
      if (response?.meta.code == 200) {
        setShippingData(response?.data);
        setData(response?.data?.unit);
      }
      return response;
    },
  });

  const handleReceiveUnit = (item: { [key: string]: any }) => {
    handleModal('modalUnitOrder', true, item);
  };

  return isPending ? (
    <Container>
      <div className="grid grid-cols-12">
        <div className="col-span-12 h-100 items-center justify-center flex">
          <Loader2 />
        </div>
      </div>
    </Container>
  ) : (
    <Container>
      <ModalUnitOrder />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <p className="detail-title">DETAIL UNIT</p>
          <p
            className={`detail-label text-lg font-semibold mt-3 ${
              shippingData?.shipping_order_status === 'transit'
                ? 'text-primary-color'
                : shippingData?.shipping_order_status === 'complete'
                ? 'text-success'
                : 'text-amber-400'
            } `}
          >
            {shippingData?.shipping_order_status?.toUpperCase()}
          </p>
        </div>
        <div className="col-span-6 lg:col-span-3">
          <p className="detail-label">Tanggal Shipping</p>
        </div>
        <div className="col-span-6 lg:col-span-9">
          <p className="detail-label">
            : {dayJsFormatDate(shippingData?.shipping_order_shipping_date)}
          </p>
        </div>
        <div className="col-span-6 lg:col-span-3">
          <p className="detail-label">Sales Order</p>
        </div>
        <div className="col-span-6 lg:col-span-9">
          <p className="detail-label">
            : {shippingData?.shipping_order_number}
          </p>
        </div>
        <div className="col-span-6 lg:col-span-3">
          <p className="detail-label">Nomor Delivery</p>
        </div>
        <div className="col-span-6 lg:col-span-9">
          <p className="detail-label">
            : {shippingData?.shipping_order_delivery_number}
          </p>
        </div>
        <div className="col-span-6 lg:col-span-3">
          <p className="detail-label">Dealer</p>
        </div>
        <div className="col-span-6 lg:col-span-9">
          <p className="detail-label">: {shippingData?.dealer?.dealer_name}</p>
        </div>
        <div className="lg:col-span-3 col-span-6">
          <p className="detail-label">Jumlah Unit</p>
        </div>
        <div className="col-span-6 lg:col-span-9">
          <p className="detail-label">: {shippingData?.unit_total}</p>
        </div>
        <div className="col-span-6 lg:col-span-3">
          <p className="detail-label">Jumlah Terima</p>
        </div>
        <div className="col-span-6 lg:col-span-3">
          <p className="detail-label">: {shippingData?.unit_received_total}</p>
        </div>
        <div className="col-span-12 pt-5">
          <p className="detail-title">List Detail Unit</p>
        </div>
        <div className="col-span-12 rounded-t-xl overflow-auto">
          <table className={`border-collapse w-full dark:border-strokedark`}>
            <thead>
              <tr className="border-t bg-primary-color text-white border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5">
                <th className="py-3">TIPE MOTOR</th>
                <th>WARNA</th>
                <th>NO. RANGKA</th>
                <th>NO. MESIN</th>
                <th>TANGGAL TERIMA</th>
                <th>NOTE</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: any, index) => (
                <tr
                  className="border-t border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5 items-center"
                  key={index}
                >
                  <td className="text-center py-3 text-black">
                    {item?.motor?.motor_name}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.color?.color_name}
                  </td>

                  <td className="text-center py-3 text-black">
                    {item.unit_frame}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item.unit_engine}
                  </td>
                  <td className="text-center py-3 text-black">
                    {!item?.unit_received_date
                      ? '-'
                      : dayJsFormatDate(item.unit_received_date)}
                  </td>
                  <td className="text-center py-3 text-black max-w-[100px] overflow-hidden whitespace-nowrap truncate">
                    {!item?.unit_note ? '-' : item.unit_note}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item.unit_status !== null ? (
                      <span className="text-success">TERIMA</span>
                    ) : (
                      <Button
                        label="TERIMA"
                        onClick={() => handleReceiveUnit(item)}
                        className="bg-primary-color text-white text-sm font-normal w-full p-2 inline-flex gap-2 items-center rounded-md hover:bg-indigo-800"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-span-12 mt-5">
          <div className="grid grid-cols-1 lg:flex">
            <Button
              label="BACK"
              onClick={() => navigate('/units/shipping-order')}
              className="btn-back w-full lg:w-auto"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

export default UnitOrderDetail;
