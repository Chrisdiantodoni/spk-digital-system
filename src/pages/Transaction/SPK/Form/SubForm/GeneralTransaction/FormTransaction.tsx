import { Controller, useFormContext, useWatch } from 'react-hook-form';
import RadioButton from '../../../../../../components/RadioButton';
import { useEffect } from 'react';
import SelectGroup from '../../../../../../components/Forms/SelectGroup/SelectGroup';
import SelectMicrofinance from '../../../../../../components/Forms/SelectGroup/SelectMicrofinance';
import SelectLeasing from '../../../../../../components/Forms/SelectGroup/SelectLeasing';
import SelectTenor from '../../../../../../components/Forms/SelectGroup/Master/SelectTenor';
import { ControllerInput } from '../../../../../../utils/ControllerInput';
import { useParams } from 'react-router-dom';

const FormTransaction = () => {
  const {
    register,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();
  const payment_method = useWatch({
    control,
    name: 'spk_transaction_payment_method',
  });

  const leasing = watch('spk_transaction_leasi');
  const microfinance = useWatch({
    control,
    name: 'spk_transaction_microfinance',
  });

  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      if (
        getValues('spk_transaction_microfinance') ||
        watch('spk_transaction_leasing')
      ) {
        setValue('spk_transaction_leasing', leasing);
        setValue('spk_transaction_microfinance', microfinance);
      } else {
        setValue('spk_transaction_leasing', null);
        setValue('spk_transaction_microfinance', null);
      }
    }
  }, [payment_method, id]);

  const handlePaymentMethod = () => {
    switch (payment_method) {
      case 'cash':
        return (
          <>
            <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
              <p className="detail-label">Microfinance</p>
            </div>
            <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <Controller
                name="spk_transaction_microfinance"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SelectMicrofinance onChange={onChange} value={value} />
                )}
              />
            </div>
          </>
        );
      case 'credit':
        return (
          <>
            <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
              <p className="detail-label">Leasing</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <Controller
                name="spk_transaction_leasing"
                control={control}
                rules={{ required: 'Leasing wajib dipilih' }}
                render={({ field: { onChange, value } }) => (
                  <SelectLeasing onChange={onChange} value={value} />
                )}
              />
            </div>
            <div className="col-span-4 hidden lg:block" />
            <div className="col-span-12 lg:col-span-8">
              {errors.spk_transaction_leasing && (
                <span className="text-error">
                  {errors.spk_transaction_leasing?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
              <p className="detail-label">Down Payment</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <ControllerInput
                control={control}
                type={'currency'}
                name="spk_transaction_down_payment"
                defaultValue={''}
                rules={{ required: 'Down Payment wajib diisi' }}
              />
            </div>
            <div className="col-span-4 hidden lg:block" />
            <div className="col-span-12 lg:col-span-8">
              {errors.spk_transaction_down_payment && (
                <span className="text-error">
                  {errors.spk_transaction_down_payment?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
              <p className="detail-label">Tenor</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <Controller
                name="spk_transaction_tenor"
                control={control}
                rules={{ required: 'Tenor wajib dipilih' }}
                render={({ field: { onChange, value } }) => (
                  <SelectTenor onChange={onChange} value={value} />
                )}
              />
            </div>
            <div className="col-span-4 hidden lg:block" />
            <div className="col-span-12 lg:col-span-8">
              {errors.spk_transaction_tenor && (
                <span className="text-error">
                  {errors.spk_transaction_tenor?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
              <p className="detail-label">Cicilan</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <ControllerInput
                control={control}
                rules={{ required: 'Cicilan wajib diisi' }}
                type={'currency'}
                defaultValue={''}
                name="spk_transaction_instalment"
              />
            </div>
            <div className="col-span-4 hidden lg:block" />
            <div className="col-span-12 lg:col-span-8">
              {errors.spk_transaction_instalment && (
                <span className="text-error">
                  {errors.spk_transaction_instalment?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
              <p className="detail-label">Nama Surveyor</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                {...register('spk_transaction_surveyor_name', {
                  required: 'Nama Surveypr wajib diisi',
                })}
              />
            </div>
            <div className="col-span-4 hidden lg:block" />
            <div className="col-span-12 lg:col-span-8">
              {errors.spk_transaction_surveyor_name && (
                <span className="text-error">
                  {errors.spk_transaction_surveyor_name?.message?.toString()}
                </span>
              )}
            </div>
          </>
        );
      default:
        break;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-x-6 ">
      <div className="col-span-12">
        <div className="detail-title">Transaction Info</div>
      </div>
      <div className="col-span-12 mt-4">
        <hr />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Metode Pembelian</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8   flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_transaction_method_buying"
          control={control}
          defaultValue={'off_the_road'}
          render={({ field: { onChange, value } }) => (
            <SelectGroup
              divClassName="w-full mb-0"
              items={[
                {
                  label: 'Off the Road',
                  value: 'off_the_road',
                },
                {
                  label: 'On the Road',
                  value: 'on_the_road',
                },
              ]}
              value={value}
              onChange={(e) => {
                // console.log(e);
                onChange(e);
              }}
            />
          )}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 my-4 lg:my-6  flex items-center">
        <p className="detail-label">Metode Pembayaran</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-8 flex items-center gap-2">
        <p className="hidden lg:block">:</p>
        <Controller
          name="spk_transaction_payment_method"
          control={control}
          defaultValue={'cash'}
          render={({ field: { onChange, value } }) => (
            <RadioButton
              className="flex justify-around w-full "
              items={[
                {
                  label: 'CASH',
                  value: 'cash',
                },
                {
                  label: 'CREDIT',
                  value: 'credit',
                },
              ]}
              selectedItem={value}
              onChange={onChange}
            />
          )}
        />
      </div>
      {handlePaymentMethod()}
    </div>
  );
};

export default FormTransaction;
