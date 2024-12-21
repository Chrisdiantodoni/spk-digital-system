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
import createStore from '../../../context';
import LoaderButton from '../../../common/Loader/LoaderButton';
import Button from '../../../components/Forms/Button/Button';

export default function unitRepairReturnDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string | undefined }>();
  const [repairReturnData, setRepairReturnData] = useState<{
    [key: string]: any;
  }>({});

  const { setTitle } = createStore();

  useEffect(() => {
    setTitle('DETAIL FINISH REPAIR');
  }, []);

  const { backBtn, editBtn, confirmBtn, deleteBtn, createDeliveryBtn } =
    useButtonApproval();

  const { isPending } = useQuery({
    queryKey: ['unit_repair_return'],
    queryFn: async () =>
      await repair.getRepairReturnDetail(id).then((res) => {
        if (res.meta.code === 200) {
          console.log(res);
          setRepairReturnData(res?.data);
        }
      }),
  });

  const { mutate: handleDeleteRepairReturn, isPending: loadingDelete } =
    useMutation({
      mutationFn: async () => {
        const response = await repair.deleteRepairReturn(id);
        return response;
      },
      onSuccess: (res) => {
        if (res.meta.code === 200) {
          Swal.fire({
            title: 'Sukses!',
            text: 'Kembali Repair Unit berhasil dihapus',
            icon: 'success',
          });
          navigate('/units/unit-return-repair');
        }
      },
    });

  const { mutate: handleRequestReturnRepairUnit, isPending: loadingRequest } =
    useMutation({
      mutationFn: async (data: any) => {
        const response = await repair.updateRepairReturnStatus(id, data);
        return response;
      },
      onSuccess: (res) => {
        if (res.meta.code === 200) {
          Swal.fire({
            title: 'Sukses!',
            text: 'Status Kembali Repair diupdate',
            icon: 'success',
          });
          navigate('/units/unit-return-repair');
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
          repair_return_status:
            status === 'approve'
              ? 'approve'
              : status === 'cancel'
              ? 'cancel'
              : '',
        };
        handleRequestReturnRepairUnit(repair_status);
      }
    });
  };

  const handleDelete = (id: any) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Batal',
      confirmButtonColor: '#D40000',
      confirmButtonText: 'YES',
      cancelButtonColor: '#00029D',
      showLoaderOnConfirm: loadingDelete,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteRepairReturn(id);
      }
    });
  };

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
            <div className="col-span-12">
              <span className="detail-title">DETAIL KEMBALI REPAIR</span>
            </div>

            <div className="lg:col-span-3 xsm:col-span-12">
              <p className="detail-label">NOMOR KEMBALI REPAIR</p>
            </div>
            <div className="col-span-9">
              <p className="detail-label">
                : {repairReturnData?.repair_return_number}
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 col-span-12">
          <div className="grid grid-cols-12 gap-y-3">
            <div className="lg:col-span-12 col-span-12">
              <span className="detail-title">DETAIL SURAT JALAN</span>
            </div>
            <div className="lg:col-span-3 col-span-12">
              <span className="detail-label">Nomor Surat Jalan</span>
            </div>
            <div className="lg:col-span-8 col-span-12">
              <span className="detail-label">
                :{' '}
                {repairReturnData?.delivery_repair_return?.delivery
                  ?.delivery_number
                  ? repairReturnData?.delivery_repair_return?.delivery
                      ?.delivery_number
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
                data={repairReturnData?.repair_log?.map((item: any) => ({
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
        <div className="col-span-12 ">
          <div className="grid grid-cols-1 lg:flex items-center gap-5">
            {backBtn({ onClick: () => navigate(-1) })}
            {repairReturnData?.repair_return_status === 'create' && (
              <>
                <Button
                  className="btn-edit w-full lg:w-auto"
                  to={`/units/unit-return-repair/unit-return-repair-form/?id=${repairReturnData?.repair_return_id}`}
                  isButton={false}
                  label="EDIT"
                />

                {/* {editBtn({
                  onClick: () =>
                    navigate(
                      `/units/unit-return-repair/unit-return-repair-form/?id=${repairReturnData?.repair_return_id}`,
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
            {repairReturnData?.repair_return_status === 'approve' && (
              <>
                {
                  repairReturnData?.delivery_repair_return !== null ? null : (
                    <Button
                      isButton={false}
                      to={`/units/unit-delivery/new/?type=repair_return&id=${id}`}
                      label="SURAT JALAN"
                      className="btn-confirm  w-full lg:w-auto"
                    />
                  )

                  // createDeliveryBtn({
                  //     onClick: () =>
                  //       navigate(
                  //         `/units/unit-delivery/new/?type=repair_return&id=${id}`,
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
            data={repairReturnData?.repair_return_unit?.map(
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
  { title: 'AKSI', key: 'repair_log_action' },
];

const headersUnit = [
  { title: 'NO.', key: 'no' },
  { title: 'TIPE MOTOR', key: 'repair_unit.unit.motor.motor_name' },
  { title: 'NO. RANGKA', key: 'repair_unit.unit.unit_frame' },
  { title: 'NO. MESIN', key: 'repair_unit.unit.unit_engine' },
  { title: 'WARNA', key: 'repair_unit.unit.color.color_name' },
];
