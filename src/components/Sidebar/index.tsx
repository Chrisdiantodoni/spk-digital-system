import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/Logo-Header.png';
import Pie from '../../images/icon/pie.svg';
import { X } from 'react-bootstrap-icons';
import SelectSelectedDealer from '../Forms/SelectGroup/Master/SelectSelectedDealer';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import master from '../../Services/API/master';
import createStore from '../../context';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  onClick: () => void;
}

interface DealerInfo {
  dealer?: {
    dealer_name?: string;
  };
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  const [selectedDealer, setSelectedDealer] = useState<any>(null);
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const handleSelectingDealer = (item: any) => {
    setSelectedDealer(item);
    handleSelectDealer(item);
  };

  const { account_dealer, handle } = createStore();
  const getUserDealer = () => {
    const dealerByUser = account_dealer;
    setSelectedDealer({
      label: dealerByUser?.dealer?.dealer_name,
      value: dealerByUser,
    });
  };

  useEffect(() => {
    getUserDealer();
  }, []);

  const queryClient = useQueryClient();

  const dealer: any | null = JSON.parse(
    localStorage?.getItem('account_dealer') || '{}',
  );

  const { mutate: handleSelectDealer } = useMutation({
    mutationFn: async (item: any) => {
      const body: any = {
        dealer_id: item?.value?.dealer_id,
        user_id: item?.value?.user_id,
      };
      const response = await master.selectDealer(
        dealer?.dealer_by_user_id,
        body,
      );
      return response;
    },
    onSuccess: async (res: any) => {
      const queryCache = queryClient.getQueryCache();
      await localStorage.setItem('account_dealer', JSON.stringify(res?.data));
      await handle('account_dealer', res?.data);
      window.location.href = '/dashboard';
      queryCache.getAll().map((cache) => {
        queryClient.invalidateQueries({ queryKey: cache?.queryKey });
        cache?.queryKey;
      });
    },
  });

  return (
    <aside ref={sidebar}>
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-evenly gap-2 px-6 py-5.5 lg:py-6.5">
        {!sidebarOpen && (
          <NavLink to="/dashboard" className="flex items-center gap-4">
            <img src={Logo} alt="Logo" className="w-55" />
          </NavLink>
        )}
        <button
          className={'block lg:hidden'}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
        >
          <X size={26} strokeWidth={10} />
        </button>
      </div>

      {/* <!-- SIDEBAR HEADER --> */}
      <div className="relative mt-4 mx-6 border border-gray-300 rounded-lg">
        <SelectSelectedDealer
          value={selectedDealer}
          onChange={(value: any) => handleSelectingDealer(value)}
        />
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-2 px-4 lg:mt-8 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}

              <NavLink
                to="/dashboard"
                className={`group relative flex items-center gap-2.5 rounded-2xl px-4 py-4 shadow-xl text-white font-semibold text-lg duration-300 ease-in-out hover:bg-indigo-800 hover:text-white bg-primary-color mb-5`}
              >
                <img src={Pie} width={25} />
                Dashboard
              </NavLink>

              {/* <!-- Dropdown Menu End --> */}
              {/* <!-- Menu Item Dashboard --> */}

