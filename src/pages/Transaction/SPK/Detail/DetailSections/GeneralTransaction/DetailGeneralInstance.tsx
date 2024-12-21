import Button from '../../../../../../components/Forms/Button/Button';
import { dayJsFormatDate } from '../../../../../../utils/dayjs';

const DetailGeneralInstance = ({
  detailGeneral,
  onEditDetailGeneral,
  isEditGeneralData,
}: any) => {
  const handleChangeIsEdit = () => {
    onEditDetailGeneral(!isEditGeneralData);
  };

  const data = detailGeneral?.spk_general;

  return (
    <div className="grid grid-cols-12 gap-x-6 ">
      <div className="col-span-12 flex justify-between items-center">
        <div className="detail-title">General Info</div>
        {detailGeneral?.spk_status !== 'spk' && (
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

      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">Tanggal</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">
          {dayJsFormatDate(data?.spk_general_date)}
        </p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">Salesman</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.sales_name}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">No. Indent</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_general_method_sales}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">No. PO</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_general_method_sales}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">Tanggal PO</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_general_method_sales}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">Nama Instansi</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_general_method_sales}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">Alamat</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_general_method_sales}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">Provinsi</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_general_method_sales}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">Kota/Kabupaten</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_general_method_sales}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">Kecamatan</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_general_method_sales}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">Kelurahan</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_general_method_sales}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">Kode Pos</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_general_method_sales}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">No. Telp</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_general_method_sales}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">No. Ponsel</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_general_method_sales}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label">E-mail</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_general_method_sales}</p>
      </div>
    </div>
  );
};

export default DetailGeneralInstance;
