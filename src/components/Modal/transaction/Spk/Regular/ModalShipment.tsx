import { useEffect } from 'react';
import createStore from '../../../../../context';
import SelectUnitNew from '../../../../Forms/SelectGroup/SelectUnitNew';
import { Controller, useForm, useWatch } from 'react-hook-form';
import useUnitYear from '../../../../../hooks/useUnitYear';
import Button from '../../../../Forms/Button/Button';
import { useButtonApproval } from '../../../../../hooks/useButtonApproval';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import spk from '../../../../../Services/API/transaction/spk';
import { useParams } from 'react-router-dom';
import { SweetAlert } from '../../../../../utils/Swal';
import { formatRupiah } from '../../../../../utils/formatter';
import Swal from 'sweetalert2';
import Modal from '../../../Modal';

const ModalShipment = ({ detailUnit }: any) => {
  const { setValue, handleSubmit, control, register, reset } = useForm<any>({
    defaultValues: {
      spk_shipment_chassis_number: '',
      spk_shipment_engine_no: '',
      spk_shipment_unit_year: '',
    },
  });

  const { id } = useParams();
  const handleModal = createStore((state: any) => state.handleModal);
  const handleLoading = createStore((state: any) => state.handleLoading);
  const modalShipmentRegular = createStore(
    (state: any) => state.modal.modalShipmentRegular,
  );

  const units = useWatch({
    control: control,
    name: 'spk_shipment_chassis_number',
  });

  useEffect(() => {
    if (units) {
      setValue('spk_shipment_engine_no', units?.value?.unit_engine);
      setValue('spk_shipment_unit_year', year);
    } else {
      setValue('spk_shipment_chassis_number', null);
      setValue('spk_shipment_engine_no', null);
      setValue('spk_shipment_unit_year', null);
    }
  }, [units]);

  const year = useUnitYear(units?.value?.unit_frame);
  const { backFormBtn } = useButtonApproval();
  const queryClient = useQueryClient();

  const { mutate: handleSubmitShipment } = useMutation({
    mutationFn: async (data: any) => {
      data = {
        unit_id: units?.value?.unit_id,
        unit_year: year,
      };
      handleLoading('SUBMIT', true);
      const response = await spk.createShipment(id!, data);
      return response;
    },
    onSuccess: (res: any) => {
      if (res.meta.code === 200) {
        SweetAlert('success', 'Shipment dibuat', 'success');
        reset();
        handleModal('modalShipmentRegular', false);
        handleLoading('SUBMIT', false);
        queryClient.invalidateQueries({ queryKey: ['detail_spk_regular'] });
      }
    },
    onError: (error: any) => {
      handleLoading('SUBMIT', false);
      SweetAlert('error', error, 'error');
    },
  });

  const onSubmitShipment = (data: any) => {
    let otr = detailUnit?.spk_pricing?.spk_pricing_on_the_road;
    let dp = detailUnit?.spk_transaction?.spk_transaction_down_payment;
    let discount = detailUnit?.spk_pricing?.spk_pricing_discount;
    let indent = detailUnit?.spk_pricing?.spk_pricing_indent;
    let over_discount = detailUnit?.spk_pricing?.spk_pricing_over_discount;
    let subsidi = detailUnit?.spk_pricing?.spk_pricing_subsidi;
    let text;
    let nominal = 0;

    if (
      detailUnit?.spk_transaction?.spk_transaction_payment_method === 'cash'
    ) {
      nominal =
        parseFloat(otr) -
        parseFloat(discount) -
        parseFloat(indent) -
        parseFloat(over_discount) -
        parseFloat(subsidi);
    } else if (
      detailUnit?.spk_transaction?.spk_transaction_payment_method === 'credit'
    ) {
      nominal =
        parseFloat(dp) -
        parseFloat(discount) -
        parseFloat(indent) -
        parseFloat(over_discount) -
        parseFloat(subsidi);
    }
    if (nominal < 0) {
      text = `Terdapat kelebihan bayar senilai ${formatRupiah(
        Math.abs(nominal),
      )}`;
    } else {
      text = '';
    }
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'info',
      text: text,
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#D40000',
      confirmButtonText: 'YES',
      confirmButtonColor: '#00029D',
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmitShipment(data);
      }
    });
  };

  return (
    <Modal
      title={'SHIPMENT'}
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700 "
      // className={'w-2/3 lg:w-1/3 h-auto rounded-md z-99'}
      parentClass="z-[999]"
      centered
      activeModal={modalShipmentRegular}
      onClose={() => handleModal('modalShipmentRegular', false)}
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <label className="detail-title text-base">No. SPK</label>
        </div>
        <div className="col-span-12">
          <label className="detail-label">{detailUnit?.spk_number}</label>
        </div>
        <div className="col-span-12">
          <label className="detail-title text-base">Detail Motor</label>
        </div>
        <div className="col-span-4">
          <label className="detail-label">Tipe Motor</label>
        </div>
        <div className="col-span-8 flex items-center gap-2">
          <p className="detail-label">:</p>
          <label className="detail-label">
            {detailUnit?.spk_unit?.motor?.motor_name}
          </label>
        </div>
        <div className="col-span-4">
          <label className="detail-label">Warna</label>
        </div>
        <div className="col-span-8 flex items-center gap-2">
          <p className="detail-label">:</p>
          <label className="detail-label">
            {detailUnit?.spk_unit?.color?.color_name}
          </label>
        </div>
        <div className="col-span-12">
          <label className="detail-label">No. Rangka</label>
        </div>
        <div className="col-span-12">
          <Controller
            control={control}
            name="spk_shipment_chassis_number"
            render={({ field: { onChange, value } }) => (
              <SelectUnitNew
                onChange={onChange}
                value={value}
                motor_id={detailUnit?.spk_unit?.motor?.motor_id}
              />
            )}
          />
        </div>
        <div className="col-span-12">
          <label className="detail-label">No. Mesin</label>
        </div>
        <div className="col-span-12">
          <input
            readOnly
            {...register('spk_shipment_engine_no')}
            className="text-input"
            placeholder="no. mesin tidak tersedia"
          />
        </div>
        <div className="col-span-12">
          <label className="detail-label">Tahun Produksi</label>
        </div>
        <div className="col-span-12">
          <input
            readOnly
            {...register('spk_shipment_unit_year')}
            className="text-input"
            placeholder="tahun produksi tidak tersedia"
          />
        </div>
        <div className="col-span-12 lg:flex grid-cols-1 justify-start gap-5">
          <Button
            label={'SUBMIT'}
            className="btn-confirm lg:w-auto w-full mb-2 lg:m-0"
            onClick={handleSubmit((data) => onSubmitShipment(data))}
          />
          {backFormBtn({
            onClick: () => {
              handleModal('modalShipmentRegular', false);
              reset();
            },
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ModalShipment;
