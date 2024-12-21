import { useFormContext, Controller, useWatch } from 'react-hook-form';
import SelectGroup from '../../../../../../components/Forms/SelectGroup/SelectGroup';

import ModalImage from '../../../../../../components/Modal/Preview/ModalImage';
import FormUploadFiles from './FormUploadFiles';
import SelectNeq from '../../../../../../components/Forms/SelectGroup/SelectNeq';

const FormDeliveryInstance = ({
  customerFiles,
  onChangeCustomerFiles,
  detailDelivery,
  errorSK,
  onChangeErrorSk,
}: any) => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const delivery_option = useWatch({
    control,
    name: 'delivery_option',
  });

  const renderDeliveryOption = (delivery: any) => {
    switch (detailDelivery?.spk_delivery_type || delivery) {
      case 'ktp':
        return (
          <>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">Nama</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                {...register('spk_delivery_name', {
                  required: 'Nama wajib diisi',
                })}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.spk_delivery_name && (
                <span className="text-error">
                  {errors.spk_delivery_name?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">Alamat</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                {...register('spk_delivery_address', {
                  required: 'Alamat wajib diisi',
                })}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.spk_delivery_address && (
                <span className="text-error">
                  {errors.spk_delivery_address?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">Kota</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                {...register('spk_delivery_city', {
                  required: 'Kota wajib diisi',
                })}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.spk_delivery_city && (
                <span className="text-error">
                  {errors.spk_delivery_city?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">No. Telp</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                {...register('spk_delivery_tel_number')}
              />
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">No. Ponsel</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                {...register('spk_delivery_phone_number', {
                  required: 'No. ponsel wajib diisi',
                })}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.spk_delivery_phone_number && (
                <span className="text-error">
                  {errors.spk_delivery_phone_number?.message?.toString()}
                </span>
              )}
            </div>
          </>
        );
      case 'dealer':
        return (
          <>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">Nama</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                {...register('spk_delivery_name', {
                  required: 'Nama wajib diisi',
                })}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.spk_delivery_name && (
                <span className="text-error">
                  {errors.spk_delivery_name?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">No. Ponsel</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                {...register('spk_delivery_phone_number', {
                  required: 'No. ponsel wajib diisi',
                })}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.spk_delivery_phone_number && (
                <span className="text-error">
                  {errors.spk_delivery_phone_number?.message?.toString()}
                </span>
              )}
            </div>
          </>
        );
      case 'neq':
        return (
          <>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">NEQ</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <Controller
                name="spk_delivery_neq"
                control={control}
                rules={{ required: 'NEQ wajib dipilih' }}
                render={({ field: { onChange, value } }) => (
                  <SelectNeq onChange={onChange} value={value} />
                )}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.spk_delivery_neq && (
                <span className="text-error">
                  {errors.spk_delivery_neq?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">Nama</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                {...register('spk_delivery_name', {
                  required: 'Nama wajib diisi',
                })}
              />
            </div>

            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.spk_delivery_name && (
                <span className="text-error">
                  {errors.spk_delivery_name?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">No. Ponsel</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                {...register('spk_delivery_phone_number', {
                  required: 'No. Ponsel wajib diisi',
                })}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.spk_delivery_phone_number && (
                <span className="text-error">
                  {errors.spk_delivery_phone_number?.message?.toString()}
                </span>
              )}
            </div>
          </>
        );
      case 'domicile':
        return (
          <>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">Nama</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                {...register('spk_delivery_name', {
                  required: 'Nama wajib diisi',
                })}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.spk_delivery_name && (
                <span className="text-error">
                  {errors.spk_delivery_name?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">Alamat</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                {...register('spk_delivery_address', {
                  required: 'Alamat wajib diisi',
                })}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.spk_delivery_address && (
                <span className="text-error">
                  {errors.spk_delivery_address?.message?.toString()}
                </span>
              )}
            </div>
            <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
              <p className="detail-label">Kota</p>
              <p className="text-danger ml-2">*</p>
            </div>
            <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
              <p className="hidden lg:block">:</p>
              <input
                className="text-input"
                {...register('spk_delivery_city', {
                  required: 'Kota wajib diisi',
                })}
              />
            </div>
            <div className="col-span-3 hidden lg:block" />
            <div className="col-span-12 lg:col-span-9">
              {errors.spk_delivery_city && (
                <span className="text-error">
                  {errors.spk_delivery_city?.message?.toString()}
                </span>
              )}
            </div>
            <FormUploadFiles
              errorSK={errorSK}
              onChangeErrorSk={onChangeErrorSk}
              customerFiles={customerFiles}
              onChangeCustomerFiles={onChangeCustomerFiles}
            />
          </>
        );
      default:
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-x-6 mt-8">
      <ModalImage />
      <div className="col-span-12 lg:col-span-6">
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-12">
            <div className="detail-title">Delivery Info</div>
          </div>
          <div className="col-span-12 lg:col-span-3 my-4 lg:my-6 flex items-center">
            <p className="detail-label">Opsi Pengantaran</p>
            <p className="text-danger ml-2">*</p>
          </div>
          <div className="col-span-12 lg:col-span-9 flex items-center gap-2">
            <p className="hidden lg:block">:</p>
            <Controller
              name="delivery_option"
              control={control}
              defaultValue={'ktp'}
              render={({ field: { onChange, value } }) => (
                <SelectGroup
                  divClassName="w-full"
                  items={[
                    {
                      label: 'Pengantaran KTP',
                      value: 'ktp',
                    },
                    {
                      label: 'Self Pick-Up Dealer',
                      value: 'dealer',
                    },
                    {
                      label: 'Self Pick-Up NEQ',
                      value: 'neq',
                    },
                    {
                      label: 'Pengantaran Alamat Domisili',
                      value: 'domicile',
                    },
                  ]}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </div>
          <div className="col-span-12 my-2">
            <hr />
          </div>
          {renderDeliveryOption(delivery_option)}
        </div>
      </div>
    </div>
  );
};

export default FormDeliveryInstance;
