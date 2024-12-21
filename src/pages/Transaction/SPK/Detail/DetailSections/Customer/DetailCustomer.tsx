import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import Button from '../../../../../../components/Forms/Button/Button';
import { dayJsFormatDate } from '../../../../../../utils/dayjs';

const DetailCustomer = ({
  detailCustomer,
  editDetailCustomerInfo,
  onEditDetailCustomerInfo,
}: any) => {
  const { setValue } = useFormContext();

  useEffect(() => {
    setValue('spk_customer_gender', 'pria');
  }, []);

  const data = detailCustomer?.spk_customer;
  const handleToggleEditDetailCustomerInfo = () => {
    onEditDetailCustomerInfo(!editDetailCustomerInfo);
  };

  return (
    <div className="grid grid-cols-12 gap-x-6 mb-10">
      <div className="col-span-12 flex justify-between items-center">
        <div className="detail-title">Customer Info</div>
        {detailCustomer?.spk_status !== 'spk' && (
          <div>
            <Button
              label="EDIT"
              className={'btn-edit-outline w-auto px-5 py-2'}
              onClick={() => handleToggleEditDetailCustomerInfo()}
            />
          </div>
        )}
      </div>
      <div className="col-span-12 mt-2">
        <hr />
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 lg:my-3 flex items-center">
        <p className="detail-label font-semibold">NIK</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_customer_nik}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 lg:my-3 flex items-center">
        <p className="detail-label font-semibold">Nama</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_customer_name}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 lg:my-3 flex items-start">
        <p className="detail-label font-semibold">Alamat Lengkap</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex justify-start gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label flex items-start">
          {`${data?.spk_customer_address}`}
          <br />
          {`${data?.city}, ${data?.district},`}
          <br />
          {`Kel. ${data?.sub_district}, ${data?.spk_customer_postal_code}, ${data?.province}`}
        </p>
      </div>

      <div className="col-span-12 lg:col-span-4 flex my-3 lg:my-3 items-center">
        <p className="detail-label font-semibold">Tempat Lahir</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex mb-3 lg:my-3 items-center  gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_customer_birth_place || '-'}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 flex my-3 lg:my-3 items-center">
        <p className="detail-label font-semibold">Tanggal Lahir</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex mb-3 lg:my-3 items-center  gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">
          {dayJsFormatDate(data?.spk_customer_birth_date)}
        </p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">Jenis Kelamin</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">
          {data?.spk_customer_gender === 'woman' ? 'Wanita' : 'Pria'}
        </p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">No. Telp</p>
      </div>
      <div className="col-span-12 lg:col-span-8 my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_customer_telp || '-'}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">No. Ponsel</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_customer_no_phone || '-'}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">No. Whatsapp</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_customer_no_wa || '-'}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">Agama</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_customer_religion}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">Status Pernikahan</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.marital_name}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">Hobi</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.hobbies_name}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">Nama Ibu Kandung</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_customer_mother_name}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">NPWP</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_customer_npwp}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">Email</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_customer_email}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">Status Rumah</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.residence_name}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">Pendidikan</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.education_name}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3  flex items-center">
        <p className="detail-label font-semibold">Pekerjaan</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.work_name}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">Pendapatan</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_customer_income}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">Pengeluaran</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_customer_outcome}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">Merk Motor Sebelumnya</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.motor_brand_name}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">Tipe Motor Sebelumnya</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_customer_motor_type_before}</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-3 flex items-center">
        <p className="detail-label font-semibold">Tahun Motor Sebelumnya</p>
      </div>
      <div className="col-span-12 lg:col-span-8 mb-3 lg:my-3 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="detail-label">{data?.spk_customer_motor_year_before}</p>
      </div>
    </div>
  );
};

export default DetailCustomer;
