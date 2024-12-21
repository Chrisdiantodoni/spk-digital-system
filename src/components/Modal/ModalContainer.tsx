import { useEffect, useCallback } from 'react';

interface Props {
  show: Boolean;
  closeModal: () => void | undefined;
  children: string | JSX.Element | JSX.Element[];
  title: String;
  className?: String;
  zIndexClass?: string;
}

const Modal = ({
  show,
  closeModal,
  children,
  title,
  className = 'w-180',
  zIndexClass,
}: Props) => {
  const escFunction = useCallback(
    (event: any) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    },
    [closeModal],
  );

  useEffect(() => {
    if (show) {
      document.addEventListener('keydown', escFunction, false);
    } else {
      document.removeEventListener('keydown', escFunction, false);
    }

    return () => {
      document.removeEventListener('keydown', escFunction, false);
    };
  }, [escFunction, show]);

  const handleClickBackdrop = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Check if the click target is the backdrop itself
      if (event.target === event.currentTarget) {
        // Check if the mouse down event happened on the backdrop
        // If it did, we wait for mouse up event before closing the modal
        let isMouseDownOnBackdrop = true;

        const mouseUpHandler = () => {
          if (isMouseDownOnBackdrop) {
            closeModal();
          }
          // Remove the mouse up event listener after it's triggered once
          document.removeEventListener('mouseup', mouseUpHandler);
          document.removeEventListener('mousemove', mouseMoveHandler);
        };
        // Add a mouse up event listener to check if the mouse down event was on the backdrop
        document.addEventListener('mouseup', mouseUpHandler);

        // Add a mouse move event listener to track mouse movement on the backdrop
        const mouseMoveHandler = () => {
          isMouseDownOnBackdrop = false;
        };
        console.log('jalan');

        document.addEventListener('mousemove', mouseMoveHandler);

        // Remove the mouse move event listener when the backdrop is no longer clicked
        const mouseLeaveHandler = () => {
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseleave', mouseLeaveHandler);
        };

        document.addEventListener('mouseleave', mouseLeaveHandler);
      }
    },
    [closeModal],
  );

  return (
    <div
      className={`modal-container backdrop-blur-sm py-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] fixed overflow-hidden z-999 transition-opacity duration-300 flex bg-opacity-20 bg-black-2 top-0 right-0 left-0 bottom-0  ${
        show
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      } ${zIndexClass}`}
      onClick={handleClickBackdrop}
    >
      <div
        className={`modal rounded-md transition-transform duration-300  bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-auto m-auto ${className} ${
          show ? 'scale-100' : 'scale-90'
        }`}
      >
        <div className="border-b flex items-center justify-between border-stroke py-4 px-7 dark:border-strokedark ">
          <div className="text-xl font-semibold text-black-title pt-5">
            {title}
          </div>
          <div className=" flex justify-end">
            <span
              className="text-xl align-center font-semibold cursor-pointer "
              onClick={closeModal}
            >
              &times;
            </span>
          </div>
        </div>
        <div className="content-body-modal px-7 py-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
