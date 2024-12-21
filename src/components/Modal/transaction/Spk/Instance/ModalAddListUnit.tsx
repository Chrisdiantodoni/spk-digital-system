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
import SelectUnitNew from '../../../../Forms/SelectGroup/SelectUnitNew';

const ModalAddListUnit = () => {
  const handleModal = createStore((state) => state.handleModal);
  const handleLoading = createStore((state) => state.handleLoading);
  const modalAddListUnit = createStore(
    (state: any) => state.modal.modalAddListUnit,
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
      //   className={'w-2/3 lg:w-2/3 h-auto rounded-md'}
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      activeModal={modalAddListUnit}
      onClose={() => handleModal('modalAddListUnit', false)}
      centered
    >
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <p className="detail-label">Tipe Motor</p>
            </div>
            <div className="col-span-12">
              <p className="detail-label"> ALL NEW NMAX 155</p>
            </div>
            <div className="col-span-12">
              <p className="detail-label">Warna</p>
            </div>
            <div className="col-span-12">
              <p className="detail-label">BIRU</p>
            </div>
            <div className="col-span-12">
              <p className="detail-label">No. Rangka</p>
            </div>
            <div className="col-span-12">
              <Controller
                name="quantity"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SelectUnitNew onChange={onChange} value={value} />
                )}
              />
            </div>
            <div className="col-span-12">
              <p className="detail-label">No. Mesin</p>
            </div>
            <div className="col-span-12">
              <input className="text-input" value={'FGSDASS'} readOnly />
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
            onClick: () => handleModal('modalAddListUnit', false),
          })}
        </div>
      </div>
    </Modal>
  );
};
export default ModalAddListUnit;
