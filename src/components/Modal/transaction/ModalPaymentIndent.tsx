import createStore from '../../../context';
import Button from '../../Forms/Button/Button';
import { useForm, Controller, useWatch } from 'react-hook-form';
import DatePicker from '../../Forms/DatePicker/DatePicker';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import LoaderButton from '../../../common/Loader/LoaderButton';
import { SweetAlert } from '../../../utils/Swal';
import { useRef, useState } from 'react';
import { useButtonApproval } from '../../../hooks/useButtonApproval';
import RadioButton from '../../RadioButton';
import SelectBank from '../../Forms/SelectGroup/SelectBank';
import { numberFormatter } from '../../../utils/formatter';
import indent from '../../../Services/API/transaction/indent';
import toast from 'react-hot-toast';
import { ControllerInput } from '../../../utils/ControllerInput';
import { useParams } from 'react-router-dom';
import pdfPreview from '../../../images/pdfPreview.png';
import { Eye, Trash } from 'react-bootstrap-icons';
import { dayjsFormatInputDate } from '../../../utils/dayjs';
import spk from '../../../Services/API/transaction/spk';
import Modal from '../Modal';
import ModalImage from '../Preview/ModalImage';

function ModalPaymentIndent({ items, type }: any) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      payment_date: new Date(),
      bank: '',
      payment_method: '',
      payment_note: '',
      amount_total: 0,
    },
  });

  const { id } = useParams() as string | any;

  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<any>('');

  const handleFileChange = (event: any) => {
    const uploadedFile = event.target.files; // Access the uploaded file
    if (!uploadedFile || uploadedFile.length === 0) {
      return; // No file selected
    }
    if (uploadedFile[0].size > 5 * 1024 * 1024) {
      // Limit size to 5MB
      SweetAlert(
        'warning',
        'File terlalu besar, upload gambar harus di bawah 5 mb',
        'Perhatian',
      );
      return;
    }
    const updatedFiles = Array.from(uploadedFile).map((file: any) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setFile((prev: any) => ({
      ...prev,
      uploadedFile: [...(prev?.uploadedFile || []), ...updatedFiles],
    }));
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Click the file input programmatically
    }
  };

  const handleCloseModal = createStore((state: any) => state.handleModal);
  const modalPaymentIndent = createStore(
    (state: any) => state.modal.modalPaymentIndent,
  );

  const [selectedMethodPayment, setSelectedMethodPayment] = useState('cash');

  const { mutate: handlePaymentIndent, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();

      if (type === 'spk') {
        if (file) {
          file?.uploadedFile?.forEach((file: any, index: number) => {
            formData.append(`spk_payment_img[${index}][img]`, file?.file);
          });
        }

        const formFields = {
          spk_payment_list_method: selectedMethodPayment,
          bank_id:
            selectedMethodPayment !== 'cash'
              ? bank?.value?.bank_id || null
              : null,
          spk_payment_list_date: dayjsFormatInputDate(data?.payment_date),
          spk_payment_list_note: data?.payment_note,
          spk_payment_list_amount: data?.amount_total || 0,
        };
        Object.entries(formFields).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });

        const response = spk.createSpkPaymentRegular(id, formData);
        return response;
      } else if (type === 'indent-instance') {
        if (file) {
          file?.uploadedFile?.forEach((file: any, index: number) => {
            formData.append(
              `indent_instansi_payment_image[${index}][img]`,
              file?.file,
            );
          });
        }

        const formFields = {
          indent_instansi_payment_method: selectedMethodPayment,
          bank_id:
            selectedMethodPayment !== 'cash'
              ? bank?.value?.bank_id || null
              : null,
          indent_instansi_payment_date: dayjsFormatInputDate(
            data?.payment_date,
          ),
          indent_instansi_payment_note: data?.payment_note,
          indent_instansi_payment_amount: data?.amount_total || 0,
        };
        Object.entries(formFields).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });

        const response = indent.createIndentInstancePayment(id, formData);
        return response;
      } else {
        if (file) {
          file?.uploadedFile?.forEach((file: any, index: number) => {
            formData.append(`indent_payment_img[${index}][img]`, file?.file);
          });
        }
        const formFields = {
          indent_payment_method: selectedMethodPayment,
          bank_id:
            selectedMethodPayment !== 'cash'
              ? bank?.value?.bank_id || null
              : null,
          indent_payment_amount: numberFormatter(getValues('amount_total')),
          indent_payment_date: dayjs(getValues('payment_date')).format(
            'YYYY-MM-DD',
          ),
          indent_payment_note: getValues('payment_note'),
        };

        Object.entries(formFields).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });

        const response = await indent.createIndentPayment(id, formData);
        return response;
      }
    },
    onSuccess: async (res: any) => {
      if (res?.meta?.code === 200) {
        if (type === 'spk') {
          SweetAlert('success', 'Pembayaran SPK ditambahkan', 'Sukses');
          queryClient.invalidateQueries({ queryKey: ['detail_payment'] });
        } else {
          SweetAlert('success', 'Pembayaran Indent ditambahkan', 'Sukses');
          queryClient.invalidateQueries({ queryKey: ['detail_indent'] });
        }
        handleCloseModal('modalPaymentIndent', false);
        reset();
      }
    },
    onError: (error: any) => {
      console.log({ error });
      SweetAlert('error', error?.message?.data, 'Error');
    },
  });

  const onSubmit = (data: any) => {
    const amount_total = numberFormatter(getValues('amount_total'));
    if (type === 'spk') {
      handlePaymentIndent(data);
    } else {
      if (amount_total > items?.amount_remaining) {
        toast.error('nilai yang dibayar lebih dari nominal pembayaran');
        return;
      } else {
        handlePaymentIndent(data);
      }
    }
  };

  const bank = useWatch<any>({
    control,
    name: 'bank',
  });
  const openPdfInNewTab = (url: string) => {
    window.open(url, '_blank');
  };
  const handleDeleteFiles = (index: number, id: string) => {
    setFile((prev: any) => ({
      ...prev,
      uploadedFile: prev.uploadedFile.filter(
        (_: any, i: number) => i !== index,
      ),
    }));
  };
  const { backFormBtn, addDocumentOrPhotos } = useButtonApproval();

  return (
    <>
      <Modal
        title={'PEMBAYARAN'}
        onClose={() => {
          handleCloseModal('modalPaymentIndent', false);
          setFile(null);
          reset();
          if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the value of file input
          }
        }}
        centered
        themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
        activeModal={modalPaymentIndent}
        className="w-2/3 lg:w-1/3 h-auto rounded-md"
      >
        <ModalImage />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <label className="detail-label" htmlFor="date">
              Metode Pembayaran
            </label>
            <div className="flex items-center">
              <RadioButton
                selectedItem={selectedMethodPayment}
                onChange={(value: any) => setSelectedMethodPayment(value)}
                className="flex justify-evenly my-4"
                items={[
                  {
                    label: 'TUNAI',
                    value: 'cash',
                  },
                  {
                    label: 'TRANSFER BANK',
                    value: 'bank_transfer',
                  },
                  {
                    label: 'GIRO',
                    value: 'giro',
                  },
                ]}
              />
            </div>
          </div>

          {selectedMethodPayment !== 'cash' && (
            <div className="col-span-12">
              <label className="detail-label" htmlFor="event_name">
                Nama Bank
              </label>
              <div className="flex items-center w-full my-3">
                <Controller
                  control={control}
                  name="bank"
                  rules={{ required: 'Bank harus dipilih' }}
                  render={({ field: { onChange, value } }) => (
                    <SelectBank onChange={onChange} value={value} />
                  )}
                />
              </div>
              {errors.bank && (
                <>
                  <div className="col-span-12">
                    <span className="text-red-600">
                      {errors.bank.message?.toString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
          <div className="col-span-12">
            <label className="detail-label" htmlFor="location">
              Nominal Pembayaran
            </label>
            <div className="flex items-center w-full my-3">
              {type === 'spk' ? (
                <ControllerInput
                  name="amount_total"
                  control={control}
                  type={'currency'}
                />
              ) : (
                <ControllerInput
                  name="amount_total"
                  control={control}
                  rules={{
                    required: 'Nominal Wajib diisi',
                  }}
                  type={'currency'}
                />
              )}
            </div>
            {errors.amount_total && (
              <>
                <div className="col-span-12">
                  <span className="text-red-600">
                    {errors.amount_total.message?.toString()}
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="col-span-12">
            <div className="detail-label my-3">Tanggal Pembayaran</div>
            <Controller
              name="payment_date"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  divClassName="w-full my-3"
                  onChange={onChange}
                  value={value}
                />
              )}
            />
          </div>

          <div className="col-span-12">
            <label className="detail-label" htmlFor="note">
              Detail Bayar
            </label>
            <div className="flex items-center w-full">
              <textarea
                id="note"
                className="text-area my-3"
                {...register('payment_note')}
              ></textarea>
            </div>
          </div>

          <div className="col-span-12">
            <div className="flex items-center justify-between">
              <label className="detail-label" htmlFor="note">
                Bukti Pembayaran
              </label>
              {/* {file && (
                <Button
                  label="Preview"
                  className={'text-black hover:underline'}
                  onClick={() => handleCloseModal('modalImage2', true)}
                />
              )} */}
            </div>
            <div className="flex items-center w-full my-3">
              {addDocumentOrPhotos({
                onClick: handleUploadClick,
                label: 'Upload Bukti Pembayaran',
              })}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                hidden
                multiple
                accept="image/*, application/pdf"
              />
            </div>
          </div>
          {file?.uploadedFile?.map((uploadedFile: any, index: number) => (
            <div key={index} className="col-span-4">
              {(uploadedFile?.type === 'image' ||
                uploadedFile?.file?.type?.startsWith('image/')) && (
                <div className="relative group">
                  <div
                    className="relative inset-0 opacity-100 hover:opacity-50 transition-opacity cursor-pointer flex justify-center"
                    onClick={() =>
                      handleCloseModal(
                        'modalImage',
                        true,
                        uploadedFile?.name || uploadedFile?.previewUrl,
                      )
                    }
                  >
                    <img
                      src={uploadedFile?.name || uploadedFile?.previewUrl}
                      alt={`Image ${index}`}
                      className="max-h-48 object-contain"
                    />
                  </div>
                  <Button
                    label=""
                    className={`btn-delete px-2 py-2 absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100`}
                    onClick={() => handleDeleteFiles(index, uploadedFile?.id)}
                    Icon={<Trash size={18} color="#fff" />}
                  />
                </div>
              )}
              {(uploadedFile?.file?.type === 'application/pdf' ||
                uploadedFile?.type === 'pdf') && (
                <div className="relative group">
                  <div
                    className="inset-0  opacity-100 hover:opacity-50 transition-opacity cursor-pointer justify-center flex py-2 border border-stroke"
                    onClick={() =>
                      openPdfInNewTab(
                        uploadedFile?.name || uploadedFile?.previewUrl,
                      )
                    }
                  >
                    <img src={pdfPreview} className="max-h-30" />
                  </div>
                  <Button
                    label=""
                    className={`btn-delete px-2 py-2 absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100`}
                    onClick={() => handleDeleteFiles(index, uploadedFile?.id)}
                    Icon={<Trash size={18} color="#fff" />}
                  />
                  <Button
                    label=""
                    className={
                      'btn-payment px-2 py-2 hidden absolute w-auto top-10 right-0 transition-opacity opacity-0 group-hover:opacity-100'
                    }
                    onClick={() =>
                      openPdfInNewTab(
                        uploadedFile?.name || uploadedFile?.previewUrl,
                      )
                    }
                    Icon={<Eye size={18} color="#fff" />}
                  />
                </div>
              )}
            </div>
          ))}
          <div className="col-span-12 lg:flex justify-end items-end gap-5 ">
            {backFormBtn({
              onClick: () => {
                handleCloseModal('modalPaymentIndent', false);
                setFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''; // Reset the value of file input
                }
                reset();
              },
            })}
            {/* <Button
            label="CANCEL"
            Icon={<XCircle size={18} />}
            onClick={() => handleCloseModal('modalEventForm', false, item)}
            className={'btn-back'}
          /> */}
            {isPending ? (
              <>
                <LoaderButton
                  className={
                    'btn-confirm w-full lg:w-auto mt-5 text-center justify-center'
                  }
                />
              </>
            ) : (
              <>
                <Button
                  label={'BAYAR'}
                  className="btn-confirm w-full mt-5 lg:w-auto"
                  onClick={handleSubmit((data: any) => onSubmit(data))}
                />
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ModalPaymentIndent;
