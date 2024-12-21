import createStore from '../../../context';
import Button from '../../Forms/Button/Button';
import Modal from '../Modal';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from '../../Forms/DatePicker/DatePicker';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import LoaderButton from '../../../common/Loader/LoaderButton';
import master from '../../../Services/API/master';
import { SweetAlert } from '../../../utils/Swal';
import { useEffect } from 'react';
import { useButtonApproval } from '../../../hooks/useButtonApproval';

function ModalEventForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      event_date: new Date(),
      event_name: '',
      location: '',
      note: '',
    },
  });
  const queryClient = useQueryClient();

  const handleCloseModal = createStore((state: any) => state.handleModal);
  const modalEventForm = createStore(
    (state: any) => state.modal.modalEventForm,
  );
  const item = createStore((state: any) => state.modalItem);

  const { mutate: handleAddEvent, isPending } = useMutation({
    mutationFn: async () => {
      const body = {
        master_event_date: dayjs(getValues('event_date')).format('YYYY-MM-DD'),
        master_event_name: getValues('event_name'),
        master_event_location: getValues('location'),
        master_event_note: getValues('note'),
      };
      if (item) {
        const response = await master.updateEvent(item?.master_event_id, body);
        return response;
      }
      const response = await master.createEvent(body);
      return response;
    },
    onSuccess: async (res: any) => {
      if (res.meta.code === 200 && item) {
        SweetAlert('success', 'Event diupdate', 'Sukses');
        handleCloseModal('modalEventForm', false);
        queryClient.invalidateQueries({ queryKey: ['detail_event'] });
      }
      if (res.meta.code === 200 && !item) {
        reset();
        SweetAlert('success', 'Event ditambahkan', 'Sukses');
        handleCloseModal('modalEventForm', false);
        queryClient.invalidateQueries({ queryKey: ['eventList'] });
      }
    },
    onError: () => {
      SweetAlert('error', 'Terjadi Error', 'Error');
    },
  });

  const handleAddModal = () => {
    handleAddEvent();
  };

  useEffect(() => {
    if (item) {
      setValue<any>(
        'event_date',
        dayjs(item?.master_event_date).format('MMM DD, YYYY'),
      );
      setValue('event_name', item?.master_event_name);
      setValue('location', item?.master_event_location);
      setValue('note', item?.master_event_note);
    } else {
      reset();
    }
  }, [item]);

  const { backFormBtn } = useButtonApproval();

  return (
    <Modal
      title={item ? 'Edit Event' : 'Tambah Event'}
      onClose={() => handleCloseModal('modalEventForm', false, item)}
      activeModal={modalEventForm}
      centered
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      // className="w-1/3 h-auto rounded-md"
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <label className="detail-label" htmlFor="date">
            Tanggal
          </label>
          <Controller
            name="event_date"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                divClassName="w-full"
                onChange={onChange}
                value={value}
              />
            )}
          />
        </div>
        <div className="col-span-12">
          <label className="detail-label" htmlFor="event_name">
            Nama Event
          </label>
          <div className="flex items-center w-full">
            <input
              className="text-input my-3"
              {...register('event_name', {
                required: 'Nama Event harus diisi.',
              })}
            />
          </div>
          {errors.event_name && (
            <div className="col-span-12">
              <span className="text-red-600">{errors.event_name.message}</span>
            </div>
          )}
        </div>
        <div className="col-span-12">
          <label className="detail-label" htmlFor="location">
            Lokasi
          </label>
          <div className="flex items-center w-full">
            <input
              className="text-input my-3"
              {...register('location', {
                required: 'Lokasi Event harus diisi.',
              })}
            />
          </div>
          {errors.location && (
            <>
              <div className="col-span-12">
                <span className="text-red-600">{errors.location.message}</span>
              </div>
            </>
          )}
        </div>
        <div className="col-span-12">
          <label className="detail-label" htmlFor="note">
            Catatan
          </label>
          <div className="flex items-center w-full">
            <textarea
              className="text-area my-3"
              {...register('note')}
            ></textarea>
          </div>
          {errors.note && (
            <>
              <div className="col-span-12">
                <span className="text-red-600">{errors.note.message}</span>
              </div>
            </>
          )}
        </div>
        <div className="col-span-12 flex justify-end items-end gap-5 ">
          <div>
            {backFormBtn({
              onClick: () => handleCloseModal('modalEventForm', false),
            })}
          </div>
          {/* <Button
            label="CANCEL"
            Icon={<XCircle size={18} />}
            onClick={() => handleCloseModal('modalEventForm', false, item)}
            className={'btn-back'}
          /> */}
          {isPending ? (
            <>
              <LoaderButton
                className={'btn-confirm w-50 text-center justify-center'}
              />
            </>
          ) : (
            <>
              <Button
                label={item ? 'EDIT EVENT' : 'TAMBAH EVENT'}
                className="btn-confirm w-50"
                onClick={handleSubmit(handleAddModal)}
              />
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ModalEventForm;
