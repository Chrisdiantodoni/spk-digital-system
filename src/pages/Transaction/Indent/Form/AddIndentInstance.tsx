import { useNavigate } from 'react-router-dom';
import LoaderButton from '../../../../common/Loader/LoaderButton';
import Container from '../../../../components/Container';
import { useButtonApproval } from '../../../../hooks/useButtonApproval';
import { Controller, useWatch, useForm } from 'react-hook-form';
import SelectMotor from '../../../../components/Forms/SelectGroup/SelectMotor';
import SelectSalesman from '../../../../components/Forms/SelectGroup/SelectSalesman';
import { useEffect, useState } from 'react';
import { numberFormatter } from '../../../../utils/formatter';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import indent from '../../../../Services/API/transaction/indent';
import queryStrings from 'query-string';
import Loader2 from '../../../../common/Loader/Loader';
import createStore from '../../../../context';
import { ControllerInput } from '../../../../utils/ControllerInput';
import DatePicker from '../../../../components/Forms/DatePicker/DatePicker';
import SelectProvince from '../../../../components/Forms/SelectGroup/Master/SelectProvince';
import SelectCity from '../../../../components/Forms/SelectGroup/Master/SelectCity';
import SelectDistrict from '../../../../components/Forms/SelectGroup/Master/SelectDistrict';
import SelectSubdistrict from '../../../../components/Forms/SelectGroup/Master/SelectSubDistrict';
import { SweetAlert } from '../../../../utils/Swal';
import { dayjsFormatInputDate } from '../../../../utils/dayjs';

