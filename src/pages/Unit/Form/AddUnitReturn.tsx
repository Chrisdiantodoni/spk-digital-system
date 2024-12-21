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
import SelectUnitNew from '../../../components/Forms/SelectGroup/SelectUnitNew';
import LoaderButton from '../../../common/Loader/LoaderButton';
import { useButtonApproval } from '../../../hooks/useButtonApproval';
import RadioButton from '../../../components/RadioButton';
import SelectDealer from '../../../components/Forms/SelectGroup/Master/SelectDealer';
import retur from '../../../Services/API/retur';
import SelectMainDealer from '../../../components/Forms/SelectGroup/Master/SelectMainDealer';

export default function AddUnitRepair() {
  const navigate = useNavigate();

  const {
    register,
    resetField,
    setValue,
    formState: { errors, dirtyFields },
    control,
    handleSubmit,
  } = useForm<any>({
    defaultValues: {
      main_dealer_id: '',
      destination_dealer: '',
      retur_reason: '',
      unit_name: '',
      engine_no: '',
      motor: '',
      retur_unit: [
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
  const dealer_type = useWatch<any>({
    control,
    name: 'dealer_type',
  });

  const { setTitle } = createStore();

  useEffect(() => {
    setTitle('RETUR UNIT');
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
      SweetAlert('warning', 'Unit sedang berada di Event', 'Perhatian');
    } else if (!isDuplicateUnit(item.unit_id)) {
      setDataUnit([item, ...dataUnit]);
    } else {
      SweetAlert('error', 'Unit sudah ditambahkan', 'Error');
    }
  };

  const { mutate: handleConfirmation, isPending } = useMutation({
    mutationFn: async (data: any) => {
      data = {
        ...data,
        main_dealer_name: data?.main_dealer_id?.value?.main_dealer_name,
        main_dealer_id: data?.main_dealer_id?.value?.main_dealer_id,
        retur_unit_dealer_destination_id:
          data?.destination_dealer?.value?.dealer_id,
        retur_unit_dealer_destination_name:
          data?.destination_dealer?.value?.dealer_name,
        // dealer_id: data?.destination_dealer?.value?.dealer_id,
        // dealer_name: data?.destination_dealer?.value?.dealer_name,
        retur_unit_reason: data?.retur_reason,
        units: dataUnit?.map((item: any) => {
          const newItem: any = {
            unit_id: item?.unit_id,
          };
          if (item.retur_unit_list_id) {
            newItem.retur_unit_list_id = item.retur_unit_list_id;
          }
          return newItem;
        }),
      };
      if (id) {
        const response = await retur.updateReturUnit(id, data);
        return response;
      }
      const response = await retur.createReturUnit(data);
      return response;
      // console.log({ data });
    },
    onSuccess: (res: any) => {
      if (res?.meta?.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          text: id ? 'Unit berhasil diedit' : 'Unit berhasil ditambahkan',
          icon: 'success',
        });
        navigate(`/units/unit-return/${res?.data?.retur_unit?.retur_unit_id}`);
        if (id) {
          navigate(`/units/unit-return/${id}`);
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

  const { mutate: handleDeleteDataUnitRetur } = useMutation({
    mutationFn: async (id: string) => {
      const response = await retur.deleteReturUnitList(id);
      return response;
    },
    onSuccess(res) {
      if (res.meta.code === 200) {
        getDetailRetur();
      }
    },
  });

  const handleDeleteDataUnit = (index: number) => {
    setDataUnit((prevState) => prevState.filter((_, idx) => idx !== index));
  };

  const handleRequest = (data: any) => {
    if (dataUnit.length === 0) {
      SweetAlert('warning', 'Unit Retur masih kosong', 'Perhatian');
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

  const onSubmit = async (data: any) => {
    await handleConfirmation(data);
  };

  const onDelete = async (id: string) => {
    await handleDeleteDataUnitRetur(id);
  };

  const getDetailRetur = async () => {
    setIsLoading(true);
    await retur
      .getReturUnitDetail(id)
      .then((res: any) => {
        if (res.meta.code == 200) {
          setValue('retur_reason', res.data.retur_unit_reason);
          setValue('dealer_type', res?.data?.dealer_type);
          setValue('main_dealer_id', {
            label: res?.data?.main_dealer_name,
            value: {
              main_dealer_id: res?.data?.main_dealer_id,
              main_dealer_name: res?.data?.main_dealer_name,
            },
          });
          setValue('destination_dealer', {
            label: res?.data?.retur_unit_dealer_destination_name,
            value: {
              dealer_id: res?.data?.retur_unit_dealer_destination_id,
              dealer_name: res?.data?.retur_unit_dealer_destination_name,
            },
          });
          setDataUnit(
            res?.data?.retur_unit_list?.map((item: any) => ({
              retur_unit_list_id: item?.retur_unit_list_id,
              ...item?.unit,
            })),
          );
        }
      })
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    if (id) {
      getDetailRetur();
    }
  }, [id]);

  useEffect(() => {
    if (dirtyFields.dealer_type) {
      setValue('destination_dealer', null);
    }
  }, [dealer_type]);

  console.log({ dirtyFields });

  useEffect(() => {
    if (!motor?.value || !units?.value) {
      resetField('motor');
      setValue('motor', '');
    }
  }, [motor?.value, units?.value]);

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
          <p className="detail-title">FORM UNIT RETURN</p>
        </div>
        <div className="col-span-12 lg:col-span-2 flex items-center">
          <label className="detail-label" htmlFor="Bengkel">
            Retur Ke
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="hidden lg:block">:</p>
          <div className="w-full lg:w-2/5">
            <Controller
              name="main_dealer_id"
              control={control}
              rules={{ required: 'Main Dealer wajib dipilih' }}
              render={({ field: { onChange, value } }) => (
                <SelectMainDealer value={value} onChange={onChange} />
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
          <label htmlFor="dealer" className="detail-label">
            Dealer
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="hidden lg:block">:</p>
          <Controller
            name="dealer_type"
            control={control}
            defaultValue={'mds'}
            render={({ field: { onChange, value } }) => (
              <RadioButton
                items={[
                  { label: 'MDS', value: 'mds' },
                  { label: 'Independent', value: 'independent' },
                ]}
                onChange={onChange}
                selectedItem={value}
                className="justify-around flex lg:w-2/5 w-full"
              />
            )}
          />
        </div>
        <div className="col-span-12 lg:col-span-2 flex">
          <label htmlFor="dealer" className="detail-label">
            Dealer Tujuan
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center ">
          <p className="hidden lg:block">:</p>
          <div className="w-full lg:w-2/5">
            <Controller
              name="destination_dealer"
              rules={{ required: 'Dealer Tujuan wajib dipilih' }}
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectDealer
                  value={value}
                  onChange={onChange}
                  dealer_type={dealer_type || 'mds'}
                />
              )}
            />
          </div>
        </div>
        {errors.destination_dealer && (
          <>
            <div className="col-span-2 hidden lg:block"></div>
            <div className="col-span-10">
              <span className="text-danger">
                {errors.destination_dealer.message?.toString()}
              </span>
            </div>
          </>
        )}
        <div className="col-span-12 lg:col-span-2 flex">
          <label htmlFor="driverName" className="detail-label">
            Alasan Retur
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex  gap-2">
          <p className="hidden lg:block">:</p>
          <div className="lg:w-2/5 w-full">
            <textarea {...register('retur_reason')} className="text-area" />
          </div>
        </div>

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
                    {item?.retur_unit_list_id ? (
                      <Button
                        label="HAPUS"
                        className="btn-delete"
                        onClick={() => onDelete(item?.retur_unit_list_id)}
                      />
                    ) : (
                      <Button
                        label="HAPUS"
                        className="btn-delete"
                        onClick={() => handleDeleteDataUnit(index)}
                      />
                    )}
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
