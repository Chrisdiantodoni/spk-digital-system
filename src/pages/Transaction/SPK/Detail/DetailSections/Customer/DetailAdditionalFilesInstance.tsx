import { Eye, Trash } from 'react-bootstrap-icons';
import Button from '../../../../../../components/Forms/Button/Button';
import createStore from '../../../../../../context';
import ModalImage from '../../../../../../components/Modal/Preview/ModalImage';
import pdfPreview from '../../../../../../images/pdfPreview.png';

const DetailAdditionalFilesInstance = ({
  editCustomerFiles,
  onEditCustomerFiles,
  detailAdditionalFile,
}: any) => {
  const { handleModal } = createStore();

  const openPdfInNewTab = (url: string) => {
    window.open(url, '_blank');
  };
  const handleToggleEditAdditionalInfo = () => {
    onEditCustomerFiles(!editCustomerFiles);
  };

  const dataKtpKk = detailAdditionalFile?.spk_additional_document;
  const otherFile = detailAdditionalFile?.spk_additional_document_another;
  return (
    <div className="grid grid-cols-12 col-span-12 gap-x-6 mt-8">
      <ModalImage />
      <div className="col-span-12 lg:col-span-12 flex justify-between items-center">
        <div className="detail-title">Additional Info</div>
        {detailAdditionalFile?.spk_status !== 'spk' && (
          <div>
            <Button
              label="EDIT"
              className={'btn-edit-outline w-auto px-5 py-2'}
              onClick={() => handleToggleEditAdditionalInfo()}
            />
          </div>
        )}
      </div>
      <div className="col-span-12 mt-2">
        <hr />
      </div>

      <div className="col-span-12 flex items-start w-full my-6 ">
        <p className="detail-label">
          Dokumen Tambahan
          {/* <span className="text-xs">(Tagihan Listrik, Slip Gaji, dll)</span> */}
        </p>
      </div>
      {otherFile?.map((uploadedFile: any, index: number) => (
        <div key={index} className="col-span-4">
          {!uploadedFile?.spk_additional_document_another_name?.endsWith(
            'pdf',
          ) && (
            <div className="relative group">
              <div
                className="relative inset-0 opacity-100 hover:opacity-50 transition-opacity cursor-pointer  flex justify-center"
                onClick={() =>
                  handleModal(
                    'modalImage',
                    true,
                    uploadedFile?.spk_additional_document_another_name,
                  )
                }
              >
                <img
                  src={uploadedFile?.spk_additional_document_another_name}
                  alt={`Image ${index}`}
                  className="max-h-48 object-contain"
                />
              </div>
            </div>
          )}
          {uploadedFile?.spk_additional_document_another_name?.endsWith(
            'pdf',
          ) && (
            <div className="relative group">
              <div
                className="inset-0  opacity-100 hover:opacity-50 transition-opacity cursor-pointer justify-center flex border border-stroke py-2 "
                onClick={() =>
                  openPdfInNewTab(
                    uploadedFile.spk_additional_document_another_name,
                  )
                }
              >
                <img src={pdfPreview} className="max-h-30" />

                {/* <iframe
                  src={uploadedFile.spk_additional_document_another_name}
                  width="100%"
                /> */}
              </div>

              <Button
                label=""
                className={
                  'btn-payment px-2 py-2 hidden absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100'
                }
                onClick={() =>
                  openPdfInNewTab(
                    uploadedFile.spk_additional_document_another_name,
                  )
                }
                Icon={<Eye size={18} color="#fff" />}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DetailAdditionalFilesInstance;
