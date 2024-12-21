import { Link } from 'react-router-dom';
import Image404 from '../../images/404.png';
import Astronaut from '../../images/astronaut.png';

function Error404() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black-2">
      <div className="grid grid-cols-12 justify-center items-center lg:gap-x-20 gap-x-6 ">
        <div className="lg:col-span-6 col-span-12 flex flex-col lg:justify-end justify-center">
          <img src={Image404} className="w-100 self-center" alt="404 Error" />
          <div className="lg:w-170 w-full -mt-10">
            <span className="text-white text-5xl font-light block text-center mb-3">
              OOOps!
            </span>
            <span className="text-white text-5xl font-light block mb-3 text-center">
              Halaman tidak ditemukan
            </span>
          </div>
          <div className="lg:w-170 w-full flex-1 flex-col lg:mx-0">
            <span className="text-white text-2xl font-light block">
              Halaman yang Anda cari tidak tersedia atau tidak dapat
            </span>
            <span className="text-white text-2xl font-light block">
              ditemukan, kembali ke halaman beranda.
            </span>
            <span className="text-white text-2xl  font-light block mb-10"></span>
            <div className="flex justify-start">
              <Link
                to="/dashboard"
                className="bg-danger hover:bg-red-800 text-white py-2 px-4 rounded-lg font-bold text-lg "
              >
                KEMBALI KE DASHBOARD
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 justify-center flex lg:justify-start">
          <img src={Astronaut} className="lg:w-125 w-100" alt="Astronaut" />
        </div>
      </div>
    </div>
  );
}

export default Error404;
