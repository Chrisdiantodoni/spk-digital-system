import { Controller, useForm } from 'react-hook-form';
import DatePicker from '../../../../../../components/Forms/DatePicker/DatePicker';
import SelectIndent from '../../../../../../components/Forms/SelectGroup/Master/SelectIndent';
import SelectSalesman from '../../../../../../components/Forms/SelectGroup/SelectSalesman';
import { ControllerInput } from '../../../../../../utils/ControllerInput';
import SelectSubdistrict from '../../../../../../components/Forms/SelectGroup/Master/SelectSubDistrict';
import SelectDistrict from '../../../../../../components/Forms/SelectGroup/Master/SelectDistrict';
import SelectCity from '../../../../../../components/Forms/SelectGroup/Master/SelectCity';
import SelectProvince from '../../../../../../components/Forms/SelectGroup/Master/SelectProvince';

const FormGeneralInfoInstance = () => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const province = watch('province');
  const district = watch('district');
  const city = watch('city');
  return (
    <div className="grid grid-cols-12 gap-x-6">
      <div className="col-span-12 flex justify-between">
        <div className="detail-title">General Info</div>
      </div>
      <div className="col-span-12 mt-4">
        <hr />
      </div>
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Tanggal</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <div className="w-full">
          <Controller
            name="dates_po"
            control={control}
            rules={{ required: 'Lokasi wajib dipilih' }}
            render={({ field: { onChange, value } }) => (
              <DatePicker onChange={onChange} value={value} isDisabled />
            )}
          />
        </div>
      </div>
      <div className="col-span-3 hidden lg:block" />
      <div className="col-span-12 lg:col-span-9">
        {errors.spk_general_location && (
          <span className="text-error">
            {errors.spk_general_location?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Salesman</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_general_salesman"
          control={control}
          rules={{ required: 'Salesman wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectSalesman onChange={onChange} value={value} />
          )}
        />
      </div>
      <div className="col-span-3 hidden lg:block" />
      <div className="col-span-12 lg:col-span-9">
        {errors.spk_general_salesman && (
          <span className="text-error">
            {errors.spk_general_salesman?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6  flex items-center">
        <p className="detail-label">No. Indent</p>
      </div>
      <div className="col-span-12 lg:col-span-9  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="indent"
          control={control}
          render={({ field: { onChange, value } }) => {
            // if (value?.value?.spk_general == null) {
            //   return SweetAlert('perhatian', 'sudah ada spk', 'warning');
            // }
            return <SelectIndent onChange={onChange} value={value} />;
          }}
        />
      </div>
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6  flex items-center">
        <p className="detail-label">NO. PO</p>
      </div>
      <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <input
          className="text-input"
          {...register('po_number', { required: 'Nomor PO wajib diisi' })}
        />
      </div>
      <div className="col-span-3 hidden lg:block" />
      <div className="col-span-12 lg:col-span-9">
        {errors.po_number && (
          <span className="text-error">
            {errors.po_number?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Tanggal PO</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <div className="w-full">
          <Controller
            name="po_date"
            control={control}
            rules={{ required: 'Tanggal PO wajib dipilih' }}
            render={({ field: { onChange, value } }) => (
              <DatePicker onChange={onChange} value={value} />
            )}
          />
        </div>
      </div>
      <div className="col-span-3 hidden lg:block" />
      <div className="col-span-12 lg:col-span-9">
        {errors.po_date && (
          <span className="text-error">
            {errors.po_date?.message?.toString()}
          </span>
        )}
      </div>
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
      <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
        <p className="detail-label">E-mail</p>
      </div>
      <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <input className="text-input" {...register('email')} />
      </div>
    </div>
  );
};

export default FormGeneralInfoInstance;
