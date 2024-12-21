import { Controller, useForm } from 'react-hook-form';
import SelectProvince from '../../../../../../components/Forms/SelectGroup/Master/SelectProvince';
import SelectCity from '../../../../../../components/Forms/SelectGroup/Master/SelectCity';
import SelectDistrict from '../../../../../../components/Forms/SelectGroup/Master/SelectDistrict';
import SelectSubdistrict from '../../../../../../components/Forms/SelectGroup/Master/SelectSubDistrict';
import { ControllerInput } from '../../../../../../utils/ControllerInput';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import CheckBox from '../../../../../../components/Checkboxes/Checkbox';

const FormLegalInstance = () => {
  const {
    register,
    formState: { errors },
    control,
    watch,
  } = useForm();

  const province = watch('province');
  const district = watch('district');
  const city = watch('city');
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckBoxChange = (newValue: boolean) => {
    setIsChecked(!newValue);
  };
  const { id } = useParams();

  return (
    <div className="grid grid-cols-12 gap-x-6 mb-6">
      <div className="col-span-12 flex justify-between">
        <div className="detail-title">Legal Info</div>
      </div>
      <div className="col-span-12 mt-4">
        <hr />
      </div>
      {!id && (
        <div className="col-span-12 my-4">
          <CheckBox
            isChecked={isChecked}
            label="Apakah Identitas Pembeli sesuai dengan Identitas Pemakai?"
            onChange={handleCheckBoxChange}
          />
        </div>
      )}
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Nama Instansi</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <input
          className="text-input"
          {...register('instance_name', {
            required: 'Nama Instansi wajib diisi',
          })}
        />
      </div>
      <div className="col-span-3 hidden lg:block" />
      <div className="col-span-12 lg:col-span-9">
        {errors.instance_name && (
          <span className="text-error">
            {errors.instance_name?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Alamat</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <input
          className="text-input"
          {...register('instance_address', {
            required: 'Alamat Instansi wajib diisi',
          })}
        />
      </div>
      <div className="col-span-3 hidden lg:block" />
      <div className="col-span-12 lg:col-span-9">
        {errors.instance_address && (
          <span className="text-error">
            {errors.instance_address?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Provinsi</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="province"
          control={control}
          rules={{ required: 'Provinsi wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectProvince onChange={onChange} value={value} />
          )}
        />
      </div>
      <div className="col-span-3 hidden lg:block" />
      <div className="col-span-12 lg:col-span-9">
        {errors.province && (
          <span className="text-error">
            {errors.province?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Kota/Kabupaten</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="city"
          control={control}
          rules={{ required: 'Kota/Kabupaten wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectCity
              disabled={!province ? true : false}
              onChange={onChange}
              value={value}
              province_id={province?.value?.province_id}
            />
          )}
        />
      </div>
      <div className="col-span-3 hidden lg:block" />
      <div className="col-span-12 lg:col-span-9">
        {errors.city && (
          <span className="text-error">{errors.city?.message?.toString()}</span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Kecamatan</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="district"
          control={control}
          rules={{ required: 'Kecamatan wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectDistrict
              onChange={onChange}
              value={value}
              disabled={!city ? true : false}
              city_id={city?.value?.city_id}
            />
          )}
        />
      </div>
      <div className="col-span-3 hidden lg:block" />
      <div className="col-span-12 lg:col-span-9">
        {errors.district && (
          <span className="text-error">
            {errors.district?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Kelurahan</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="sub_district"
          control={control}
          rules={{ required: 'Kelurahan wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectSubdistrict
              onChange={onChange}
              value={value}
              disabled={!district ? true : false}
              district_id={district?.value?.district_id}
            />
          )}
        />
      </div>
      <div className="col-span-3 hidden lg:block" />
      <div className="col-span-12 lg:col-span-9">
        {errors.sub_district && (
          <span className="text-error">
            {errors.sub_district?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Kode Pos</p>
      </div>
      <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="post_code"
          control={control}
          maxLength={6}
          type={'text-number'}
        />
      </div>
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
        <p className="detail-label">No. Telp</p>
      </div>
      <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="tel_number"
          control={control}
          maxLength={6}
          type={'text-number'}
        />
      </div>
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
        <p className="detail-label">No. Ponsel</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="phone_number"
          control={control}
          rules={{ required: 'No. Ponsel wajib diisi' }}
          maxLength={6}
          type={'text-number'}
        />
      </div>
    </div>
  );
};

export default FormLegalInstance;
