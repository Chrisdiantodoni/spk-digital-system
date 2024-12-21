import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import createStore from '../../../context';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../Forms/Button/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import priceList from '../../../Services/API/priceList';
import { SweetAlert } from '../../../utils/Swal';
import { ControllerInput } from '../../../utils/ControllerInput';
import SelectSelectedDealer from '../../Forms/SelectGroup/Master/SelectSelectedDealer';
import SelectNeq from '../../Forms/SelectGroup/SelectNeq';

const ModalClonePriceList: React.FC = () => {
  const modalState = createStore((state) => state.modal.modalClonePriceList);
  const handleModal = createStore((state) => state.handleModal);
  const handleLoading = createStore((state) => state.handleLoading);

  const { control, setValue, handleSubmit, watch } = useForm<any>({
    defaultValues: {
      discount: 0,
    },
  });

  const queryClient = useQueryClient();

  const { mutate: submitPriceList } = useMutation({
    mutationFn: async (data: any) => {
      handleLoading('CONFIRM', true);
      data = {
        ...data,
        location_before: data?.neq_before
          ? data?.neq_before?.value?.dealer_neq_id
          : data?.location_before?.value?.dealer_id, //bisa dealer_id atau dealer_neq_id
        location_after: data?.neq_after
          ? data?.neq_after?.value?.dealer_neq_id
          : data?.location_after?.value?.dealer_id, // sama juga bisa dealer_id atau dealer_neq_id
        location_type_after: data?.neq_after ? 'neq' : 'dealer', // ini tergantung dari location after nya kalo dealer_neq_id maka neq bgtu juga sebaliknya
      };
      const response = await priceList.clonePriceList(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        handleLoading('CONFIRM', false);
        queryClient.invalidateQueries({ queryKey: ['masterPriceList'] });
        SweetAlert('success', 'Price List Motor Diclone', 'Sukses');
        handleModal('modalClonePriceList', false);
      }
    },
  });

  const location_before = watch('location_before');
  const location_after = watch('location_after');

  //   useEffect(() =>
  //   {
  //     if(location_before?.type === 'dealer')

  //   }, [location_after, location_before])

  return (
    <Modal
      title="Clone Price List"
      activeModal={modalState}
      centered
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      onClose={() => handleModal('modalClonePriceList', false)}
      footerContent={
        <div className="flex gap-2">
          <Button
            label="CANCEL"
            className="btn-delete"
            onClick={() => handleModal('modalClonePriceList', false)}
          />
          <Button
            label="CONFIRM"
            className="btn-confirm"
            onClick={handleSubmit((data) => submitPriceList(data))}
          />
        </div>
      }
    >
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 detail-title text-base">ASAL</div>
        <div className="col-span-6">
          <p className="detail-label">MDS</p>
        </div>
        <div className="col-span-6">
          <p className="detail-label">NEQ</p>
        </div>
        <div className="col-span-6">
          <Controller
            name="location_before"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectSelectedDealer onChange={onChange} value={value} />
            )}
          />
        </div>
        <div className="col-span-6">
          <Controller
            name="neq_before"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectNeq
                onChange={onChange}
                value={value}
                dealer_id={location_before?.value?.dealer_id}
              />
            )}
          />
        </div>

        <div className="col-span-12 detail-title text-base">Clone Tujuan</div>

        <div className="col-span-6">
          <p className="detail-label">MDS</p>
        </div>
        <div className="col-span-6">
          <p className="detail-label">NEQ</p>
        </div>
        <div className="col-span-6">
          <Controller
            name="location_after"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectSelectedDealer onChange={onChange} value={value} />
            )}
          />
        </div>
        <div className="col-span-6">
          <Controller
            name="neq_after"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectNeq
                onChange={onChange}
                value={value}
                dealer_id={location_after?.value?.dealer_id}
              />
            )}
          />
        </div>
        <div className="col-span-12">
          <p className="detail-label">Discount (Rp.)</p>
        </div>
        <div className="col-span-12">
          <ControllerInput
            control={control}
            type={'currency'}
            name="discount"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalClonePriceList;
