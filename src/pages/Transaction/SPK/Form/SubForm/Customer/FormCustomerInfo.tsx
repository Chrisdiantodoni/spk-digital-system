import { Controller, useFormContext, useWatch } from 'react-hook-form';
import RadioButton from '../../../../../../components/RadioButton';
import SelectProvince from '../../../../../../components/Forms/SelectGroup/Master/SelectProvince';
import SelectCity from '../../../../../../components/Forms/SelectGroup/Master/SelectCity';
import SelectDistrict from '../../../../../../components/Forms/SelectGroup/Master/SelectDistrict';
import SelectSubdistrict from '../../../../../../components/Forms/SelectGroup/Master/SelectSubDistrict';
import DatePicker from '../../../../../../components/Forms/DatePicker/DatePicker';
import SelectGroup from '../../../../../../components/Forms/SelectGroup/SelectGroup';
import SelectMarital from '../../../../../../components/Forms/SelectGroup/Master/SelectMarital';
import SelectHobby from '../../../../../../components/Forms/SelectGroup/Master/SelectHobby';
import SelectResidence from '../../../../../../components/Forms/SelectGroup/Master/SelectResidence';
import SelectMotorBrand from '../../../../../../components/Forms/SelectGroup/Master/SelectMotorBrand';
import SelectWork from '../../../../../../components/Forms/SelectGroup/Master/SelectWork';
import SelectEducation from '../../../../../../components/Forms/SelectGroup/Master/SelectEducation';
import SelectExpense from '../../../../../../components/Forms/SelectGroup/Master/SelectExpense';
import SelectIncome from '../../../../../../components/Forms/SelectGroup/Master/SelectIncome';
import { ControllerInput } from '../../../../../../utils/ControllerInput';

