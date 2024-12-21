// import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DropdownUser from './DropdownUser';
import { ArrowsFullscreen, List } from 'react-bootstrap-icons';
import { useParams } from 'react-router-dom';
import createStore from '../../context';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  toggleSidebar: (arg0: boolean) => void;
  sidebarDissapear: string | boolean | undefined;
  setSidebarDissapear: (arg0: boolean) => void;
  onClickUser: () => void;
}) => {
  const { pageTitle } = createStore();
  // useEffect(() => {
  //   const routeTitleMap: { [key: string]: string } = {
  //     '/dashboard': 'DASHBOARD',
  //     '/units/shipping-order': 'SHIPPING ORDER',
  //     '/units/unit-return': 'RETUR UNIT',
  //     '/units/unit-repair': 'REPAIR UNIT',
  //     '/units/unit-list': 'STOCK UNIT',
  //     '/units/unit-return/delivery': 'SURAT JALAN RETUR UNIT',
  //     '/units/unit-repair/delivery': 'SURAT JALAN REPAIR UNIT',
  //     '/units/report': 'REPORT',
  //     '/units/stock': 'STOCK UNIT',
  //     '/units/history': 'HISTORY UNIT',
  //     '/transaction/spk-instance': 'SPK INSTANSI',
  //     '/transaction/indent-instance': 'INDENT INSTANSI',
  //     '/transaction/spk-regluar': 'SPK REGUlAR',
  //     '/transaction/indent-regular': 'SPK REGULAR',
  //   };
  //   routeTitleMap[`/units/shipping-order/${id}`] = `SHIPPING ORDER`;
  //   routeTitleMap[`/units/unit-return/${id}`] = `DETAIL UNIT`;

  //   routeTitleMap[`/units/unit-delivery/${id}?type=retur`] =
  //     `DETAIL PENGANTARAN RETUR UNIT`;
  //   routeTitleMap[`/units/unit-delivery/${id}?type=repair`] = `DETAIL UNIT`;

  //   routeTitleMap[`/units/unit-repair/${id}`] = `DETAIL UNIT`;
  //   routeTitleMap[`/units/unit-list/${id}`] = `STOCK UNIT`;
  //   routeTitleMap[`/units/stock/${status}`] = `STOCK UNIT`;

  //   const path = location.pathname + location.search;
  //   const newTitle = routeTitleMap[path] || 'Default Title';
  //   setPageTitle(newTitle);
  // }, [location.pathname]);

  const toggleSidebar: React.MouseEventHandler<HTMLButtonElement> = () => {
    props.setSidebarOpen(!props.sidebarOpen);
    props.setSidebarDissapear(!props.sidebarDissapear);
  };
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  return (
    <header className="sticky z-99 top-0 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center px-4 py-4 shadow-2 md:px-6 2xl:px-11 gap-x-10">
        <div className="justify-start flex gap-10">
          <div className="flex items-center gap-2 sm:gap-4 ">
            <button
              onClick={toggleSidebar}
              className="bg-slate-200 rounded-md p-2 hover:bg-slate-300"
            >
              <List size={26} />
            </button>
            {/* <!-- Hamburger Toggle BTN --> */}
          </div>
          <div className="flex items-center">
            <p className="text-3xl font-semibold text-black-title">
              {pageTitle}
            </p>
          </div>
        </div>

        <div className="flex flex-grow items-center gap-3 2xsm:gap-7 justify-end ">
          <div className="hidden lg:block">
            <button
              className="bg-icon-color justify-center items-center p-3 rounded-lg transition ease-in-out delay-150 hover:scale-110 hover:bg-icon-color duration-300"
              onClick={toggleFullScreen}
            >
              <ArrowsFullscreen size={20} />
            </button>
          </div>
          {/* <!-- User Area --> */}
          <DropdownUser userClick={props.onClickUser} />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
