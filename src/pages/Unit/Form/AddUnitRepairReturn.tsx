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
import repair from '../../../Services/API/repair';
import createStore from '../../../context';
import { useButtonApproval } from '../../../hooks/useButtonApproval';
import SelectUnitWithStatus from '../../../components/Forms/SelectGroup/SelectUnitWithStatus';

export default function AddUnitRepairReturn() {
  const navigate = useNavigate();
  const { setValue, control, handleSubmit } = useForm({
    defaultValues: {
      unit: '',
      selected_unit: {
        unit_engine: '',
      },
      repair_unit: [
        {
          unit_id: '',
        },
      ],
    },
  });

  const unit = useWatch<any>({
    control,
    name: 'unit',
  });

  const { setTitle, handleLoading } = createStore();

  useEffect(() => {
    setTitle('FINISH REPAIR');
  }, []);
  const [dataUnit, setDataUnit] = useState<string[]>([]);
  const { id } = queryStrings.parse(location.search) as { id: string };
  const [isLoading, setIsLoading] = useState(false);

  const { backFormBtn, addUnitBtn } = useButtonApproval();

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
      setDataUnit([{ ...item, is_delete: false }, ...dataUnit]);
    } else {
      SweetAlert('error', 'Unit sudah ditambahkan', 'Error');
    }
  };

  const { mutate: handleConfirmation, isPending } = useMutation({
    mutationFn: async (data: any) => {
      data = {
        repair_return_unit: dataUnit?.map((item: any) => {
          const newItem: any = {
            repair_unit_list_id: item?.repair_unit_list_id,
            is_delete: item.is_delete,
          };
          if (item.repair_return_unit_id) {
            newItem.repair_return_unit_id = item.repair_return_unit_id;
          }
          return newItem;
          //   const newItem: any = {
          //     unit_id: item?.unit_id,
          //   };
          //   if (item.repair_unit_list_id !== undefined) {
          //     newItem.repair_unit_list_id = item.repair_unit_list_id;
          //   }
          //   return newItem;
        }),
      };

      if (id) {
        handleLoading('EDIT', true);
        const response = await repair.updateRepairReturn(id, data);
        return response;
      }
      //   console.log(data);
      handleLoading('CREATE', true);

      const response = await repair.createRepairReturn(data);
      return response;
    },
    onSuccess: (res: any) => {
      if (res?.meta?.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          text: id
            ? 'Finish repair berhasil diedit'
            : 'Finish repair berhasil ditambahkan.',
          icon: 'success',
        });
        if (id) {
          handleLoading('EDIT', false);

          navigate(`/units/unit-return-repair/${id}`);
        } else {
          handleLoading('CREATE', false);

          navigate(
            `/units/unit-return-repair/${res?.data?.repair_return?.repair_return_id}`,
          );
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
    if (unit?.repair_return_unit_id) {
      updatedDataUnit = dataUnit?.map((item: any) =>
        item?.unit_id === unit.unit_id
          ? { ...item, is_delete: !item?.is_delete }
          : item,
      );
    } else {
      setDataUnit((prevState) =>
        prevState.filter((item: any) => item?.unit_id !== unit?.unit_id),
      );
      return;
    }
    setDataUnit(updatedDataUnit);
  };

  const handleRequest = () => {
    if (dataUnit.length === 0) {
      SweetAlert('warning', 'Unit Finish Repair kosong', 'perhatian');
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

  const getDetailRepairReturnUnit = async () => {
    setIsLoading(true);
    await repair
      .getRepairReturnDetail(id)
      .then((res: any) => {
        if (res.meta.code == 200) {
          setDataUnit(
            res?.data?.repair_return_unit?.map((item: any) => ({
              repair_return_unit_id: item?.repair_return_unit_id,
              ...item?.repair_unit,
              is_delete: false,
            })),
          );
        }
      })
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    if (id) {
      getDetailRepairReturnUnit();
    }
  }, [id]);

  useEffect(() => {
    if (!unit) {
      setValue('selected_unit', { unit_engine: '' });
    }
  }, [unit]);

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
          <p className="detail-title">FORM KEMBALI REPAIR UNIT</p>
        </div>

        <div className="col-span-12 lg:col-span-2 flex items-center">
          <label className="detail-label" htmlFor="chassis_no">
            No. Rangka
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 gap-2 flex items-center">
          <p className="hidden lg:block">:</p>
          <div className=" w-full lg:w-2/5">
            <Controller
              name="unit"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectUnitWithStatus
                  onChange={onChange}
                  value={value}
                  status={'repair'}
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
              unit?.value?.unit?.unit_engine || 'Nomor mesin tidak ditemukan...'
            }
            readOnly
            className="border border-stroke p-2 rounded-md w-full lg:w-2/5 text-black"
          />
        </div>
        <div className="col-span-2 hidden lg:block" />
        <div className="col-span-12 lg:col-span-10">
          {addUnitBtn({ onClick: () => handleAddUnit(unit?.value) })}
        </div>
        <div className="col-span-12">
          <div className="grid grid-cols-1 gap-5 lg:flex">
            {backFormBtn({ onClick: () => navigate(-1) })}

            <Button
              label={id ? 'EDIT' : 'CREATE'}
              onClick={handleSubmit(handleRequest)}
              className={id ? 'btn-edit w-auto' : 'btn-request w-auto'}
            />
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
                    {item?.motor?.motor_name || item?.unit?.motor.motor_name}
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
