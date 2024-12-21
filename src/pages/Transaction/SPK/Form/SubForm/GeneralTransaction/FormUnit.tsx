import { Controller, useFormContext } from 'react-hook-form';
import SelectMotor from '../../../../../../components/Forms/SelectGroup/Master/SelectMotor';
import SelectColor from '../../../../../../components/Forms/SelectGroup/SelectColor';

const FormUnit = () => {
  const {
    control,
    getValues,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid grid-cols-12 gap-x-6 ">
      <div className="col-span-12">
        <div className="detail-title mt-10">Unit Info</div>
      </div>
      <div className="col-span-12 mt-2 ">
        <hr />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Tipe Motor</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_unit_motor"
          control={control}
          rules={{ required: 'Tipe Motor wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectMotor
              onChange={onChange}
              value={value}
              location={getValues('spk_general_location')}
            />
          )}
        />
      </div>
      <div className="col-span-4 hidden lg:block" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_unit_motor && (
          <span className="text-error">
            {errors.spk_unit_motor?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Warna</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_unit_color"
          control={control}
          rules={{ required: 'Warna wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectColor onChange={onChange} value={value} />
          )}
        />
      </div>
      <div className="col-span-4 hidden lg:block" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_unit_color && (
          <span className="text-error">
            {errors.spk_unit_color?.message?.toString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormUnit;
