import Container from '../../../../components/Container';
import TabViews from '../../../../components/TabViews';
import Button from '../../../../components/Forms/Button/Button';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import FormUnit from './SubForm/GeneralTransaction/FormUnit';
import FormTransaction from './SubForm/GeneralTransaction/FormTransaction';
import FormCustomerInfo from './SubForm/Customer/FormCustomerInfo';
import FormLegal from './SubForm/Customer/FormLegal';
import FormPricingInfo from './SubForm/Pricing/FormPricingInfo';
import FormDelivery from './SubForm/Delivery/FormDelivery';
import { useNavigate } from 'react-router-dom';
import createStore from '../../../../context';
import { useEffect, useState } from 'react';
import FormGeneralInfo from './SubForm/GeneralTransaction/FormGeneralInfo';
import FormAdditionalFiles from './SubForm/Customer/FormAdditionalFiles';
import Swal from 'sweetalert2';
import { useMutation } from '@tanstack/react-query';
import { dayjsFormatInputDate } from '../../../../utils/dayjs';
import { formatRupiah, numberFormatter } from '../../../../utils/formatter';
import spk from '../../../../Services/API/transaction/spk';
import { SweetAlert } from '../../../../utils/Swal';
import usePricingUpdate from '../../../../hooks/usePriceUpdate';

