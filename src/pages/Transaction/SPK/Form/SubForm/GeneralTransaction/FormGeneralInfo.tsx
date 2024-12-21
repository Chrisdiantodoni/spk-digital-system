import { Controller, useFormContext } from 'react-hook-form';
import SelectLocation from '../../../../../../components/Forms/SelectGroup/Master/SelectLocation';
import SelectIndent from '../../../../../../components/Forms/SelectGroup/Master/SelectIndent';
import DatePicker from '../../../../../../components/Forms/DatePicker/DatePicker';
import SelectSalesman from '../../../../../../components/Forms/SelectGroup/SelectSalesman';
import SelectMethodSales from '../../../../../../components/Forms/SelectGroup/Master/SelectMethodSales';
import { SweetAlert } from '../../../../../../utils/Swal';

const FormGeneralInfo = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid grid-cols-12 gap-x-6 ">
      <div className="col-span-12 flex justify-between">
        <div className="detail-title">General Info</div>
      </div>
      <div className="col-span-12 mt-4">
        <hr />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6 flex items-center">
        <p className="detail-label">Lokasi</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_general_location"
          control={control}
          rules={{ required: 'Lokasi wajib dipilih' }}
          render={({ field: { onChange, value } }) => (
            <SelectLocation onChange={onChange} value={value} />
          )}
        />
      </div>
      <div className="col-span-4 hidden lg:block" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_general_location && (
          <span className="text-error">
            {errors.spk_general_location?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">No. Indent</p>
      </div>
      <div className="col-span-12 lg:col-span-8  flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_general_indent"
          control={control}
          render={({ field: { onChange, value } }) => {
            // if (value?.value?.spk_general == null) {
            //   return SweetAlert('perhatian', 'sudah ada spk', 'warning');
            // }
            return <SelectIndent onChange={onChange} value={value} />;
          }}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Tanggal</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <div className="w-full ">
          <Controller
            name="spk_general_date"
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePicker
                onChange={onChange}
                value={value}
                divClassName=" w-full mb-0"
              />
            )}
          />
        </div>
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Salesman</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
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
      <div className="col-span-4 hidden lg:block" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_general_salesman && (
          <span className="text-error">
            {errors.spk_general_salesman?.message?.toString()}
          </span>
        )}
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Metode Penjualan</p>
        <p className="text-danger ml-2">*</p>
      </div>

      <div className="relative col-span-12 lg:col-span-8  flex items-center  gap-2">
        <p className="relative hidden lg:block">:</p>
        <div className="relative w-full">
          <Controller
            control={control}
            rules={{ required: 'Method Penjualan wajib dipilih' }}
            name="spk_general_sales_method"
            render={({ field: { onChange, value } }) => (
              <SelectMethodSales onChange={onChange} value={value} />
            )}
          />
        </div>
      </div>
      <div className="col-span-4 hidden lg:block" />
      <div className="col-span-12 lg:col-span-8">
        {errors.spk_general_sales_method && (
          <span className="text-error">
            {errors.spk_general_sales_method?.message?.toString()}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormGeneralInfo;