const FormCustomerInfo = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<any>();
  const province = useWatch<any>({
    control: control,
    name: 'spk_customer_province',
  });
  const city = useWatch<any>({
    control: control,
    name: 'spk_customer_city',
  });
  const district = useWatch<any>({
    control: control,
    name: 'spk_customer_district',
  });
  return (
    <div className="grid grid-cols-12 gap-x-6 mb-10">
      <div className="col-span-12 flex justify-between">
        <div className="detail-title">Customer Info</div>
      </div>
      <div className="col-span-12 mt-4">
        <hr />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">NIK</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_customer_nik"
          control={control}
          maxLength={16}
          rules={{
            required: 'NIK wajib diisi',
          }}
          type={'text-number'}
        />
      </div>
      <div className="col-span-4 hidden lg:block" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_nik && (
          <span className="text-error">
            {errors.spk_customer_nik?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Nama</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>

        <input
          className="text-input"
          {...register('spk_customer_name', { required: 'Nama wajib diisi' })}
        />
      </div>
      <div className="col-span-4 hidden lg:block" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_name && (
          <span className="text-error">
            {errors.spk_customer_name?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Alamat</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <input
          className="text-input"
          {...register('spk_customer_address', {
            required: 'Alamat wajib diisi',
          })}
        />
      </div>
      <div className="col-span-4 hidden lg:block" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_address && (
          <span className="text-error">
            {errors.spk_customer_address?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Provinsi</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_customer_province"
          control={control}
          rules={{ required: 'Provinsi wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectProvince onChange={onChange} value={value} />
          )}
        />
      </div>

      <div className="col-span-4 hidden lg:block" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_province && (
          <span className="text-error">
            {errors.spk_customer_province?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Kota/Kabupaten</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_customer_city"
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
      <div className="col-span-4 hidden lg:block" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_city && (
          <span className="text-error">
            {errors.spk_customer_city?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Kecamatan</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_customer_district"
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
      <div className="col-span-4 hidden lg:block" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_district && (
          <span className="text-error">
            {errors.spk_customer_district?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Kelurahan</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_customer_sub_district"
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
      <div className="col-span-4 hidden lg:block" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_sub_district && (
          <span className="text-error">
            {errors.spk_customer_sub_district?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Kode Pos</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_customer_post_code"
          control={control}
          maxLength={6}
          type={'text-number'}
        />
      </div>

      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Tempat Lahir</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <input
          className="text-input"
          {...register('spk_customer_place_of_birth', {
            required: 'Tempat lahir wajib diisi',
          })}
        />
      </div>
      <div className="col-span-4 hidden lg:block" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_place_of_birth && (
          <span className="text-error">
            {errors.spk_customer_place_of_birth?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Tanggal Lahir</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_customer_date_of_birth"
          control={control}
          rules={{ required: 'Tanggal lahir wajib dipilih' }}
          defaultValue={null}
          render={({ field: { onChange, value } }) => (
            <div className="w-full">
              <DatePicker onChange={onChange} value={value} />
            </div>
          )}
        />
      </div>
      <div className="col-span-4 hidden lg:block" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_date_of_birth && (
          <span className="text-error">
            {errors.spk_customer_date_of_birth?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Jenis Kelamin</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_customer_gender"
          control={control}
          defaultValue={'pria'}
          render={({ field: { onChange, value } }) => (
            <RadioButton
              className="w-full flex justify-around"
              items={[
                {
                  label: 'PRIA',
                  value: 'man',
                },
                {
                  label: 'WANITA',
                  value: 'woman',
                },
              ]}
              selectedItem={value}
              onChange={onChange}
            />
          )}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">No. Telp</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_customer_telephone_number"
          control={control}
          type={'text-number'}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">No. Ponsel</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_customer_phone_number"
          control={control}
          rules={{
            required: 'No. ponsel wajib diisi',
          }}
          type={'text-number'}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_phone_number && (
          <span className="text-error">
            {errors.spk_customer_phone_number?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">No. Whatsapp</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_customer_wa_number"
          control={control}
          type={'text-number'}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Agama</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          control={control}
          name="spk_customer_religion"
          defaultValue={''}
          rules={{ required: 'Agama wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <div className="w-full">
              <SelectGroup
                className="w-full flex justify-around"
                items={[
                  {
                    label: 'Pilih Agama',
                    value: '',
                    disabled: true,
                  },
                  {
                    label: 'KRISTEN',
                    value: 'Kristen',
                  },
                  {
                    label: 'KATOLIK',
                    value: 'Katolik',
                  },
                  {
                    label: 'ISLAM',
                    value: 'Islam',
                  },
                  {
                    label: 'BUDDHA',
                    value: 'Buddha',
                  },
                  {
                    label: 'KONGHUCU',
                    value: 'Konghucu',
                  },
                ]}
                value={value}
                onChange={onChange}
              />
            </div>
          )}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_religion && (
          <span className="text-error">
            {errors.spk_customer_religion?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Status Pernikahan</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_customer_marital"
          control={control}
          rules={{ required: 'Status Pernikahan wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectMarital onChange={onChange} value={value} />
          )}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_marital && (
          <span className="text-error">
            {errors.spk_customer_marital?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Hobi</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_customer_hobby"
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectHobby onChange={onChange} value={value} />
          )}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Nama Ibu Kandung</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <input
          className="text-input"
          {...register('spk_customer_birth_mother')}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">NPWP</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_customer_npwp"
          control={control}
          type={'text-number'}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Email</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <input
          className="text-input"
          {...register('spk_customer_email', {
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Format email tidak sesuai',
            },
          })}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_email && (
          <span className="text-error">
            {errors?.spk_customer_email?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Status Rumah</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_customer_residence"
          control={control}
          rules={{ required: 'Status rumah wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectResidence onChange={onChange} value={value} />
          )}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_residence && (
          <span className="text-error">
            {errors.spk_customer_residence?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Pendidikan</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_customer_education"
          control={control}
          rules={{ required: 'Pendidikan wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectEducation onChange={onChange} value={value} />
          )}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_education && (
          <span className="text-error">
            {errors.spk_customer_education?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Pekerjaan</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_customer_work"
          control={control}
          rules={{ required: 'Pekerjaan wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectWork onChange={onChange} value={value} />
          )}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_work && (
          <span className="text-error">
            {errors.spk_customer_work?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Lama Bekerja</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <p className="w-1/5">
          <ControllerInput
            name="spk_customer_length_of_work"
            control={control}
            maxLength={2}
            type={'text-number'}
          />
        </p>
        <p className="detail-label">Tahun</p>
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Pendapatan</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_customer_income"
          control={control}
          rules={{ required: 'Pendapatan wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectIncome onChange={onChange} value={value} />
          )}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_income && (
          <span className="text-error">
            {errors.spk_customer_income?.message?.toString()}
          </span>
        )}
      </div>

      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Pengeluaran</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_customer_expenditure"
          control={control}
          rules={{ required: 'Pengeluaran wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectExpense onChange={onChange} value={value} />
          )}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_customer_expenditure && (
          <span className="text-error">
            {errors.spk_customer_expenditure?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Merk Motor Sebelumnya</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_customer_previous_brand"
          control={control}
          render={({ field: { onChange, value } }) => (
            <SelectMotorBrand onChange={onChange} value={value} />
          )}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Tipe Motor Sebelumnya</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <input
          className="text-input"
          {...register('spk_customer_previous_type')}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Tahun Motor Sebelumnya</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name="spk_customer_previous_motor_year"
          control={control}
          maxLength={4}
          type={'text-number'}
        />
      </div>
    </div>
  );
};

export default FormCustomerInfo;
