import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../../../../../components/Forms/Button/Button';
import { dayJsFormatDate } from '../../../../../../utils/dayjs';
import { formatRupiah } from '../../../../../../utils/formatter';
import spk from '../../../../../../Services/API/transaction/spk';
import Swal from 'sweetalert2';
import createStore from '../../../../../../context';

const DetailPO = ({ detailPO }: any) => {
  const data = detailPO?.spk_purchase_order;
  const handleModal = createStore((state: any) => state.handleModal);

  const onSubmitReset = (id: any) => {
    Swal.fire({
      title: 'Reset PO?',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#D40000',
      confirmButtonText: 'YES',
      confirmButtonColor: '#00029D',
    }).then((result) => {
      if (result.isConfirmed) {
        resetPO(id);
      }
    });
  };

  const { mutate: resetPO } = useMutation({
    mutationFn: async (id: any) => {
      const response = await spk.resetPo(id);
      return response;
      // console.log({ id });
      // return;
    },
    onSuccess: (res: any) => {
      if (res.meta.code === 200) {
        queryClient.invalidateQueries({ queryKey: ['detail_spk_regular'] });
      }
    },
  });

  const queryClient = useQueryClient();
  console.log(data?.spk_purchase_order_act_tac);

  return (
    <div className="grid grid-cols-12 gap-x-6 mb-10">
      <div className="col-span-12 justify-between flex items-center">
        <div className="detail-title">
          {detailPO?.spk_transaction?.spk_transaction_method_payment === 'cash'
            ? 'PO Microfinance'
            : 'PO Leasing'}
        </div>
        <div className="flex gap-x-5">
          {detailPO?.spk_purchase_order && (
            <Button
              label="RESET"
              className={'btn-delete w-auto px-5 py-2'}
              onClick={() => onSubmitReset(data?.spk_purchase_order_id)}
            />
          )}
          {data?.spk_purchase_order_act_tac === 0 && (
            <Button
              label="ACT TAC"
              onClick={() => handleModal('modalPo', true)}
              className={'btn-payment w-auto px-5 py-2'}
            />
          )}
          {!data && (
            <Button
              label="CREATE PO"
              onClick={() => handleModal('modalPo', true, detailPO)}
              className={'btn-payment w-auto px-5 py-2'}
            />
          )}
        </div>
      </div>
      <div className="col-span-12 mt-2">
        <hr />
      </div>
      <div className="col-span-6 lg:col-span-3 my-3 flex items-center">
        <p className="detail-label">Tanggal PO</p>
      </div>
      <div className="col-span-6 lg:col-span-9 flex my-3 items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">
          {dayJsFormatDate(data?.spk_purchase_order_date)}
        </p>
      </div>
      <div className="col-span-6 lg:col-span-3 my-3 flex items-center">
        <p className="detail-label">No. PO</p>
      </div>
      <div className="col-span-6 lg:col-span-9 flex my-3 items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_purchase_order_no || '-'}</p>
      </div>
      <div className="col-span-6 lg:col-span-3 my-3 flex items-center">
        <p className="detail-label">TAC</p>
      </div>
      <div className="col-span-6 lg:col-span-9 flex my-3 items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">
          {formatRupiah(data?.spk_purchase_order_tac || '0')}
        </p>
      </div>
      {data?.spk_purchase_order_act_tac > 0 && (
        <>
          <div className="col-span-6 lg:col-span-3 my-3 flex items-center">
            <p className="detail-label">ACT TAC</p>
          </div>
          <div className="col-span-6 lg:col-span-9 flex my-3 items-center gap-2">
            <p className="hidden lg:block">:</p>
            <p className="detail-label">
              {formatRupiah(data?.spk_purchase_order_act_tac || '0')}
            </p>
          </div>
        </>
      )}
      <div className="col-span-12 my-3">
        <p className="detail-label">File</p>
      </div>
    </div>
  );
};

export default DetailPO;
