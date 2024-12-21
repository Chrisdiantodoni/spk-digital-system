import { ReactNode } from 'react';
import createStore from '../../../context';
import LoaderButton from '../../../common/Loader/LoaderButton';
import { Link } from 'react-router-dom';

type ButtonProps = {
  label: string;
  onClick?: (value: any) => void;
  Icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  without_label?: boolean;
  type?: any;
  isButton?: boolean;
  to?: any;
};

const Button = ({
  label,
  onClick,
  Icon,
  className,
  disabled,
  without_label,
  type,
  to,
  isButton = true,
}: ButtonProps) => {
  const loadingButton = createStore((state: any) => state.loadingButton[label]);
  return loadingButton ? (
    <LoaderButton
      className={`${className} justify-center flex items-center`}
      without_label={without_label}
    />
  ) : isButton ? (
    <button
      type={type}
      className={`${className} justify-center flex items-center`}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {Icon && <div className="">{Icon}</div>}
      {label}
    </button>
  ) : (
    <Link
      to={to}
      className={`${className} justify-center flex items-center`}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {Icon && <div className="">{Icon}</div>}
      {label}
    </Link>
  );
};

export default Button;
