import createStore from '../../../context';
import pdfPreview from '../../../images/pdfPreview.png';
import Button from '../../Forms/Button/Button';
import { Eye } from 'react-bootstrap-icons';
import Modal from '../Modal';

function ModalImage() {
  const handleCloseModal = createStore((state: any) => state.handleModal);
  const modalImage = createStore((state: any) => state.modal.modalImage);
  const item = createStore((state: any) => state.modalItem);

  const openPdfInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  console.log({ item });
  return (
    <Modal
      title={'Bukti Bayar'}
      onClose={() => handleCloseModal('modalImage', false)}
      activeModal={modalImage}
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      centered
      // className="w-3/5 h-auto rounded-md "
    >
      <div className="grid grid-cols-12 gap-4">
        {item && (
          <div className="col-span-12">
            {item.endsWith('.pdf') && (
              <div className="relative group">
                <div
                  className=" relative inset-0  opacity-100 hover:opacity-50 transition-opacity cursor-pointer justify-center flex border border-stroke py-2"
                  onClick={() => openPdfInNewTab(item)}
                >
                  <img src={pdfPreview} className="max-h-30" />
                </div>
                <Button
                  label=""
                  className={
                    'btn-payment px-2 py-2 hidden absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100'
                  }
                  onClick={() => openPdfInNewTab(item)}
                  Icon={<Eye size={18} color="#fff" />}
                />
              </div>
            )}
            {!item.endsWith('.pdf') && <img src={item} alt="Pratinjau file" />}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default ModalImage;