const AddIndentInstance = () => {
  const navigate = useNavigate();

  const [isDisabledInput, setIsDisabledInput] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      motor: '',
      no_handphone: '',
      sales: '',
      amount: '',
      note: '',
      indent_date: new Date(),
      po_date: new Date(),
    },
  });
  const motor = useWatch<any>({
    control,
    name: 'motor',
  });

  const salesman = useWatch<any>({
    control,
    name: 'sales',
  });

  const { id } = queryStrings.parse(location.search) as { id: string };

  const { setTitle } = createStore();

  useEffect(() => {
    if (id) {
      setTitle('EDIT INDENT INSTANCE');
    } else {
      setTitle('ADD INDENT INSTANCE');
    }
  }, []);

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

  const { isPending, mutate: handleSubmitIndentInstanceData } = useMutation({
    mutationFn: async (data: any) => {
      // console.log({ data });
      data = {
        ...data,
        indent_instansi_date: dayjsFormatInputDate(data?.indent_date),
        motor_id: data?.motor?.value,
        indent_instansi_po_date: dayjsFormatInputDate(data?.po_date),
        amount_total: numberFormatter(data?.amount),
        sales_id: salesman?.value?.salesman_id,
        salesman_name: salesman?.value?.salesman_name || salesman?.value,
        province_id: data?.province?.value?.province_id,
        province_name: data?.province?.value?.province_name,
        city_id: data?.city?.value?.city_id,
        city_name: data?.city?.value?.city_name,
        district_id: data?.district?.value?.district_id,
        district_name: data?.district?.value?.district_name,
        sub_district_id: data?.sub_district?.value?.sub_district_id,
        sub_district_name: data?.sub_district?.value?.sub_district_name,
        indent_instansi_note: data?.note,
      };

      if (id) {
        const response = await indent.updateIndentInstance(id, data);
        return response;
      }
      // console.log({ data });
      // return;
      // if (id) {
      //   const response = await indent.
      //   return response
      // }
      const response = await indent.createIndentInstance(data);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        if (id) {
          Swal.fire({
            title: 'Sukses!',
            icon: 'success',
            text: 'Indent berhasil diedit',
          }).then(() => {
            navigate(`/transaction/indent-instance/${id}`);
          });
        } else {
          Swal.fire({
            title: 'Sukses!',
            icon: 'success',
            text: 'Indent berhasil dibuat',
          }).then(() => {
            navigate(
              `/transaction/indent-instance/${res?.data?.indent_instansi?.indent_instansi_id}`,
            );
          });
        }
      } else {
        console.log(res);
        SweetAlert('error', res?.data, 'Error');
      }
    },
    onError: (res: any) => {
      console.log(res);
      SweetAlert('error', res?.data, 'Error');
    },
  });
  const handleSubmitIndentInstance = (data: any) => {
    console.log({ data });

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
        handleSubmitIndentInstanceData(data);
      }
    });
  };

  const getDetailIndent = async () => {
    setIsLoading(true);
    await indent.getIndentInstanceDetail(id).then((res: any) => {
      if (res.meta.code == 200) {
        setValue('motor', { value: res?.data?.motor?.motor_id });
        setValue('sales', {
          label: res?.data?.salesman_name,
          value: {
            salesman_id: res?.data?.sales_id,
            salesman_name: res?.data?.salesman_name,
          },
        });
        setValue('indent_instansi_name', res?.data?.indent_instansi_name);
        setValue('indent_instansi_no_hp', res?.data?.indent_instansi_no_hp);
        setValue('indent_instansi_nominal', res?.data?.indent_instansi_nominal);
        setValue(
          'indent_instansi_number_po',
          res?.data?.indent_instansi_number_po,
        );
        setValue('indent_instansi_address', res?.data?.indent_instansi_address);
        setValue('province', {
          label: res?.data?.province_name,
          value: {
            province_id: res?.data?.province_id,
            province_name: res?.data?.province_name,
          },
        });
        setValue('city', {
          label: res?.data?.city_name,
          value: {
            city_id: res?.data?.city_id,
            city_name: res?.data?.city_name,
          },
        });
        setValue('district', {
          label: res?.data?.district_name,
          value: {
            district_id: res?.data?.district_id,
            district_name: res?.data?.district_name,
          },
        });
        setValue('sub_district', {
          label: res?.data?.sub_district_name,
          value: {
            sub_district_id: res?.data?.sub_district_id,
            sub_district_name: res?.data?.sub_district_name,
          },
        });

        setValue(
          'indent_instansi_postal_code',
          res?.data?.indent_instansi_postal_code,
        );
        setValue('indent_instansi_no_telp', res?.data?.indent_instansi_no_telp);
        setValue('indent_instansi_email', res?.data?.indent_instansi_email);
        setValue('amount', res?.data?.indent_instansi_nominal);
        setValue('note', res?.data?.indent_instansi_note);

        // setValue('note', res?.data?.indent_note);
        setIsLoading(false);
      }
      if (res.data?.indent_instansi_payments.length > 0) {
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

  const province = watch('province');
  const district = watch('district');
  const city = watch('city');

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
            {id ? 'EDIT INDENT INSTANSI' : 'TAMBAH INDENT INSTANSI'}
          </p>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 items-center flex">
              <p className="detail-label">Tanggal Indent</p>
              <span className="text-danger ml-1">*</span>
            </div>
            <div className="col-span-12 lg:col-span-9 flex gap-2 items-center">
              <p className="hidden lg:block">:</p>
              <div className="w-full">
                <Controller
                  name="indent_date"
                  rules={{ required: 'Tanggal wajib diisi' }}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      isDisabled
                      onChange={onChange}
                      value={value}
                      divClassName="w-full"
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 items-center flex">
              <p className="detail-label">No. PO</p>
              <span className="text-danger ml-1">*</span>
            </div>
            <div className="col-span-12 lg:col-span-9 flex gap-2 items-center">
              <p className="hidden lg:block">:</p>
              <input
                disabled={isDisabledInput}
                className="text-input"
                {...register('indent_instansi_number_po', {
                  required: 'Nomor PO wajib diisi',
                })}
              />
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 items-center flex">
              <p className="detail-label">Tanggal PO</p>
              <span className="text-danger ml-1">*</span>
            </div>
            <div className="col-span-12 lg:col-span-9 flex gap-2 items-center">
              <p className="hidden lg:block">:</p>
              <div className="w-full">
                <Controller
                  name="po_date"
                  rules={{ required: 'Tanggal wajib diisi' }}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DatePicker
                      isDisabled={isDisabledInput}
                      onChange={onChange}
                      value={value}
                      divClassName="w-full"
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 items-center flex">
              <p className="detail-label">Nama Instansi</p>
              <span className="text-danger ml-1">*</span>
            </div>
            <div className="col-span-12 lg:col-span-9 flex gap-2 items-center">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                disabled={isDisabledInput}
                {...register('indent_instansi_name')}
              />
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 items-center flex">
              <p className="detail-label">Alamat</p>
              <span className="text-danger ml-1">*</span>
            </div>
            <div className="col-span-12 lg:col-span-9 flex gap-2 items-center">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                disabled={isDisabledInput}
                {...register('indent_instansi_address')}
              />
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
                  <SelectProvince
                    onChange={onChange}
                    value={value}
                    disabled={isDisabledInput}
                  />
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
                    disabled={!province || isDisabledInput ? true : false}
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
                <span className="text-error">
                  {errors.city?.message?.toString()}
                </span>
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
                    disabled={!city || isDisabledInput ? true : false}
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
                    disabled={!district || isDisabledInput ? true : false}
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
                name="indent_instansi_postal_code"
                control={control}
                maxLength={6}
                type={'text-number'}
                disabled={isDisabledInput}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">No. Telp</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <ControllerInput
                name="indent_instansi_no_telp"
                control={control}
                maxLength={12}
                type={'text-number'}
                disabled={isDisabledInput}
              />
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">No. Ponsel</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <ControllerInput
                name="indent_instansi_no_hp"
                control={control}
                maxLength={12}
                rules={{ required: 'No. Ponsel wajib diisi' }}
                type={'text-number'}
                disabled={isDisabledInput}
              />
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">E-mail</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                disabled={isDisabledInput}
                {...register('indent_instansi_email')}
              />
            </div>

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
            <div className="col-span-12 lg:col-span-3  my-4 lg:my-6 items-center flex">
              <p className="detail-label">Amount</p>
              <span className="text-danger ml-1">*</span>
            </div>
            <div className="col-span-12 lg:col-span-9 flex gap-2 my-4 items-center">
              <p className="hidden lg:block">:</p>
              <ControllerInput
                name="indent_instansi_nominal"
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
                  onClick: handleSubmit(handleSubmitIndentInstance),
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

export default AddIndentInstance;
