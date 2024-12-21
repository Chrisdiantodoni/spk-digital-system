import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Container from '../../../components/Container';
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
import eventReturn from '../../../Services/API/eventReturn';
import Button from '../../../components/Forms/Button/Button';
import { Controller, useForm, useWatch } from 'react-hook-form';
import SelectUnitWithStatus from '../../../components/Forms/SelectGroup/SelectUnitWithStatus';
import { SweetAlert } from '../../../utils/Swal';

export default function ReturnEventDetail() {
  const { setTitle } = createStore();
  const [eventDetail, setEventDetail] = useState<any>({});
  const navigate = useNavigate();
  const [isNewUnitAdded, setIsNewUnitAdded] = useState(false);
  const { backBtn, confirmBtn, deleteBtn } = useButtonApproval();
  const { control } = useForm();
  const { id } = useParams<any | string>();

  const { isLoading } = useQuery({
    queryKey: ['detail_event'],
    queryFn: async () => {
      const response = await eventReturn.getEventReturnDetail(id);
      if (response?.meta.code === 200) {
        setEventDetail(response?.data);
        setDataUnit(response?.data?.event_return_unit);
      }
    },
  });

  const { mutate: handleDeleteEvent, isPending: loadingDelete } = useMutation({
    mutationFn: async () => {
      const response = await eventReturn.deleteEventReturn(id);
      return response;
    },
    onSuccess: (res) => {
      if (res.meta.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          text: 'Event berhasil dihapus',
          icon: 'success',
        });
        navigate('/events/return-event');
      }
    },
  });

  const queryClient = useQueryClient();

  const { mutate: handlRequestEventUnit, isPending: loadingRequest } =
    useMutation({
      mutationFn: async (data: any) => {
        const response = await eventReturn.updateEventStatus(id, data);
        return response;
      },
      onSuccess: (res) => {
        if (res.meta.code === 200) {
          Swal.fire({
            title: 'Sukses!',
            text: 'Status Event diupdate',
            icon: 'success',
          });
          navigate(`/events/return-event/${id}`);
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
          event_return_status:
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
  const onDelete = async (id: string) => {
    await handleDeleteReturnEventUnit(id);
  };

  const { mutate: handleDeleteReturnEventUnit } = useMutation({
    mutationFn: async (id: string) => {
      const response = await eventReturn.deleteEventUnitReturn(id);
      return response;
    },
    onSuccess(res) {
      if (res.meta.code === 200) {
        queryClient.invalidateQueries({ queryKey: ['detail_event'] });
      }
    },
  });

  useEffect(() => {
    setTitle('KEMBALI EVENT');
  }, []);

  const isShowingButton = () => {
    return eventDetail?.event_return_unit
      ?.map((item: any) => item?.event_list_unit?.unit?.unit_location_status)
      .some(Boolean);
  };

  const [dataUnit, setDataUnit] = useState([]);

  const handleDeleteDataUnit = (index: number) => {
    setIsNewUnitAdded(false);

    setDataUnit((prevState: any) =>
      prevState.filter((_item: any, idx: any) => idx !== index),
    );
  };

  // console.log(
  //   eventDetail?.event_return_unit?.map(
  //     (item) => item?.event_list_unit?.unit_location_status,
  //   ),
  // );

  const isDuplicateUnit = (unit_id: string) => {
    const checkUnitId = dataUnit.filter(
      (filter: any) => filter?.unit_id === unit_id,
    );
    if (checkUnitId.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const motor = useWatch<any>({
    control,
    name: 'motor',
  });

  const handleAddUnit = (item: any) => {
    if (!item) {
      SweetAlert('warning', 'Tidak ada unit yang terpilih', 'Perhatian');
    } else if (!isDuplicateUnit(item.unit_id)) {
      setIsNewUnitAdded(true);
      setDataUnit([
        {
          ...item?.unit,
          event_list_unit_id: item?.event_list_unit_id,
          added: true,
        },
        ...dataUnit,
      ]);
    } else {
      SweetAlert('error', 'Unit sudah ditambahkan');
    }
  };
  const isShownButtonEdit = () => {
    let isEditButtonShown = false;
    dataUnit.forEach((item: any) => {
      if (item?.added) {
        isEditButtonShown = true;
      }
    });
    return isEditButtonShown;
  };

  const { mutate: handleConfirmationEdit } = useMutation({
    mutationFn: async () => {
      const body = {
        event_return_unit: dataUnit?.map((item: any) => {
          const newItem: any = {
            event_list_unit_id: item?.event_list_unit_id,
          };
          if (item?.event_return_list_unit_id) {
            newItem.event_return_list_unit_id = item.event_return_list_unit_id;
          }
          return newItem;
        }),
      };
      const response = await eventReturn.updateEventReturn(id, body);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          text: 'Kembali Event Berhasil diupdate',
          icon: 'success',
        });
        queryClient.invalidateQueries({ queryKey: ['detail_event'] });
      }
    },
    onError: () => {
      Swal.fire({
        title: 'Error!',
        text: 'error',
        icon: 'error',
      });
    },
  });

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
      <div className="grid grid-cols-12 gap-6 ">
        <div className="lg:col-span-6 col-span-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-12 xsm:col-span-12 col-span-12">
              <span className="detail-title">DETAIL KEMBALI EVENT</span>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Tanggal Event</p>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <p className="detail-label">
                :{' '}
                {dayJsFormatDate(eventDetail?.master_event?.master_event_date)}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Nama Event</p>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <p className="detail-label">
                : {eventDetail?.master_event?.master_event_name}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Lokasi</p>
            </div>
            <div className="lg:col-span-9 col-span-6">
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
            <div className="lg:col-span-3 col-span-6">
              <span className="detail-label">Nomor Surat Jalan</span>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <span className="detail-label">
                :{' '}
                {eventDetail?.delivery_event_return?.delivery.delivery_number
                  ? eventDetail?.delivery_event_return?.delivery.delivery_number
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
                data={eventDetail?.event_return_log?.map((item: any) => ({
                  ...item,
                  created_at: (
                    <span>{dayjsFormatDateTime(item.created_at)}</span>
                  ),
                  event_return_log_action: (
                    <span>{statusEvent(item.event_return_log_action)}</span>
                  ),
                }))}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <div className="grid grid-cols-1 lg:flex gap-x-4 gap-y-5">
            {backBtn({ onClick: () => navigate('/events/return-event') })}

            {eventDetail?.event_return_status === 'create' && (
              <>
                {isShowingButton() && (
                  <>
                    {loadingRequest ? (
                      <LoaderButton
                        className={'btn-confirm lg:w-auto w-full'}
                      />
                    ) : (
                      confirmBtn({ onClick: () => handleRequest('approve') })
                    )}
                  </>
                )}
                {loadingDelete ? (
                  <LoaderButton className={'btn-delete lg:w-auto w-full'} />
                ) : (
                  deleteBtn({
                    onClick: () => handleDelete(id),
                  })
                )}
                {isShownButtonEdit() && (
                  // <Button
                  //   isButton={false}
                  //   to={`/events/return-event/form?id=${eventDetail?.event_return_id}`}
                  //   className="btn-edit w-full lg:w-auto"
                  //   label="EDIT"
                  // />
                  <Button
                    className="btn-edit w-full lg:w-auto"
                    label="SAVE"
                    onClick={() => handleConfirmationEdit()}
                  />
                )}
              </>
            )}
            {eventDetail?.event_return_status === 'approve' && (
              <>
                {
                  !eventDetail?.delivery_event_return?.delivery
                    .delivery_number && (
                    <Button
                      isButton={false}
                      to={`/units/unit-delivery/new/?type=event_return&id=${id}`}
                      label="SURAT JALAN"
                      className="btn-confirm  w-full lg:w-auto"
                    />
                  )
                  // createDeliveryBtn({
                  //   onClick: () =>
                  //     navigate(
                  //       `/units/unit-delivery/new/?type=event_return&id=${id}`,
                  //     ),
                  // })
                }
              </>
            )}
          </div>
        </div>
        {eventDetail?.event_return_status === 'create' && (
          <div className="col-span-12">
            {isShowingButton() && (
              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12">
                  <div className="detail-title">TAMBAH UNIT</div>
                </div>
                <div className="col-span-12 lg:col-span-2 flex items-center">
                  <label className="detail-label" htmlFor="chassis_no">
                    No. Rangka
                  </label>
                </div>
                <div className="col-span-12 lg:col-span-10 gap-2 flex items-center">
                  <p className="hidden lg:block">:</p>
                  <div className="w-full lg:w-2/5">
                    <Controller
                      name="motor"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <SelectUnitWithStatus
                          onChange={onChange}
                          value={value}
                          status={'return_event'}
                          event_id={eventDetail?.master_event_id}
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-2 flex items-center">
                  <label htmlFor="engine_No" className="detail-label">
                    No. Mesin
                  </label>
                </div>

                <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
                  <p className="hidden lg:block">:</p>
                  <input
                    id="engine_No"
                    type="text"
                    value={
                      motor?.value?.unit?.unit_engine ||
                      'Nomor mesin tidak ditemukan...'
                    }
                    readOnly
                    className="text-input w-full lg:w-2/5"
                  />
                </div>
                <div className="col-span-2 hidden lg:block" />
                <div className="col-span-12 lg:col-span-10">
                  <Button
                    label="ADD UNIT"
                    className={'btn-confirm w-auto'}
                    onClick={() => handleAddUnit(motor?.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="col-span-12">
          <div className="detail-title">LIST UNIT</div>
        </div>
        <div className="col-span-12">
          <Table
            headers={headersUnit}
            data={dataUnit?.map((item: any, index: number) => ({
              ...item,
              no: <span>{index + 1}</span>,
              created_at: <span>{dayjsFormatDateTime(item.created_at)}</span>,
              unit_type: (
                <span>
                  {item?.event_list_unit?.unit?.motor?.motor_name ||
                    item?.motor?.motor_name}
                </span>
              ),
              unit_frame: (
                <span>
                  {item?.event_list_unit?.unit?.unit_frame || item?.unit_frame}
                </span>
              ),
              unit_engine: (
                <span>
                  {item?.event_list_unit?.unit?.unit_engine || item?.unit_frame}
                </span>
              ),
              unit_color: (
                <span>
                  {item?.event_list_unit?.unit?.color?.color_name ||
                    item?.color?.color_name}
                </span>
              ),
              action: eventDetail?.event_return_status === 'create' && (
                <span>
                  {item?.event_return_list_unit_id ? (
                    <Button
                      label="HAPUS"
                      className="btn-delete"
                      onClick={() => onDelete(item?.event_return_list_unit_id)}
                    />
                  ) : (
                    <Button
                      label="HAPUS"
                      className="btn-delete"
                      onClick={() => handleDeleteDataUnit(index)}
                    />
                  )}
                </span>
              ),
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
  { title: 'AKSI', key: 'event_return_log_action' },
];

const headersUnit = [
  { title: 'NO.', key: 'no' },
  {
    title: 'TIPE MOTOR',
    key: 'unit_type',
  },
  {
    title: 'NO. RANGKA',
    key: 'unit_frame',
  },
  {
    title: 'NO. MESIN',
    key: 'unit_engine',
  },
  {
    title: 'WARNA',
    key: 'unit_color',
  },
  { title: 'AKSI', key: 'action' },
];
