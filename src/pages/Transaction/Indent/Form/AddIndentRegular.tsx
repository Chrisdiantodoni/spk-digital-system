import { useNavigate } from 'react-router-dom';
import LoaderButton from '../../../../common/Loader/LoaderButton';
import Container from '../../../../components/Container';
import { useButtonApproval } from '../../../../hooks/useButtonApproval';
import { Controller, useWatch, useForm } from 'react-hook-form';
import SelectMotor from '../../../../components/Forms/SelectGroup/SelectMotor';
import SelectSalesman from '../../../../components/Forms/SelectGroup/SelectSalesman';
import RadioButton from '../../../../components/RadioButton';
import { useEffect, useState } from 'react';
import SelectMicrofinance from '../../../../components/Forms/SelectGroup/SelectMicrofinance';
import { numberFormatter } from '../../../../utils/formatter';
import { useMutation } from '@tanstack/react-query';
import SelectLeasing from '../../../../components/Forms/SelectGroup/SelectLeasing';
import Swal from 'sweetalert2';
import indent from '../../../../Services/API/transaction/indent';
import SelectColor from '../../../../components/Forms/SelectGroup/SelectColor';
import queryStrings from 'query-string';
import Loader2 from '../../../../common/Loader/Loader';
import createStore from '../../../../context';
import { ControllerInput } from '../../../../utils/ControllerInput';