              {/* <!-- Menu Item Forms --> */}
              <div className="">
                <div className="text-lg flex text-slate-400 font-normal my-2">
                  Main
                </div>
                <hr />
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/units' || pathname.includes('units')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-lg px-4 py-3 mt-2 font-medium text-secondary-color duration-300 ease-in-out hover:bg-primary-hover-color  ${
                            pathname.includes('units') &&
                            'bg-graydark dark:bg-meta-4'
                          } ${open && 'bg-primary-hover-color'}`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          Inventory
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden mt-2 rounded-lg ${
                            open
                              ? 'h-56 transition-all duration-300 ease-in-out'
                              : 'h-0 transition-all duration-300 ease-in-out'
                          }`}
                        >
                          <ul className="flex flex-col gap-2.5 my-2">
                            <li>
                              <NavLink
                                to="/units/shipping-order"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Shipping Order
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/units/unit-list"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Stock
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/units/unit-return"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Return
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/units/unit-repair"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Repair
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/units/unit-return-repair"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Finish Repair
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                {/* <!-- Menu Item TRANSAKSI --> */}

                {/* <!-- Menu Item Forms --> */}
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/transaction' ||
                    pathname.includes('transactions')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5  px-4 py-3 font-medium text-secondary-color duration-300 ease-in-out hover:bg-primary-hover-color rounded-lg  ${
                            (pathname === '/transaction' ||
                              pathname.includes('transaction')) &&
                            'bg-graydark dark:bg-meta-4'
                          } ${open && 'bg-primary-hover-color'}`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          Transaction
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden mt-2 rounded-lg ${
                            open
                              ? 'h-64 transition-all duration-300 ease-in-out'
                              : 'h-0 transition-all duration-300 ease-in-out'
                          }`}
                        >
                          <ul className="flex flex-col gap-2.5 my-2">
                            <li>
                              <NavLink
                                to="/transaction/indent-instance"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Instance Indent
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/transaction/po-instance"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Instance PO
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/transaction/spk-instance"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Instance SPK
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/transaction/indent-regular"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Regular Indent
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/transaction/spk-regular"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Regular SPK
                              </NavLink>
                            </li>{' '}
                            <li>
                              <NavLink
                                to="/transaction/cro"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                CRO
                              </NavLink>
                            </li>{' '}
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/payment' || pathname.includes('payment')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5  px-4 py-3 font-medium text-secondary-color duration-300 ease-in-out hover:bg-primary-hover-color rounded-lg  ${
                            (pathname === '/payment' ||
                              pathname.includes('payment')) &&
                            'bg-graydark dark:bg-meta-4'
                          } ${open && 'bg-primary-hover-color'}`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          Payment
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden mt-2 rounded-lg ${
                            open
                              ? 'h-36 transition-all duration-300 ease-in-out'
                              : 'h-0 transition-all duration-300 ease-in-out'
                          }`}
                        >
                          <ul className="flex flex-col gap-2.5 my-2">
                            <li>
                              <NavLink
                                to="/payment/overpayment-regular"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Over Payment
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/payment/indent-instance"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Instance Payment
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/payment/payment-regular"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Regular Payment
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                {/* end of Main */}
                <div className="text-lg flex text-slate-400 font-normal my-2">
                  Mutation
                </div>
                <hr />
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/events' || pathname.includes('events')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5  px-4 py-3 mt-2 font-medium text-secondary-color duration-300 ease-in-out hover:bg-primary-hover-color rounded-lg  ${
                            (pathname === '/events' ||
                              pathname.includes('events')) &&
                            'bg-graydark dark:bg-meta-4'
                          } ${open && 'bg-primary-hover-color'}`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          Event
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden rounded-lg ${
                            open
                              ? 'h-34 transition-all duration-300 ease-in-out'
                              : 'h-0 transition-all duration-300 ease-in-out'
                          }`}
                        >
                          <ul className="flex flex-col gap-2.5 my-2">
                            <li>
                              <NavLink
                                to="/events/event-list"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                List
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/events/transfer-event"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Transfer
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/events/return-event"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Return
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/neqs' || pathname.includes('neqs')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5  px-4 py-3 font-medium text-secondary-color duration-300 ease-in-out hover:bg-primary-hover-color rounded-lg  ${
                            (pathname === '/neqs' ||
                              pathname.includes('neqs')) &&
                            'bg-graydark dark:bg-meta-4'
                          } ${open && 'bg-primary-hover-color'}`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          NEQ
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden mt-2 rounded-lg ${
                            open
                              ? 'h-24 transition-all duration-300 ease-in-out'
                              : 'h-0 transition-all duration-300 ease-in-out'
                          }`}
                        >
                          <ul className="flex flex-col gap-2.5 my-2">
                            <li>
                              <NavLink
                                to="/neqs/transfer-neq"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Transfer
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/neqs/return-neq"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8  font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Return
                              </NavLink>
                            </li>
                          </ul>
                        </div>

                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                <div className="text-lg flex text-slate-400 font-normal my-2">
                  Report
                </div>
                <hr />
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/report' || pathname.includes('report')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5  px-4 py-3 mt-2 font-medium text-secondary-color duration-300 ease-in-out hover:bg-primary-hover-color rounded-lg  ${
                            (pathname === '/transaction' ||
                              pathname.includes('transaction')) &&
                            'bg-graydark dark:bg-meta-4'
                          } ${open && 'bg-primary-hover-color'}`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          Stock
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden mt-2 rounded-lg ${
                            open
                              ? 'h-36 transition-all duration-300 ease-in-out'
                              : 'h-0 transition-all duration-300 ease-in-out'
                          }`}
                        >
                          <ul className="flex flex-col gap-2.5 my-2">
                            <li>
                              <NavLink
                                to="/report/receivables"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Stock Report
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/report/leasing"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                SPK Report
                              </NavLink>
                            </li>{' '}
                            <li>
                              <NavLink
                                to="/report/retur"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Return Report
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                <div className="text-lg flex text-slate-400 font-normal my-2">
                  Settings
                </div>
                <hr />
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/settings' || pathname.includes('settings')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5  px-4 py-3 mt-2 font-medium text-secondary-color duration-300 ease-in-out hover:bg-primary-hover-color rounded-lg  ${
                            (pathname === '/settings' ||
                              pathname.includes('settings')) &&
                            'bg-graydark dark:bg-meta-4'
                          } ${open && 'bg-primary-hover-color'}`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          Settings
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                              open && 'rotate-180'
                            }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden mt-2 rounded-lg ${
                            open
                              ? 'h-36 transition-all duration-300 ease-in-out'
                              : 'h-0 transition-all duration-300 ease-in-out'
                          }`}
                        >
                          <ul className="flex flex-col gap-2.5 my-2">
                            <li>
                              <NavLink
                                to="/settings/permissions"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                permissions
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/settings/pricelist"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                Price List
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/report/retur"
                                className={({ isActive }) =>
                                  'group relative flex items-center rounded-lg py-1 gap-x-2 pl-8 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
                                  (isActive && '!text-secondary-color')
                                }
                              >
                                User
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              </div>
            </ul>
          </div>

          {/* <!-- Others Group --> */}
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;

