import { useMutation, useQuery } from '@tanstack/react-query';
import Container from '../../../components/Container';
import createStore from '../../../context';
import { useEffect, useState } from 'react';
import Loader2 from '../../../common/Loader/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { dayJsFormatDate, dayjsFormatDateTime } from '../../../utils/dayjs';
import Table from '../../../components/Tables/Table';
import { statusEvent } from '../../../utils/statusUtils';
import Swal from 'sweetalert2';
import LoaderButton from '../../../common/Loader/LoaderButton';
import { useButtonApproval } from '../../../hooks/useButtonApproval';
import neqReturn from '../../../Services/API/neqReturn';
import Button from '../../../components/Forms/Button/Button';

export default function ReturnNeqDetail() {
  const { setTitle } = createStore();
  const [neqDetail, setNeqDetail] = useState<any>({});
  const navigate = useNavigate();

  const { createDeliveryBtn, backBtn, confirmBtn, deleteBtn, editBtn } =
    useButtonApproval();

  const { id } = useParams<string>();

  const { isLoading } = useQuery({
    queryKey: ['detail_neq'],
    queryFn: async () => {
      const response = await neqReturn.getNeqReturnDetail(id);
      if (response?.meta.code === 200) {
        setNeqDetail(response?.data);
      }
    },
  });

  const { mutate: handleDeleteNeq, isPending: loadingDelete } = useMutation({
    mutationFn: async () => {
      const response = await neqReturn.deleteNeqReturn(id);
      return response;
    },
    onSuccess: (res) => {
      if (res.meta.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          text: 'Kembai Neq berhasil dihapus',
          icon: 'success',
        });
        navigate('/neqs/return-neq');
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Error',
          icon: 'error',
        });
      }
    },
  });

  const { mutate: handleRequestNeqStatus, isPending: loadingRequest } =
    useMutation({
      mutationFn: async (data: any) => {
        const response = await neqReturn.updateNeqReturnStatus(id, data);
        return response;
      },
      onSuccess: (res) => {
        if (res.meta.code === 200) {
          Swal.fire({
            title: 'Sukses!',
            text: 'Status Kembali Neq diupdate',
            icon: 'success',
          });
          navigate('/neqs/return-neq');
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Error',
            icon: 'error',
          });
        }
      },
    });

  const handleRequest = (status: string) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#D40000',
      confirmButtonText: 'YES',
      confirmButtonColor: '#00029D',
      showLoaderOnConfirm: loadingRequest,
    }).then((result) => {
      if (result.isConfirmed) {
        const neq_return_status: any = {
          neq_return_status:
            status === 'approve'
              ? 'approve'
              : status === 'request'
              ? 'request'
              : 'cancel',
        };
        handleRequestNeqStatus(neq_return_status);
      }
    });
  };

  const handleDelete = (id: any) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'NO',
      confirmButtonColor: '#D40000',
      confirmButtonText: 'YES',
      cancelButtonColor: '#00029D',
      showLoaderOnConfirm: loadingDelete,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteNeq(id);
      }
    });
  };

  useEffect(() => {
    setTitle('KEMBALI NEQ');
  }, []);

  const isShowingButton = () => {
    return neqDetail?.neq_return_unit
      ?.map((item: any) => item?.neq_unit?.unit?.unit_location_status)
      .some(Boolean);
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
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-6 col-span-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <span className="detail-title">DETAIL KEMBALI NEQ</span>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Nomor Kembali Neq</p>
            </div>
            <div className=" lg:col-span-9 col-span-6 ">
              <p className="detail-label">: {neqDetail?.neq_return_number}</p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Tanggal Kembali</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">
                : {dayJsFormatDate(neqDetail?.created_at)}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Asal Neq</p>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <p className="detail-label">
                : {neqDetail?.dealer_neq?.dealer_neq_name}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Catatan</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">: {neqDetail?.neq_note}</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 col-span-12">
          <div className="grid grid-cols-12 gap-y-3">
            <div className="lg:col-span-12 col-span-12">
              <span className="detail-title">DETAIL SURAT JALAN</span>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <span className="detail-label">Nomor Surat Jalan</span>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <span className="detail-label">
                :{' '}
                {neqDetail?.delivery_neq?.delivery_number
                  ? neqDetail?.delivery_neq?.delivery_number
                  : 'Belum Terbit'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-y-3 mt-10">
            <div className="lg:col-span-12 col-span-12">
              <span className="detail-title">LOG AKTIVITAS</span>
            </div>
            <div className="lg:col-span-12 col-span-12">
              <Table
                headers={headers}
                data={neqDetail?.neq_return_log?.map((item: any) => ({
                  ...item,
                  created_at: (
                    <span>{dayjsFormatDateTime(item.created_at)}</span>
                  ),
                  neq_log_action: (
                    <span>{statusEvent(item.neq_return_log_action)}</span>
                  ),
                }))}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12 ">
          <div className="grid grid-cols-1 lg:flex gap-y-5 items-center gap-x-4">
            {backBtn({ onClick: () => navigate(`/neqs/return-neq`) })}

            {neqDetail?.neq_return_status === 'create' && (
              <>
                {isShowingButton() && (
                  <>
                    <Button
                      className="btn-edit w-full lg:w-auto"
                      to={`/neqs/return-neq/form?id=${neqDetail?.neq_return_id}`}
                      isButton={false}
                      label="EDIT"
                    />

                    {loadingRequest ? (
                      <LoaderButton className={'btn-confirm w-auto'} />
                    ) : (
                      confirmBtn({ onClick: () => handleRequest('approve') })
                    )}
                  </>
                )}

                {loadingDelete ? (
                  <LoaderButton className={'btn-delete w-auto'} />
                ) : (
                  deleteBtn({
                    onClick: () => handleDelete(id),
                  })
                )}
              </>
            )}
            {neqDetail?.neq_return_status === 'approve' && (
              <>
                {
                  !neqDetail?.delivery_neq_return?.delivery_number && (
                    <Button
                      className="btn-confirm  w-full lg:w-auto"
                      to={`/units/unit-delivery/new/?type=neq_return&id=${id}`}
                      isButton={false}
                      label="SURAT JALAN"
                    />
                  )
                  // createDeliveryBtn({
                  //   onClick: () =>
                  //     navigate(
                  //       ,
                  //     ),
                  // })
                }
              </>
            )}
          </div>
        </div>
        <div className="col-span-12">
          <Table
            headers={headersUnit}
            data={neqDetail?.neq_return_unit?.map(
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

const headers = [
  { title: 'TANGGAL', key: 'created_at' },
  { title: 'STAFF', key: 'user.username' },
  { title: 'AKSI', key: 'neq_log_action' },
];

const headersUnit = [
  { title: 'NO.', key: 'no' },
  { title: 'TIPE MOTOR', key: 'neq_unit.unit.motor.motor_name' },
  { title: 'NO. RANGKA', key: 'neq_unit.unit.unit_frame' },
  { title: 'NO. MESIN', key: 'neq_unit.unit.unit_engine' },
  { title: 'WARNA', key: 'neq_unit.unit.color.color_name' },
];
