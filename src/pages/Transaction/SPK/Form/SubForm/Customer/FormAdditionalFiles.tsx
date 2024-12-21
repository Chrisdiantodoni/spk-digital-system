import { Eye, Trash } from 'react-bootstrap-icons';
import Button from '../../../../../../components/Forms/Button/Button';
import { SweetAlert } from '../../../../../../utils/Swal';
import { useRef } from 'react';
import createStore from '../../../../../../context';
import ModalImage from '../../../../../../components/Modal/Preview/ModalImage';
import pdfPreview from '../../../../../../images/pdfPreview.png';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import spk from '../../../../../../Services/API/transaction/spk';

const FormAdditionalFiles = ({
  customerFiles,
  onChangeCustomerFiles,
  errorKtp,
  errorKK,
  onChangeErrorKtp,
  onChangeErrorKk,
}: any) => {
  const ktpUploadRef = useRef<HTMLInputElement>(null);
  const kkUploadRef = useRef<HTMLInputElement>(null);
  const { handleModal } = createStore();
  const additionalDocumentRef = useRef<HTMLInputElement>(null);

  const handleUploadKtpClick = () => {
    if (ktpUploadRef.current) {
      ktpUploadRef.current.click();
    }
  };

  const handleKkUploadClick = () => {
    if (kkUploadRef.current) {
      kkUploadRef.current.click();
    }
  };
  const handleAdditionalUploadClick = () => {
    if (additionalDocumentRef.current) {
      additionalDocumentRef.current.click();
    }
  };
  const handleFileChangeKtp = (event: any) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return;
    }

    const uploadedFile = uploadedFiles[0];
    onChangeErrorKtp(null);

    if (uploadedFile.size > 5 * 1024 * 1024) {
      SweetAlert('warning', 'File terlalu besar, maks 5 mb', 'Perhatian');
      return;
    }

    onChangeCustomerFiles((prev: any) => ({
      ...prev,
      ktpFiles: uploadedFile,
    }));
  };

  const handleFileChangeKK = (event: any) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return;
    }
    const uploadedFile = uploadedFiles[0];
    if (uploadedFile.size > 5 * 1024 * 1024) {
      SweetAlert('warning', 'File terlalu besar, maks 5 mb', 'Perhatian');
      return;
    }
    onChangeErrorKk(null);

    onChangeCustomerFiles((prev: any) => ({
      ...prev,
      kkFiles: uploadedFile,
    }));
  };

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

    onChangeCustomerFiles((prev: any) => ({
      ...prev,
      additionalFiles: [...(prev?.additionalFiles || []), ...updatedFiles],
    }));
  };

  const fileName = (value: any) => {
    const parts = value?.split('/'); // Memecah string berdasarkan tanda "/"
    const lastPart = parts[parts?.length - 1]; // Mengambil elemen terakhir dari hasil pecahan
    return lastPart || '';
  };

  const openPdfInNewTab = (url: string) => {
    window.open(url, '_blank');
  };
  const handleDeleteFiles = (index: number, id: string) => {
    if (id) {
      deleteFiles(id);
    } else {
      onChangeCustomerFiles((prev: any) => ({
        ...prev,
        additionalFiles: prev.additionalFiles.filter(
          (_: any, i: number) => i !== index,
        ),
      }));
    }
  };
  const queryClient = useQueryClient();

  const { mutate: deleteFiles } = useMutation({
    mutationFn: async (id: string) => {
      const response = await spk.deleteSpkDocumentAdditional(id);
      return response;
    },
    onSuccess: (res: any) => {
      if (res.meta.code === 200) {
        queryClient.invalidateQueries({ queryKey: ['detail_spk_regular'] });
      }
    },
  });

  return (
    <div className="grid grid-cols-12 col-span-12 gap-6">
      <ModalImage />
      <div className="col-span-12 lg:col-span-12">
        <div className="detail-title">Additional Info</div>
      </div>
      <div className="col-span-12 lg:col-span-4 flex items-center">
        <p className="detail-label">KTP</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-12  flex mt-[-18px] items-center w-full">
        <label
          className=" p-2 text-sm min-w-30 bg-slate-100 border border-slate-200 rounded-l-lg text-black cursor-pointer hover:bg-slate-50"
          onClick={handleUploadKtpClick}
        >
          Choose Files
        </label>
        <div className="bg-slate-50 h-full w-full text-sm items-center flex px-2 rounded-r-lg border border-slate-200">
          {customerFiles?.ktpFiles
            ? customerFiles?.ktpFiles?.name || fileName(customerFiles?.ktpFiles)
            : 'No file Chosen '}
        </div>
        <input
          type="file"
          ref={ktpUploadRef}
          name="sk_uploads"
          onChange={handleFileChangeKtp}
          hidden
          accept="image/*, application/pdf"
        />
      </div>
      <div className={`col-span-12 ${errorKtp ? 'block' : 'hidden'} `}>
        {errorKtp && <span className="text-error">{errorKtp}</span>}
      </div>
      {customerFiles?.ktpFiles && (
        <div className="col-span-4">
          {customerFiles?.ktpFiles?.type === 'application/pdf' ? (
            <div className="relative group">
              <div
                className="inset-0 opacity-100 hover:opacity-50 transition-opacity cursor-pointer justify-center flex py-2 border border-stroke"
                onClick={() =>
                  openPdfInNewTab(URL.createObjectURL(customerFiles?.ktpFiles))
                }
              >
                <img src={pdfPreview} className="max-h-30" />

                {/* <iframe
                  src={URL.createObjectURL(customerFiles?.ktpFiles)}
                  width="100%"
                /> */}
              </div>
              {/* <Button
                label=""
                className="btn-delete hidden bg-opacity-100 px-2 py-2 absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100"
                onClick={() =>
                  onChangeCustomerFiles((prev: any) => ({
                    ...prev,
                    ktpFiles: null,
                  }))
                }
                Icon={<Trash size={18} color="#fff" />}
              /> */}
              <Button
                label=""
                className="btn-payment px-2 py-2 hidden absolute w-auto top-10 right-0 transition-opacity opacity-0 group-hover:opacity-100"
                onClick={() =>
                  openPdfInNewTab(URL.createObjectURL(customerFiles?.ktpFiles))
                }
                Icon={<Eye size={18} color="#fff" />}
              />
            </div>
          ) : customerFiles?.ktpFiles?.type?.startsWith('image/') ? (
            <div className="relative group">
              <div
                className="relative inset-0 opacity-100 hover:opacity-50 transition-opacity cursor-pointer"
                onClick={() =>
                  handleModal(
                    'modalImage',
                    true,
                    URL.createObjectURL(customerFiles?.ktpFiles),
                  )
                }
              >
                <img
                  src={URL.createObjectURL(customerFiles?.ktpFiles)}
                  alt={`Image Ktp`}
                  className="max-h-48 object-contain"
                />
              </div>
              {/* <Button
                label=""
                className={`btn-delete px-2 py-2 absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100`}
                onClick={() =>
                  onChangeCustomerFiles((prev: any) => ({
                    ...prev,
                    ktpFiles: null,
                  }))
                }
                Icon={<Trash size={18} color="#fff" />}
              /> */}
            </div>
          ) : customerFiles?.ktpFiles?.endsWith('.pdf') ? (
            <div className="relative group">
              <div className="relative group">
                <div
                  className="inset-0 opacity-100 hover:opacity-50 transition-opacity cursor-pointer justify-center flex py-2 border border-stroke"
                  onClick={() => openPdfInNewTab(customerFiles?.ktpFiles)}
                >
                  <img src={pdfPreview} className="max-h-30" />
                </div>
                {/* <Button
                  label=""
                  className="btn-delete hidden bg-opacity-100 px-2 py-2 absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100"
                  onClick={() =>
                    onChangeCustomerFiles((prev: any) => ({
                      ...prev,
                      ktpFiles: null,
                    }))
                  }
                  Icon={<Trash size={18} color="#fff" />}
                /> */}
                <Button
                  label=""
                  className="btn-payment px-2 py-2 hidden absolute w-auto top-10 right-0 transition-opacity opacity-0 group-hover:opacity-100"
                  onClick={() => openPdfInNewTab(customerFiles?.ktpFiles)}
                  Icon={<Eye size={18} color="#fff" />}
                />
              </div>
            </div>
          ) : (
            <div className="relative group">
              <div
                className="relative inset-0 opacity-100 hover:opacity-50 transition-opacity cursor-pointer"
                onClick={() =>
                  handleModal('modalImage', true, customerFiles?.ktpFiles)
                }
              >
                <img
                  src={customerFiles?.ktpFiles}
                  alt={`Image Ktp`}
                  className="max-h-48 object-contain"
                />
                {/* <Button
                  label=""
                  className="btn-delete hidden bg-opacity-100 px-2 py-2 absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100"
                  onClick={() =>
                    onChangeCustomerFiles((prev: any) => ({
                      ...prev,
                      ktpFiles: null,
                    }))
                  }
                  Icon={<Trash size={18} color="#fff" />}
                /> */}
              </div>
            </div>
          )}
        </div>
      )}
      {customerFiles?.ktpFiles ? (
        <div className="col-span-8" />
      ) : (
        <div className="col-span-12" />
      )}
      <div className="col-span-12 lg:col-span-12 flex items-center">
        <p className="detail-label">KK</p>
        <p className="text-danger ml-2">*</p>
      </div>
      <div className="col-span-12 lg:col-span-12  flex mt-[-18px] items-center w-full">
        <label
          className=" p-2 text-sm min-w-30 bg-slate-100 border border-slate-200 rounded-l-lg text-black cursor-pointer hover:bg-slate-50"
          onClick={handleKkUploadClick}
        >
          Choose Files
        </label>
        <div className="bg-slate-50 h-full w-full text-sm items-center flex px-2 rounded-r-lg border border-slate-200">
          {customerFiles?.kkFiles
            ? customerFiles?.kkFiles?.name || fileName(customerFiles?.kkFiles)
            : 'No file Chosen '}
        </div>
        <input
          type="file"
          ref={kkUploadRef}
          name="sk_uploads"
          onChange={handleFileChangeKK}
          hidden
          accept="image/*, application/pdf"
        />
      </div>
      <div className={`col-span-12 ${errorKK ? 'block' : 'hidden'} `}>
        {errorKK && <span className="text-error">{errorKK}</span>}
      </div>
      {customerFiles?.kkFiles && (
        <div className="col-span-4">
          {customerFiles?.kkFiles?.type === 'application/pdf' ? (
            <div className="relative group">
              <div
                className="inset-0 opacity-100 hover:opacity-50 transition-opacity cursor-pointer justify-center flex py-2 border border-stroke"
                onClick={() =>
                  openPdfInNewTab(URL.createObjectURL(customerFiles?.kkFiles))
                }
              >
                <img src={pdfPreview} className="max-h-30" />

                {/* <iframe
                  src={URL.createObjectURL(customerFiles?.kkFiles)}
                  width="100%"
                /> */}
              </div>
              <Button
                label=""
                className="btn-delete hidden bg-opacity-100 px-2 py-2 absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100"
                onClick={() =>
                  onChangeCustomerFiles((prev: any) => ({
                    ...prev,
                    kkFiles: null,
                  }))
                }
                Icon={<Trash size={18} color="#fff" />}
              />
              <Button
                label=""
                className="btn-payment px-2 py-2 hidden absolute w-auto top-10 right-0 transition-opacity opacity-0 group-hover:opacity-100"
                onClick={() =>
                  openPdfInNewTab(URL.createObjectURL(customerFiles?.kkFiles))
                }
                Icon={<Eye size={18} color="#fff" />}
              />
            </div>
          ) : customerFiles?.kkFiles?.type?.startsWith('image/') ? (
            <div className="relative group">
              <div
                className="relative inset-0 opacity-100 hover:opacity-50 transition-opacity cursor-pointer"
                onClick={() =>
                  handleModal(
                    'modalImage',
                    true,
                    URL.createObjectURL(customerFiles?.kkFiles),
                  )
                }
              >
                <img
                  src={URL.createObjectURL(customerFiles?.kkFiles)}
                  alt={`Image Ktp`}
                  className="max-h-48 object-contain"
                />
              </div>
              {/* <Button
                label=""
                className={`btn-delete px-2 py-2 absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100`}
                onClick={() =>
                  onChangeCustomerFiles((prev: any) => ({
                    ...prev,
                    ktpFiles: null,
                  }))
                }
                Icon={<Trash size={18} color="#fff" />}
              /> */}
            </div>
          ) : customerFiles?.kkFiles?.endsWith('.pdf') ? (
            <div className="relative group">
              <div className="relative group">
                <div
                  className="inset-0 opacity-100 hover:opacity-50 transition-opacity cursor-pointer justify-center flex py-2 border border-stroke"
                  onClick={() => openPdfInNewTab(customerFiles?.kkFiles)}
                >
                  <img src={pdfPreview} className="max-h-30" />

                  {/* <iframe src={customerFiles?.kkFiles} width="100%" /> */}
                </div>
                {/* <Button
                  label=""
                  className="btn-delete hidden bg-opacity-100 px-2 py-2 absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100"
                  onClick={() =>
                    onChangeCustomerFiles((prev: any) => ({
                      ...prev,
                      kkFiles: null,
                    }))
                  }
                  Icon={<Trash size={18} color="#fff" />}
                /> */}
                <Button
                  label=""
                  className="btn-payment px-2 py-2 hidden absolute w-auto top-10 right-0 transition-opacity opacity-0 group-hover:opacity-100"
                  onClick={() => openPdfInNewTab(customerFiles?.kkFiles)}
                  Icon={<Eye size={18} color="#fff" />}
                />
              </div>
            </div>
          ) : (
            <div className="relative group">
              <div
                className="relative inset-0 opacity-100 hover:opacity-50 transition-opacity cursor-pointer"
                onClick={() =>
                  handleModal('modalImage', true, customerFiles?.kkFiles)
                }
              >
                <img
                  src={customerFiles?.kkFiles}
                  alt={`Image Ktp`}
                  className="max-h-48 object-contain"
                />
                {/* <Button
                  label=""
                  className="btn-delete hidden bg-opacity-100 px-2 py-2 absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100"
                  onClick={() =>
                    onChangeCustomerFiles((prev: any) => ({
                      ...prev,
                      kkFiles: null,
                    }))
                  }
                  Icon={<Trash size={18} color="#fff" />}
                /> */}
              </div>
            </div>
          )}
        </div>
      )}
      {customerFiles?.kkFiles ? (
        <div className="col-span-8" />
      ) : (
        <div className="col-span-12" />
      )}
      <div className="col-span-12 flex items-start w-full">
        <p className="detail-label">
          Dokumen Tambahan
          <br />
          <span className="text-xs">(Tagihan Listrik, Slip Gaji, dll)</span>
        </p>
      </div>
      <div className="col-span-12 lg:col-span-12  flex mt-[-18px] items-center w-full">
        <label
          className=" p-2 text-sm min-w-30 bg-slate-100 border border-slate-200 rounded-l-lg text-black cursor-pointer hover:bg-slate-50"
          onClick={handleAdditionalUploadClick}
        >
          Choose Files
        </label>
        <div className="bg-slate-50 h-full w-full text-sm items-center flex px-2 rounded-r-lg border border-slate-200 whitespace-nowrap overflow-hidden overflow-ellipsis">
          {customerFiles?.additionalFiles &&
          customerFiles?.additionalFiles?.length === 1
            ? fileName(
                customerFiles?.additionalFiles[0]?.file?.name ||
                  customerFiles?.additionalFiles[0]?.name,
              )
            : customerFiles?.additionalFiles?.length > 1
            ? `${customerFiles?.additionalFiles?.length} files`
            : 'No file chosen'}
        </div>
        <input
          type="file"
          ref={additionalDocumentRef}
          name="sk_uploads"
          onChange={handleFileChange}
          hidden
          multiple
          accept="image/*, application/pdf"
        />
      </div>
      {customerFiles?.additionalFiles?.map(
        (uploadedFile: any, index: number) => (
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
        ),
      )}
    </div>
  );
};

export default FormAdditionalFiles;
