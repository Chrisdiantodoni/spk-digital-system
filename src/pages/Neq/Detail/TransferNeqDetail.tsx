import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import neq from '../../../Services/API/neq';
import Button from '../../../components/Forms/Button/Button';

export default function TransferNeqDetail() {
  const { setTitle } = createStore();
  const [neqDetail, setNeqDetail] = useState<any>({});
  const navigate = useNavigate();

  const { backBtn, confirmBtn, deleteBtn } = useButtonApproval();

  const { id } = useParams<string>();

  const { isLoading } = useQuery({
    queryKey: ['detail_neq'],
    queryFn: async () => {
      const response = await neq.getNeqDetail(id);
      if (response?.meta.code === 200) {
        setNeqDetail(response?.data);
      }
    },
  });

  const { mutate: handleDeleteNeq, isPending: loadingDelete } = useMutation({
    mutationFn: async () => {
      const response = await neq.deleteNeq(id);
      return response;
    },
    onSuccess: (res) => {
      if (res.meta.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          text: 'Transfer Neq berhasil dihapus',
          icon: 'success',
        });
        navigate('/neqs/transfer-neq');
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Error',
          icon: 'error',
        });
      }
    },
  });

  const queryClient = useQueryClient();

  const { mutate: handleRequestNeqStatus, isPending: loadingRequest } =
    useMutation({
      mutationFn: async (data: any) => {
        const response = await neq.updateNeqStatus(id, data);
        return response;
      },
      onSuccess: (res) => {
        if (res.meta.code === 200) {
          Swal.fire({
            title: 'Sukses!',
            text: 'Status Neq diupdate',
            icon: 'success',
          });
          queryClient.invalidateQueries({ queryKey: ['detail_neq'] });
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
        const event_status: any = {
          neq_status:
            status === 'approve'
              ? 'approve'
              : status === 'request'
              ? 'request'
              : 'cancel',
        };
        handleRequestNeqStatus(event_status);
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
    setTitle('TRANSFER NEQ');
  }, []);

  const isShowingButton = () => {
    return neqDetail?.neq_unit
      .map((item: any) => !item?.unit?.unit_location_status)
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
        <div className="lg:col-span-6">
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-12 xsm:col-span-12">
              <span className="detail-title">DETAIL TRANSFER NEQ</span>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Tanggal Transfer</p>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <p className="detail-label">
                : {dayJsFormatDate(neqDetail?.neq_shipping_date)}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Tujuan Pengiriman</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
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
            <div className="lg:col-span-8 col-span-6">
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
                data={neqDetail?.neq_log?.map((item: any) => ({
                  ...item,
                  created_at: (
                    <span>{dayjsFormatDateTime(item.created_at)}</span>
                  ),
                  neq_log_action: (
                    <span>{statusEvent(item.neq_log_action)}</span>
                  ),
                }))}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12 ">
          <div className="grid grid-cols-1 lg:flex gap-y-5 items-center gap-x-4">
            {backBtn({ onClick: () => navigate('/neqs/transfer-neq') })}

            {neqDetail?.neq_status === 'create' && (
              <>
                {isShowingButton() && (
                  <>
                    <Button
                      className="btn-edit w-full lg:w-auto"
                      to={`/neqs/transfer-neq/form?id=${neqDetail?.neq_id}`}
                      isButton={false}
                      label="EDIT"
                    />
                    {/* {editBtn({
  onClick: () =>
    navigate(`/neqs/transfer-neq/form?id=${neqDetail?.neq_id}`),
})} */}
                    {loadingRequest ? (
                      <LoaderButton
                        className={'btn-confirm w-full lg:w-auto'}
                      />
                    ) : (
                      confirmBtn({ onClick: () => handleRequest('approve') })
                    )}
                  </>
                )}
                {loadingDelete ? (
                  <LoaderButton className={'btn-delete lg:w-full w-auto'} />
                ) : (
                  deleteBtn({
                    onClick: () => handleDelete(id),
                  })
                )}
              </>
            )}
            {neqDetail?.neq_status === 'approve' && (
              <>
                {
                  !neqDetail?.delivery_neq?.delivery_number && (
                    <Button
                      className="btn-confirm  w-full lg:w-auto"
                      to={`/units/unit-delivery/new/?type=neq&id=${id}`}
                      isButton={false}
                      label="SURAT JALAN"
                    />
                  )
                  // createDeliveryBtn({
                  //   onClick: () =>
                  //     navigate(`/units/unit-delivery/new/?type=neq&id=${id}`),
                  // })
                }
              </>
            )}
          </div>
        </div>
        <div className="col-span-12">
          <Table
            headers={headersUnit}
            data={neqDetail?.neq_unit?.map((item: any, index: number) => ({
              ...item,
              no: <span>{index + 1}</span>,
              created_at: <span>{dayjsFormatDateTime(item.created_at)}</span>,
            }))}
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
  { title: 'TIPE MOTOR', key: 'unit.motor.motor_name' },
  { title: 'NO. RANGKA', key: 'unit.unit_frame' },
  { title: 'NO. MESIN', key: 'unit.unit_engine' },
  { title: 'WARNA', key: 'unit.color.color_name' },
];
