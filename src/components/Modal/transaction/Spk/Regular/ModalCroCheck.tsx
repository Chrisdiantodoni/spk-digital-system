import { Controller, useForm } from 'react-hook-form';
import createStore from '../../../../../context';
import Modal from '../../../Modal';
import RadioButton from '../../../../RadioButton';
import { useButtonApproval } from '../../../../../hooks/useButtonApproval';
import Button from '../../../../Forms/Button/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import spk from '../../../../../Services/API/transaction/spk';
import { useParams } from 'react-router-dom';
import { SweetAlert } from '../../../../../utils/Swal';

const ModalCroCheck = ({ detailCro }: any) => {
  const data = detailCro;

  const handleModal = createStore((state) => state.handleModal);
  const handleLoading = createStore((state) => state.handleLoading);
  const modalCroCheck = createStore((state: any) => state.modal.modalCroCheck);
  const { control, register, reset, handleSubmit } = useForm({
    defaultValues: {
      is_cro_check: '1',
      spk_cro_check_note: '',
    },
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
      title={'VERIFIKASI CHECK'}
      // className={'w-2/3 lg:w-1/3 h-auto rounded-md'}
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      activeModal={modalCroCheck}
      onClose={() => handleModal('modalCroCheck', false)}
      centered
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <p className="detail-label">Pilih Status</p>
        </div>
        <div className="col-span-12">
          <Controller
            control={control}
            name="is_cro_check"
            defaultValue="0"
            render={({ field: { onChange, value } }) => (
              <RadioButton
                onChange={onChange}
                selectedItem={value}
                className="flex justify-evenly py-2"
                items={[
                  {
                    label: 'VERIFIKASI',
                    value: '1',
                  },
                  {
                    label: 'TIDAK TERVERIFIKASI',
                    value: '0',
                  },
                ]}
              />
            )}
          />
        </div>
        <div className="col-span-12">
          <p className="detail-label">Catatan</p>
        </div>
        <div className="col-span-12">
          <textarea
            {...register('spk_cro_check_note', {
              required: 'Catatan harus diisi',
            })}
            className="text-area"
          ></textarea>
        </div>
        <div className="col-span-12 lg:flex grid-cols-1 justify-start gap-5">
          <Button
            label="SUBMIT"
            className="btn-confirm lg:w-auto w-full mb-2 lg:m-0"
            onClick={handleSubmit((data) => handleCroCheck(data))}
          />
          {backFormBtn({ onClick: () => handleModal('modalCroCheck', false) })}
        </div>
      </div>
    </Modal>
  );
};
export default ModalCroCheck;
