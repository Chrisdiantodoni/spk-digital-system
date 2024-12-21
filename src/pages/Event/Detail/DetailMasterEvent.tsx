import { useQuery } from '@tanstack/react-query';
import Container from '../../../components/Container';
import createStore from '../../../context';
import { useEffect, useState } from 'react';
import Loader2 from '../../../common/Loader/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { dayJsFormatDate, dayjsFormatDateTime } from '../../../utils/dayjs';
import Table from '../../../components/Tables/Table';
import { useButtonApproval } from '../../../hooks/useButtonApproval';
import ModalEventForm from '../../../components/Modal/Event/ModalEventForm';
import master from '../../../Services/API/master';

export default function DetailMasterEvent() {
  const { setTitle, handleModal } = createStore();
  const [eventDetail, setEventDetail] = useState<any>({});
  const [eventUnit, setEventUnit] = useState<any>({});
  const navigate = useNavigate();

  const { backBtn, editBtn } = useButtonApproval();

  const { id } = useParams<string>();

  const { isLoading } = useQuery({
    queryKey: ['detail_event'],
    queryFn: async () => {
      const response = await master.getEventDetail(id);
      if (response?.meta.code === 200) {
        let mergedEventUnits: any = [];
        setEventDetail(response?.data);
        response.data?.event.forEach((event: any) => {
          mergedEventUnits = mergedEventUnits.concat(event.event_unit);
        });

        setEventUnit(mergedEventUnits);
        // setEventUnit(
        //   response.data?.event?.reduce((acc: any, curr: any) => {
        //     acc.push(...curr.event_unit);
        //     return acc || [];
        //   }, []),
        // );
      }
      return response;
    },
  });

  const handleTotalUnitTransferEvent = (eventList: any) => {
    return eventList.reduce(
      (total: any, num: any) => total + num?.event_unit_total,
      0,
    );
  };

  useEffect(() => {
    setTitle('DETAIL EVENT');
  }, []);

  return isLoading ? (
    <Container>
      <div className="grid grid-cols-12">
        <div className="col-span-12 h-100 items-center justify-center flex">
          <Loader2 />
        </div>
      </div>
    </Container>
  ) : (
    <Container>
      <ModalEventForm />
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-6 col-span-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-12 col-span-12">
              <span className="detail-title">DETAIL EVENT</span>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Tanggal Event</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {dayJsFormatDate(eventDetail?.master_event_date)}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Nama Event</p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">: {eventDetail?.master_event_name}</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">Lokasi</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {eventDetail?.master_event_location}
              </p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">Catatan</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">: {eventDetail?.master_event_note}</p>
            </div>
          </div>
        </div>

        <div className="col-span-12  mt-10">
          <div className="grid grid-cols-1 lg:flex items-center gap-x-4">
            {backBtn({ onClick: () => navigate(-1) })}

            {handleTotalUnitTransferEvent(eventDetail?.event) === 0 && (
              <>
                {editBtn({
                  onClick: () =>
                    handleModal('modalEventForm', true, eventDetail),
                })}
              </>
            )}
          </div>
        </div>
        <div className="col-span-6">
          <p className="detail-title">LIST UNIT</p>
        </div>
        <div className="col-span-6">
          <p className="detail-label font-semibold text-lg flex items-end justify-end mr-10">
            Total Unit : {handleTotalUnitTransferEvent(eventDetail?.event)}
          </p>
        </div>
        <div className="col-span-12">
          <Table
            headers={headersUnit}
            data={eventUnit?.map((item: any, index: number) => ({
              ...item,
              no: <span>{index + 1}</span>,
              created_at: <span>{dayjsFormatDateTime(item.created_at)}</span>,
            }))}
          />
        </div>
      </div>
    </Container>
  );
}

const headersUnit = [
  { title: 'NO.', key: 'no' },
  { title: 'TIPE MOTOR', key: 'unit.motor.motor_name' },
  { title: 'NO. RANGKA', key: 'unit.unit_frame' },
  { title: 'NO. MESIN', key: 'unit.unit_engine' },
  { title: 'WARNA', key: 'unit.color.color_name' },
];
