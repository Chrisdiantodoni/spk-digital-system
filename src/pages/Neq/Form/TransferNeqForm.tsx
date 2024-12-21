import { useNavigate } from 'react-router-dom';
import Container from '../../../components/Container';
import Button from '../../../components/Forms/Button/Button';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import queryStrings from 'query-string';
import Loader2 from '../../../common/Loader/Loader';
import { useForm, Controller, useWatch } from 'react-hook-form';
import SelectMotor from '../../../components/Forms/SelectGroup/SelectMotor';
import { SweetAlert } from '../../../utils/Swal';
import createStore from '../../../context';
import dayjs from 'dayjs';
import SelectUnitNew from '../../../components/Forms/SelectGroup/SelectUnitNew';
// import LoaderButton from '../../../common/Loader/LoaderButton';
import SelectNeq from '../../../components/Forms/SelectGroup/SelectNeq';
import DatePicker from '../../../components/Forms/DatePicker/DatePicker';
import neq from '../../../Services/API/neq';
import { useButtonApproval } from '../../../hooks/useButtonApproval';

export default function TransferNeqForm() {
  const navigate = useNavigate();
  const {
    setValue,
    control,
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      neq: '',
      shipping_date: new Date(),
      note: '',
      unit_name: '',
      motor: '',
      selected_unit: {},
    },
  });

  const neqDetail = useWatch<any>({
    control,
    name: 'neq',
  });

  const units = useWatch<any>({
    control,
    name: 'unit_name',
  });

  const motor = useWatch<any>({
    control,
    name: 'motor',
  });

  const date = useWatch<any>({
    control,
    name: 'shipping_date',
  });

  const [dataUnit, setDataUnit] = useState<string[]>([]);
  const { id } = queryStrings.parse(location.search) as { id: string };
  const [isLoading, setIsLoading] = useState(false);
  const { setTitle, handleLoading } = createStore();

  const isDuplicateUnit = (unit_id: string) => {
    const checkUnitId = dataUnit.filter(
      (filter: any) => filter?.unit_id === unit_id,
    );

    if (checkUnitId.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleAddUnit = (item: any) => {
    if (!item) {
      SweetAlert('warning', 'Tidak ada unit yang terpilih', 'Perhatian');
    } else if (item?.unit_location_status) {
      SweetAlert(
        'warning',
        item?.unit_location_status === 'neq'
          ? 'Unit sudah berada di NEQ harap di retur terlebih dahulu'
          : 'Unit sedang berada di event',
        'Perhatian',
      );
    } else if (!isDuplicateUnit(item.unit_id)) {
      setDataUnit([{ ...item, is_delete: false }, ...dataUnit]);
    } else {
      SweetAlert('error', 'Unit sudah ditambahkan');
    }
  };

  const { mutate: handleConfirmation, isPending } = useMutation({
    mutationKey: ['add_transfer_neq'],
    mutationFn: async (data: any) => {
      data = {
        ...data,
        neq_shipping_date: dayjs(date).format('YYYY-MM-DD'),
        dealer_neq_id: neqDetail?.value?.dealer_neq_id,
        neq_note: getValues('note'),
        neq_unit: dataUnit?.map((item: any) => {
          const newItem: any = {
            unit_id: item?.unit_id,
            is_delete: item?.is_delete,
          };
          if (item.neq_unit_id) {
            newItem.neq_unit_id = item.neq_unit_id;
          }
          return newItem;
        }),
      };

      if (id) {
        handleLoading('EDIT', true);
        const response = await neq.updateNeq(id, data);
        return response;
      }
      handleLoading('CREATE', true);

      const response = await neq.createNeq(data);
      return response;
    },
    onSuccess: (res: any) => {
      if (res?.meta?.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          text: 'Unit berhasil ditambahkan',
          icon: 'success',
        });
        if (id) {
          handleLoading('EDIT', false);
          navigate(`/neqs/transfer-neq/${id}`);
        } else {
          handleLoading('CREATE', false);
          navigate(`/neqs/transfer-neq/${res?.data?.neq?.neq_id}`);
        }
      } else {
        handleLoading('EDIT', false);
        handleLoading('CREATE', false);

        Swal.fire({
          title: 'Error!',
          text: 'error',
          icon: 'error',
        });
      }
    },
  });

  // const { mutate: handleDeleteUnitTransferNeq } = useMutation({
  //   mutationFn: async (id: string) => {
  //     const response = await neq.deleteNeqUnit(id);
  //     return response;
  //   },
  //   onSuccess(res) {
  //     if (res.meta.code === 200) {
  //       getDetailTransferNeq();
  //     }
  //   },
  // });

  const handleDeleteDataUnit = (unit: any) => {
    let updatedDataUnits = [];
    if (unit?.neq_unit_id) {
      updatedDataUnits = dataUnit?.map((item: any) =>
        item.unit_id == unit?.unit_id
          ? { ...item, is_delete: !item?.is_delete }
          : item,
      );
    } else {
      updatedDataUnits = dataUnit?.filter(
        (filter: any) => filter?.unit_id !== unit?.unit_id,
      );
    }
    setDataUnit(updatedDataUnits);
    // setDataUnit((prevState) => prevState.filter((_, idx) => idx !== index));
  };

  const handleRequest = () => {
    if (dataUnit.length === 0) {
      SweetAlert('warning', 'Unit Transfer NEQ masih kosong', 'Perhatian');
      return;
    }
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#D40000',
      confirmButtonText: 'YES',
      confirmButtonColor: '#00029D',
      showLoaderOnConfirm: isPending,
    }).then((result) => {
      console.log({ result });
      if (result.isConfirmed) {
        onSubmit();
      }
    });
  };

  const onSubmit = async () => {
    const data = {};
    await handleConfirmation(data);
  };

  // const onDelete = async (id: string) => {
  //   await handleDeleteUnitTransferNeq(id);
  // };

  useEffect(() => {
    setTitle('TRANSFER NEQ');
  }, []);

  const getDetailTransferNeq = async () => {
    setIsLoading(true);
    await neq
      .getNeqDetail(id)
      .then((res: any) => {
        if (res.meta.code == 200) {
          setValue('neq', { value: res?.data });
          setValue(
            'shipping_date',
            dayjs(res?.data?.neq_shipping_date).format('MMM DD, YYYY'),
          );
          setValue('note', res?.data?.neq_note);
          setDataUnit(
            res?.data?.neq_unit.map((item: any) => ({
              ...item.unit,
              is_delete: false,
              neq_unit_id: item?.neq_unit_id,
            })),
          );
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (id) {
      getDetailTransferNeq();
    }
  }, [id]);

  useEffect(() => {
    if (!units) {
      setValue('motor', '');
    }
  }, [units]);

  const { backFormBtn, addUnitBtn } = useButtonApproval();

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
        <div className="col-span-12">
          <p className="detail-title">FORM TRANSFER NEQ</p>
        </div>
        <div className="lg:col-span-2 flex items-center col-span-12">
          <label htmlFor="event_name" className="detail-label">
            Nama Neq
          </label>
        </div>
        <div className="lg:col-span-10 col-span-12 flex gap-2 items-center">
          <p className="lg:block hidden">:</p>
          <div className="w-full lg:w-2/5">
            <Controller
              name="neq"
              rules={{ required: 'NEQ wajib dipilih' }}
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectNeq
                  onChange={onChange}
                  value={value}
                  neq_id={neqDetail?.value?.dealer_neq_id}
                />
              )}
            />
          </div>
        </div>
        {errors.neq && (
          <>
            <div className="col-span-2"></div>
            <div className="col-span-10">
              <span className="text-danger">
                {errors.neq.message?.toString()}
              </span>
            </div>
          </>
        )}
        <div className="lg:col-span-2 col-span-12 flex items-center">
          <label htmlFor="event_name" className="detail-label">
            Tanggal Pengiriman
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="lg:block hidden">:</p>
          <div className="w-full lg:w-2/5">
            <Controller
              name="shipping_date"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  onChange={onChange}
                  value={value}
                  divClassName="w-full"
                />
              )}
            />
          </div>
        </div>

        <div className="lg:col-span-2 col-span-12 flex">
          <label htmlFor="driverName" className="detail-label">
            Catatan
          </label>
        </div>
        <div className="lg:col-span-10 col-span-12 flex  gap-2">
          <p className="lg:block hidden">:</p>
          <div className="w-full lg:w-2/5">
            <textarea {...register('note')} className="text-area w-full" />
          </div>
        </div>

        <div className="col-span-12 my-10">
          <hr />
        </div>
        <div className="lg:col-span-2 col-span-12 flex items-center">
          <label className="detail-label" htmlFor="motor_type">
            Tipe Motor
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="lg:block hidden">:</p>
          <div className="w-full lg:w-2/5">
            <Controller
              name="unit_name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectMotor onChange={onChange} value={value} />
              )}
            />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-2 flex items-center">
          <label className="detail-label" htmlFor="chassis_no">
            No. Rangka
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 gap-2 flex items-center">
          <p className="hidden lg:block">:</p>
          <div className="w-full lg:w-2/5">
            <Controller
              name="motor"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectUnitNew
                  onChange={onChange}
                  value={value}
                  motor_id={units?.value}
                />
              )}
            />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-2 flex items-center">
          <label htmlFor="engine_No" className="detail-label">
            No. Mesin
          </label>
        </div>

        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="hidden lg:block">:</p>
          <input
            id="engine_No"
            type="text"
            value={
              motor?.value?.unit_engine || 'Nomor mesin tidak ditemukan...'
            }
            readOnly
            className="text-input w-full lg:w-2/5"
          />
        </div>
        <div className="col-span-2 hidden lg:block" />
        <div className="col-span-12 lg:col-span-10">
          {addUnitBtn({ onClick: () => handleAddUnit(motor?.value) })}
        </div>
        <div className="col-span-12">
          <div className="grid grid-cols-1 gap-x-3 gap-y-4 lg:flex">
            {backFormBtn({ onClick: () => navigate(-1) })}
            {/* <Button
                label="CANCEL"
                Icon={<ArrowLeft size={18} />}
                className={'btn-delete'}
                onClick={() => navigate(-1)}
              /> */}
            <Button
              label={id ? 'EDIT' : 'CREATE'}
              onClick={handleSubmit(handleRequest)}
              className={id ? 'btn-edit w-auto' : 'btn-request w-auto'}
            />
            {/* {addUnitBtn({ onClick: () => handleAddUnit(motor?.value) })} */}
          </div>
        </div>
        <div className="col-span-12">
          <p className="detail-title">LIST UNIT</p>
        </div>
        <div className="col-span-12 rounded-t-xl overflow-auto">
          <table className={`border-collapse w-full  dark:border-strokedark`}>
            <thead>
              <tr className="border-t bg-primary-color text-white border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5">
                <th className="py-3">NO.</th>
                <th>TIPE MOTOR</th>
                <th>NO. RANGKA</th>
                <th>NO. MESIN</th>
                <th>WARNA</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {dataUnit?.map((item: any, index: number) => (
                <tr
                  key={index}
                  className="border-t border-stroke py-4.5 px-4 md:px-6 2xl:px-7.5 items-center"
                >
                  <td className="text-center py-3 text-black">{index + 1}</td>
                  <td className="text-center py-3 text-black">
                    {item?.motor?.motor_name}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.unit_frame}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.unit_engine}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.color?.color_name}
                  </td>
                  <td className="text-center py-3 text-black">
                    <Button
                      label={item?.is_delete ? 'BATAL HAPUS' : 'HAPUS'}
                      className="btn-delete"
                      onClick={() => handleDeleteDataUnit(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
