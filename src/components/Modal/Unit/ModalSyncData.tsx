import { useEffect, useState } from 'react';
import createStore from '../../../context';
import Button from '../../Forms/Button/Button';
import flatpickr from 'flatpickr';
import DatePicker from '../../Forms/DatePicker/DatePicker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import unit from '../../../Services/API/unit';
import { SweetAlert } from '../../../utils/Swal';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import Modal from '../Modal';

function ModalSyncData() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      shipping_date: new Date(),
    },
  });
  const modalSyncData = createStore((state: any) => state.modal.modalSyncData);
  const handleCloseModal = createStore((state: any) => state.handleModal);
  const handleLoading = createStore((state: any) => state.handleLoading);

  const [defaultDate, setDefaultDate] = useState('');

  const queryClient = useQueryClient();

  const { mutate: handleSyncData } = useMutation({
    mutationFn: async (data: any) => {
      const body = {
        shipping_date: dayjs(data?.shipping_date).format('YYYY-MM-DD'),
      };
      handleLoading('Sync', true);
      const response = await unit.syncShippingData(body);
      return response;
    },
    onSuccess: (res: any) => {
      if (res?.meta?.code === 200) {
        SweetAlert('success', 'Sync Success', 'Success');
        handleLoading('Sync', false);
        handleCloseModal('modalSyncData', false);
        queryClient.invalidateQueries();
      }
    },
  });

  return (
    <Modal
      title={'Sync Data'}
      centered
      activeModal={modalSyncData}
      onClose={() => handleCloseModal('modalSyncData', false)}
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      parentClass="z-[999]"
    >
      <div className="grid grid-cols-12 items-center gap-y-10">
        <div className="col-span-12 items-center z-999999 ">
          <Controller
            name="shipping_date"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePicker label="Tanggal" value={value} onChange={onChange} />
            )}
          ></Controller>
        </div>
        <div className="col-span-12">
          <Button
            label="Sync"
            className={'btn-submit w-full'}
            onClick={handleSubmit((data: any) => handleSyncData(data))}
          />
        </div>
      </div>
    </Modal>
  );
}

export default ModalSyncData;
