import createStore from '../../../context';
import pdfPreview from '../../../images/pdfPreview.png';
import Button from '../../Forms/Button/Button';
import { Eye } from 'react-bootstrap-icons';
import Modal from '../Modal';

function ModalImage2() {
  const handleCloseModal = createStore((state: any) => state.handleModal);
  const modalImage = createStore((state: any) => state.modal.modalImage2);
  const item = createStore((state: any) => state.modalItem);

  const openPdfInNewTab = (url: string) => {
    window.open(url, '_blank');
  };
  return (
    <Modal
      title={'Bukti Bayar'}
      onClose={() => handleCloseModal('modalImage2', false)}
      activeModal={modalImage}
      centered
      themeClass="bg-white dark:bg-slate-800 dark:border-b dark:border-slate-700"
      // className="w-3/5 h-auto rounded-md "
    >
      <div className="grid grid-cols-12 gap-4">
        {Array.isArray(item) && item.length > 0
          ? item?.map((item: any) => (
              <div className="col-span-4">
                {(item?.indent_payment_img?.endsWith('.pdf') ||
                  item?.image?.endsWith('.pdf')) && (
                  <div className="relative group">
                    <div
                      className=" relative inset-0  opacity-100 hover:opacity-50 transition-opacity cursor-pointer justify-center flex border border-stroke py-2"
                      onClick={() =>
                        openPdfInNewTab(item?.indent_payment_img || item?.image)
                      }
                    >
                      <img src={pdfPreview} className="max-h-30" />
                    </div>
                    <Button
                      label=""
                      className={
                        'btn-payment px-2 py-2 hidden absolute w-auto top-0 right-0 transition-opacity opacity-0 group-hover:opacity-100'
                      }
                      onClick={() =>
                        openPdfInNewTab(item?.indent_payment_img || item?.image)
                      }
                      Icon={<Eye size={18} color="#fff" />}
                    />
                  </div>
                )}
                {((item?.indent_payment_img &&
                  !item.indent_payment_img.endsWith('.pdf')) ||
                  (item?.image && !item.image.endsWith('.pdf'))) && (
                  <img
                    src={item?.indent_payment_img || item?.image}
                    alt="Pratinjau file"
                  />
                )}
              </div>
            ))
          : null}
      </div>
    </Modal>
  );
}

export default ModalImage2;
