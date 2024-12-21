import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserOne from '../../images/user/user-01.png';
import Button from '../Forms/Button/Button';
import { BoxArrowLeft, ShieldLock } from 'react-bootstrap-icons';
import authentication from '../../Services/API/authentication';

const DropdownUser = ({ userClick }: { userClick: () => void }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handleLogout = async () => {
    await authentication
      .logout()
      .then((res) => {
        if (res.meta.code === 200) {
          localStorage.clear();
          navigate('/auth/sign-in');
        } else if (res.message === 'unauthenticated') {
          navigate('/auth/sign-in');
        }
      })
      .catch((error) => console.log(error));
  };

  const account_user: any = JSON.parse(
    localStorage.getItem('account_user') ?? '{}',
  );

  return (
    <>
      <div className="relative">
        <Link
          ref={trigger}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-4"
          to="#"
        >
          <span className="h-12 w-12 rounded-full">
            <img src={UserOne} alt="User" />
          </span>
          <span className="hidden text-right lg:block">
            <span className="block text-sm font-medium text-black dark:text-white">
              {account_user?.username}
            </span>
            <span className="block text-xs">UX Designer</span>
          </span>
          <svg
            className="hidden fill-current sm:block"
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
              fill=""
            />
          </svg>
        </Link>

        {/* <!-- Dropdown Start --> */}
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
            dropdownOpen === true ? 'block' : 'hidden'
          }`}
        >
          <ul className="border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Button
                label="Ganti Kata Sandi"
                onClick={userClick}
                Icon={<ShieldLock size={24} />}
                className={
                  'hover:text-secondary-color text-base items-center gap-x-4 flex'
                }
              />
            </li>
          </ul>
          <button
            className="flex items-center gap-3.5 px-6 py-4 text-sm text-danger font-medium duration-300 ease-in-out hover:text-red-800 lg:text-base"
            onClick={handleLogout}
          >
            <BoxArrowLeft size={24} />
            Log Out
          </button>
        </div>
        {/* <!-- Dropdown End --> */}
      </div>
    </>
  );
};

export default DropdownUser;
