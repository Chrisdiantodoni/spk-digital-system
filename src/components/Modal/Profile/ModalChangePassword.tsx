import { Eye, EyeSlash, XCircle } from 'react-bootstrap-icons';
import createStore from '../../../context';
import Button from '../../Forms/Button/Button';
import Modal from '../ModalContainer';
import { useState } from 'react';
import SweetAlert from '../../Swal';
import Swal from 'sweetalert2';

function ModalChangePassword() {
  const handleCloseModal = createStore((state: any) => state.handleModal);
  const modalChangePassword = createStore(
    (state: any) => state.modal.modalChangePassword,
  );

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  return (
    <Modal
      title="Ganti Kata Sandi"
      closeModal={() => handleCloseModal('modalChangePassword', false)}
      show={modalChangePassword}
      className="w-1/3 h-auto rounded-md"
    >
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <label className="detail-label" htmlFor="oldPassword">
            Kata Sandi lama
          </label>
          <div className="flex items-center w-full">
            <input
              className="input py-3"
              type={showOldPassword ? 'text' : 'password'}
              id="oldPassword"
            />
            <div
              className="absolute right-10 hover:text-slate-800 cursor-pointer"
              onClick={() => setShowOldPassword((prev) => !prev)}
            >
              {showOldPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <label className="detail-label" htmlFor="newPassword">
            Kata Sandi baru
          </label>
          <div className="flex items-center w-full">
            <input
              className="input py-3"
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
            />
            <div
              className="absolute right-10 hover:text-slate-800 cursor-pointer"
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <label className="detail-label" htmlFor="confirmPassword">
            Konfirmasi Kata Sandi Baru
          </label>
          <div className="flex items-center w-full">
            <input
              className="input py-3"
              type={showConfirmNewPassword ? 'text' : 'password'}
              id="confirmPassword"
            />
            <div
              className="absolute right-10 hover:text-slate-800 cursor-pointer"
              onClick={() => setShowConfirmNewPassword((prev) => !prev)}
            >
              {showConfirmNewPassword ? (
                <EyeSlash size={20} />
              ) : (
                <Eye size={20} />
              )}
            </div>
          </div>
        </div>
        <div className="col-span-6">
          <Button
            label="CANCEL"
            Icon={<XCircle size={18} />}
            onClick={() => handleCloseModal('modalChangePassword', false)}
            className={
              'items-center bg-danger text-white w-full text-xl font-semibold py-3 rounded-md hover:bg-red-800'
            }
          />
        </div>
        <div className="col-span-6">
          <Button
            label="LANJUTKAN"
            className="items-center bg-primary-color text-white text-xl font-semibold w-full py-3 rounded-md hover:bg-indigo-800"
            onClick={() => {
              handleCloseModal('modalChangePassword', false);
              Swal.fire({
                title: 'Sukses',
                timer: 2000,
                icon: 'success',
                showConfirmButton: false,
                text: 'Kata sandi Anda berhasil diubah',
              });
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

export default ModalChangePassword;
