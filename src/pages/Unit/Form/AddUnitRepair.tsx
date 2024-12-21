import { useNavigate } from 'react-router-dom';
import Container from '../../../components/Container';
import Button from '../../../components/Forms/Button/Button';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import queryStrings from 'query-string';
import Loader2 from '../../../common/Loader/Loader';
import { useForm, Controller, useWatch } from 'react-hook-form';
import SelectMotor from '../../../components/Forms/SelectGroup/SelectMotor';
import { SweetAlert } from '../../../utils/Swal';
import repair from '../../../Services/API/repair';
import createStore from '../../../context';
import SelectUnitNew from '../../../components/Forms/SelectGroup/SelectUnitNew';
import LoaderButton from '../../../common/Loader/LoaderButton';
import { useButtonApproval } from '../../../hooks/useButtonApproval';
import master from '../../../Services/OpenAPI/master';
import SelectMainDealer from '../../../components/Forms/SelectGroup/Master/SelectMainDealer';

export default function AddUnitRepair() {
  const navigate = useNavigate();
  const {
    register,
    resetField,
    setValue,
    getValues,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<any>({
    defaultValues: {
      main_dealer_id: '',
      repair_reason: '',
      unit_name: '',
      engine_no: '',
      motor: '',
      repair_unit: [
        {
          unit_id: '',
        },
      ],
    },
  });

  const units = useWatch<any>({
    control,
    name: 'unit_name',
  });

  const motor = useWatch<any>({
    control,
    name: 'motor',
  });
  const { setTitle } = createStore();

  useEffect(() => {
    setTitle('TRANSFER REPAIR UNIT');
  }, []);
  const [dataUnit, setDataUnit] = useState<string[]>([]);
  const { id } = queryStrings.parse(location.search) as { id: string };
  const [isLoading, setIsLoading] = useState(false);

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
    } else if (item?.unit_location_status === 'event') {
      SweetAlert('warning', 'Unit sedang berada di event', 'Perhatian');
    } else if (!isDuplicateUnit(item.unit_id)) {
      setDataUnit([{ ...item, is_delete: false }, ...dataUnit]);
    } else {
      SweetAlert('error', 'Unit sudah ditambahkan', 'Error');
    }
  };

  const { mutate: handleConfirmation, isPending } = useMutation({
    mutationFn: async (data: any) => {
      data = {
        ...data,
        main_dealer_id: data?.main_dealer_id?.value?.main_dealer_id,
        main_dealer_name: data?.main_dealer_id?.value?.main_dealer_name,
        repair_reason: getValues('repair_reason'),
        repair_unit: dataUnit?.map((item: any) => {
          const newItem: any = {
            unit_id: item?.unit_id,
            is_delete: item.is_delete,
          };
          if (item.repair_unit_id) {
            newItem.repair_unit_id = item.repair_unit_id;
          }
          return newItem;
        }),
      };
      // console.log({ data });
      // return;
      if (id) {
        const response = await repair.updateRepair(id, data);
        return response;
      }
      const response = await repair.createRepair(data);
      return response;
    },
    onSuccess: (res: any) => {
      if (res?.meta?.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          text: id ? 'Unit berhasil ediedit' : 'Unit berhasil ditambahkan',
          icon: 'success',
        });
        navigate(`/units/unit-repair/${res?.data?.repair?.repair_id}`);
        if (id) {
          navigate(`/units/unit-repair/${id}`);
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
    let updatedDataUnit = [];
    if (unit?.repair_unit_id) {
      updatedDataUnit = dataUnit?.map((item: any) =>
        item?.unit_id === unit?.unit_id
          ? { ...item, is_delete: !item.is_delete }
          : item,
      );
    } else {
      updatedDataUnit = dataUnit.filter(
        (filter: any) => filter.unit_id !== unit.unit_id,
      );
    }
    setDataUnit(updatedDataUnit);
  };

  const handleRequest = (data: string) => {
    if (dataUnit.length === 0) {
      SweetAlert('warning', 'Unit Repair masih kosong', 'Perhatian');
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
        onSubmit(data);
      }
    });
  };

  const onSubmit = async (data: string) => {
    await handleConfirmation(data);
  };

  const getDetailRepairUnit = async () => {
    setIsLoading(true);
    await repair
      .getDetailRepairUnit(id)
      .then((res: any) => {
        if (res.meta.code == 200) {
          setValue('repair_reason', res.data.repair_reason);
          setValue('main_dealer_id', {
            label: res?.data?.main_dealer_name,
            value: {
              main_dealer_name: res?.data?.main_dealer_name,
              main_dealer_id: res?.data?.main_dealer_id,
            },
          });
          setDataUnit(
            res?.data?.repair_unit.map((item: any) => ({
              is_delete: false,
              repair_unit_id: item?.repair_unit_list_id,
              ...item?.unit,
            })),
          );
        }
      })
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    if (id) {
      getDetailRepairUnit();
    }
  }, [id]);

  const { data: mainDealer, isLoading: mainDealerLoading } = useQuery({
    queryKey: ['main_dealer'],
    queryFn: async () => {
      const response = await master.getMainDealer('paginate=false');
      if (response?.meta.code === 200) {
        return response;
      }
    },
  });

  useEffect(() => {
    if (!motor?.value || !units?.value) {
      resetField('motor');
      setValue('motor', '');
    }
  }, [motor?.value, units?.value]);

  const { addUnitBtn, backFormBtn } = useButtonApproval();

  return isLoading || mainDealerLoading ? (
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
          <p className="detail-title">FORM REPAIR UNIT</p>
        </div>
        <div className="col-span-12 lg:col-span-2 flex items-center">
          <label className="detail-label" htmlFor="Bengkel">
            Gudang
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="hidden lg:block">:</p>
          <div className="lg:w-2/5 w-full">
            <Controller
              name="main_dealer_id"
              rules={{ required: 'Gudang wajib dipilih' }}
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectMainDealer onChange={onChange} value={value} />
              )}
            />
          </div>
        </div>
        {errors.main_dealer_id && (
          <>
            <div className="col-span-2 hidden lg:block"></div>
            <div className="col-span-10">
              <span className="text-danger">
                {errors.main_dealer_id.message?.toString()}
              </span>
            </div>
          </>
        )}
        <div className="col-span-12 lg:col-span-2 flex">
          <label htmlFor="driverName" className="detail-label">
            Alasan Repair
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex  gap-2">
          <p className="hidden lg:block">:</p>
          <div className="lg:w-2/5 w-full">
            <textarea
              {...register('repair_reason', {
                required: 'Alasan Repair wajib diisi',
              })}
              className="text-area"
            />
          </div>
        </div>
        {errors.repair_reason && (
          <>
            <div className="col-span-2 hidden lg:block"></div>
            <div className="col-span-10">
              <span className="text-red-600">
                {errors.repair_reason.message?.toString()}
              </span>
            </div>
          </>
        )}
        <div className="col-span-12 my-10">
          <hr />
        </div>
        <div className="col-span-12 lg:col-span-2 flex items-center">
          <label className="detail-label" htmlFor="motor_type">
            Tipe Motor
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="hidden lg:block">:</p>
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
                  motor_id={units?.value || null}
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

        <div className="col-span-12 lg:col-span-10 gap-2 flex flex-col lg:flex-row items-center">
          <p className="hidden lg:block">:</p>
          <input
            id="engine_No"
            type="text"
            value={
              motor?.value?.unit_engine || 'Nomor mesin tidak ditemukan...'
            }
            readOnly
            className="border border-stroke py-2 px-3 rounded-md w-full lg:w-2/5 text-black"
          />
        </div>
        <div className="col-span-2 hidden lg:block" />
        <div className="col-span-12 lg:col-span-10">
          {addUnitBtn({ onClick: () => handleAddUnit(motor?.value) })}
        </div>

        <div className="col-span-12 ">
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 items-center lg:flex">
            {backFormBtn({ onClick: () => navigate(-1) })}
            {isPending ? (
              <LoaderButton
                className={id ? 'btn-edit w-auto' : 'btn-request w-auto'}
              />
            ) : (
              <Button
                label={id ? 'EDIT' : 'CREATE'}
                onClick={handleSubmit(handleRequest)}
                className={id ? 'btn-edit w-auto' : 'btn-request w-auto'}
              />
            )}
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
