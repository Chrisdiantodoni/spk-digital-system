import createStore from '../../../context';
import Modal from '../ModalContainer';

function ModalPreviewImage({ file }: any) {
  // Change `file` to `files`
  const handleCloseModal = createStore((state: any) => state.handleModal);
  const modalPreviewImage = createStore(
    (state: any) => state.modal.modalPreviewImage,
  );

  return (
    <Modal
      title={'PREVIEW'}
      closeModal={() => handleCloseModal('modalPreviewImage', false)}
      show={modalPreviewImage}
      className="w-full h-auto rounded-md"
    >
      <div className="grid grid-cols-12 gap-4">
        {/* Map over the `files` array and render each image */}
        {file?.uploadedFile?.map((file: any, index: number) => (
          <div className="col-span-3">
            <img
              loading="lazy"
              key={index}
              src={file?.previewUrl}
              alt={`Preview ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default ModalPreviewImage;