const AddIndentRegular = () => {
  const navigate = useNavigate();

  const [isDisabledInput, setIsDisabledInput] = useState(false);

  const {
    control,
    getValues,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      motor: '',
      color: '',
      consumer: '',
      nik: '',
      whatsapp: '',
      no_handphone: '',
      sales: '',
      microfinance: '',
      amount: '',
      note: '',
      leasing: '',
      indentDetail: '',
    },
  });
  const motor = useWatch<any>({
    control,
    name: 'motor',
  });
  const microfinance = useWatch<any>({
    control,
    name: 'microfinance',
  });

  const leasing = useWatch<any>({
    control,
    name: 'leasing',
  });

  const salesman = useWatch<any>({
    control,
    name: 'sales',
  });

  const color = useWatch<any>({
    control,
    name: 'color',
  });
  const { id } = queryStrings.parse(location.search) as { id: string };

  const { setTitle } = createStore();

  useEffect(() => {
    if (id) {
      setTitle('EDIT INDENT');
    } else {
      setTitle('ADD INDENT');
    }
  }, []);

  const [selectedOption, setSelectedOption] = useState('cash');
  const [isLoading, setIsLoading] = useState(false);

  // const registerNumber = (name: any) => ({
  //   ...register(name, {
  //     required: 'Jumlah harus dimasukkan',
  //     pattern: {
  //       value: /^\d+(\.\d{1,2})?$/,
  //       message: 'Invalid amount',
  //     },
  //   }),
  //   onChange: (e: any) => {
  //     const inputValue =
  //       parseFloat(e.target.value.replace(/[^0-9.-]/g, '')) || 0;
  //     setValue(name, inputCurrency(inputValue));
  //   },
  // });

  const { isPending, mutate: handleSubmitIndentRegularData } = useMutation({
    mutationFn: async (data: any) => {
      console.log({ data });
      data = {
        motor_id: motor?.value,
        color_id: color?.value?.color_id,
        indent_people_name: getValues('consumer'),
        indent_nik: getValues('nik'),
        indent_wa_number: getValues('whatsapp'),
        indent_phone_number: getValues('no_handphone'),
        indent_type: selectedOption,
        indent_note: getValues('note'),
        amount_total: numberFormatter(data?.amount),
        sales_id: salesman?.value?.salesman_id,
        salesman_name: salesman?.value?.salesman_name || salesman?.value,
      };
      if (selectedOption === 'cash') {
        data.micro_finance_id = microfinance?.value?.microfinance_id;
        data.microfinance_name =
          microfinance?.value?.microfinance_name || microfinance?.value;
      } else {
        data.leasing_id = leasing?.value?.leasing_id;
        data.leasing_name = leasing?.value?.leasing_name || leasing?.value;
      }
      if (id) {
        const response = await indent.updateIndent(id, data);
        return response;
      }
      // console.log(data);
      // return;
      // if (id) {
      //   const response = await indent.
      //   return response
      // }
      const response = await indent.createIndent(data);
      return response;
    },
    onSuccess: (res) => {
      if (res.meta.code === 200) {
        if (id) {
          Swal.fire({
            title: 'Sukses!',
            icon: 'success',
            text: 'Indent berhasil diedit',
          }).then(() => {
            navigate(`/transaction/indent-regular/${id}`);
          });
        } else {
          Swal.fire({
            title: 'Sukses!',
            icon: 'success',
            text: 'Indent berhasil dibuat',
          }).then(() => {
            navigate(
              `/transaction/indent-regular/${res?.data?.indent?.indent_id}`,
            );
          });
        }
      }
    },
  });
  const handleSubmitIndentRegular = (data: any) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#D40000',
      confirmButtonText: 'YES',
      confirmButtonColor: '#00029D',
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmitIndentRegularData(data);
      }
    });
  };

  const getDetailIndent = async () => {
    setIsLoading(true);
    await indent.getIndentDetail(id).then((res: any) => {
      if (res.meta.code == 200) {
        setValue('motor', { value: res?.data?.motor?.motor_id });
        if (res?.data?.indent_type === 'cash') {
          setValue('microfinance', {
            label: res?.data?.microfinance_name,
            value: res?.data?.microfinance_name,
          });
        } else {
          setValue('leasing', {
            label: res?.data?.leasing_name,
            value: res?.data?.leasing_name,
          });
        }
        setSelectedOption(res?.data?.indent_type);
        setValue('color', {
          label: res?.data?.color?.color_name,
          value: res?.data?.color,
        });
        setValue('sales', {
          label: res?.data?.salesman_name,
          value: res?.data?.salesman_name,
        });
        setValue('consumer', res?.data?.indent_people_name);
        setValue('nik', res?.data?.indent_nik);
        setValue('no_handphone', res?.data?.indent_phone_number);
        setValue('whatsapp', res?.data?.indent_wa_number);
        setValue('amount', res?.data?.amount_total);
        setValue('note', res?.data?.indent_note);
        setIsLoading(false);
      }
      if (res.data?.indent_payment.length > 0) {
        setIsDisabledInput(true);
      }
    });
  };
  useEffect(() => {
    if (id) {
      getDetailIndent();
    }
  }, []);

  const { backFormBtn, submitBtn } = useButtonApproval();
  return isLoading ? (
    <Container>
      <div className="grid grid-cols-12">
        <div className="col-span-12 h-100 items-center justify-center flex">
          <Loader2 />
        </div>
      </div>
    </Container>
  ) : (
    <Container>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <p className="detail-title">
            {' '}
            {id ? 'EDIT INDENT' : 'TAMBAH INDENT'}
          </p>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 items-center flex">
              <p className="detail-label">Tipe Motor</p>
              <span className="text-danger ml-1">*</span>
            </div>
            <div className="col-span-12 lg:col-span-9 flex gap-2 items-center">
              <p className="hidden lg:block">:</p>
              <Controller
                name="motor"
                rules={{ required: 'Tipe Motor wajib dipilih' }}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SelectMotor
                    onChange={onChange}
                    value={value}
                    motor_id={motor?.value}
                  />
                )}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.motor && (
                <span className="text-error">
                  {errors.motor?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 my-4 lg:my-6items-center flex">
              <p className="detail-label">Warna</p>
              <span className="text-danger ml-1">*</span>
            </div>
            <div className="col-span-12 lg:col-span-9 flex gap-2 items-center">
              <p className="hidden lg:block">:</p>

              <Controller
                name="color"
                control={control}
                rules={{ required: 'Warna wajib dipilih' }}
                render={({ field: { onChange, value } }) => (
                  <SelectColor
                    onChange={onChange}
                    value={value}
                    color_id={color?.value?.color_id}
                  />
                )}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.color && (
                <span className="text-error">
                  {errors.color?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 items-center flex">
              <p className="detail-label">Konsumen</p>
              <span className="text-danger ml-1">*</span>
            </div>
            <div className="col-span-12 lg:col-span-9 flex gap-2 items-center">
              <p className="hidden lg:block">:</p>

              <input
                className="text-input"
                {...register('consumer', { required: 'Konsumen wajib diisi' })}
                disabled={isDisabledInput}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.consumer && (
                <span className="text-error">
                  {errors.consumer?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 items-center flex">
              <p className="detail-label">NIK</p>
              <span className="text-danger ml-1">*</span>
            </div>
            <div className="col-span-12 lg:col-span-9 flex gap-2 items-center">
              <p className="hidden lg:block">:</p>
              <ControllerInput
                name="nik"
                control={control}
                rules={{
                  required: 'NIK Wajib diisi',
                }}
                type={'text-number'}
                disabled={isDisabledInput}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.nik && (
                <span className="text-error">
                  {errors.nik?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 items-center flex">
              <p className="detail-label">No. Handphone</p>
              <span className="text-danger ml-1">*</span>
            </div>
            <div className="col-span-12 lg:col-span-9 flex gap-2 items-center">
              <p className="hidden lg:block">:</p>
              <ControllerInput
                name="no_handphone"
                control={control}
                rules={{
                  required: 'No. Handphone Wajib diisi',
                }}
                type={'text-number'}
                disabled={isDisabledInput}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.no_handphone && (
                <span className="text-error">
                  {errors.no_handphone?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 items-center flex">
              <p className="detail-label">Whatsapp</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex gap-2 items-center">
              <p className="hidden lg:block">:</p>
              <ControllerInput
                name="whatsapp"
                control={control}
                type={'text-number'}
                disabled={isDisabledInput}
              />
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 items-center flex">
              <p className="detail-label">Sales</p>
              <span className="text-danger ml-1">*</span>
            </div>
            <div className="col-span-12 lg:col-span-9 flex gap-2 items-center">
              <p className="hidden lg:block">:</p>
              <Controller
                name="sales"
                control={control}
                rules={{ required: 'Salesman wajib dipilih' }}
                render={({ field: { onChange, value } }) => (
                  <SelectSalesman
                    onChange={onChange}
                    value={value}
                    sales_id={salesman?.value?.salesman_id}
                    isDisabled={isDisabledInput}
                  />
                )}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.sales && (
                <span className="text-error">
                  {errors.sales?.message?.toString()}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 items-center flex">
              <p className="detail-label">Jenis Transaksi</p>
              <span className="text-danger ml-1">*</span>
            </div>
            <div className="col-span-12 lg:col-span-9 flex  gap-2 items-center">
              <p className="hidden lg:block">:</p>
              <RadioButton
                selectedItem={selectedOption}
                items={[
                  { label: 'CASH', value: 'cash' },
                  { label: 'CREDIT', value: 'credit' },
                ]}
                disabled={isDisabledInput}
                onChange={(value: any) => setSelectedOption(value)}
                className="flex justify-evenly w-full items-center"
              />
            </div>
            <div className="col-span-12 lg:col-span-3 items-center flex  my-4 lg:my-6 transition-opacity duration-300 opacity-100">
              <p className="detail-label">
                {selectedOption === 'cash' ? 'Microfinance' : 'Leasing'}
              </p>
              <span className="text-danger ml-1">*</span>
            </div>

            <div className="col-span-12 lg:col-span-9 flex gap-2 items-center transition-opacity duration-300 opacity-100">
              <p className="hidden lg:block">:</p>
              {selectedOption === 'cash' ? (
                <Controller
                  name="microfinance"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SelectMicrofinance
                      onChange={onChange}
                      value={value}
                      microfinance_id={microfinance?.value?.micro_finance_id}
                      isDisabled={isDisabledInput}
                    />
                  )}
                />
              ) : (
                <Controller
                  name="leasing"
                  rules={{ required: 'Leasing wajib dipilih' }}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <SelectLeasing
                      onChange={onChange}
                      value={value}
                      leasing_id={leasing?.value?.leasing_id}
                      isDisabled={isDisabledInput}
                    />
                  )}
                />
              )}
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.leasing && (
                <span className="text-error">
                  {errors.leasing?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3  my-4 lg:my-6 items-center flex">
              <p className="detail-label">Amount</p>
              <span className="text-danger ml-1">*</span>
            </div>
            <div className="col-span-12 lg:col-span-9 flex gap-2 my-4 items-center">
              <p className="hidden lg:block">:</p>
              <ControllerInput
                name="amount"
                control={control}
                rules={{
                  required: 'Nominal Wajib diisi',
                }}
                type={'currency'}
                disabled={isDisabledInput}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.amount && (
                <span className="text-error">
                  {errors.amount?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3  my-4 lg:my-6 flex">
              <p className="detail-label">Catatan</p>
            </div>
            <div className="col-span-12 lg:col-span-9 my-4 lg:my-5 flex gap-2 ">
              <p className="hidden lg:block">:</p>
              <textarea
                className="text-area"
                {...register('note')}
                disabled={isDisabledInput}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:flex">
          <div className="grid grid-cols-12 gap-x-3 gap-y-4">
            <div className="col-span-12 lg:col-span-4 2xl:col-span-2 gap-2">
              {isPending ? (
                <LoaderButton className={`btn-edit`} />
              ) : (
                submitBtn({
                  onClick: handleSubmit(handleSubmitIndentRegular),
                })
              )}
            </div>
            <div className="col-span-12 lg:col-span-4 2xl:col-span-2 gap-2">
              {backFormBtn({ onClick: () => navigate(-1) })}
              {/* <Button
                label="CANCEL"
                Icon={<ArrowLeft size={18} />}
                className={'btn-delete'}
                onClick={() => navigate(-1)}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default AddIndentRegular;
