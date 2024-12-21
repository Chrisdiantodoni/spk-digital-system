import { Link } from 'react-router-dom';
import image403 from '../../images/403.png';

function Error403() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="grid grid-cols-12">
        <div className="lg:col-span-4 col-span-12 justify-center flex">
          <img src={image403} className="lg:w-[492px] w-75" />
        </div>
        <div className="lg:col-span-8 col-span-12 w-full flex  justify-center flex-col lg:mx-0 gap-y-3">
          <div className="font-semibold lg:text-9xl mt-10 lg:mt-0 text-6xl text-black-2 mb-15">
            Ooops....
          </div>
          <div className="font-semibold lg:text-6xl text-4xl ml-4 text-black-2 mb-5">
            Akses Dilarang
          </div>
          <div className="font-light ml-4 lg:text-3xl text-start text-xl  text-graydark">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
          </div>
          <div className="font-light ml-4 lg:text-3xl text-start  text-xl text-graydark">
            Silahkan hubungi administrator jika anda memerlukan bantuan.
          </div>
          <div className="mt-4 flex lg:justify-end justify-center w-full">
            <Link
              to={'/dashboard'}
              className="bg-danger px-3 py-1 rounded-lg text-white text-lg hover:bg-red-800"
            >
              KEMBALI KE DASHBOARD
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error403;
