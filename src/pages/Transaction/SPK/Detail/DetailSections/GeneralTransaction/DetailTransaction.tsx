import Button from '../../../../../../components/Forms/Button/Button';
import {
  formatRupiah,
  numberFormatter,
} from '../../../../../../utils/formatter';

const DetailTransaction = ({
  detailTransaction,
  onEditTransactionInfo,
  editTransactionInfo,
}: any) => {
  const handleChangeIsEdit = () => {
    onEditTransactionInfo(!editTransactionInfo);
  };
  const data = detailTransaction?.spk_transaction;

  const handlePaymentMethod = () => {
    switch (data?.spk_transaction_method_payment) {
      case 'cash':
        return (
          <>
            <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
              <p className="detail-label">Microfinance</p>
            </div>
            <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3  flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">{data?.microfinance_name}</p>
            </div>
          </>
        );
      case 'credit':
        return (
          <>
            <div className="col-span-12 lg:col-span-4 my-3 lg:my-3   flex items-center">
              <p className="detail-label">Leasing</p>
            </div>
            <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">{data?.leasing_name}</p>
            </div>
            <div className="col-span-12 lg:col-span-4 my-3 lg:my-3  flex items-center">
              <p className="detail-label">Down Payment</p>
            </div>
            <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3  flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {formatRupiah(data?.spk_transaction_down_payment)}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 my-3 lg:my-3  flex items-center">
              <p className="detail-label">Tenor</p>
            </div>
            <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3  flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {data?.spk_transaction_tenor} Bulan
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 my-3 lg:my-3  flex items-center">
              <p className="detail-label">Cicilan</p>
            </div>
            <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3  flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {formatRupiah(data?.spk_transaction_instalment)}
              </p>
            </div>
            <div className="col-span-12 lg:col-span-4 my-3 lg:my-3  flex items-center">
              <p className="detail-label">Nama Surveyor</p>
            </div>
            <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3  flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <p className="detail-label">
                {data?.spk_transaction_surveyor_name}
              </p>
            </div>
          </>
        );

      default:
        break;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-x-6 mb-10">
      <div className="col-span-12 flex justify-between items-center">
        <div className="detail-title">Transaction Info</div>
        {detailTransaction?.spk_status !== 'spk' && (
          <div>
            <Button
              label="EDIT"
              className={'btn-edit-outline w-auto px-5 py-2'}
              onClick={() => handleChangeIsEdit()}
            />
          </div>
        )}
      </div>
      <div className="col-span-12 mt-2 ">
        <hr />
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 lg:my-3 flex items-center">
        <p className="detail-label">Metode Pembelian</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">
          {data?.spk_transaction_method_buying === 'on_the_road'
            ? 'On The Road'
            : 'Off The Road'}
        </p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 lg:my-3  flex items-center">
        <p className="detail-label">Metode Pembayaran</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">
          {data?.spk_transaction_method_payment === 'cash' ? 'CASH' : 'KREDIT'}
        </p>
      </div>
      {handlePaymentMethod()}
    </div>
  );
};

export default DetailTransaction;
