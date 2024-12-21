import { Controller, useForm } from 'react-hook-form';
import createStore from '../../../../../context';
import Modal from '../../../Modal';
import { useButtonApproval } from '../../../../../hooks/useButtonApproval';
import Button from '../../../../Forms/Button/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import spk from '../../../../../Services/API/transaction/spk';
import { useParams } from 'react-router-dom';
import { SweetAlert } from '../../../../../utils/Swal';
import SelectMotor from '../../../../Forms/SelectGroup/Master/SelectMotor';
import SelectColor from '../../../../Forms/SelectGroup/SelectColor';
import { ControllerInput } from '../../../../../utils/ControllerInput';

const ModalAddUnit = () => {
  const handleModal = createStore((state) => state.handleModal);
  const handleLoading = createStore((state) => state.handleLoading);
  const modalAddUnitInstance = createStore(
    (state: any) => state.modal.modalAddUnitInstance,
  );
  const { control, register, reset, handleSubmit } = useForm({
    defaultValues: {},
  });
  const { backFormBtn } = useButtonApproval();

  const queryClient = useQueryClient();
  const { id } = useParams();
  const { mutate: handleCroCheck } = useMutation({
    mutationFn: async (data: any) => {
      handleLoading('SUBMIT', true);
      const response = await spk.createCroCheck(id!, data);
      return response;
    },
    onSuccess: (res: any) => {
      if (res?.meta?.code === 200) {
        handleLoading('SUBMIT', false);
        handleModal('modalCroCheck', false);
        reset();
        queryClient.invalidateQueries({ queryKey: ['detail_spk_regular'] });
        SweetAlert('success', 'SPK diverifikasi CRO', 'success');
      }
    },
  });

  return (
    <Modal
      title={'ADD UNIT'}
      className={'w-2/3 lg:w-2/3 h-auto rounded-md'}
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      activeModal={modalAddUnitInstance}
      onClose={() => handleModal('modalAddUnitInstance', false)}
      centered
    >
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 lg:col-span-1">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <p className="detail-label">Tipe Motor</p>
            </div>
            <div className="col-span-12">
              <Controller
                name="motor_type"
                rules={{ required: 'Tipe Motor wajib dipilih' }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SelectMotor
                    location={'mds'}
                    onChange={onChange}
                    value={value}
                  />
                )}
              />
            </div>
            <div className="col-span-12">
              <p className="detail-label">Tipe Motor</p>
            </div>
            <div className="col-span-12">
              <Controller
                name="color"
                rules={{ required: 'Warna wajib dipilih' }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SelectColor onChange={onChange} value={value} />
                )}
              />
            </div>
            <div className="col-span-12">
              <p className="detail-label">Jumlah Unit</p>
            </div>
            <div className="col-span-12">
              <ControllerInput
                name="quantity"
                type={'text-number'}
                control={control}
              />
            </div>
            <div className="col-span-12">
              <p className="detail-label">Off The Road</p>
            </div>
            <div className="col-span-12">
              <ControllerInput
                name="off_the_road"
                type={'currency'}
                control={control}
              />
            </div>
            <div className="col-span-12">
              <p className="detail-label">BBN</p>
            </div>
            <div className="col-span-12">
              <ControllerInput name="bbn" type={'currency'} control={control} />
            </div>
            <div className="col-span-12">
              <p className="detail-label">On The Road</p>
            </div>
            <div className="col-span-12">
              <ControllerInput
                name="on_the_road"
                type={'currency'}
                control={control}
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <p className="detail-label">Diskon</p>
            </div>
            <div className="col-span-12">
              <ControllerInput
                name="discount"
                type={'currency'}
                control={control}
              />
            </div>
            <div className="col-span-12">
              <p className="detail-label">Over Diskon</p>
            </div>
            <div className="col-span-12">
              <ControllerInput
                name="over_discount"
                type={'currency'}
                control={control}
              />
            </div>
            <div className="col-span-12">
              <p className="detail-label">Komisi</p>
            </div>
            <div className="col-span-12">
              <ControllerInput
                name="commission"
                type={'currency'}
                control={control}
              />
            </div>
            <div className="col-span-12">
              <p className="detail-label">Booster</p>
            </div>
            <div className="col-span-12">
              <ControllerInput
                name="booster"
                type={'currency'}
                control={control}
              />
            </div>
            <div className="col-span-12">
              <p className="detail-label">Biaya Additional</p>
            </div>
            <div className="col-span-12">
              <ControllerInput
                name="additional_cost"
                type={'currency'}
                control={control}
              />
            </div>
            <div className="col-span-12">
              <p className="detail-label">Keterangan</p>
            </div>
            <div className="col-span-12">
              <textarea {...register('note')} className="text-area" />
            </div>
          </div>
        </div>
        <div className="col-span-2 lg:flex grid-cols-1 justify-start gap-5">
          <Button
            label="SUBMIT"
            className="btn-confirm lg:w-auto w-full mb-2 lg:m-0"
            onClick={handleSubmit((data) => handleCroCheck(data))}
          />
          {backFormBtn({
            onClick: () => handleModal('modalAddUnitInstance', false),
          })}
        </div>
      </div>
    </Modal>
  );
};
export default ModalAddUnit;