// <li>
// <SidebarLinkGroup
//   activeCondition={
//     pathname === '/report/unit' ||
//     (pathname.includes('report') &&
//       pathname.includes('unit'))
//   }
// >
//   {(handleClick, open) => (
//     <React.Fragment>
//       <NavLink
//         to="#"
//         className={`group relative flex items-center gap-2.5 px-4 py-4 font-medium text-secondary-color duration-300 ease-in-out hover:bg-primary-hover-color rounded-lg ${
//           (pathname === '/report/' ||
//             pathname.includes('report/')) &&
//           'bg-graydark dark:bg-meta-4'
//         } ${open && 'bg-primary-hover-color'}`}
//         onClick={(e) => {
//           e.preventDefault();
//           sidebarExpanded
//             ? handleClick()
//             : setSidebarExpanded(true);
//         }}
//       >
//         UNIT
//         <svg
//           className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
//             open && 'rotate-180'
//           }`}
//           width="20"
//           height="20"
//           viewBox="0 0 20 20"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             fillRule="evenodd"
//             clipRule="evenodd"
//             d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
//             fill=""
//           />
//         </svg>
//       </NavLink>
//       {/* Dropdown Menu Start */}
//       <div
//         className={`translate transform overflow-hidden border border-graydark mt-2 rounded-lg ${
//           !open && 'hidden'
//         }`}
//       >
//         <ul className="flex flex-col gap-2.5 my-2">
//           <li>
//             <NavLink
//               to="/report/report-unit"
//               className={({ isActive }) =>
//                 'group relative flex items-center gap-2.5 py-1 px-4 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
//                 (isActive &&
//                   '!text-secondary-color')
//               }
//             >
//               REPORT
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/report/stock-unit"
//               className={({ isActive }) =>
//                 'group relative flex items-center gap-2.5 py-1 px-4 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
//                 (isActive &&
//                   '!text-secondary-color')
//               }
//             >
//               STOCK UNIT
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/report/history-unit"
//               className={({ isActive }) =>
//                 'group relative flex items-center gap-2.5 py-1 px-4 font-medium text-black duration-300 ease-in-out hover:text-secondary-color hover:bg-primary-hover-color ' +
//                 (isActive &&
//                   '!text-secondary-color')
//               }
//             >
//               HISTORY
//             </NavLink>
//           </li>
//           {/* Add more nested dropdown items here if needed */}
//         </ul>
//       </div>
//       {/* Dropdown Menu End */}
//     </React.Fragment>
//   )}
// </SidebarLinkGroup>
// </li>
