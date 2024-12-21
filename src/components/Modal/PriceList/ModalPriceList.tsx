import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import createStore from '../../../context';
import { ControllerInput } from '../../../utils/ControllerInput';
import { useForm } from 'react-hook-form';
import Button from '../../Forms/Button/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import priceList from '../../../Services/API/priceList';
import Loader2 from '../../../common/Loader/Loader';
import { SweetAlert } from '../../../utils/Swal';

const ModalPriceList: React.FC = () => {
  const modalState = createStore((state) => state.modal.modalPriceList);
  const handleModal = createStore((state) => state.handleModal);
  const handleLoading = createStore((state) => state.handleLoading);
  const [priceListData, setPriceListData] = useState<any>({});
  const id = createStore((state: any) => state.modalItem);

  const { control, setValue, handleSubmit } = useForm<any>({
    defaultValues: {
      discount: 0,
    },
  });

  const { mutate: getPriceListDetail, isPending } = useMutation({
    mutationFn: async () => {
      const response = await priceList.getPriceListDetail(id);
      setPriceListData(response?.data);
      setValue('off_the_road', response?.data?.off_the_road);
      setValue('bbn', response?.data?.bbn);
      setValue('discount', response?.data?.discount);
      return response;
    },
  });

  useEffect(() => {
    if (id) {
      getPriceListDetail();
    }
  }, [id]);

  const queryClient = useQueryClient();

  const { mutate: submitPriceList } = useMutation({
    mutationFn: async (data: any) => {
      handleLoading('CONFIRM', true);
      const response = await priceList.updatePriceList(id, data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        handleLoading('CONFIRM', false);
        queryClient.invalidateQueries({ queryKey: ['masterPriceList'] });
        SweetAlert('success', 'Price List Motor Diupdate', 'Sukses');
        handleModal('modalPriceList', false);
      }
    },
  });

  return isPending ? (
    <Modal
      title="Modal PriceList"
      activeModal={modalState}
      centered
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      onClose={() => handleModal('modalPriceList', false)}
    >
      <Loader2 />
    </Modal>
  ) : (
    <Modal
      title="Update Price List"
      activeModal={modalState}
      centered
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      onClose={() => handleModal('modalPriceList', false)}
      footerContent={
        <div className="flex gap-2">
          <Button
            label="CANCEL"
            className="btn-delete"
            onClick={() => handleModal('modalPriceList', false)}
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
        <div className="col-span-12">
          <p className="detail-label">Lokasi</p>
        </div>
        <div className="col-span-12">
          <p className="detail-label">
            {priceListData?.dealer?.dealer_name ||
              priceListData?.dealer_neq?.dealer_neq_name}
          </p>
        </div>
        <div className="col-span-12">
          <p className="detail-label">Tipe Unit</p>
        </div>
        <div className="col-span-12">
          <p className="detail-label">{priceListData?.motor?.motor_name}</p>
        </div>
        <div className="col-span-12">
          <p className="detail-label">Off The Road</p>
        </div>
        <div className="col-span-12">
          <ControllerInput
            name="off_the_road"
            control={control}
            type="currency"
          />
        </div>
        <div className="col-span-12">
          <p className="detail-label">BBN</p>
        </div>
        <div className="col-span-12">
          <ControllerInput name="bbn" control={control} type="currency" />
        </div>
        <div className="col-span-12">
          <p className="detail-label">Discount</p>
        </div>
        <div className="col-span-12">
          <ControllerInput name="discount" control={control} type="currency" />
        </div>
      </div>
    </Modal>
  );
};

export default ModalPriceList;
