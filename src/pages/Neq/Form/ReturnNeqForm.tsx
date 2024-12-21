import { useNavigate } from 'react-router-dom';
import Container from '../../../components/Container';
import Button from '../../../components/Forms/Button/Button';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import queryStrings from 'query-string';
import Loader2 from '../../../common/Loader/Loader';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { SweetAlert } from '../../../utils/Swal';
import createStore from '../../../context';
import LoaderButton from '../../../common/Loader/LoaderButton';
import SelectUnitWithStatus from '../../../components/Forms/SelectGroup/SelectUnitWithStatus';
import SelectNeq from '../../../components/Forms/SelectGroup/SelectNeq';
import DatePicker from '../../../components/Forms/DatePicker/DatePicker';
import neqReturn from '../../../Services/API/neqReturn';
import { useButtonApproval } from '../../../hooks/useButtonApproval';

export default function ReturnNeqForm() {
  const navigate = useNavigate();
  const {
    setValue,
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      neq: '',
      shipping_date: new Date(),
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

  const [dataUnit, setDataUnit] = useState<any>([]);
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
    } else if (!isDuplicateUnit(item.unit_id)) {
      setDataUnit([
        { ...item?.unit, neq_unit_id: item?.neq_unit_id, is_delete: false },
        ...dataUnit,
      ]);
    } else {
      SweetAlert('error', 'Unit sudah ditambahkan');
    }
  };

  const { mutate: handleConfirmation, isPending } = useMutation({
    mutationKey: ['add_transfer_event'],
    mutationFn: async (data: any) => {
      data = {
        ...data,
        dealer_neq_id: neqDetail?.value?.dealer_neq_id,
        neq_return_unit: dataUnit?.map((item: any) => {
          const newItem: any = {
            neq_unit_id: item?.neq_unit_id,
            is_delete: item?.is_delete,
          };
          if (item?.neq_return_unit_id) {
            newItem.neq_return_unit_id = item.neq_return_unit_id;
          }
          return newItem;
        }),
      };
      if (id) {
        handleLoading('EDIT', true);
        const response = await neqReturn.updateNeqReturn(id, data);
        return response;
      }
      handleLoading('CREATE', true);

      const response = await neqReturn.createNeqReturn(data);
      return response;
    },
    onSuccess: (res: any) => {
      if (res?.meta?.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          text: id
            ? 'Kembali Neq Berhasil diupdate'
            : 'Kembali Neq Berhasil ditambahkan',
          icon: 'success',
        });
        if (id) {
          handleLoading('EDIT', false);
          navigate(`/neqs/return-neq/${id}`);
        } else {
          handleLoading('CREATE', false);
          navigate(`/neqs/return-neq/${res?.data?.neq_return?.neq_return_id}`);
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'error',
          icon: 'error',
        });
      }
    },
  });

  const handleDeleteDataUnit = (unit: any) => {
    let updatedUnit = [];
    if (unit?.neq_return_unit_id) {
      updatedUnit = dataUnit?.map((item: any) =>
        item.unit_id === unit?.unit_id
          ? { ...item, is_delete: !item?.is_delete }
          : item,
      );
    } else {
      updatedUnit = dataUnit?.filter(
        (filter: any) => filter?.unit_id !== unit?.unit_id,
      );
    }
    setDataUnit(updatedUnit);
  };

  const handleRequest = () => {
    if (dataUnit?.length === 0) {
      SweetAlert('warning', 'Unit Kembali NEQ masih kosong', 'Perhatian');
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
      if (result.isConfirmed) {
        onSubmit();
      }
    });
  };

  const onSubmit = async () => {
    const data = {};
    await handleConfirmation(data);
  };

  useEffect(() => {
    setTitle('KEMBALI NEQ');
  }, []);

  const getDetailReturnNeq = async () => {
    setIsLoading(true);
    await neqReturn
      .getNeqReturnDetail(id)
      .then((res: any) => {
        if (res.meta.code == 200) {
          setValue('neq', { value: res.data });
          setDataUnit(
            res?.data?.neq_return_unit.map((item: any) => ({
              ...item?.neq_unit,
              is_delete: false,
              neq_return_unit_id: item?.neq_return_unit_id,
            })),
          );
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (id) {
      getDetailReturnNeq();
    }
  }, [id]);

  useEffect(() => {
    if (!units) {
      setValue('motor', '');
    }
  }, [units]);

  const { addUnitBtn, backFormBtn } = useButtonApproval();

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
          <p className="detail-title">FORM KEMBALI NEQ</p>
        </div>
        <div className="col-span-12 lg:col-span-2 flex items-center">
          <label htmlFor="event_name" className="detail-label">
            Nama NEQ
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="hidden lg:block">:</p>
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
            <div className="col-span-2 hidden lg:block"></div>
            <div className="col-span-10">
              <span className="text-danger">
                {errors.neq.message?.toString()}
              </span>
            </div>
          </>
        )}
        {/* <div className="col-span-12 lg:col-span-2 flex items-center">
          <label htmlFor="event_name" className="detail-label">
            Tanggal Pengiriman
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="hidden lg:block">:</p>
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
        </div> */}

        <div className="col-span-12 lg:col-span-2 flex">
          <label htmlFor="driverName" className="detail-label">
            Catatan
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex  gap-2">
          <p className="hidden lg:block">:</p>
          <div className="w-full lg:w-2/5">
            <textarea {...register('note')} className="text-area w-full" />
          </div>
        </div>

        <div className="col-span-12 my-10">
          <hr />
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
                <SelectUnitWithStatus
                  onChange={onChange}
                  value={value}
                  status={'return_neq'}
                  neq_id={neqDetail?.value?.dealer_neq_id}
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
              motor?.value?.unit?.unit_engine ||
              'Nomor mesin tidak ditemukan...'
            }
            readOnly
            className="text-input w-full lg:w-2/5"
          />
        </div>
        <div className="col-span-2 hidden lg:block" />
        <div className="col-span-12 lg:col-span-10">
          {addUnitBtn({ onClick: () => handleAddUnit(motor?.value) })}
        </div>
        <div className="col-span-12 lg:flex">
          <div className="grid grid-cols-1 gap-x-3 gap-y-4 lg:flex">
            {backFormBtn({ onClick: () => navigate(-1) })}

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
          <table className={`border-collapse w-full dark:border-strokedark`}>
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
                    {item?.motor?.motor_name || item?.unit?.motor?.motor_name}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.unit_frame || item?.unit?.unit_frame}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.unit_engine || item?.unit?.unit_engine}
                  </td>
                  <td className="text-center py-3 text-black">
                    {item?.color?.color_name || item?.unit?.color?.color_name}
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
