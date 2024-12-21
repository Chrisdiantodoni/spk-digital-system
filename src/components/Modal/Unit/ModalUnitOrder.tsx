import Store from '../../../context';
import Button from '../../Forms/Button/Button';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import unit from '../../../Services/API/unit';
import Modal from '../Modal';

interface IFormInput {
  unit_note: any;
}

function ModalUnitOrder() {
  const handleCloseModal = Store((state: any) => state.handleModal);
  const modalUnitOrder = Store((state: any) => state.modal.modalUnitOrder);
  const handleLoading = Store((state: any) => state.handleLoading);
  const item = Store((state: any) => state.modalItem);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      unit_note: '',
    },
  });

  const queryClient = useQueryClient();

  const { mutate: handleReceiveUnit, isPending } = useMutation<IFormInput>({
    mutationFn: async (data) => {
      handleLoading('TERIMA', true);
      const response = unit.updateShippingUnit(item?.unit_id, data);
      return response;
    },
    onSuccess: async () => {
      reset();
      handleLoading('TERIMA', false);

      await handleCloseModal('modalUnitOrder', false);
      await Swal.fire({
        title: 'Sukses',
        text: 'Unit berhasil diterima',
        icon: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['detail_unit_order'] });
    },
  });

  const handleFormSubmit = async (formData: any) => {
    await handleReceiveUnit(formData);
  };

  return (
    <Modal
      title={'TERIMA UNIT'}
      centered
      activeModal={modalUnitOrder}
      onClose={() => handleCloseModal('modalUnitOrder', false)}
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
    >
      <div className="grid grid-cols-3 gap-4">
        <div className="text-md text-black col-span-1">Tipe Motor</div>
        <div className="text-md text-black col-span-2">
          : {item?.motor.motor_name}
        </div>
        <div className="text-md text-black col-span-1">Warna</div>
        <div className="text-md text-black col-span-2">
          : {item?.color?.color_name}
        </div>

        <div className="text-md text-black col-span-1">No. Rangka</div>
        <div className="text-md text-black col-span-2">
          : {item?.unit_frame}
        </div>
        <div className="text-md text-black col-span-1">No. Mesin</div>
        <div className="text-md text-black col-span-2">
          : {item?.unit_engine}
        </div>
        <div className="text-md text-black col-span-1">Note</div>
        <div className="text-md text-black col-span-3">
          <textarea
            {...register('unit_note')}
            className="w-full h-20 border border-gray-300 rounded-md px-3 py-2"
          ></textarea>
          {/* {errors.unit_note && (
            <small className=" text-danger">
              <i>Note Harus di isi.</i>
            </small>
          )} */}
        </div>
        <div className="col-span-3">
          <Button
            label={'TERIMA'}
            disabled={isPending}
            className="bg-primary-color text-white w-full py-1 rounded-md hover:bg-indigo-800"
            onClick={handleSubmit(handleFormSubmit)}
          />
        </div>
      </div>
    </Modal>
  );
}

export default ModalUnitOrder;
