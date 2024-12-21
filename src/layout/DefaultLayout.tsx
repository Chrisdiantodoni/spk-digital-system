import { useState } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import { Outlet } from 'react-router-dom';
import ModalChangePassword from '../components/Modal/Profile/ModalChangePassword';
import { useHasPermission, usePermissionQuery } from '../hooks/usePermissions';
import createStore from '../context';

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarDissapear, setSidebarDissapear] = useState(true);
  const handleModal = createStore((state: any) => state.handleModal);
  usePermissionQuery();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex flex-grow h-screen overflow-hidden lg:transition-all transition-none duration-300">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <div
          className={`absolute left-0 top-0 z-999 flex h-screen flex-col overflow-y-scroll scrollbar-hide bg-white lg:duration-150 duration-0 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
            sidebarOpen
              ? 'translate-x-0 w-[280px] lg:w-0'
              : '-translate-x-full w-0 lg:w-[280px]'
          }`}
        >
          {useHasPermission('read_unit') && (
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              onClick={toggleSidebar}
            />
          )}
        </div>
        {/* <!-- ===== Sidebar End ===== --> */}
        {/* <!-- ===== Content Area Start ===== --> */}
        <ModalChangePassword />
        <div
          className={`relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden transition ease-in duration-300 `}
        >
          <Header
            sidebarDissapear={sidebarDissapear}
            setSidebarDissapear={setSidebarDissapear}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            toggleSidebar={toggleSidebar}
            onClickUser={() => handleModal('modalChangePassword', true)}
          />
          {/* <!-- ===== Header Start ===== --> */}
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className="flex-1 ">
            <div className="mx-5 my-5 max-w-screen p-4 md:p-6 2xl:p-2">
              <Outlet />
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default DefaultLayout;
