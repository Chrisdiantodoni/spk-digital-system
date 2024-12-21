import { useForm, useWatch } from 'react-hook-form';

// Custom hook to handle form logic
function useHookTransaction() {
  const {
    register,
    handleSubmit,
    control,
    getValues,
    wa
    formState: { errors },
  } = useForm({
    defaultValues: {
      indent_number: '',
    },
  });

  return {
    register,
    handleSubmit,
    errors,
    useWatch,
    control,
    getValues,
  };
}

export default useHookTransaction;
