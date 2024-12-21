import Container from '../../../components/Container';
import Button from '../../../components/Forms/Button/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import unit from '../../../Services/API/unit';
import { dayJsFormatDate, dayjsFormatDateTime } from '../../../utils/dayjs';
import { statusAction, statusUnit } from '../../../utils/statusUtils';
import Loader2 from '../../../common/Loader/Loader';
import createStore from '../../../context';

function UnitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stockDetail, setStockDetail] = useState<{ [key: string]: any }>({});
  const [dataHistory, setDataHistory] = useState([]);

  const { isPending } = useQuery({
    queryKey: ['unit_detail'],
    queryFn: async () => {
      const response = await unit.getStockUnitDetail(id);
      if (response?.meta?.code === 200) {
        setStockDetail(response?.data);
        setDataHistory(response?.data?.unit_log);
      }
      return response;
    },
  });
  const { setTitle } = createStore();

  useEffect(() => {
    setTitle('STOCK DETAIL');
  }, []);

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
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-12 xsm:col-span-12">
          <p className="detail-title ">DETAIL UNIT</p>
        </div>
        {/* <div className="lg:col-span-6 inline-block lg:justify-end xsm:col-span-12">
          <Breadcrumb
            items={[
              { label: 'Dashboard', link: '/' },
              { label: 'Unit', link: '/units/shipping-order' },
              { label: id },
            ]}
          />
        </div> */}
        <div className="lg:col-span-3 col-span-6">
          <p className="detail-label">Tanggal</p>
        </div>
        <div className="col-span-6 lg:col-span-9">
          <p className="detail-label">
            : {dayJsFormatDate(stockDetail?.unit_received_date)}
          </p>
        </div>
        <div className="lg:col-span-3 col-span-6">
          <p className="detail-label">Tipe Motor</p>
        </div>
        <div className="col-span-6 lg:col-span-9">
          <p className="detail-label">: {stockDetail?.motor?.motor_name}</p>
        </div>
        <div className="lg:col-span-3 col-span-6">
          <p className="detail-label">Warna</p>
        </div>
        <div className="col-span-6 lg:col-span-9">
          <p className="detail-label">
            : {stockDetail?.color?.color_name || '-'}
          </p>
        </div>
        <div className="lg:col-span-3 col-span-6">
          <p className="detail-label">No. Rangka</p>
        </div>
        <div className="col-span-6 lg:col-span-9">
          <p className="detail-label">: {stockDetail?.unit_frame}</p>
        </div>
        <div className="lg:col-span-3  col-span-6">
          <p className="detail-label">No. Mesin</p>
        </div>
        <div className="col-span-6 lg:col-span-9">
          <p className="detail-label">: {stockDetail?.unit_engine}</p>
        </div>
        <div className="lg:col-span-3 col-span-6">
          <p className="detail-label">Status</p>
        </div>
        <div className="col-span-6 lg:col-span-9">
          <p className="detail-label">
            : {statusUnit(stockDetail?.unit_status)}
          </p>
        </div>
        <div className="col-span-12 pt-5">
          <p className="detail-title">History Unit</p>
        </div>
        <div className="col-span-12 rounded-t-xl overflow-auto">
          <table className={`border-collapse w-full dark:border-strokedark`}>
            <thead>
              <tr className="border-t border-stroke bg-primary-color text-white py-4.5 px-4 md:px-6 2xl:px-7.5">
                <th className="py-3">TANGGAL</th>
                <th>SALES ORDER</th>
                <th>AKSI</th>
                <th>STAFF</th>
                <th>DEALER</th>
                <th>NEQ</th>
                <th>EVENT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {dataHistory.map((item: any, index) => (
                <tr
                  className="border-t border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5 items-center"
                  key={index}
                >
                  <td className="text-center py-3 text-black">
                    {dayjsFormatDateTime(item?.created_at)}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.unit_log_number}
                  </td>
                  <td className="text-center py-3 text-black">
                    {statusAction(item?.unit_log_action)}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.user?.username}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.unit_log_dealer_name || '-'}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.unit_log_neq_name || '-'}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.unit_log_event_name || '-'}
                  </td>
                  <td className="text-center py-3 text-black">
                    {statusUnit(item?.unit_log_status)}
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
              onClick={() => navigate('/units/unit-list')}
              className="btn-back w-full lg:w-auto"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

export default UnitDetail;
