import Button from '../../../../../../components/Forms/Button/Button';
import { dayJsFormatDate } from '../../../../../../utils/dayjs';

const DetailContractInfo = ({
  detailContract,
  editLegalInfo,
  onEditLegalInfo,
}: any) => {
  const handleOnEditLegalInfo = () => {
    onEditLegalInfo(!editLegalInfo);
  };

  const data = detailContract?.spk_legal;

  return (
    <div className="grid grid-cols-12 gap-x-6 mb-10 mt-8">
      <div className="col-span-12 flex justify-between items-center">
        <div className="detail-title">Contract Info</div>
      </div>
      <div className="col-span-12 mt-2">
        <hr />
      </div>

      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">Nilai Kontrak</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_legal_name}</p>
      </div>

      <div className="col-span-12 lg:col-span-4 my-3  flex items-center">
        <p className="detail-label">Pembayaran</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">
          {dayJsFormatDate(data?.spk_legal_birth_date)}
        </p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3  flex items-center">
        <p className="detail-label">Verifikasi</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_legal_gender}</p>
      </div>
    </div>
  );
};

export default DetailContractInfo;
