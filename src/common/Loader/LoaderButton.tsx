import { BeatLoader } from 'react-spinners';

interface LoaderButtonProps {
  className: string;
  without_label?: boolean;
}

export default function LoaderButton({
  className,
  without_label = false,
}: LoaderButtonProps) {
  return (
    <div className={`${className} justify-center`}>
      <BeatLoader color="#FFFF" size={6} />
      {!without_label && 'Loading'}
    </div>
  );
}
