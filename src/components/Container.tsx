import { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

const Container: React.FC<ContainerProps> = ({ children, className }) => {
  return (
    <div className={`bg-white py-6 px-5 rounded-2xl ${className}`}>
      {children}
    </div>
  );
};

export default Container;
