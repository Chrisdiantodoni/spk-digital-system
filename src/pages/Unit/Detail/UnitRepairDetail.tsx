import { useNavigate, useParams } from 'react-router-dom';
import Container from '../../../components/Container';
import Table from '../../../components/Tables/Table';
import Swal from 'sweetalert2';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { dayjsFormatDateTime } from '../../../utils/dayjs';
import { statusRepair } from '../../../utils/statusUtils';
import Loader2 from '../../../common/Loader/Loader';
import { useButtonApproval } from '../../../hooks/useButtonApproval';
import repair from '../../../Services/API/repair';
import LoaderButton from '../../../common/Loader/LoaderButton';
import Button from '../../../components/Forms/Button/Button';
import createStore from '../../../context';

export default function UnitRepairDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string | undefined }>();
  const [repairData, setRepairData] = useState<{ [key: string]: any }>({});

  const { backBtn, editBtn, confirmBtn, deleteBtn, createDeliveryBtn } =
    useButtonApproval();

  const { isPending } = useQuery({
    queryKey: ['unit_repair_detail'],
    queryFn: async () => {
      const response = await repair.getDetailRepairUnit(id).then((res) => {
        if (res.meta.code === 200) {
          setRepairData(res?.data);
        }
      });
      return response;
    },
  });

  const { mutate: handleDeleteRepair, isPending: loadingDelete } = useMutation({
    mutationFn: async () => {
      const response = await repair.deleteRepair(id);
      return response;
    },
    onSuccess: (res) => {
      if (res.meta.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          text: 'Repair Unit berhasil dihapus',
          icon: 'success',
        });
        navigate('/units/unit-repair');
      }
    },
  });

  const { mutate: handleRequestRepairUnit, isPending: loadingRequest } =
    useMutation({
      mutationFn: async (data: any) => {
        const response = await repair.updateRepairStatusRequest(id, data);
        return response;
      },
      onSuccess: (res) => {
        if (res.meta.code === 200) {
          Swal.fire({
            title: 'Sukses!',
            text: 'Status Repair diupdate',
            icon: 'success',
          });
          navigate('/units/unit-repair');
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
        const repair_status: any = {
          repair_status:
            status === 'approve'
              ? 'approve'
              : status === 'cancel'
              ? 'cancel'
              : '',
        };
        handleRequestRepairUnit(repair_status);
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
        handleDeleteRepair(id);
      }
    });
  };

  const { setTitle } = createStore();

  useEffect(() => {
    setTitle('DETAIL UNIT REPAIR');
  }, []);

  return isPending ? (
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
              <span className="detail-title">DETAIL REPAIR</span>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Gudang</p>
            </div>
            <div className="lg:col-span-9  col-span-6">
              <p className="detail-label">: {repairData?.main_dealer_name}</p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Alasan Repair</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">: {repairData?.repair_reason}</p>
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
                {repairData?.delivery_repair?.delivery?.delivery_number
                  ? repairData?.delivery_repair?.delivery?.delivery_number
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
                data={repairData?.repair_log?.map((item: any) => ({
                  ...item,
                  created_at: (
                    <span>{dayjsFormatDateTime(item.created_at)}</span>
                  ),
                  repair_log_action: (
                    <span>{statusRepair(item.repair_log_action)}</span>
                  ),
                }))}
              />
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <div className="grid grid-cols-1 lg:flex items-center gap-x-4 gap-y-5">
            {backBtn({ onClick: () => navigate('/units/unit-repair') })}

            {repairData?.repair_status === 'create' && (
              <>
                <Button
                  className="btn-edit w-full lg:w-auto"
                  to={`/units/unit-repair/unit-repair-form/?id=${repairData?.repair_id}`}
                  isButton={false}
                  label="EDIT"
                />
                {/* {editBtn({
                  onClick: () =>
                    navigate(
                      `/units/unit-repair/unit-repair-form/?id=${repairData?.repair_id}`,
                    ),
                })} */}
                {loadingRequest ? (
                  <LoaderButton className="btn-confirm w-full lg:w-auto" />
                ) : (
                  confirmBtn({ onClick: () => handleRequest('approve') })
                )}
                {loadingDelete ? (
                  <LoaderButton className="btn-delete w-full lg:w-auto" />
                ) : (
                  deleteBtn({ onClick: () => handleDelete(id) })
                )}
              </>
            )}
            {repairData?.repair_status === 'approve' && (
              <>
                {
                  repairData?.delivery_repair !== null ? null : (
                    <Button
                      isButton={false}
                      to={`/units/unit-delivery/new/?type=repair&id=${id}`}
                      label="SURAT JALAN"
                      className="btn-confirm  w-full lg:w-auto"
                    />
                  )

                  // createDeliveryBtn({
                  //     onClick: () =>
                  //       navigate(
                  //         `/units/unit-delivery/new/?type=repair&id=${id}`,
                  //       ),
                  //   })
                }
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
        <div className="col-span-12">
          <Table
            headers={headersUnit}
            data={repairData?.repair_unit?.map((item: any, index: number) => ({
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
  { title: 'AKSI', key: 'repair_log_action' },
];

const headersUnit = [
  { title: 'NO.', key: 'no' },
  { title: 'TIPE MOTOR', key: 'unit.motor.motor_name' },
  { title: 'NO. RANGKA', key: 'unit.unit_frame' },
  { title: 'NO. MESIN', key: 'unit.unit_engine' },
  { title: 'WARNA', key: 'unit.color.color_name' },
];
