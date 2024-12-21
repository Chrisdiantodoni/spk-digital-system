import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Container from '../../../components/Container';
import event from '../../../Services/API/event';
import createStore from '../../../context';
import { useEffect, useState } from 'react';
import Loader2 from '../../../common/Loader/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { dayJsFormatDate, dayjsFormatDateTime } from '../../../utils/dayjs';
import Table from '../../../components/Tables/Table';
import { statusEvent } from '../../../utils/statusUtils';
import Swal from 'sweetalert2';
import LoaderButton from '../../../common/Loader/LoaderButton';
import { useButtonApproval } from '../../../hooks/useButtonApproval';
import Button from '../../../components/Forms/Button/Button';

export default function EventDetail() {
  const { setTitle } = createStore();
  const [eventDetail, setEventDetail] = useState<any>({});
  const navigate = useNavigate();

  const { backBtn, confirmBtn, deleteBtn } = useButtonApproval();

  const { id } = useParams<string>();

  const { isLoading } = useQuery({
    queryKey: ['detail_event'],
    queryFn: async () => {
      const response = await event.getEventDetail(id);
      if (response?.meta.code === 200) {
        setEventDetail(response?.data);
      }
    },
  });

  const { mutate: handleDeleteEvent, isPending: loadingDelete } = useMutation({
    mutationFn: async () => {
      const response = await event.deleteEventDetail(id);
      return response;
    },
    onSuccess: (res) => {
      if (res.meta.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          text: 'Event berhasil dihapus',
          icon: 'success',
        });
        navigate('/events/transfer-event');
      }
    },
  });

  const queryClient = useQueryClient();

  const { mutate: handlRequestEventUnit, isPending: loadingRequest } =
    useMutation({
      mutationFn: async (data: any) => {
        const response = await event.updateEventStatus(id, data);
        return response;
      },
      onSuccess: (res) => {
        if (res.meta.code === 200) {
          Swal.fire({
            title: 'Sukses!',
            text: 'Status Event diupdate',
            icon: 'success',
          });
          navigate(`/events/transfer-event/${id}`);
          queryClient.invalidateQueries({ queryKey: ['detail_event'] });
        }
      },
    });

  const handleRequest = (status: string) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#D40000',
      confirmButtonText: 'YES',
      confirmButtonColor: '#00029D',
      showLoaderOnConfirm: loadingRequest,
    }).then((result) => {
      if (result.isConfirmed) {
        const event_status: any = {
          event_status:
            status === 'approve'
              ? 'approve'
              : status === 'request'
              ? 'request'
              : 'cancel',
        };
        handlRequestEventUnit(event_status);
      }
    });
  };

  const handleDelete = (id: any) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'NO',
      confirmButtonColor: '#D40000',
      confirmButtonText: 'YES',
      cancelButtonColor: '#00029D',
      showLoaderOnConfirm: loadingDelete,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteEvent(id);
      }
    });
  };

  useEffect(() => {
    setTitle('TRANSFER EVENT');
  }, []);

  const isShowingButton = () => {
    return eventDetail?.event_unit
      .map((item: any) => !item?.unit?.unit_location_status)
      .some(Boolean);
  };
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
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-6 col-span-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-12 xsm:col-span-12 col-span-12">
              <span className="detail-title">DETAIL TRANSFER EVENT</span>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Tanggal Event</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">
                :{' '}
                {dayJsFormatDate(eventDetail?.master_event?.master_event_date)}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Nama Event</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">
                : {eventDetail?.master_event?.master_event_name}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Lokasi</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">
                : {eventDetail?.master_event?.master_event_location}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Catatan</p>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <p className="detail-label">
                : {eventDetail?.master_event?.master_event_note}
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 col-span-12">
          <div className="grid grid-cols-12 gap-y-3">
            <div className="lg:col-span-12 col-span-12">
              <span className="detail-title">DETAIL SURAT JALAN</span>
            </div>
            <div className="lg:col-span-3  col-span-6">
              <span className="detail-label">Nomor Surat Jalan</span>
            </div>
            <div className="lg:col-span-8 col-span-6">
              <span className="detail-label">
                :{' '}
                {eventDetail?.delivery_event?.delivery?.delivery_number
                  ? eventDetail?.delivery_event?.delivery?.delivery_number
                  : 'Belum Terbit'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-y-3 mt-10">
            <div className="lg:col-span-12 col-span-12">
              <span className="detail-title">LOG AKTIVITAS</span>
            </div>
            <div className="lg:col-span-12 col-span-12">
              <Table
                headers={headers}
                data={eventDetail?.event_log?.map((item: any) => ({
                  ...item,
                  created_at: (
                    <span>{dayjsFormatDateTime(item.created_at)}</span>
                  ),
                  event_log_action: (
                    <span>{statusEvent(item.event_log_action)}</span>
                  ),
                }))}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12 ">
          <div className="grid grid-cols-1 lg:flex items-center gap-x-4 gap-y-3">
            {backBtn({ onClick: () => navigate('/events/transfer-event') })}
            {eventDetail?.event_status === 'create' && (
              <>
                {isShowingButton() ? (
                  <>
                    <Button
                      isButton={false}
                      to={`/events/transfer-event/form?id=${eventDetail?.event_id}`}
                      className="btn-edit w-full lg:w-auto"
                      label="EDIT"
                    />
                    {loadingRequest ? (
                      <LoaderButton
                        className={'btn-confirm w-full lg:w-auto'}
                      />
                    ) : (
                      confirmBtn({ onClick: () => handleRequest('approve') })
                    )}
                  </>
                ) : null}
                {loadingDelete ? (
                  <LoaderButton className={'btn-delete w-full lg:w-auto'} />
                ) : (
                  deleteBtn({
                    onClick: () => handleDelete(id),
                  })
                )}
              </>
            )}
            {eventDetail?.event_status === 'approve' && (
              <>
                {
                  !eventDetail?.delivery_event?.delivery?.delivery_number && (
                    <Button
                      isButton={false}
                      to={`/units/unit-delivery/new/?type=event&id=${id}`}
                      label="SURAT JALAN"
                      className="btn-confirm  w-full lg:w-auto"
                    />
                  )
                  // createDeliveryBtn({
                  //   onClick: () =>
                  //     navigate(`),
                  // })
                }
              </>
            )}
          </div>
        </div>
        <div className="col-span-12">
          <Table
            headers={headersUnit}
            data={eventDetail?.event_unit?.map((item: any, index: number) => ({
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

const headers = [
  { title: 'TANGGAL', key: 'created_at' },
  { title: 'STAFF', key: 'user.username' },
  { title: 'AKSI', key: 'event_log_action' },
];

const headersUnit = [
  { title: 'NO.', key: 'no' },
  { title: 'TIPE MOTOR', key: 'unit.motor.motor_name' },
  { title: 'NO. RANGKA', key: 'unit.unit_frame' },
  { title: 'NO. MESIN', key: 'unit.unit_engine' },
  { title: 'WARNA', key: 'unit.color.color_name' },
];
