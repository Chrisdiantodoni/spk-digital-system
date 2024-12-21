import { useNavigate } from 'react-router-dom';
import Container from '../../../components/Container';
import Button from '../../../components/Forms/Button/Button';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import queryStrings from 'query-string';
import Loader2 from '../../../common/Loader/Loader';
import { useForm, Controller, useWatch } from 'react-hook-form';
import SelectMotor from '../../../components/Forms/SelectGroup/SelectMotor';
import { SweetAlert } from '../../../utils/Swal';
import createStore from '../../../context';
import dayjs from 'dayjs';
import SelectEvent from '../../../components/Forms/SelectGroup/SelectEvent';
import SelectUnitNew from '../../../components/Forms/SelectGroup/SelectUnitNew';
import LoaderButton from '../../../common/Loader/LoaderButton';
import event from '../../../Services/API/event';
import { useButtonApproval } from '../../../hooks/useButtonApproval';

export default function TransferEventForm() {
  const navigate = useNavigate();
  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      event: '',
      unit_name: '',
      motor: '',
      selected_unit: {},
    },
  });

  const eventDetail = useWatch<any>({
    control,
    name: 'event',
  });

  const units = useWatch<any>({
    control,
    name: 'unit_name',
  });

  const motor = useWatch<any>({
    control,
    name: 'motor',
  });

  const [dataUnit, setDataUnit] = useState<string[]>([]);
  const { id } = queryStrings.parse(location.search) as { id: string };
  const [isLoading, setIsLoading] = useState(false);
  const { setTitle } = createStore();

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

  const handleAddUnit = (item: any) => {
    if (!item) {
      SweetAlert('warning', 'Tidak ada unit yang terpilih', 'Perhatian');
    } else if (item?.unit_location_status) {
      SweetAlert(
        'warning',
        item?.unit_location_status === 'neq'
          ? 'Unit sedang berada di NEQ harap di retur terlebih dahulu'
          : 'Unit sudah berada di event',
        'Perhatian',
      );
    } else if (!isDuplicateUnit(item.unit_id)) {
      setDataUnit([{ ...item, is_delete: false }, ...dataUnit]);
      console.log(dataUnit);
    } else {
      SweetAlert('error', 'Unit sudah ditambahkan');
    }
  };

  const { mutate: handleConfirmation, isPending } = useMutation({
    mutationKey: ['add_transfer_event'],
    mutationFn: async (data: any) => {
      data = {
        ...data,
        master_event_id: eventDetail?.value?.master_event_id,
        event_unit: dataUnit?.map((item: any) => {
          const newItem: any = {
            unit_id: item?.unit_id,
            is_delete: item?.is_delete,
          };
          if (item.event_list_unit_id !== undefined) {
            newItem.event_list_unit_id = item.event_list_unit_id;
          }
          return newItem;
        }),
      };
      // console.log(data);
      // return;
      if (id) {
        const response = await event.updateEvent(id, data);
        return response;
      }

      const response = await event.createEvent(data);
      return response;
    },
    onSuccess: (res: any) => {
      if (res?.meta?.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          text: 'Unit berhasil ditambahkan',
          icon: 'success',
        });
        if (id) {
          navigate(`/events/transfer-event/${id}`);
        } else {
          navigate(`/events/transfer-event/${res?.data?.event?.event_id}`);
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'error',
          icon: 'error',
        });
      }
    },
  });

  const handleDeleteDataUnit = (unit: any) => {
    let updatedDataUnit = [];
    if (unit?.event_list_unit_id) {
      updatedDataUnit = dataUnit.map((item: any) =>
        item.event_list_unit_id === unit.event_list_unit_id
          ? { ...item, is_delete: !item.is_delete } // Mark for deletion
          : item,
      );
    } else {
      updatedDataUnit = dataUnit.filter(
        (filter: any) => filter.unit_id !== unit?.unit_id,
      );
    }
    setDataUnit(updatedDataUnit);
  };

  const handleRequest = () => {
    if (dataUnit?.length === 0) {
      SweetAlert('warning', 'Unit event masih kosong', 'perhatian');
      return;
    }
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#D40000',
      confirmButtonText: 'YES',
      confirmButtonColor: '#00029D',
      showLoaderOnConfirm: isPending,
    }).then((result) => {
      console.log({ result });
      if (result.isConfirmed) {
        onSubmit();
      }
    });
  };

  const onSubmit = async () => {
    const data = {};
    await handleConfirmation(data);
  };

  useEffect(() => {
    setTitle('TRANSFER EVENT');
  }, []);

  const getDetailTransferEvent = async () => {
    setIsLoading(true);
    await event
      .getEventDetail(id)
      .then((res: any) => {
        if (res.meta.code == 200) {
          setValue('event', { value: res.data.master_event });
          setDataUnit(
            res?.data?.event_unit.map((item: any) => ({
              ...item.unit,
              is_delete: false,
              event_list_unit_id: item?.event_list_unit_id,
            })),
          );
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (id) {
      getDetailTransferEvent();
    }
  }, [id]);

  useEffect(() => {
    if (!units) {
      setValue('motor', '');
    }
  }, [units]);

  const { backFormBtn, addUnitBtn } = useButtonApproval();

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
        <div className="col-span-12">
          <p className="detail-title">FORM TRANSFER EVENT</p>
        </div>
        <div className="col-span-12 lg:col-span-2 flex items-center">
          <label htmlFor="event_name" className="detail-label">
            Nama Event
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="hidden lg:block">:</p>
          <div className="lg:w-2/5 w-full">
            <Controller
              name="event"
              rules={{ required: 'Event wajib dipilih' }}
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectEvent
                  onChange={onChange}
                  value={value}
                  eventName={eventDetail?.value?.master_event_name}
                />
              )}
            />
          </div>
        </div>
        {errors.event && (
          <>
            <div className="col-span-2 hidden lg:block"></div>
            <div className="col-span-10">
              <span className="text-danger">
                {errors.event.message?.toString()}
              </span>
            </div>
          </>
        )}
        <div className="col-span-12 lg:col-span-2 flex items-center">
          <label htmlFor="event_name" className="detail-label">
            Tanggal Event
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="hidden lg:block">:</p>
          <input
            id="event_name"
            type="text"
            readOnly
            value={
              eventDetail?.value?.master_event_date
                ? dayjs(eventDetail?.value?.master_event_date).format(
                    'MMM DD, YYYY',
                  )
                : 'Belum ada event terpilih.'
            }
            className="border border-stroke p-2 rounded-md w-full lg:w-2/5 text-black"
          />
        </div>

        <div className="col-span-12 lg:col-span-2 flex items-center">
          <label htmlFor="event_name" className="detail-label">
            Lokasi
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="hidden lg:block">:</p>
          <input
            id="event_location"
            type="text"
            readOnly
            value={
              eventDetail?.value?.master_event_location ||
              'Belum ada event terpilih.'
            }
            className="text-input w-full lg:w-2/5"
          />
        </div>

        <div className="col-span-12 lg:col-span-2 flex">
          <label htmlFor="driverName" className="detail-label">
            Catatan
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex  gap-2">
          <p className="hidden lg:block">:</p>
          <div className="w-full lg:w-2/5">
            <textarea
              value={
                eventDetail?.value?.master_event_note ||
                'Belum ada event terpilih'
              }
              readOnly
              className="text-area"
            />
          </div>
        </div>

        <div className="col-span-12 my-10">
          <hr />
        </div>
        <div className="col-span-12 lg:col-span-2 flex items-center">
          <label className="detail-label" htmlFor="motor_type">
            Tipe Motor
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="hidden lg:block">:</p>
          <div className="w-full lg:w-2/5">
            <Controller
              name="unit_name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectMotor onChange={onChange} value={value} />
              )}
            />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-2 flex items-center">
          <label className="detail-label" htmlFor="chassis_no">
            No. Rangka
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 gap-2 flex items-center">
          <p className="hidden lg:block"> :</p>
          <div className="w-full lg:w-2/5">
            <Controller
              name="motor"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectUnitNew
                  onChange={onChange}
                  value={value}
                  motor_id={units?.value}
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
              motor?.value?.unit_engine || 'Nomor mesin tidak ditemukan...'
            }
            readOnly
            className="text-input w-full lg:w-2/5"
          />
        </div>
        <div className="col-span-2 hidden lg:block" />
        <div className="col-span-12 lg:col-span-10">
          {addUnitBtn({ onClick: () => handleAddUnit(motor?.value) })}
        </div>
        <div className="col-span-12">
          <div className="grid grid-cols-1 lg:flex gap-x-4 gap-y-5">
            {backFormBtn({ onClick: () => navigate(-1) })}
            {isPending ? (
              <LoaderButton className={`btn-request w-auto`} />
            ) : (
              <Button
                label="TRANSFER EVENT"
                onClick={handleSubmit(handleRequest)}
                className={'btn-request w-auto'}
              />
            )}

            {/* {addUnitBtn({ onClick: () => handleAddUnit(motor?.value) })} */}
          </div>
        </div>
        <div className="col-span-12">
          <p className="detail-title">LIST UNIT</p>
        </div>
        <div className="col-span-12 rounded-t-xl overflow-auto">
          <table className={`border-collapse w-full dark:border-strokedark`}>
            <thead>
              <tr className="border-t bg-primary-color text-white border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5">
                <th className="py-3">NO.</th>
                <th>TIPE MOTOR</th>
                <th>NO. RANGKA</th>
                <th>NO. MESIN</th>
                <th>WARNA</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {dataUnit?.map((item: any, index: number) => (
                <tr
                  key={index}
                  className="border-t border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5 items-center"
                >
                  <td className="text-center py-3 text-black">{index + 1}</td>
                  <td className="text-center py-3 text-black">
                    {item?.motor?.motor_name}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.unit_frame}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.unit_engine}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.color.color_name}
                  </td>
                  <td className="text-center py-3 text-black">
                    <Button
                      label={item?.is_delete ? 'BATAL HAPUS' : 'HAPUS'}
                      className="btn-delete text-sm"
                      onClick={() => handleDeleteDataUnit(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
