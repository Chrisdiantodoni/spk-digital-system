import { Controller, useForm } from 'react-hook-form';
import createStore from '../../../../../context';
import DatePicker from '../../../../Forms/DatePicker/DatePicker';
import Modal from '../../../Modal';
import { ControllerInput } from '../../../../../utils/ControllerInput';
import { useEffect, useRef, useState } from 'react';
import Button from '../../../../Forms/Button/Button';
import { SweetAlert } from '../../../../../utils/Swal';
import { useButtonApproval } from '../../../../../hooks/useButtonApproval';
import { Eye, Trash } from 'react-bootstrap-icons';
import pdfPreview from '../../../../../images/pdfPreview.png';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import spk from '../../../../../Services/API/transaction/spk';
import { useParams } from 'react-router-dom';
import { dayjsFormatInputDate } from '../../../../../utils/dayjs';
import { numberFormatter } from '../../../../../utils/formatter';
import ModalImage from '../../../Preview/ModalImage';

const ModalPo = ({ detailPo }: any) => {
  const handleModal = createStore((state: any) => state.handleModal);
  const handleLoading = createStore((state: any) => state.handleLoading);
  const modalPo = createStore((state: any) => state.modal.modalPo);
  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      spk_purchase_order_no: '',
      spk_purchase_order_date: new Date(),
      spk_purchase_order_tac: 0,
      spk_purchase_order_act_tac: 0,
    },
  });

  const data = detailPo?.spk_purchase_order;

  const [file, setFile] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Click the file input programmatically
    }
  };

  const { id } = useParams<string>();

  useEffect(() => {
    if (data) {
      setValue(
        'spk_purchase_order_type',
        detailPo?.spk_transaction?.spk_transaction_method_payment,
      );
      setValue('spk_purchase_order_date', data?.spk_purchase_order_date);
      setValue('spk_purchase_order_no', data?.spk_purchase_order_no);
      setValue('spk_purchase_order_tac', data?.spk_purchase_order_tac);
      setFile((prev: any) => ({
        ...prev,
        uploadedFile: data?.spk_purchase_order_file?.map((item: any) => ({
          ...item,
          name: item?.spk_purchase_order_file_path,
          type: item?.spk_purchase_order_file_path?.endsWith('.pdf')
            ? 'pdf'
            : 'image',
        })),
      }));
    } else {
      reset();
      setValue('spk_purchase_order_no', '');
      setFile(null);
    }
  }, [data, modalPo]);

  console.log({ file });

  const openPdfInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

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
  const queryClient = useQueryClient();

  const handleDeleteFiles = (index: number, id: string) => {
    setFile((prev: any) => ({
      ...prev,
      uploadedFile: prev.uploadedFile.filter(
        (_: any, i: number) => i !== index,
      ),
    }));
  };

  const { backFormBtn, addDocumentOrPhotos } = useButtonApproval();

  const { mutate: handleSubmitPo } = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();
      data = {
        ...data,
        spk_purchase_order_date: dayjsFormatInputDate(
          data?.spk_purchase_order_date,
        ),
        spk_purchase_order_type:
          detailPo?.spk_transaction?.spk_transaction_method_payment,
      };
      if (file) {
        file.uploadedFile.forEach((file: any, index: number) => {
          formData.append(`spk_purchase_order_files[${index}]`, file?.file);
        });
      }
      Object.entries(data).forEach(([key, value]: any) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      if (detailPo?.spk_purchase_order) {
        const act_tac = {
          spk_purchase_order_act_tac: numberFormatter(
            data?.spk_purchase_order_act_tac,
          ),
        };
        handleLoading('ACT TAC', true);
        const response = await spk.updatePoActTac(
          detailPo?.spk_purchase_order?.spk_purchase_order_id,
          act_tac,
        );
        return response;
      }
      handleLoading('SUBMIT', true);
      const response = await spk.createPo(id!, formData);
      return response;
    },
    onSuccess: (res: any) => {
      if (res?.meta?.code === 200) {
        handleLoading('SUBMIT', false);
        handleLoading('ACT TAC', false);

        SweetAlert(
          'success',
          data ? 'Act TAC ditambahkan' : 'PO Berhasil dibuat',
          'Sukses',
        );
        handleModal('modalPo', false);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset the value of file input
        }
        reset();
        queryClient.invalidateQueries({ queryKey: ['detail_spk_regular'] });
      } else {
        let errorMessage = res?.response?.data?.data || 'An error occurred';
        const errorKeys = Object.keys(errorMessage);
        if (errorKeys.length > 0) {
          errorMessage = errorMessage[errorKeys[0]][0]; // Get the first error message from the first error key
        }
        SweetAlert('error', errorMessage, 'Error');
        handleLoading('SUBMIT', false);
        handleLoading('ACT TAC', false);
      }
    },
    onError: (error: any) => {
      handleLoading('SUBMIT', false);
      handleLoading('ACT TAC', false);
      SweetAlert('error', error, 'Error');
    },
  });

  return (
    <>
      <ModalImage />
      <Modal
        title="PO"
        activeModal={modalPo}
        onClose={() => {
          handleModal('modalPo', false);
          if (!data) {
            if (fileInputRef.current) {
              fileInputRef.current.value = ''; // Reset the value of file input
            }
            setFile([]);
            reset();
            setValue('spk_purchase_order_no', '');
          }
        }}
        // className="w-2/3 lg:w-1/3 h-auto rounded-md"
        centered
        themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <label className="detail-label" htmlFor="">
              Tanggal PO
            </label>
          </div>
          <div className="col-span-12">
            <Controller
              name="spk_purchase_order_date"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  divClassName="w-full my-3"
                  onChange={onChange}
                  value={value}
                  isDisabled={data ? true : false}
                />
              )}
            />
          </div>
          <div className="col-span-12">
            <label className="detail-label" htmlFor="">
              No. PO
            </label>
          </div>
          <div className="col-span-12">
            <input
              className="text-input"
              {...register('spk_purchase_order_no')}
              disabled={data ? true : false}
            />
          </div>
          <div className="col-span-12">
            <label className="detail-label" htmlFor="">
              TAC (Rp.)
            </label>
          </div>
          <div className="col-span-12">
            <ControllerInput
              name="spk_purchase_order_tac"
              control={control}
              type={'currency'}
              disabled={data ? true : false}
            />
          </div>
          {data && (
            <>
              <div className="col-span-12">
                <label className="detail-label" htmlFor="">
                  Act TAC (Rp.)
                </label>
              </div>
              <div className="col-span-12">
                <ControllerInput
                  name="spk_purchase_order_act_tac"
                  control={control}
                  type={'currency'}
                />
              </div>
            </>
          )}
          <div className="col-span-12">
            <div className="flex items-center justify-between">
              <label className="detail-label" htmlFor="note">
                File
              </label>
            </div>
            {!data && (
              <div className="flex items-center w-full my-3">
                {addDocumentOrPhotos({
                  onClick: handleUploadClick,
                  label: 'File',
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
            )}
          </div>
          {file?.uploadedFile?.map((uploadedFile: any, index: number) => (
            <div key={index} className="col-span-4">
              {(uploadedFile?.type === 'image' ||
                uploadedFile?.file?.type?.startsWith('image/')) && (
                <div className="relative group">
                  <div
                    className="relative inset-0 opacity-100 hover:opacity-50 transition-opacity cursor-pointer flex justify-center"
                    onClick={() =>
                      handleModal(
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
                  {uploadedFile?.name && (
                    <Button
                      label=""
                      className={`btn-delete px-2 py-2 absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100`}
                      onClick={() => handleDeleteFiles(index, uploadedFile?.id)}
                      Icon={<Trash size={18} color="#fff" />}
                    />
                  )}
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
                  {uploadedFile?.name && (
                    <Button
                      label=""
                      className={`btn-delete px-2 py-2 absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100`}
                      onClick={() => handleDeleteFiles(index, uploadedFile?.id)}
                      Icon={<Trash size={18} color="#fff" />}
                    />
                  )}
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
          <div className="col-span-12 flex justify-start gap-5">
            <Button
              label={data ? 'ACT TAC' : 'SUBMIT'}
              className="btn-confirm w-auto"
              onClick={handleSubmit((formData) => handleSubmitPo(formData))}
            />
            {backFormBtn({
              onClick: () => {
                handleModal('modalPo', false);
                if (!data) {
                  reset();
                  setFile([]);
                  setValue('spk_purchase_order_no', '');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Reset the value of file input
                  }
                }
              },
            })}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalPo;
