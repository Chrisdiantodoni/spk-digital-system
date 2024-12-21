import { useLocation, useNavigate, useParams } from 'react-router-dom';
import queryString from 'query-string';
import Container from '../../../../components/Container';
import Button from '../../../../components/Forms/Button/Button';
import Table from '../../../../components/Tables/Table';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import delivery from '../../../../Services/API/delivery';
import Loader2 from '../../../../common/Loader/Loader';
import { dayjsFormatDateTime } from '../../../../utils/dayjs';
import { useListDeliveryUnitTable } from '../../../../hooks/TableDelivery/useListDeliveryUnitTable';
import LoaderButton from '../../../../common/Loader/LoaderButton';
import { useButtonApproval } from '../../../../hooks/useButtonApproval';
import createStore from '../../../../context';

export default function UnitDeliveryNoteDetail() {
  const location = useLocation();
  const { id } = useParams<any>();
  const { type } = queryString.parse(location.search) as { type: string };
  const navigate = useNavigate();
  const [deliveryData, setDeliveryData] = useState<any>({});
  const { handleLoading } = createStore();

  function handleIdDetail() {
    switch (type) {
      case 'repair':
        return deliveryData?.delivery_repair?.repair?.repair_id;
      case 'repair_return':
        return deliveryData?.delivery_repair_return?.repair_return
          ?.repair_return_id;
      case 'event':
        return deliveryData?.delivery_event?.event?.event_id;
      case 'event_return':
        return deliveryData?.delivery_event_return?.event_return
          ?.event_return_id;
      case 'neq':
        return deliveryData?.delivery_neq?.neq?.neq_id;
      case 'neq_return':
        return deliveryData?.delivery_neq_return?.neq_return?.neq_return_id;
      case 'spk':
        return deliveryData?.delivery_spk?.spk?.spk_id;
      default:
        break;
    }
  }

  const { isLoading } = useQuery({
    queryKey: ['unit_delivery_detail'],
    queryFn: async () => {
      try {
        const res = await delivery.getDeliveryDetail(id);
        setDeliveryData(res?.data);
        return res;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  const handleRequest = (type: string) => {
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
        const data = {
          delivery_status: type === 'approve' ? 'approve' : 'cancel',
        };
        queryClient.invalidateQueries({
          queryKey: ['unit_delivery_detail'],
        });
        handleChangeStatusDelivery(data);
      }
    });
  };
  const queryClient = useQueryClient();

  const { mutate: handleChangeStatusDelivery } = useMutation({
    mutationFn: async (body: any) => {
      handleLoading('CONFIRM', true);
      const response = await delivery.updateDeliveryStatus(id, body);
      return response;
    },
    onSuccess: (res: any) => {
      if (res.meta.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          icon: 'success',
        }).then(() => {
          queryClient.invalidateQueries({
            queryKey: ['unit_delivery_detail'],
          });
          handleLoading('CONFIRM', false);
        });
      }
    },
  });

  const { mutate: handleDeleteDelivery, isPending: isPendingDeleteDelivery } =
    useMutation({
      mutationFn: async () => {
        handleLoading('DELETE', true);
        const response = await delivery.deleteDelivery(id);
        return response;
      },
      onSuccess: (res: any) => {
        if (res.meta.code === 200) {
          Swal.fire({
            title: 'Sukses!',
            icon: 'success',
            text: 'Surat jalan berhasil dihapus',
          }).then(() => {
            handleLoading('DELETE', false);

            navigate(`/units/delivery?type=${type}`);
          });
        }
      },
    });

  const handleDelete = () => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#00029D',
      confirmButtonText: 'YES',
      confirmButtonColor: '#D40000',
      showLoaderOnConfirm: isPendingDeleteDelivery,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteDelivery();
      }
    });
  };

  const { listDeliveryUnit } = useListDeliveryUnitTable();

  const handleDeliveryDataUnit = () => {
    switch (type) {
      case 'repair':
        return deliveryData?.delivery_repair?.repair;
      case 'repair_return':
        return deliveryData?.delivery_repair_return?.repair_return;
      case 'event':
        return deliveryData?.delivery_event?.event;
      case 'event_return':
        return deliveryData?.delivery_event_return?.event_return;
      case 'neq':
        return deliveryData?.delivery_neq?.neq;
      case 'neq_return':
        return deliveryData?.delivery_neq_return?.neq_return;
      case 'spk':
        return deliveryData?.delivery_spk?.spk;
      default:
        break;
    }
  };

  const { backBtn, deleteBtn, confirmBtn } = useButtonApproval();

  useEffect(() => {
    if (type === 'repair') {
      setTitle('SURAT JALAN TRANSFER REPAIR');
    } else if (type === 'event') {
      setTitle('SURAT JALAN TRANSFER EVENT');
    } else if (type === 'repair_return') {
      setTitle('SURAT JALAN FINISH REPAIR ');
    } else if (type === 'event_return') {
      setTitle('SURAT JALAN KEMBALI EVENT ');
    } else if (type === 'neq') {
      setTitle('SURAT JALAN TRANSFER NEQ');
    } else if (type === 'neq_return') {
      setTitle('SURAT JALAN KEMBALI NEQ');
    } else if (type === 'spk') {
      setTitle('SURAT JALAN SPK');
    }
  }, []);

  const { setTitle } = createStore();

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
            <div className="lg:col-span-12 col-span-12">
              <span className="detail-title">DETAIL SURAT JALAN</span>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">No. Surat Jalan</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">: {deliveryData?.delivery_number}</p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Nama Driver</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">
                : {deliveryData?.delivery_driver_name}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Kendaraan</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">: {deliveryData?.delivery_vehicle}</p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Kelengkapan</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">
                : {deliveryData?.delivery_completeness}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Catatan</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">: {deliveryData?.delivery_note}</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 col-span-12">
          <div className="grid grid-cols-12 gap-y-3">
            <div className="lg:col-span-12 col-span-12">
              <span className="detail-title">LOG AKTIVITAS</span>
            </div>
            <div className="lg:col-span-12 col-span-12">
              <Table
                headers={headers}
                data={deliveryData?.delivery_log.map((item: any) => ({
                  ...item,
                  created_at: (
                    <span>{dayjsFormatDateTime(item?.created_at)}</span>
                  ),
                }))}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <div className="grid grid-cols-1 lg:flex gap-y-3 gap-x-5">
            {backBtn({
              onClick: () => navigate(`/units/delivery?type=${type}`),
            })}
            {deliveryData?.delivery_status === 'create' && (
              <>
                <Button
                  className="btn-edit w-full lg:w-auto"
                  to={`/units/unit-delivery/new/?type=${type}&id=${handleIdDetail()}&idDelivery=${id}`}
                  isButton={false}
                  label="EDIT"
                />
                {confirmBtn({ onClick: () => handleRequest('approve') })}
                {isPendingDeleteDelivery ? (
                  <LoaderButton className="btn-delete w-auto" />
                ) : (
                  deleteBtn({ onClick: () => handleDelete() })
                )}
              </>
            )}
            {deliveryData?.delivery_status === 'approve' && (
              <>
                <Button
                  label="PRINT"
                  // onClick={() => handleDelete()}
                  className="btn-edit w-auto"
                />

                {/* <Button
                label="BATAL"
                Icon={<XSquare size={18} />}
                onClick={() => handleRequest('cancel')}
                className="btn-back"
              /> */}
              </>
            )}
          </div>
        </div>
        <div className="lg:col-span-12 col-span-12">
          {listDeliveryUnit(type, handleDeliveryDataUnit())}
        </div>
      </div>
    </Container>
  );
}

const headers = [
  { title: 'TANGGAL', key: 'created_at' },
  { title: 'STAFF', key: 'user.username' },
  { title: 'AKSI', key: 'delivery_log_action' },
];
