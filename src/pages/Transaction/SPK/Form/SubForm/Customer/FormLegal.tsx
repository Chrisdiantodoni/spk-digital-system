import { Controller, useFormContext, useWatch } from 'react-hook-form';
import CheckBox from '../../../../../../components/Checkboxes/Checkbox';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import SelectProvince from '../../../../../../components/Forms/SelectGroup/Master/SelectProvince';
import SelectCity from '../../../../../../components/Forms/SelectGroup/Master/SelectCity';
import SelectDistrict from '../../../../../../components/Forms/SelectGroup/Master/SelectDistrict';
import SelectSubdistrict from '../../../../../../components/Forms/SelectGroup/Master/SelectSubDistrict';
import RadioButton from '../../../../../../components/RadioButton';
import DatePicker from '../../../../../../components/Forms/DatePicker/DatePicker';
import { dayJsFormatDate } from '../../../../../../utils/dayjs';
import { ControllerInput } from '../../../../../../utils/ControllerInput';
import toast from 'react-hot-toast';

const FormLegal = () => {
  const {
    register,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useFormContext();
  const [isChecked, setIsChecked] = useState(false);
  const { id } = useParams();

  const handleCheckBoxChange = (newValue: any) => {
    const spkCustomerRequiredErrors = Object.keys(errors).filter(
      (key: any) =>
        key.startsWith('spk_customer') && errors[key]?.type === 'required',
    );

    if (spkCustomerRequiredErrors.length > 0) {
      toast.error('There are empty inputs in the Customer Info');
      return;
    }
    setIsChecked(!newValue);
    handleSynchronizeData(!newValue);
  };

  const handleSynchronizeData = (newValue: boolean) => {
    if (newValue) {
      setValue('spk_legal_nik', getValues('spk_customer_nik'));
      setValue('spk_legal_name', getValues('spk_customer_name'));
      setValue('spk_legal_address', getValues('spk_customer_address'));
      setValue('spk_legal_province', getValues('spk_customer_province'));
      setValue('spk_legal_city', getValues('spk_customer_city'));
      setValue('spk_legal_district', getValues('spk_customer_district'));
      setValue(
        'spk_legal_sub_district',
        getValues('spk_customer_sub_district'),
      );
      setValue('spk_legal_post_code', getValues('spk_customer_post_code'));
      setValue(
        'spk_legal_place_of_birth',
        getValues('spk_customer_place_of_birth'),
      );
      setValue(
        'spk_legal_date_of_birth',
        dayJsFormatDate(getValues('spk_customer_date_of_birth')),
      );
      setValue('spk_legal_gender', getValues('spk_customer_gender'));
      setValue(
        'spk_legal_telephone_number',
        getValues('spk_customer_telephone_number'),
      );
      setValue(
        'spk_legal_phone_number',
        getValues('spk_customer_phone_number'),
      );
    }
  };

  const legalProvince = useWatch<any>({
    control: control,
    name: 'spk_legal_province',
  });
  const legalCity = useWatch<any>({
    control: control,
    name: 'spk_legal_city',
  });
  const legalDistict = useWatch<any>({
    control: control,
    name: 'spk_legal_district',
  });

  return (
    <div className="grid grid-cols-12 gap-x-6 mb-10">
      <div className="col-span-12">
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
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">NIK</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name={'spk_legal_nik'}
          control={control}
          rules={{
            required: 'NIK wajib diisi.',
          }}
          defaultValue={''}
          disabled={isChecked}
          type="text-number"
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_legal_nik && (
          <span className="text-error">
            {errors.spk_legal_nik?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Nama</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>

        <input
          className="text-input"
          {...register('spk_legal_name', { required: 'Nama wajib diisi' })}
          disabled={isChecked}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_legal_name && (
          <span className="text-error">
            {errors.spk_legal_name?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Alamat</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <input
          className="text-input"
          {...register('spk_legal_address', { required: 'Alamat wajib diisi' })}
          disabled={isChecked}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_legal_address && (
          <span className="text-error">
            {errors.spk_legal_address?.message?.toString()}
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
          name="spk_legal_province"
          control={control}
          rules={{ required: 'Provinsi wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectProvince
              onChange={onChange}
              value={value}
              disabled={isChecked}
            />
          )}
        />
      </div>{' '}
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_legal_province && (
          <span className="text-error">
            {errors.spk_legal_province?.message?.toString()}
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
          name="spk_legal_city"
          control={control}
          rules={{ required: 'Kota/Kabupaten wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectCity
              onChange={onChange}
              value={value}
              disabled={isChecked || !legalProvince ? true : false}
              province_id={legalProvince?.value?.province_id}
            />
          )}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_legal_city && (
          <span className="text-error">
            {errors.spk_legal_city?.message?.toString()}
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
          name="spk_legal_district"
          control={control}
          rules={{ required: 'Kecamatan wajib diisi' }}
          render={({ field: { onChange, value } }) => (
            <SelectDistrict
              onChange={onChange}
              value={value}
              disabled={isChecked || !legalCity ? true : false}
              city_id={legalCity?.value?.city_id}
            />
          )}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_legal_district && (
          <span className="text-error">
            {errors.spk_legal_district?.message?.toString()}
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
          name="spk_legal_sub_district"
          control={control}
          rules={{ required: 'Kelurahan wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectSubdistrict
              onChange={onChange}
              value={value}
              disabled={isChecked || !legalDistict ? true : false}
              district_id={legalDistict?.value?.district_id}
            />
          )}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_legal_sub_district && (
          <span className="text-error">
            {errors.spk_legal_sub_district?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Kode Pos</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <input
          className="text-input"
          {...register('spk_legal_post_code')}
          disabled={isChecked}
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
          {...register('spk_legal_place_of_birth', {
            required: 'Tempat lahir wajib diisi',
          })}
          disabled={isChecked}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_legal_place_of_birth && (
          <span className="text-error">
            {errors.spk_legal_place_of_birth?.message?.toString()}
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
          name="spk_legal_date_of_birth"
          control={control}
          defaultValue={null}
          rules={{ required: 'Tanggal lahir wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <div className="w-full">
              <DatePicker
                onChange={onChange}
                value={value}
                isDisabled={isChecked}
              />
            </div>
          )}
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_legal_date_of_birth && (
          <span className="text-error">
            {errors.spk_legal_date_of_birth?.message?.toString()}
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
          name="spk_legal_gender"
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
              disabled={isChecked}
            />
          )}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">No. Telp</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name={'spk_legal_telephone_number'}
          control={control}
          defaultValue={''}
          disabled={isChecked}
          type="text-number"
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">No. Ponsel</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <ControllerInput
          name={'spk_legal_phone_number'}
          control={control}
          rules={{
            required: 'No. Ponsel wajib diisi.',
          }}
          defaultValue={''}
          disabled={isChecked}
          type="text-number"
        />
      </div>
      <div className="col-span-4 lg:block hidden" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_legal_phone_number && (
          <span className="text-error">
            {errors.spk_legal_phone_number?.message?.toString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormLegal;
