import Container from '../../../components/Container';
import Button from '../../../components/Forms/Button/Button';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import queryString from 'query-string';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loader2 from '../../../common/Loader/Loader';
import { useForm } from 'react-hook-form';
import delivery from '../../../Services/API/delivery';
import { useEffect, useState } from 'react';
import repair from '../../../Services/API/repair';
import createStore from '../../../context';
import { useListDeliveryUnitTable } from '../../../hooks/TableDelivery/useListDeliveryUnitTable';
import event from '../../../Services/API/event';
import { useButtonApproval } from '../../../hooks/useButtonApproval';
import eventReturn from '../../../Services/API/eventReturn';
import neq from '../../../Services/API/neq';
import neqReturn from '../../../Services/API/neqReturn';
import spk from '../../../Services/API/transaction/spk';
import CheckboxGroup from '../../../components/Checkboxes/CheckboxGroup';

export default function AddUnitDeliveryNote() {
  const { type, id, idDelivery } = queryString.parse(location.search) as {
    type: string;
    id: string;
    idDelivery?: string;
  };
  const [isLoadingDeliveryDetail, setIsLoadingDeliveryDetail] = useState(false);
  const { setTitle, handleLoading } = createStore();
  const { customBtn } = useButtonApproval();
  const [attribute, setAttribute] = useState<any>([]);

  const checkboxData = [
    {
      label: 'MANUAL BOOK',
      value: 'MANUAL BOOK',
    },
    {
      label: 'TOOLKIT',
      value: 'TOOLKIT',
    },
    {
      label: 'ACU',
      value: 'ACU',
    },
    {
      label: 'MIRROR',
      value: 'MIRROR',
    },
    {
      label: 'HELM',
      value: 'HELM',
    },
    {
      label: 'JAKET',
      value: 'JAKET',
    },
  ];

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

  const {
    getValues,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm({
    defaultValues: {
      driver_name: '',
      vehicle: '',
      note: '',
      attribute: [],
    },
  });
  const navigate = useNavigate();

  const handleRequest = () => {
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
        const data = {};
        handleSubmitDelivery(data);
      }
    });
  };

  function deliveryType(id: string) {
    switch (type) {
      case 'repair':
        return repair.getDetailRepairUnit(id);
      case 'repair_return':
        return repair.getRepairReturnDetail(id);
      case 'event':
        return event.getEventDetail(id);
      case 'event_return':
        return eventReturn.getEventReturnDetail(id);
      case 'neq':
        return neq.getNeqDetail(id);
      case 'neq_return':
        return neqReturn.getNeqReturnDetail(id);
      case 'spk':
        return spk.getDetailSpkRegular(id);
      default:
        break;
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ['getDetailRepairUnit_add_delivery'],
    queryFn: async () => {
      const response = await deliveryType(id);
      return response;
    },
  });
  const getDetailDelivery = async () => {
    setIsLoadingDeliveryDetail(true);
    const response = await delivery.getDeliveryDetail(idDelivery);
    if (response?.meta.code === 200) {
      setValue('driver_name', response?.data?.delivery_driver_name);
      setValue('note', response?.data?.delivery_note);
      setValue('vehicle', response?.data?.delivery_vehicle);
      const completeness = response?.data?.delivery_completeness;
      if (completeness) {
        const completenessArray = completeness.split(',');
        setAttribute(
          completenessArray.map((value: any) => ({ value: value.trim() })),
        );
      }
      setIsLoadingDeliveryDetail(false);
    }
  };

  useEffect(() => {
    if (idDelivery) {
      getDetailDelivery();
    }
  }, [idDelivery]);

  const { mutate: handleSubmitDelivery, isPending } = useMutation({
    mutationFn: async (data: any) => {
      data = {
        delivery_driver_name: getValues('driver_name'),
        delivery_vehicle: getValues('vehicle'),
        delivery_note: getValues('note'),
        delivery_completeness: attribute
          ?.map((item: any) => item?.value.split(','))
          .join(', '),
      };

      if (type === 'repair') {
        data['repair_id'] = id;
      } else if (type === 'event') {
        data['event_id'] = id;
      } else if (type === 'repair_return') {
        data['repair_return_id'] = id;
      } else if (type === 'event_return') {
        data['event_return_id'] = id;
      } else if (type === 'neq') {
        data['neq_id'] = id;
      } else if (type === 'neq_return') {
        data['neq_return_id'] = id;
      } else if (type === 'spk') {
        data['spk_id'] = id;
      }
      handleLoading(idDelivery ? 'EDIT' : 'CREATE', true);
      if (idDelivery) {
        const response = await delivery.updateDelivery(idDelivery, data);
        return response;
      }
      const response = await delivery.createDelivery(data);
      return response;
    },
    onSuccess: (res: any) => {
      if (res?.meta?.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          text: idDelivery
            ? 'Surat jalan berhasil diupdate'
            : 'Surat jalan berhasil dibuat',
          icon: 'success',
        });
        if (idDelivery) {
          navigate(`/units/unit-delivery/${idDelivery}?type=${type}`);
        } else {
          navigate(
            `/units/unit-delivery/${res?.data?.delivery?.delivery_id}?type=${type}`,
          );
        }
        handleLoading(id ? 'EDIT' : 'CREATE', false);
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'error',
          icon: 'error',
        });
      }
    },
  });

  const { listDeliveryUnit } = useListDeliveryUnitTable();

  // function listUnitDelivery(type: string, data: any) {
  //   switch (type) {
  //     case 'repair':
  //       return <DetailRepairUnit data={data} />;
  //     case 'repair_return':
  //       return <DetailRepairReturnUnit data={data?.data} />;
  //     default:
  //       break;
  //   }
  // }

  return isLoading || isLoadingDeliveryDetail ? (
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
          <p className="detail-title">DETAIL SURAT JALAN</p>
        </div>
        <div className="col-span-12 flex items-center lg:col-span-2">
          <label htmlFor="driverName" className="detail-label">
            Nama Driver
          </label>
        </div>
        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="hidden lg:block">:</p>
          <input
            id="driverName"
            type="text"
            {...register('driver_name', {
              required: '* Nama Driver harus diisi',
            })}
            className="border border-stroke p-2 rounded-md w-full lg:w-2/5 text-black"
          />
        </div>
        {errors.driver_name && (
          <>
            <div className="col-span-2 hidden lg:block"></div>
            <div className="col-span-12 lg:col-span-10">
              <span className="text-red-600">{errors.driver_name.message}</span>
            </div>
          </>
        )}
        <div className="col-span-12 lg:col-span-2 flex items-center">
          <label htmlFor="vehicleName" className="detail-label">
            Kendaraan
          </label>
        </div>

        <div className="col-span-12 lg:col-span-10 flex gap-2 items-center">
          <p className="hidden lg:block">:</p>
          <input
            id="vehicleName"
            type="text"
            {...register('vehicle', { required: '* Kendaraan harus diisi' })}
            className="border border-stroke p-2 rounded-md w-full  lg:w-2/5 text-black"
          />
        </div>
        {errors.vehicle && (
          <>
            <div className="col-span-2 hidden lg:block"></div>
            <div className="col-span-12 lg:col-span-10">
              <span className="text-red-600">{errors.vehicle.message}</span>
            </div>
          </>
        )}
        <div className="lg:col-span-2 col-span-12 flex ">
          <label htmlFor="attribute" className="detail-label">
            Kelengkapan
          </label>
        </div>

        <div className="lg:col-span-10 col-span-12 flex gap-2">
          <p className="hidden lg:block">:</p>
          <div className="justify-start">
            {checkboxData?.map((item, index) => (
              <div key={index} className="mb-2">
                <CheckboxGroup
                  label={item?.label}
                  checked={attribute.some(
                    (attr: any) => attr.value === item.value,
                  )}
                  onChange={(e: any) => {
                    const isChecked = e;
                    if (isChecked) {
                      setAttribute((prevAttribute: any) => [
                        ...prevAttribute,
                        { value: item.value },
                      ]);
                    } else {
                      setAttribute((prevAttribute: any) =>
                        prevAttribute.filter(
                          (attr: any) => attr.value !== item.value,
                        ),
                      );
                    }
                  }}
                />
                {/* <input
                  type="checkbox"
                  id={`attribute_${index}`}
                  checked={attribute.some(
                    (attr: any) => attr.value === item.value,
                  )}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    if (isChecked) {
                      setAttribute((prevAttribute: any) => [
                        ...prevAttribute,
                        { value: item.value },
                      ]);
                    } else {
                      setAttribute((prevAttribute: any) =>
                        prevAttribute.filter(
                          (attr: any) => attr.value !== item.value,
                        ),
                      );
                    }
                  }}
                />
                <label
                  htmlFor={`attribute_${index}`}
                  className="mr-5 ml-2 detail-label"
                >
                  {item.label}
                </label> */}
              </div>
            ))}
          </div>
        </div>
        {errors.attribute && (
          <>
            <div className="col-span-2 hidden lg:block"></div>
            <div className="col-span-12 lg:col-span-10">
              <span className="text-red-600">{errors.attribute.message}</span>
            </div>
          </>
        )}
        <div className="lg:col-span-2 col-span-12 flex items-center">
          <label htmlFor="note" className="detail-label">
            Catatan
          </label>
        </div>

        <div className="lg:col-span-10 col-span-12 flex gap-2 items-center">
          <p className="hidden lg:block">:</p>
          <input
            id="note"
            type="text"
            {...register('note')}
            className="border border-stroke p-2 rounded-md w-full  lg:w-2/5 text-black"
          />
        </div>
        {errors.note && (
          <>
            <div className="col-span-2 hidden lg:block"></div>
            <div className="col-span-12 lg:col-span-10">
              <span className="text-red-600">{errors.note.message}</span>
            </div>
          </>
        )}
        <div className="col-span-12 mt-3 items-center">
          <div className="grid grid-cols-1 lg:flex gap-x-5 gap-y-5">
            {customBtn({
              onClick: handleSubmit(handleRequest),
              label: idDelivery ? 'EDIT' : 'CREATE',
              className: idDelivery ? 'w-auto btn-edit' : 'w-auto btn-request',
            })}
            <Button
              label="CANCEL"
              className={'btn-delete  lg:w-auto w-full'}
              onClick={() => navigate(-1)}
            />
          </div>
        </div>
        <div className="col-span-12">{listDeliveryUnit(type, data)}</div>
      </div>
    </Container>
  );
}
