import React, { useState } from 'react';
import { Envelope, EyeSlash, Eye } from 'react-bootstrap-icons';
import logoLogin from '../../images/logo/alfa-scorpii.png';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import authentication from '../../Services/API/authentication';
import createStore from '../../context';
import toast from 'react-hot-toast';
import Button from '../../components/Forms/Button/Button';

interface LoginProps {
  username: string;
  password: string;
}
const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleLoading = createStore((state: any) => state.handleLoading);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { mutate: handleSubmitLogin, isPending } = useMutation<
    any,
    Error,
    LoginProps
  >({
    mutationFn: async (data: LoginProps) => {
      handleLoading('MASUK', true);
      const response = await authentication.login(data).finally(() => {
        handleLoading('MASUK', false);
      });
      return response;
    },
    onSuccess: (response: any) => {
      const data = response?.data;
      const meta = response?.meta;
      if (meta.code === 200) {
        toast.success('Berhasil Login');
        localStorage.setItem('token', data?.token);
        localStorage.setItem('account_user', JSON.stringify(data?.user));
        localStorage.setItem(
          'account_dealer',
          JSON.stringify(data?.user?.dealer_by_user),
        );
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(response);
      }
    },
    onError: () => {
      toast.error('Login Gagal');
    },
  });

  const onSubmit = (formData: LoginProps) => {
    isPending ? null : (handleLoading(true), handleSubmitLogin(formData));
  };

  return (
    <div
      style={{
        backgroundImage: "url('/img/background-image.png')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 60vh',
        height: '100vh',
        position: 'relative',
      }}
    >
      {/* {import.meta.env.VITE_BASE_URL} */}
      <div className="grid content-center pt-20 h-full 2xl:grid-cols-11 xl:grid-cols-10 md:grid-cols-12">
        <div className="2xl:col-span-4 xl:col-span-3 md:col-span-2"></div>
        <div className="flex flex-col bg-white 2xl:col-span-3 xl:col-span-4 md:col-span-8 justify-center items-center py-5 px-2 rounded-2xl drop-shadow-xl">
          <img src={logoLogin} className="h-24 w-auto mb-5 mt-10" alt="Logo" />
          <h1 className="font-bold text-4xl mb-3 text-black">MDS LOGIN</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
            <div className="mb-5 mt-7">
              <label className="block  text-black mb-2 font-bold">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Envelope className="text-gray-500" />
                </span>
                <input
                  type="text"
                  className="input-login"
                  {...register('username', { required: true })}
                />
              </div>
              {errors.username && (
                <small className=" text-danger">
                  <i>Email is required</i>
                </small>
              )}
            </div>

            <div className="mb-5 mt-10">
              <label className="block  text-black mb-2 font-bold">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  {showPassword ? (
                    <Eye
                      className="text-gray-500 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <EyeSlash
                      className="text-gray-500 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-login"
                  {...register('password', { required: true })}
                />
              </div>
              {errors.password && (
                <small className=" text-danger">
                  <i>Password is required</i>
                </small>
              )}
            </div>
            <div className="flex items-center mb-4">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded-full focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="remember-me"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 cursor-pointer"
              >
                Remember Me
              </label>
            </div>
            <div className="flex justify-end mb-20">
              {/* {isPending ? (
                <LoaderButton className="btn-submit bg-primary-color w-full py-2" />
              ) : (
                // <BeatLoader color="#FFFFFF" size={6} />
                <button
                  type="submit"
                  className="px-4 bg-primary-color w-full hover:bg-indigo-800 transition duration-150 ease-in hover:translate-y-2 text-white justify-center items-center font-bold text-sm py-2 rounded-md"
                >
                  MASUK
                </button>
              )} */}
              <Button
                onClick={handleSubmit(onSubmit)}
                label="MASUK"
                className="px-4 bg-primary-color w-full hover:bg-indigo-800 transition duration-150 ease-in hover:translate-y-2 text-white justify-center items-center font-bold text-sm py-2 rounded-md"
              />
            </div>
          </form>
        </div>
        <div className="2xl:col-span-4 xl:col-span-3 md:col-span-2"></div>
      </div>
    </div>
  );
};

export default SignIn;
