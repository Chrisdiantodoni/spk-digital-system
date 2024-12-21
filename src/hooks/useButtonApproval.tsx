import Button from '../components/Forms/Button/Button';

interface ButtonProps {
  label: string;
  className?: string;
  onClick: () => void;
  isButton?: false;
}

export const useButtonApproval = () => {
  const createBtn = ({ label, className, onClick, isButton }: ButtonProps) => {
    return (
      <Button
        label={label}
        onClick={onClick}
        className={className}
        isButton={isButton}
      />
    );
  };

  const backBtn = ({ onClick }: { onClick: () => void }) => {
    return createBtn({
      label: 'BACK',
      onClick,
      className: 'btn-back w-full lg:w-auto',
    });
  };

  const backFormBtn = ({ onClick }: { onClick: () => void }) => {
    return createBtn({
      label: 'CANCEL',
      onClick,
      className: 'btn-delete w-full lg:w-auto',
    });
  };

  const cancelBtn = ({ onClick }: { onClick: () => void }) => {
    return createBtn({
      label: 'CANCEL',
      onClick,
      className: 'btn-delete w-full lg:w-auto',
    });
  };

  const editBtn = ({ onClick }: { onClick: () => void }) => {
    return createBtn({
      label: 'EDIT',
      onClick,
      className: 'btn-edit w-full lg:w-auto',
    });
  };

  const confirmBtn = ({ onClick }: { onClick: () => void }) => {
    return createBtn({
      label: 'CONFIRM',
      onClick,
      className: 'btn-confirm w-full lg:w-auto',
    });
  };
  const submitFormBtn = ({ onClick }: { onClick: () => void }) => {
    return createBtn({
      label: 'CREATE',
      onClick,
      className: 'btn-request w-full lg:w-auto',
    });
  };

  const deleteBtn = ({ onClick }: { onClick: () => void }) => {
    return createBtn({
      label: 'DELETE',
      onClick,
      className: 'btn-delete w-full lg:w-auto',
    });
  };

  const deliveryBtn = ({ onClick, isButton }: any) => {
    return createBtn({
      label: 'SURAT JALAN',
      isButton,
      onClick,
      className: 'btn-confirm w-full lg:w-auto',
    });
  };

  const submitBtn = ({ onClick }: any) => {
    return createBtn({
      label: 'SUBMIT',
      onClick,
      className: 'btn-edit w-full lg:w-auto',
    });
  };

  const printBtn = ({ onClick }: any) => {
    return createBtn({
      label: 'PRINT',
      onClick,
      className: 'btn-edit w-full lg:w-auto',
    });
  };

  const listDeliveryBtn = ({ onClick, isButton }: any) => {
    return createBtn({
      label: 'LIST SURAT JALAN',
      isButton,
      onClick,
      className:
        'bg-primary py-3 px-3 lg:px-0 rounded-md w-full text-white items-center flex gap-x-2 hover:bg-blue-500 lg:w-auto',
    });
  };

  const createDeliveryBtn = ({ onClick }: any) => {
    return createBtn({
      label: 'SURAT JALAN',
      onClick,
      className: 'btn-confirm  w-full lg:w-auto',
    });
  };

  const addUnitBtn = ({ onClick }: any) => {
    return createBtn({
      label: 'ADD UNIT',
      onClick,
      className: 'btn-confirm  w-full lg:w-auto',
    });
  };

  const paymentBtn = ({ onClick }: any) => {
    return createBtn({
      label: 'PAYMENT',
      onClick,
      className: 'btn-payment  w-full lg:w-auto',
    });
  };

  const addDocumentOrPhotos = ({ onClick, label, icon = true }: any) => {
    return createBtn({
      label: label,
      onClick,
      className: 'btn-payment w-full lg:w-auto',
    });
  };
  const customBtn = ({ onClick, label, className }: any) => {
    return createBtn({
      label: label,
      onClick,
      className: className,
    });
  };

  return {
    paymentBtn,
    backBtn,
    editBtn,
    confirmBtn,
    deleteBtn,
    deliveryBtn,
    printBtn,
    listDeliveryBtn,
    createDeliveryBtn,
    backFormBtn,
    addUnitBtn,
    submitBtn,
    cancelBtn,
    addDocumentOrPhotos,
    submitFormBtn,
    customBtn,
  };
};
