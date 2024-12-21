import useStore from '../../context';

const Loader2 = () => {
  return (
    <div className="flex relative right-0 bottom-0 items-center justify-center bg-transparent">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary-color border-t-transparent"></div>
    </div>
  );
};

export default Loader2;