const AddSpkRegular = () => {
  const methods = useForm<any>({
    defaultValues: {
      spk_customer_gender: 'man',
      spk_legal_gender: 'man',
      spk_delivery_pickup_option: 'ktp',
      spk_general_indent_date: new Date(),
      spk_pricing_off_the_road: '0',
      spk_pricing_bbn: '0',
      spk_transaction_method_buying: 'off_the_road',
      spk_transaction_payment_method: 'cash',
    },
    mode: 'onChange',
  });

  // const dealerSelected: any | null = JSON.parse(
  //   localStorage.getItem('account_dealer') || '{}',
  // );
  const dealerSelected = createStore((state) => state.account_dealer);

  const [errorKtp, setErrorKtp] = useState<any>(null);
  const [errorKK, setErrorKK] = useState<any>(null);
  const [errorSk, setErrorSK] = useState<any>(null);

  const [changeProvinceCustomer, setChangeProvinceCustomer] = useState(false);
  const [changeCityCustomer, setChangeCityCustomer] = useState(false);
  const [changeDistrictCustomer, setChangeDistrictCustomer] = useState(false);

  const [customerFiles, setCustomerFiles] = useState<any>({});

  const handleLoadingButton = createStore((state: any) => state.handleLoading);

  const onSubmitData = (data: any) => {
    let otr = data?.spk_pricing_on_the_road;
    let dp = data?.spk_transaction_down_payment;
    let discount = data?.spk_pricing_discount;
    let indent = data?.spk_pricing_indent;
    let over_discount = data?.spk_pricing_over_discount;
    let subsidi = data?.spk_pricing_subsidi;
    let text;
    let nominal = 0;

    if (data?.spk_transaction_payment_method === 'cash') {
      nominal =
        parseFloat(otr) -
        parseFloat(discount) -
        parseFloat(indent) -
        parseFloat(over_discount) -
        parseFloat(subsidi);
    } else if (data?.spk_transaction_payment_method === 'credit') {
      nominal =
        parseFloat(dp) -
        parseFloat(discount) -
        parseFloat(indent) -
        parseFloat(over_discount) -
        parseFloat(subsidi);
    }
    if (nominal < 0) {
      text = `Terdapat kelebihan bayar senilai ${formatRupiah(
        Math.abs(nominal),
      )}`;
    } else {
      text = '';
    }
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      text: text,
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#D40000',
      confirmButtonText: 'YES',
      confirmButtonColor: '#00029D',
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmitSPK(data);
      }
    });
  };

  const [additionalPriceInput, setAdditionalPriceInput] = useState([
    { label: 'Additional 1' },
  ]);
  const [accessoriesPriceInput, setAccessoriesPriceInput] = useState([
    { label: 'Accessories 1' },
  ]);

  const buy_method = useWatch({
    control: methods.control,
    name: 'spk_transaction_method_buying',
  });

  const motor = useWatch({
    control: methods.control,
    name: 'spk_unit_motor',
  });

  const location = useWatch({
    control: methods.control,
    name: 'spk_general_location',
  });

  const indent = useWatch({
    control: methods.control,
    name: 'spk_general_indent',
  });

  useEffect(() => {
    methods.setValue('spk_general_location', {
      label: dealerSelected?.dealer?.dealer_name,
      type: 'dealer',
      value: {
        dealer_id: dealerSelected?.dealer_id,
      },
    });
  }, []);

  useEffect(() => {
    if (indent) {
      methods.setValue('spk_pricing_indent', indent?.value?.amount_total);
      console.log({ indent });
      methods.setValue('spk_unit_color', {
        label: indent?.value?.color?.color_name,
        value: indent?.value?.color,
      });
      methods.setValue('spk_unit_motor', {
        label: indent?.value?.motor?.motor_name,
        value: indent?.value?.motor,
      });
      methods.setValue(
        'spk_transaction_payment_method',
        indent?.value?.indent_type,
      );
      methods.setValue('spk_transaction_salesman', {
        label: indent?.value?.salesman,
        value: {
          salesman_id: indent?.value?.sales_id,
          salesman_name: indent?.value?.salesman_name,
        },
      });
      if (indent?.value?.indent_type === 'cash') {
        methods.setValue('spk_transaction_microfinance', {
          label: indent?.value?.microfinance_name,
          value: {
            microfinance_name: indent?.value?.microfinance_name,
            microfinance_id: indent?.value?.micro_finance_id,
          },
        });
      } else {
        methods.setValue('spk_transaction_leasing', {
          label: indent?.value?.leasing_name,
          value: {
            leasing_name: indent?.value?.leasing_name,
            leasing_id: indent?.value?.leasing_id,
          },
        });
      }
      methods.setValue('spk_customer_name', indent?.value?.indent_people_name);
      methods.setValue('spk_customer_nik', indent?.value?.indent_nik);
      methods.setValue(
        'spk_customer_phone_number',
        indent?.value?.indent_phone_number,
      );
      methods.setValue(
        'spk_customer_wa_number',
        indent?.value?.indent_wa_number,
      );
    } else {
      methods.setValue('spk_pricing_indent', 0);
    }
  }, [indent]);

  const spk_customer_name = methods.getValues('spk_customer_name');
  const spk_customer_address = methods.getValues('spk_customer_address');
  const spk_customer_city = methods.getValues('spk_customer_city');
  const spk_customer_telephone_number = methods.getValues(
    'spk_customer_telephone_number',
  );
  const spk_customer_phone_number = methods.getValues(
    'spk_customer_phone_number',
  );

  const spk_delivery_option = useWatch({
    control: methods.control,
    name: 'spk_delivery_pickup_option',
  });

  useEffect(() => {
    if (spk_delivery_option === 'ktp') {
      methods.setValue('spk_delivery_name', spk_customer_name);
      methods.setValue('spk_delivery_address', spk_customer_address);
      methods.setValue(
        'spk_delivery_city',
        spk_customer_city?.value?.city_name,
      );
      methods.setValue(
        'spk_delivery_tel_number',
        spk_customer_telephone_number,
      );
      methods.setValue('spk_delivery_phone_number', spk_customer_phone_number);
    } else {
      methods.setValue('spk_delivery_name', '');
      methods.setValue('spk_delivery_address', '');
      methods.setValue('spk_delivery_city', '');
      methods.setValue('spk_delivery_tel_number', '');
      methods.setValue('spk_delivery_phone_number', '');
    }
  }, [
    spk_delivery_option,
    spk_customer_name,
    spk_customer_address,
    spk_customer_telephone_number,
    spk_customer_phone_number,
    spk_customer_city?.value?.city_name,
  ]);

  const { mutate: handleSubmitSPK } = useMutation({
    mutationFn: async (data: any) => {
      console.log({ data });
      const formData = new FormData();

      // Append KK file if it exists
      if (customerFiles?.kkFiles) {
        formData.append('spk_additional_document_kk', customerFiles.kkFiles);
      }

      // Append KTP file if it exists
      if (customerFiles?.ktpFiles) {
        formData.append('spk_additional_document_ktp', customerFiles.ktpFiles);
      }

      // Append additional files if they exist
      if (customerFiles?.additionalFiles) {
        customerFiles.additionalFiles.forEach((file: any, index: number) => {
          formData.append(
            `spk_additional_document_another[${index}]`,
            file?.file,
          );
        });
      }

      // Append delivery files if they exist
      if (customerFiles?.deliveryFiles) {
        customerFiles.deliveryFiles.forEach((file: any, index: number) => {
          formData.append(`spk_delivery_file_sk[${index}]`, file?.file);
        });
      }
      data?.spk_pricing_accessories?.forEach((item: any, index: number) => {
        formData.append(
          `spk_pricing_accecories_price[${index}][price]`,
          numberFormatter(item?.accessories_price).toString(),
        );
        formData.append(
          `spk_pricing_accecories_price[${index}][note]`,
          item?.accessories_note,
        );
      });
      data?.spk_pricing_additional?.forEach((item: any, index: number) => {
        formData.append(
          `spk_pricing_additional_price[${index}][price]`,
          numberFormatter(item?.additional_price).toString(),
        );
        formData.append(
          `spk_pricing_additional_price[${index}][note]`,
          item?.additional_note,
        );
      });

      const restructured_data = {
        ...data,
        sales_name: data?.spk_general_salesman?.value?.salesman_name,
        sales_id: data?.spk_general_salesman?.value?.salesman_id,
        spk_general_date: dayjsFormatInputDate(data?.spk_general_date),
        indent_id: data?.spk_general_indent?.value?.indent_id,
        spk_general_location: data?.spk_general_location?.type,
        spk_general_method_sales:
          data?.spk_general_sales_method?.value?.method_sales_name,
        dealer_id:
          data?.spk_general_location?.value?.dealer_id ||
          data?.spk_general_location?.value,
        ...(data?.spk_general_location?.type === 'neq' && {
          dealer_neq_id: data?.spk_general_location?.value?.dealer_neq_id,
        }),
        color_id: data?.spk_unit_color?.value?.color_id,
        motor_id: data?.spk_unit_motor?.value?.motor_id,
        spk_transaction_method_buying: data?.spk_transaction_method_buying,
        spk_transaction_method_payment: data?.spk_transaction_payment_method,
        ...(data?.spk_transaction_payment_method === 'cash' && {
          microfinance_name:
            data?.spk_transaction_microfinance?.value?.microfinance_name,
          micro_finance_id:
            data?.spk_transaction_microfinance?.value?.microfinance_id,
        }),
        ...(data?.spk_transaction_payment_method === 'credit' && {
          leasing_name: data?.spk_transaction_leasing?.value?.leasing_name,
          leasing_id: data?.spk_transaction_leasing?.value?.leasing_id,
          spk_transaction_down_payment: numberFormatter(
            data?.spk_transaction_down_payment,
          ),
          spk_transaction_tenor:
            data?.spk_transaction_tenor?.value?.tenor_amount,
          spk_transaction_instalment: numberFormatter(
            data?.spk_transaction_instalment,
          ),
          spk_transaction_surveyor_name: data?.spk_transaction_surveyor_name,
        }),
        spk_customer_nik: data?.spk_customer_nik,
        spk_customer_name: data?.spk_customer_name,
        spk_customer_address: data?.spk_customer_address,
        province: data?.spk_customer_province?.value?.province_name,
        province_id: data?.spk_customer_province?.value?.province_id,
        city: data?.spk_customer_city?.value?.city_name,
        city_id: data?.spk_customer_city?.value?.city_id,
        district: data?.spk_customer_district?.value?.district_name,
        district_id: data?.spk_customer_district?.value?.district_id,
        sub_district: data?.spk_customer_sub_district?.value?.sub_district_name,
        sub_district_id:
          data?.spk_customer_sub_district?.value?.sub_district_id,
        spk_customer_postal_code: data?.spk_customer_post_code,
        spk_customer_birth_place: data?.spk_customer_place_of_birth,
        spk_customer_birth_date: dayjsFormatInputDate(
          data?.spk_customer_date_of_birth,
        ),
        spk_customer_gender: data?.spk_customer_gender,
        spk_customer_telp: data?.spk_customer_telephone_number,
        spk_customer_no_wa: data?.spk_customer_wa_number,
        spk_customer_no_phone: data?.spk_customer_phone_number,
        spk_customer_religion: data?.spk_customer_religion,
        marital_name:
          data?.spk_customer_marital?.value?.martial_name ||
          data?.spk_customer_marital?.value?.marital_name,
        marital_id: data?.spk_customer_marital?.value?.marital_id,
        hobbies_name: data?.spk_customer_hobby?.value?.hobbies_name,
        hobbies_id: data?.spk_customer_hobby?.value?.hobbies_id,
        spk_customer_mother_name: data?.spk_customer_birth_mother,
        spk_customer_npwp: data?.spk_customer_npwp,
        spk_customer_email: data?.spk_customer_email,
        residence_name: data?.spk_customer_residence?.value?.residence_name,
        residence_id: data?.spk_customer_residence?.value?.residence_id,
        education_name: data?.spk_customer_education?.value?.education_name,
        education_id: data?.spk_customer_education?.value?.education_id,
        work_name:
          data?.spk_customer_work?.value?.work_name ||
          data?.spk_customer_work?.value?.occupation_name,
        work_id: data?.spk_customer_work?.value?.occupation_id,
        spk_customer_length_of_work: data?.spk_customer_length_of_work,
        spk_customer_income: data?.spk_customer_income?.value?.income_amount,
        spk_customer_outcome:
          data?.spk_customer_expenditure?.value?.expenditure_amount,
        motor_brand_name:
          data?.spk_customer_previous_brand?.value?.motor_brand_name,
        motor_brand_id:
          data?.spk_customer_previous_brand?.value?.motor_brand_id,
        spk_customer_motor_type_before: data?.spk_customer_previous_type,
        spk_customer_motor_year_before: data?.spk_customer_previous_motor_year,
        spk_legal_nik: data?.spk_legal_nik,
        spk_legal_name: data?.spk_legal_name,
        spk_legal_address: data?.spk_legal_address,
        spk_legal_province: data?.spk_legal_province?.value?.province_name,
        spk_legal_province_id: data?.spk_legal_province?.value?.province_id,
        spk_legal_city: data?.spk_legal_city?.value?.city_name,
        spk_legal_city_id: data?.spk_legal_city?.value?.city_id,
        spk_legal_district: data?.spk_legal_district?.value?.district_name,
        spk_legal_district_id: data?.spk_legal_district?.value?.district_id,
        spk_legal_sub_district:
          data?.spk_legal_sub_district?.value?.sub_district_name,
        spk_legal_sub_district_id:
          data?.spk_legal_sub_district?.value?.sub_district_id,
        spk_legal_postal_code: data?.spk_legal_post_code,
        spk_legal_birth_place: data?.spk_legal_place_of_birth,
        spk_legal_birth_date: dayjsFormatInputDate(
          data?.spk_legal_date_of_birth,
        ),
        spk_legal_gender: data?.spk_legal_gender,
        spk_legal_telp: data?.spk_legal_telephone_number,
        spk_legal_no_phone: data?.spk_legal_phone_number,
        spk_pricing_off_the_road: numberFormatter(
          data?.spk_pricing_off_the_road,
        ),
        spk_pricing_bbn: numberFormatter(data?.spk_pricing_bbn),
        spk_pricing_on_the_road: numberFormatter(data?.spk_pricing_on_the_road),
        spk_pricing_indent_nominal: numberFormatter(data?.spk_pricing_indent),
        spk_pricing_discount: numberFormatter(data?.spk_pricing_discount),
        spk_pricing_subsidi: numberFormatter(data?.spk_pricing_subsidi),
        spk_pricing_booster: numberFormatter(data?.spk_pricing_booster),
        spk_pricing_commission: numberFormatter(data?.spk_pricing_commission),
        spk_pricing_commission_surveyor: numberFormatter(
          data?.spk_pricing_surveyor_commission,
        ),
        spk_pricing_broker_name:
          data?.spk_pricing_broker_name?.value?.broker_name,
        broker_id: data?.spk_pricing_broker_name?.value?.broker_id,
        spk_pricing_broker_commission: numberFormatter(
          data?.spk_pricing_broker_commission,
        ),
        spk_pricing_cashback: numberFormatter(data?.spk_pricing_cashback),
        spk_pricing_delivery_cost: numberFormatter(data?.spk_pricing_delivery),
        spk_delivery_type: data?.spk_delivery_pickup_option,
        spk_delivery_ktp_customer_name: data?.spk_delivery_name,
        spk_delivery_ktp_customer_address: data?.spk_delivery_address,
        spk_delivery_ktp_city: data?.spk_delivery_city,
        spk_delivery_ktp_no_telp: data?.spk_delivery_tel_number,
        spk_delivery_ktp_no_phone: data?.spk_delivery_phone_number,
        dealer_delivery_neq_id: data?.spk_delivery_neq?.value?.dealer_neq_id,
        dealer_delivery_neq_customer_name: data?.spk_delivery_name,
        dealer_delivery_neq_customer_no_phone: data?.spk_delivery_phone_number,
        spk_delivery_domicile_customer_name: data?.spk_delivery_name,
        spk_delivery_domicile_city: data?.spk_delivery_city,
        spk_delivery_domicile_address: data?.spk_delivery_address,
        spk_delivery_dealer_customer_name: data?.spk_delivery_name,
        spk_delivery_dealer_no_phone: data?.spk_delivery_phone_number,
      };

      Object.entries(restructured_data).forEach(([key, value]: any) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      handleLoadingButton('SUBMIT', true);
      const response = await spk.createSpkRegular(formData);
      return response;
    },
    onSuccess: async (res: any) => {
      handleLoadingButton('SUBMIT', false);
      if (spk_delivery_option === 'domicile') {
        if (!customerFiles?.deliveryFiles) {
          setErrorSK('SK wajib diupload');
          SweetAlert('error', 'SK wajib diupload', 'Error');
          return;
        }
      }
      if (!customerFiles?.ktpFiles) {
        setErrorKtp('Ktp wajib diupload');
        SweetAlert('error', 'Ktp wajib diupload', 'Error');
        return;
      }
      if (!customerFiles?.kkFiles) {
        setErrorKK('KK wajib diupload');
        SweetAlert('error', 'KK wajib diupload', 'Error');
        return;
      }

      if (res?.meta?.code === 200) {
        handleLoadingButton('SUBMIT', false);
        SweetAlert('success', 'Spk berhasil dibuat', 'Sukses');
        navigate('/transaction/spk-regular');
      } else {
        let errorMessage = res?.response?.data?.data || 'An error occurred';
        const errorKeys = Object.keys(errorMessage);
        if (errorKeys.length > 0) {
          errorMessage = errorMessage[errorKeys[0]][0];
        }
        SweetAlert('error', errorMessage, 'Error');
      }
    },
    onError: (error: any) => {
      handleLoadingButton('SUBMIT', false);
      SweetAlert('error', error, 'Error');
    },
  });

  const offTheRoad = useWatch({
    control: methods.control,
    name: 'spk_pricing_off_the_road',
  });

  const bbnValue = useWatch({
    control: methods.control,
    name: 'spk_pricing_bbn',
  });
  const onTheRoad = parseFloat(offTheRoad) + parseFloat(bbnValue);

  useEffect(() => {
    methods.setValue('spk_pricing_on_the_road', onTheRoad);
  }, [offTheRoad, onTheRoad]);

  const navigate = useNavigate();

  const { setTitle } = createStore();

  useEffect(() => {
    setTitle('REGULAR SPK');
  }, []);

  const handleOnChangeCustomerFiles = (files: FileSystem) => {
    setCustomerFiles(files);
  };

  const { off_the_road, bbn, discount } = usePricingUpdate(
    buy_method,
    location,
    motor,
  );

  const province = useWatch<any>({
    control: methods.control,
    name: 'spk_customer_province',
  });
  const city = useWatch<any>({
    control: methods.control,
    name: 'spk_customer_city',
  });
  const district = useWatch<any>({
    control: methods.control,
    name: 'spk_customer_district',
  });

  const legalProvince = useWatch<any>({
    control: methods.control,
    name: 'spk_legal_province',
  });
  const legalCity = useWatch<any>({
    control: methods.control,
    name: 'spk_legal_city',
  });
  const legalDistict = useWatch<any>({
    control: methods.control,
    name: 'spk_legal_district',
  });

  useEffect(() => {
    const setValue = methods.setValue;
    if (!province) {
      setValue('spk_customer_city', null);
      setValue('spk_customer_district', null);
      setValue('spk_customer_sub_district', null);
    } else if (!city) {
      setValue('spk_customer_district', null);
      setValue('spk_customer_sub_district', null);
    } else if (!district) {
      setValue('spk_customer_sub_district', null);
    }
  }, [province, city, district]);

  useEffect(() => {
    const setValue = methods.setValue;
    if (!legalProvince) {
      setValue('spk_legal_city', null);
      setValue('spk_legal_district', null);
      setValue('spk_legal_sub_district', null);
    } else if (!legalCity) {
      setValue('spk_legal_district', null);
      setValue('spk_legal_sub_district', null);
    } else if (!legalDistict) {
      setValue('spk_legal_sub_district', null);
    }
  }, [legalProvince, legalCity, legalDistict]);

  useEffect(() => {
    const setValue = methods.setValue;

    if (!motor) {
      setValue('spk_pricing_off_the_road', '');
      setValue('spk_pricing_bbn', 0);
      setValue('spk_pricing_on_the_road', '');
    } else {
      setValue('spk_pricing_off_the_road', off_the_road);
      setValue('spk_pricing_discount', discount);
      if (buy_method === 'off_the_road') {
        setValue('spk_pricing_bbn', '0');
        setValue('spk_pricing_on_the_road', off_the_road);
      } else {
        setValue('spk_pricing_bbn', bbn);
        setValue(
          'spk_pricing_on_the_road',
          Number(off_the_road || 0) + Number(bbn || 0),
        );
      }
      // setValue('spk_pricing_bbn', bbnValue);
    }
  }, [motor, location?.type, buy_method]);

  return (
    <div>
      <Container>
        <FormProvider {...methods}>
          <TabViews>
            {/* @ts-ignore */}
            <div label="GENERAL & TRANSACTION">
              <div className="grid grid-cols-2 gap-y-5 gap-x-10 transition-opacity duration-300">
                <div className="col-span-2 lg:col-span-1 mt-8">
                  <FormGeneralInfo />
                  <FormUnit />
                </div>
                <div className="col-span-2 lg:col-span-1 mt-8">
                  <FormTransaction />
                </div>
              </div>
            </div>
            {/* @ts-ignore */}
            <div label="CUSTOMER">
              <div className="grid grid-cols-2 gap-y-5 gap-x-10">
                <div className="col-span-2 lg:col-span-1 mt-8">
                  <FormCustomerInfo
                    onChangeProvinceCustomer={setChangeProvinceCustomer}
                    onChangeCityCustomer={setChangeCityCustomer}
                    onChangeDistrictCustomer={setChangeDistrictCustomer}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 mt-8">
                  <FormLegal />
                  <FormAdditionalFiles
                    onChangeErrorKtp={(value: any) => setErrorKtp(value)}
                    onChangeErrorKk={(value: any) => setErrorKK(value)}
                    errorKK={errorKK}
                    errorKtp={errorKtp}
                    customerFiles={customerFiles}
                    onChangeCustomerFiles={handleOnChangeCustomerFiles}
                  />
                </div>
              </div>
            </div>
            {/* @ts-ignore */}
            <div label="PRICING">
              <FormPricingInfo
                onAddAditionalPriceInput={setAdditionalPriceInput}
                additionalPriceInput={additionalPriceInput}
                accessoriesPriceInput={accessoriesPriceInput}
                onAddAccessoriesInput={setAccessoriesPriceInput}
              />
            </div>
            {/* @ts-ignore */}
            <div label="DELIVERY">
              <FormDelivery
                customerFiles={customerFiles}
                errorSK={errorSk}
                onChangeErrorSk={(value: any) => setErrorSK(value)}
                onChangeCustomerFiles={handleOnChangeCustomerFiles}
              />
            </div>
          </TabViews>
        </FormProvider>
      </Container>
      <Container className="mt-5">
        <div className="grid grid-cols-1 lg:flex gap-y-5 gap-x-4 ">
          <Button
            label="SUBMIT"
            className={'btn-confirm w-auto'}
            onClick={methods.handleSubmit(onSubmitData)}
          />
          <Button
            label="CANCEL"
            className={'btn-delete w-auto'}
            onClick={() => navigate(-1)}
          />
        </div>
      </Container>
    </div>
  );
};

export default AddSpkRegular;
