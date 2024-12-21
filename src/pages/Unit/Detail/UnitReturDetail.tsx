import { useNavigate, useParams } from 'react-router-dom';
import Container from '../../../components/Container';
import Button from '../../../components/Forms/Button/Button';
import Table from '../../../components/Tables/Table';
import Swal from 'sweetalert2';
import createStore from '../../../context';
// import ModalReturUnit from '../../../components/Modal/Unit/ModalReturUnit';
import { useMutation, useQuery } from '@tanstack/react-query';
import retur from '../../../Services/API/retur';
import { dayJsFormatDate, dayjsFormatDateTime } from '../../../utils/dayjs';
import Loader2 from '../../../common/Loader/Loader';
import { SweetAlert } from '../../../utils/Swal';
import { useEffect } from 'react';

export default function UnitReturDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const handleLoadingButton = createStore((state) => state.handleLoading);

  const { setTitle } = createStore();

  useEffect(() => {
    setTitle('DETAIL UNIT RETUR');
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ['getReturDetailbyId'],
    queryFn: async () => {
      return await retur.getReturUnitDetail(id);
    },
  });

  const dataRetur = data?.data;

  const { mutate: onConfirmRetur } = useMutation({
    mutationFn: async () => {
      handleLoadingButton('CONFIRM', true);
      const response = await retur.confirmReturUnit(id);
      return response;
    },
    onSuccess: (res: any) => {
      if (res?.meta?.code === 200) {
        handleLoadingButton('CONFIRM', false);
        SweetAlert('success', 'Unit Retur Direquest', 'Sukses');
        navigate('/units/unit-return');
      } else {
        handleLoadingButton('CONFIRM', false);
        SweetAlert('error', res?.data, 'error');
      }
    },
    onError: (res: any) => {
      handleLoadingButton('CONFIRM', false);
      SweetAlert('error', 'Error', 'error');
    },
  });

  const { mutate: onDelete } = useMutation({
    mutationFn: async () => {
      handleLoadingButton('HAPUS', true);
      const response = await retur.deleteReturUnitDetail(id);
      return response;
    },
    onSuccess: (res: any) => {
      if (res?.meta?.code === 200) {
        handleLoadingButton('HAPUS', false);
        SweetAlert('success', 'Unit Retur Dihapus', 'Sukses');
        navigate('/units/unit-return');
      } else {
        handleLoadingButton('HAPUS', false);
        SweetAlert('error', res?.data, 'error');
      }
    },
    onError: (res: any) => {
      handleLoadingButton('HAPUS', false);
      SweetAlert('error', res?.data, 'error');
    },
  });

  const handleRequest = () => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#D40000',
      confirmButtonText: 'YES',
      confirmButtonColor: '#00029D',
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirmRetur();
      }
    });
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'NO',
      confirmButtonColor: '#D40000',
      confirmButtonText: 'YES',
      cancelButtonColor: '#00029D',
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete();
      }
    });
  };

  return isLoading ? (
    <Container>
      <div className="grid grid-cols-12">
        <div className="col-span-12 h-100 items-center justify-center flex">
          <Loader2 />
        </div>
      </div>
    </Container>
  ) : (
    <Container>
      {/* <ModalReturUnit /> */}
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-6 col-span-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-12 col-span-12">
              <span className="detail-title">DETAIL RETUR</span>
            </div>
            <div className="lg:col-span-3 col-span-12">
              <p className="detail-label">Tanggal</p>
            </div>
            <div className="lg:col-span-9 col-span-12">
              <p className="detail-label">
                : {dayJsFormatDate(dataRetur?.created_at)}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-12">
              <p className="detail-label">Nomor Retur</p>
            </div>
            <div className="col-span-12 lg:col-span-9">
              <p className="detail-label">: {dataRetur?.retur_unit_number}</p>
            </div>
            <div className="lg:col-span-3 col-span-12">
              <p className="detail-label">TUJUAN RETUR</p>
            </div>
            <div className="lg:col-span-9 col-span-12">
              <p className="detail-label">: {dataRetur?.main_dealer_name}</p>
            </div>
            <div className="lg:col-span-3 col-span-12">
              <p className="detail-label">DEALER TUJUAN</p>
            </div>
            <div className="lg:col-span-9 col-span-12">
              <p className="detail-label">
                : {dataRetur?.retur_unit_dealer_destination_name}
              </p>
            </div>
            <div className="lg:col-span-3 xsm:col-span-12">
              <p className="detail-label">ALASAN RETUR</p>
            </div>
            <div className="lg:col-span-9 col-span-12">
              <p className="detail-label">
                : {dataRetur?.retur_unit_reason || '-'}
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 col-span-12">
          <div className="grid grid-cols-12 gap-y-3">
            <div className="col-span-12">
              <span className="detail-title">LOG AKTIVITAS</span>
            </div>
            <div className="col-span-12">
              <Table
                headers={headers}
                data={dataRetur?.retur_unit_log?.map((item: any) => ({
                  ...item,
                  created_at: (
                    <span>{dayjsFormatDateTime(item?.created_at)}</span>
                  ),
                  user: <span>{item?.user?.username}</span>,
                }))}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:flex items-center gap-5 mt-10">
            <Button
              label="CANCEL"
              onClick={() => navigate(-1)}
              className="btn-back w-full lg:w-auto"
            />
            {dataRetur?.retur_unit_status === 'create' && (
              <>
                <Button
                  label="EDIT"
                  isButton={false}
                  to={`/units/unit-return/form/?id=${dataRetur?.retur_unit_id}`}
                  className="btn-edit w-full lg:w-auto"
                />
                <Button
                  label="CONFIRM"
                  onClick={() => handleRequest()}
                  className="btn-request w-full lg:w-auto"
                />
                <Button
                  label="HAPUS"
                  onClick={() => handleDelete()}
                  className="btn-delete w-full lg:w-auto"
                />
              </>
            )}
          </div>
        </div>
        <div className="col-span-12">
          <Table
            headers={headersUnit}
            data={dataRetur?.retur_unit_list?.map(
              (item: any, index: number) => ({
                ...item,
                no: <span>{index + 1}</span>,
                created_at: <span>{dayjsFormatDateTime(item.created_at)}</span>,
              }),
            )}
          />
        </div>
      </div>
    </Container>
  );
}

const headersUnit = [
  { title: 'NO.', key: 'no' },
  { title: 'TIPE MOTOR', key: 'unit.motor.motor_name' },
  { title: 'NO. RANGKA', key: 'unit.unit_frame' },
  { title: 'NO. MESIN', key: 'unit.unit_engine' },
  { title: 'WARNA', key: 'unit.color.color_name' },
];

const headers = [
  { title: 'TANGGAL', key: 'created_at' },
  { title: 'STAFF', key: 'user' },
  { title: 'AKSI', key: 'retur_unit_log_action' },
];
