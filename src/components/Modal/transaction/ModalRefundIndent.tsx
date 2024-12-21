import createStore from '../../../context';
import Button from '../../Forms/Button/Button';
import { useForm } from 'react-hook-form';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import LoaderButton from '../../../common/Loader/LoaderButton';
import { SweetAlert } from '../../../utils/Swal';
import { useButtonApproval } from '../../../hooks/useButtonApproval';
import indent from '../../../Services/API/transaction/indent';
import spk from '../../../Services/API/transaction/spk';
import Modal from '../Modal';

function ModalRefundIndent({ id }: any) {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reason_note: '',
    },
  });

  const queryClient = useQueryClient();

  const handleCloseModal = createStore((state: any) => state.handleModal);
  const modalRefundIndent = createStore(
    (state: any) => state.modal.modalRefundIndent,
  );
  const type = createStore((state) => state.typeModal);

  const item = createStore((state: any) => state.modalItem);

  const { mutate: handleRefundAll, isPending } = useMutation({
    mutationFn: async (data: any) => {
      if (type === 'spk') {
        const fields: any = {
          spk_payment_list_refund_note: data?.reason_note,
        };
        const response = await spk.refundSpkPayment(item, fields);
        return response;
      } else if (type === 'indent-instance') {
        const fields: any = {
          indent_instansi_payment_refund_note: data?.reason_note,
        };
        const response = await indent.updateIndentInstancePaymentRefundAll(
          id,
          fields,
        );
        return response;
      } else {
        const fields: any = {
          indent_payment_refund_note: getValues('reason_note'),
        };
        const response = await indent.updateRefundAllPayment(id, fields);
        return response;
      }
    },
    onSuccess: async (res: any) => {
      if (res.meta.code === 200) {
        if (type === 'spk') {
          SweetAlert('success', 'Refund dilakukan', 'Sukses');
          queryClient.invalidateQueries({
            queryKey: ['detail_payment'],
          });
        } else {
          SweetAlert('success', 'Refund dilakukan', 'Sukses');
          queryClient.invalidateQueries({ queryKey: ['detail_indent'] });
        }
      }
      handleCloseModal('modalRefundIndent', false, '');
      reset();
    },
    onError: (error: any) => {
      SweetAlert('error', error?.message?.data, 'Error');
    },
  });

  const onSubmit = (data: any) => {
    handleRefundAll(data);
  };

  const { backFormBtn } = useButtonApproval();

  return (
    <Modal
      title={'REFUND'}
      onClose={() => {
        handleCloseModal('modalRefundIndent', false);
        reset();
      }}
      centered
      activeModal={modalRefundIndent}
      parentClass="z-[999]"
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      // className="w-2/3 lg:w-1/3 h-auto rounded-md"
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <label className="detail-label" htmlFor="note">
            Alasan
          </label>
          <div className="flex items-center w-full">
            <textarea
              className="text-area my-3"
              {...register('reason_note', {
                required: 'Alasan harus diisi',
              })}
            ></textarea>
          </div>
          {errors.reason_note && (
            <small className=" text-danger">{errors.reason_note.message}</small>
          )}
        </div>

        <div className="col-span-12 flex justify-end items-end gap-5 ">
          <div>
            {backFormBtn({
              onClick: () => {
                handleCloseModal('modalRefundIndent', false);
                reset();
              },
            })}
          </div>
          {/* <Button
            label="CANCEL"
            Icon={<XCircle size={18} />}
            onClick={() => handleCloseModal('modalEventForm', false, item)}
            className={'btn-back'}
          /> */}
          <div>
            {isPending ? (
              <>
                <LoaderButton className={'btn-request'} />
              </>
            ) : (
              <>
                <Button
                  label={'REFUND'}
                  className="btn-request"
                  onClick={handleSubmit((data) => onSubmit(data))}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ModalRefundIndent;
