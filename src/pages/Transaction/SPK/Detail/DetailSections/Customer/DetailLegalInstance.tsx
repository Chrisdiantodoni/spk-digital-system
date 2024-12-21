import Button from '../../../../../../components/Forms/Button/Button';
import { dayJsFormatDate } from '../../../../../../utils/dayjs';

const DetailLegalInstance = ({
  detailLegal,
  editLegalInfo,
  onEditLegalInfo,
}: any) => {
  const handleOnEditLegalInfo = () => {
    onEditLegalInfo(!editLegalInfo);
  };

  const data = detailLegal?.spk_legal;

  return (
    <div className="grid grid-cols-12 gap-x-6 mb-10">
      <div className="col-span-12 flex justify-between items-center">
        <div className="detail-title">Legal Info</div>
        {detailLegal?.spk_status !== 'spk' && (
          <div>
            <Button
              label="EDIT"
              className={'btn-edit-outline w-auto px-5 py-2'}
              onClick={() => handleOnEditLegalInfo()}
            />
          </div>
        )}
      </div>
      <div className="col-span-12 mt-2">
        <hr />
      </div>

      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">Nama Instansi</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_legal_name}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-start">
        <p className="detail-label">Alamat Lengkap</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3 lg:my-3 flex justify-start gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label flex items-start">
          {`${data?.spk_legal_address}`}
          <br />
          {`${data?.city}, ${data?.district},`}
          <br />
          {`Kel. ${data?.sub_district}, ${data?.spk_legal_postal_code}, ${data?.province}`}
        </p>
      </div>

      <div className="col-span-12 lg:col-span-4 my-3  flex items-center">
        <p className="detail-label">No. Telp</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">
          {dayJsFormatDate(data?.spk_legal_birth_date)}
        </p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3  flex items-center">
        <p className="detail-label">No. Ponsel</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_legal_gender}</p>
      </div>
    </div>
  );
};

export default DetailLegalInstance;
