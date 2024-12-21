import { Eye, Trash } from 'react-bootstrap-icons';
import Button from '../../../../../../components/Forms/Button/Button';
import { useRef } from 'react';
import createStore from '../../../../../../context';
import { SweetAlert } from '../../../../../../utils/Swal';
import pdfPreview from '../../../../../../images/pdfPreview.png';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import spk from '../../../../../../Services/API/transaction/spk';

const FormUploadFiles = ({
  customerFiles,
  onChangeCustomerFiles,
  errorSK,
  onChangeErrorSk,
}: any) => {
  const { handleModal } = createStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: any) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return;
    }
    if (uploadedFiles[0].size > 5 * 1024 * 1024) {
      SweetAlert('warning', 'File terlalu besar, maks 5 mb', 'Perhatian');
      return;
    }
    const updatedFiles = Array.from(uploadedFiles).map((file: any) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    onChangeErrorSk(null);

    onChangeCustomerFiles((prev: any) => ({
      ...prev,
      deliveryFiles: [...(prev.deliveryFiles || []), ...updatedFiles],
    }));
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const fileName = (value: any) => {
    if (value?.includes('storage')) {
      const parts = value.split('/'); // Memecah string berdasarkan tanda "/"
      const lastPart = parts[parts.length - 1]; // Mengambil elemen terakhir dari hasil pecahan
      return lastPart;
    } else {
      return value;
    }
  };

  const handleDeleteFiles = (index: number, id: string) => {
    if (id) {
      deleteSpkDocument(id);
    } else {
      onChangeCustomerFiles((prev: any) => ({
        ...prev,
        deliveryFiles: prev.deliveryFiles.filter(
          (_: any, i: number) => i !== index,
        ),
      }));
    }
  };

  const queryClient = useQueryClient();

  const { mutate: deleteSpkDocument } = useMutation({
    mutationFn: async (id: string) => {
      const response = await spk.deleteSpkDocumentSK(id);
      return response;
    },
    onSuccess: (res: any) => {
      if (res.meta.code === 200) {
        queryClient.invalidateQueries({ queryKey: ['detail_spk_regular'] });
      }
    },
  });

  const openPdfInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <div className="col-span-12 lg:col-span-4 flex items-center">
        <p className="detail-label">Dokumen</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-12 flex mt-5 items-center w-full">
        <label
          className=" p-2 text-sm min-w-30 bg-slate-100 border border-slate-200 rounded-l-lg text-black cursor-pointer hover:bg-slate-50"
          onClick={handleUploadClick}
        >
          Choose Files
        </label>
        <div className="bg-slate-50 h-full w-full text-sm items-center flex px-2 rounded-r-lg border border-slate-200 whitespace-nowrap overflow-hidden overflow-ellipsis">
          {customerFiles?.deliveryFiles &&
          customerFiles?.deliveryFiles?.length === 1
            ? fileName(
                customerFiles?.deliveryFiles[0]?.file?.name ||
                  customerFiles?.deliveryFiles[0]?.name,
              )
            : customerFiles?.deliveryFiles?.length > 1
            ? `${customerFiles?.deliveryFiles?.length} files`
            : 'No file chosen'}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          name="sk_uploads"
          onChange={handleFileChange}
          hidden
          multiple
          accept="image/*, application/pdf"
        />
      </div>
      <div className={`col-span-12 ${errorSK ? 'block' : 'hidden'} `}>
        {errorSK && <span className="text-error">{errorSK}</span>}
      </div>
      {customerFiles?.deliveryFiles?.map((uploadedFile: any, index: number) => (
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
                    uploadedFile?.previewUrl || uploadedFile?.name,
                  )
                }
              >
                <img
                  src={uploadedFile?.previewUrl || uploadedFile?.name}
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
                className="btn-delete hidden bg-opacity-100 px-2 py-2 absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100"
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
    </>
  );
};

export default FormUploadFiles;
