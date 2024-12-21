import { FormProvider, useForm, useWatch } from 'react-hook-form';
import Container from '../../../../components/Container';
import TabViews from '../../../../components/TabViews';
import FormCustomerInfo from '../Form/SubForm/Customer/FormCustomerInfo';
import FormLegal from '../Form/SubForm/Customer/FormLegal';
import FormDelivery from '../Form/SubForm/Delivery/FormDelivery';
import FormTransaction from '../Form/SubForm/GeneralTransaction/FormTransaction';
import FormUnit from '../Form/SubForm/GeneralTransaction/FormUnit';
import FormPricingInfo from '../Form/SubForm/Pricing/FormPricingInfo';
import FormGeneralInfo from '../Form/SubForm/GeneralTransaction/FormGeneralInfo';
import DetailGeneral from './DetailSections/GeneralTransaction/DetailGeneralInfo';
import { useEffect, useState } from 'react';
import DetailTransaction from './DetailSections/GeneralTransaction/DetailTransaction';
import FormAdditionalFiles from '../Form/SubForm/Customer/FormAdditionalFiles';
import DetailUnit from './DetailSections/GeneralTransaction/DetailUnit';
import DetailCustomer from './DetailSections/Customer/DetailCustomer';
import DetailLegal from './DetailSections/Customer/DetailLegal';
import DetailPricingInfo from './DetailSections/Pricing/DetailPricingInfo';
import { useMutation, useQuery } from '@tanstack/react-query';
import spk from '../../../../Services/API/transaction/spk';
import { useNavigate, useParams } from 'react-router-dom';
import Loader2 from '../../../../common/Loader/Loader';
import DetailDelivery from './DetailSections/Delivery/DetailDelivery';
import DetailAdditionalFiles from './DetailSections/Customer/DetailAdditionalFiles';
import Button from '../../../../components/Forms/Button/Button';
import Swal from 'sweetalert2';
import { useButtonApproval } from '../../../../hooks/useButtonApproval';
import DetailPO from './DetailSections/GeneralTransaction/DetailPO';
import createStore from '../../../../context/index';
import usePricingUpdate from '../../../../hooks/usePriceUpdate';
import {
  dayjsFormatDateTime,
  dayjsFormatInputDate,
} from '../../../../utils/dayjs';
import { formatRupiah, numberFormatter } from '../../../../utils/formatter';
import { SweetAlert } from '../../../../utils/Swal';
import ModalPo from '../../../../components/Modal/transaction/Spk/Regular/ModalPo';
import ModalImage from '../../../../components/Modal/Preview/ModalImage';
import ModalShipment from '../../../../components/Modal/transaction/Spk/Regular/ModalShipment';
import ModalCroCheck from '../../../../components/Modal/transaction/Spk/Regular/ModalCroCheck';
import Table from '../../../../components/Tables/Table';

const SpkRegularDetail = () => {
  const methods = useForm();
  const [generalData, setGeneralData] = useState<any>({});
  const [unitData, setUnitData] = useState<any>({});
  const [transactionData, setTransactionData] = useState<any>({});
  const [customerData, setCustomerData] = useState<any>({});
  const { setTitle, handleLoading } = createStore();
  const [legalData, setLegalData] = useState<any>({});
  const [pricingData, setPricingData] = useState<any>({});
  const [deliveryData, setDeliveryData] = useState<any>({});
  const [toggleEditGeneralInfo, setToggleEditGeneralInfo] = useState(false);
  const [toggleEditUnitInfo, setToggleEditUnitInfo] = useState(false);
  const [toggleEditTransactionInfo, setToggleEditTransactionInfo] =
    useState(false);
  const [toggleEditCustomerInfo, setToggleEditCustomerInfo] = useState(false);
  const [toggleEditLegalInfo, setToggleEditLegalInfo] = useState(false);
  const [toggleEditPricingInfo, setToggleEditPricingInfo] = useState(false);
  const [toggleEditAdditionalFiles, setToggleEditAdditionalFiles] =
    useState(false);
  const [toggleEditDelivery, setToggleEditDelivery] = useState(false);
  const [onEditShow, setOnEditShow] = useState(false);
  const [files, setFiles] = useState<any>({});
  const handleModal = createStore((state) => state.handleModal);

  const buy_method = useWatch({
    control: methods.control,
    name: 'spk_transaction_method_buying',
  });

  const location = useWatch({
    control: methods.control,
    name: 'spk_general_location',
  });
  const motor = useWatch({
    control: methods.control,
    name: 'spk_unit_motor',
  });
  const indent = useWatch({
    control: methods.control,
    name: 'spk_general_indent',
  });

  const [additionalPriceInput, setAdditionalPriceInput] = useState([
    'Additional 1',
  ]);
  const [accessoriesPriceInput, setAccessoriesPriceInput] = useState([
    'Accessories 1',
  ]);

  useEffect(() => {
    setTitle('DETAIL SPK REGULAR');
  }, []);

  const { backBtn, printBtn } = useButtonApproval();

  const handleEditDetailGeneral = (value: any) => {
    setToggleEditGeneralInfo(value);
    setOnEditShow(true);
  };

  const handleToggleEditUnitInfo = (value: any) => {
    setOnEditShow(true);
    setToggleEditUnitInfo(value);
  };

  const handleToggleEditTransactionInfo = (value: any) => {
    setToggleEditTransactionInfo(value);
    setOnEditShow(true);
  };

  const handleToggleEditCustomerInfo = (value: boolean) => {
    setOnEditShow(true);
    setToggleEditCustomerInfo(value);
  };

  const handleToggleEditLegalData = (value: boolean) => {
    setOnEditShow(true);
    setToggleEditLegalInfo(value);
  };

  const handleToggleEditPricingInfo = (value: any) => {
    setOnEditShow(true);
    setToggleEditPricingInfo(value);
  };

  const handleToggleEditDeliveryInfo = (value: any) => {
    setOnEditShow(true);
    setToggleEditDelivery(value);
  };

  const handleOnChangeCustomerFiles = (files: FileSystem) => {
    setFiles(files);
  };

  const onCancelEdit = () => {
    Swal.fire({
      title: 'Batal Edit',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#00029D',
      confirmButtonText: 'YES',
      confirmButtonColor: '#D40000',
    }).then((result) => {
      if (result.isConfirmed) {
        setOnEditShow(false);
        setToggleEditGeneralInfo(false);
        setToggleEditTransactionInfo(false);
        setToggleEditUnitInfo(false);
        setToggleEditCustomerInfo(false);
        setToggleEditAdditionalFiles(false);
        setToggleEditLegalInfo(false);
        setToggleEditPricingInfo(false);
        setToggleEditDelivery(false);
      }
    });
  };
  const { id } = useParams();

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['detail_spk_regular'],
    queryFn: async () => {
      try {
        const response = await spk.getDetailSpkRegular(id);
        const data = response?.data;
        setFiles({
          ktpFiles: data?.spk_additional_document?.spk_additional_document_ktp,
          kkFiles: data?.spk_additional_document?.spk_additional_document_kk,
          additionalFiles: data?.spk_additional_document_another.map(
            (file: any) =>
              ({
                id: file.spk_additional_document_another_id,
                name: file.spk_additional_document_another_name,
                type: file?.spk_additional_document_another_name?.endsWith(
                  '.pdf',
                )
                  ? 'pdf'
                  : 'image',
                spk_id: file.spk_id,
                created_at: file.created_at,
                updated_at: file.updated_at,
              }) || [],
          ),
          deliveryFiles:
            data?.spk_delivery_domicile?.file_sk.map((file: any) => ({
              id: file?.spk_delivery_file_sk_id,
              name: file?.file,
              type: file?.file?.endsWith('.pdf') ? 'pdf' : 'image',
            })) || [],
        });
        setAdditionalPriceInput(
          data?.spk_pricing_additional?.map((item: any, index: number) => ({
            label: `Additional ${index + 1}`,
            id: item?.spk_pricing_additional_id,
          })),
        );
        setAccessoriesPriceInput(
          data?.spk_pricing_accecories?.map((item: any, index: number) => ({
            label: `Accessories ${index + 1}`,
            id: item?.spk_pricing_accecories_id,
          })),
        );
        setGeneralData(data?.spk_general);
        setUnitData(data?.spk_unit);
        setTransactionData(data?.spk_transaction);
        setCustomerData(data?.spk_customer);
        setLegalData(data?.spk_legal);
        setPricingData(data?.spk_pricing);
        setDeliveryData(data);

        return response;
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    const setValue = methods.setValue;

    if (onEditShow) {
      methods.setValue('spk_general_indent', {
        value: generalData?.indent,
        label: generalData?.indent?.indent_number,
      });
      methods.setValue('spk_general_location', {
        type: generalData?.spk_general_location,
        value:
          generalData?.spk_general_location === 'dealer'
            ? generalData?.dealer
            : generalData?.dealer_neq,
        label:
          generalData?.spk_general_location === 'dealer'
            ? generalData?.dealer?.dealer_name
            : generalData?.dealer_neq?.dealer_neq_name,
      });
      methods.setValue('spk_general_salesman', {
        value: {
          salesman_id: generalData?.sales_id,
          salesman_name: generalData?.sales_name,
        },
        label: generalData?.sales_name,
      });
      methods.setValue('spk_general_sales_method', {
        value: {
          sales_id: generalData?.method_sales_id,
          method_sales_name: generalData?.spk_general_method_sales,
        },
        label: generalData?.spk_general_method_sales,
      });
      methods.setValue('spk_unit_motor', {
        label: unitData?.motor?.motor_name,
        value: unitData?.motor,
      });
      methods.setValue('spk_unit_color', {
        label: unitData?.color?.color_name,
        value: unitData?.color,
      });
      if (deliveryData?.spk_delivery_type === 'ktp') {
        setValue('spk_delivery_pickup_option', 'ktp');
        const data = deliveryData?.spk_delivery_ktp;
        setValue('spk_delivery_name', data?.spk_delivery_ktp_customer_name);
        setValue(
          'spk_delivery_address',
          data?.spk_delivery_ktp_customer_address,
        );
        setValue('spk_delivery_city', data?.spk_delivery_ktp_city);
        setValue('spk_delivery_tel_number', data?.spk_delivery_ktp_no_telp);
        setValue('spk_delivery_phone_number', data?.spk_delivery_ktp_no_phone);
      } else if (deliveryData?.spk_delivery_type === 'neq') {
        const data = deliveryData?.spk_delivery_dealer_neq;
        setValue('spk_delivery_pickup_option', 'neq');
        setValue('spk_delivery_neq', {
          label: data?.spk_delivery_dealer_neq?.spk_delivery_neq_name,
          value: data?.spk_delivery_dealer_neq?.spk_delivery_neq_id,
        });
        setValue('spk_delivery_name', data?.dealer_delivery_neq_customer_name);
        setValue(
          'spk_delivery_phone_number',
          data?.dealer_delivery_neq_customer_no_phone,
        );
      } else if (deliveryData?.spk_delivery_type === 'dealer') {
        const data = deliveryData?.spk_delivery_dealer;
        setValue('spk_delivery_pickup_option', 'dealer');
        setValue('spk_delivery_name', data?.spk_delivery_dealer_customer_name);
        setValue(
          'spk_delivery_phone_number',
          data?.spk_delivery_dealer_no_phone,
        );
      } else if (deliveryData?.spk_delivery_type === 'domicile') {
        const data = deliveryData?.spk_delivery_domicile;
        setValue('spk_delivery_pickup_option', 'domicile');
        setValue(
          'spk_delivery_name',
          data?.spk_delivery_domicile_customer_name,
        );
        setValue('spk_delivery_address', data?.spk_delivery_domicile_address);
        setValue('spk_delivery_city', data?.spk_delivery_domicile_city);
      }
      setValue('spk_transaction_leasing', {
        label: transactionData?.leasing_name,
        value: {
          leasing_name: transactionData?.leasing_name,
          leasing_id: transactionData?.leasing_id,
        },
      });
      setValue('spk_transaction_tenor', {
        label: transactionData?.spk_transaction_tenor,
        value: {
          tenor_amount: transactionData?.spk_transaction_tenor,
        },
      });
      setValue('spk_transaction_microfinance', {
        label: transactionData?.microfinance_name,
        value: {
          microfinance_name: transactionData?.microfinance_name,
          microfinance_id: transactionData?.micro_finance_id,
        },
      });
      setValue(
        'spk_transaction_payment_method',
        transactionData?.spk_transaction_method_payment,
      );
      setValue(
        'spk_transaction_method_buying',
        transactionData?.spk_transaction_method_buying,
      );
      setValue(
        'spk_transaction_instalment',
        transactionData?.spk_transaction_instalment,
      );
      setValue(
        'spk_transaction_surveyor_name',
        transactionData?.spk_transaction_surveyor_name,
      );
      setValue(
        'spk_transaction_down_payment',
        transactionData?.spk_transaction_down_payment,
      );
      setValue('spk_customer_province', {
        label: customerData?.province,
        value: {
          province_id: customerData?.province_id,
          province_name: customerData?.province,
        },
      });
      setValue('spk_customer_city', {
        label: customerData?.city,
        value: {
          city_id: customerData?.city_id,
          city_name: customerData?.city,
        },
      });
      setValue('spk_customer_district', {
        label: customerData?.district,
        value: {
          district_id: customerData?.district_id,
          district_name: customerData?.district,
        },
      });
      setValue('spk_customer_sub_district', {
        label: customerData?.sub_district,
        value: {
          sub_district_id: customerData?.sub_district_id,
          sub_district_name: customerData?.sub_district,
        },
      });
      setValue('spk_customer_marital', {
        label: customerData?.marital_name,
        value: {
          marital_id: customerData?.marital_id,
          marital_name: customerData?.marital_name,
        },
      });
      setValue('spk_customer_hobby', {
        label: customerData?.hobbies_name,
        value: {
          hobbies_id: customerData?.hobbies_id,
          hobbies_name: customerData?.hobbies_name,
        },
      });
      setValue('spk_customer_residence', {
        label: customerData?.residence_name,
        value: {
          residence_id: customerData?.residence_id,
          residence_name: customerData?.residence_name,
        },
      });
      setValue('spk_customer_education', {
        label: customerData?.education_name,
        value: {
          education_id: customerData?.education_id,
          education_name: customerData?.education_name,
        },
      });
      setValue('spk_customer_work', {
        label: customerData?.work_name,
        value: {
          occupation_id: customerData?.work_id,
          occupation_name: customerData?.work_name,
        },
      });
      setValue('spk_customer_expenditure', {
        label: customerData?.spk_customer_outcome,
        value: {
          expenditure_amount: customerData?.spk_customer_outcome,
        },
      });
      setValue('spk_customer_income', {
        label: customerData?.spk_customer_income,
        value: {
          income_amount: customerData?.spk_customer_income,
        },
      });
      setValue('spk_customer_previous_brand', {
        label: customerData?.motor_brand_name,
        value: {
          motor_brand_id: customerData?.motor_brand_id,
          motor_brand_name: customerData?.motor_brand_name,
        },
      });

      setValue('spk_customer_nik', customerData?.spk_customer_nik);
      setValue('spk_customer_name', customerData?.spk_customer_name);
      setValue('spk_customer_address', customerData?.spk_customer_address);
      setValue(
        'spk_customer_post_code',
        customerData?.spk_customer_postal_code,
      );
      setValue(
        'spk_customer_place_of_birth',
        customerData?.spk_customer_birth_place,
      );
      setValue(
        'spk_customer_date_of_birth',
        customerData?.spk_customer_birth_date,
      );
      setValue('spk_customer_gender', customerData?.spk_customer_gender);
      setValue(
        'spk_customer_telephone_number',
        customerData?.spk_customer_telp,
      );
      setValue(
        'spk_customer_phone_number',
        customerData?.spk_customer_no_phone,
      );
      setValue('spk_customer_wa_number', customerData?.spk_customer_no_wa);
      setValue('spk_customer_religion', customerData?.spk_customer_religion);
      setValue(
        'spk_customer_birth_mother',
        customerData?.spk_customer_mother_name,
      );
      setValue('spk_customer_npwp', customerData?.spk_customer_npwp);
      setValue('spk_customer_email', customerData?.spk_customer_email);
      setValue(
        'spk_customer_length_of_work',
        customerData?.spk_customer_length_of_work,
      );
      setValue(
        'spk_customer_previous_type',
        customerData?.spk_customer_motor_type_before,
      );
      setValue(
        'spk_customer_previous_motor_year',
        customerData?.spk_customer_motor_year_before,
      );
      setValue('spk_legal_province', {
        label: legalData?.province,
        value: {
          province_name: legalData?.province,
          province_id: legalData?.province_id,
        },
      });
      setValue('spk_legal_city', {
        label: legalData?.city,
        value: {
          city_name: legalData?.city,
          city_id: legalData?.city_id,
        },
      });
      setValue('spk_legal_district', {
        label: legalData?.district,
        value: {
          district_name: legalData?.district,
          district_id: legalData?.district_id,
        },
      });
      setValue('spk_legal_sub_district', {
        label: legalData?.sub_district,
        value: {
          sub_district_name: legalData?.sub_district,
          sub_district_id: legalData?.sub_district_id,
        },
      });
      setValue('spk_legal_nik', legalData?.spk_legal_nik);
      setValue('spk_legal_name', legalData?.spk_legal_name);
      setValue('spk_legal_address', legalData?.spk_legal_address);
      setValue('spk_legal_post_code', legalData?.spk_legal_postal_code);
      setValue('spk_legal_place_of_birth', legalData?.spk_legal_birth_place);
      setValue('spk_legal_gender', legalData?.spk_legal_gender);
      setValue('spk_legal_telephone_number', legalData?.spk_legal_telp);
      setValue('spk_legal_phone_number', legalData?.spk_legal_no_phone);
      setValue('spk_pricing_broker_name', {
        label: pricingData?.spk_pricing_broker_name,
        value: {
          broker_name: pricingData?.spk_pricing_broker_name,
          broker_id: pricingData?.broker_id,
        },
      });
      setValue(
        'spk_pricing_off_the_road',
        pricingData?.spk_pricing_off_the_road,
      );
      setValue('spk_pricing_bbn', pricingData?.spk_pricing_bbn);
      setValue('spk_pricing_on_the_road', pricingData?.spk_pricing_on_the_road);
      setValue(
        'spk_pricing_on_the_road_note',
        pricingData?.spk_pricing_on_the_road_note,
      );
      setValue('spk_pricing_indent', pricingData?.spk_pricing_indent_nominal);
      setValue('spk_pricing_indent_note', pricingData?.spk_pricing_indent_note);
      setValue('spk_pricing_discount', pricingData?.spk_pricing_discount);
      setValue(
        'spk_pricing_discount_note',
        pricingData?.spk_pricing_discount_note,
      );
      setValue('spk_pricing_subsidi', pricingData?.spk_pricing_subsidi);
      setValue(
        'spk_pricing_subsidi_note',
        pricingData?.spk_pricing_subsidi_note,
      );
      setValue('spk_pricing_booster', pricingData?.spk_pricing_booster);
      setValue(
        'spk_pricing_booster_note',
        pricingData?.spk_pricing_booster_note,
      );
      setValue('spk_pricing_commission', pricingData?.spk_pricing_commission);
      setValue(
        'spk_pricing_commission_note',
        pricingData?.spk_pricing_commission_note,
      );
      setValue(
        'spk_pricing_surveyor_commission',
        pricingData?.spk_pricing_commission_surveyor,
      );
      setValue(
        'spk_pricing_surveyor_commission_note',
        pricingData?.spk_pricing_surveyor_commission_note,
      );
      setValue(
        'spk_pricing_broker_commission',
        pricingData?.spk_pricing_broker_commission,
      );
      setValue('spk_pricing_broker_note', pricingData?.spk_pricing_broker_note);
      setValue(
        'spk_pricing_broker_commission_note',
        pricingData?.spk_pricing_broker_commission_note,
      );
      setValue('spk_pricing_cashback', pricingData?.spk_pricing_cashback);
      setValue(
        'spk_pricing_cashback_note',
        pricingData?.spk_pricing_cashback_note,
      );
      setValue('spk_pricing_delivery', pricingData?.spk_pricing_delivery_cost);
      setValue(
        'spk_pricing_delivery_cost_note',
        pricingData?.spk_pricing_delivery_cost_note,
      );
      data?.data?.spk_pricing_additional?.forEach(
        (item: any, index: number) => {
          setValue(
            `spk_pricing_additional.${index}.additional_price`,
            item?.spk_pricing_additional_price,
          );
          setValue(
            `spk_pricing_additional.${index}.id`,
            item?.spk_pricing_additional_id,
          );
          setValue(
            `spk_pricing_additional.${index}.additional_note`,
            item?.spk_pricing_additional_note,
          );
        },
      );
      data?.data?.spk_pricing_accecories?.forEach(
        (item: any, index: number) => {
          setValue(
            `spk_pricing_accessories.${index}.accessories_price`,
            item?.spk_pricing_accecories_price,
          );
          setValue(
            `spk_pricing_accessories.${index}.id`,
            item?.spk_pricing_accecories_id,
          );
          setValue(
            `spk_pricing_accessories.${index}.accessories_note`,
            item?.spk_pricing_accecories_note,
          );
        },
      );
    }
  }, [onEditShow]);

  useEffect(() => {
    if (indent) {
      methods.setValue('spk_pricing_indent', indent?.value?.amount_total);
    } else {
      methods.setValue('spk_pricing_indent', 0);
    }
  }, [indent]);

  const onSubmitEdit = (data: any) => {
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
      icon: 'info',
      text: text,
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#D40000',
      confirmButtonText: 'YES',
      confirmButtonColor: '#00029D',
    }).then((result) => {
      if (result.isConfirmed) {
        onSubmitEditingData(data);
      }
    });
  };
  const { bbn, off_the_road, discount } = usePricingUpdate(
    buy_method,
    location,
    motor,
  );

  useEffect(() => {
    const setValue = methods.setValue;

    if (!motor) {
      setValue('spk_pricing_off_the_road', 0);
      setValue('spk_pricing_bbn', 0);
      setValue('spk_pricing_on_the_road', 0);
    } else {
      setValue('spk_pricing_off_the_road', off_the_road || 0);
      setValue('spk_pricing_discount', discount || 0);
      if (buy_method === 'off_the_road') {
        setValue('spk_pricing_bbn', 0);
        setValue('spk_pricing_on_the_road', off_the_road || 0);
      } else {
        setValue('spk_pricing_bbn', bbn);
        setValue('spk_pricing_on_the_road', (off_the_road || 0) + (bbn || 0));
      }
      // setValue('spk_pricing_bbn', bbnValue);
    }
  }, [motor, location?.type, buy_method]);

  const { mutate: onSubmitEditingData } = useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();

      if (files?.kkFiles instanceof File) {
        formData.append('spk_additional_document_kk', files.kkFiles);
      }

      // Append KTP file if it exists
      if (files?.ktpFiles instanceof File) {
        formData.append('spk_additional_document_ktp', files.ktpFiles);
      }

      // Append additional files if they exist
      if (files?.additionalFiles) {
        files.additionalFiles.forEach((file: any, index: number) => {
          if (file?.file instanceof File) {
            formData.append(
              `spk_additional_document_another[${index}]`,
              file?.file,
            );
          }
        });
      }

      // Append delivery files if they exist
      if (files?.deliveryFiles) {
        files.deliveryFiles.forEach((file: any, index: number) => {
          if (file?.file instanceof File) {
            formData.append(`spk_delivery_file_sk[${index}]`, file?.file);
          }
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
        if (item?.id) {
          formData.append(
            `spk_pricing_accecories_price[${index}][spk_pricing_accecories_id]`,
            item?.id,
          );
        }
      });
      data?.spk_pricing_additional?.forEach((item: any, index: number) => {
        formData.append(
          `spk_pricing_additional_price[${index}][price]`,
          numberFormatter(item?.additional_price).toString(),
        );
        formData.append(
          `spk_pricing_additional_price[${index}][note]`,
          item?.additional_note || '',
        );
        if (item?.id) {
          formData.append(
            `spk_pricing_additional_price[${index}][spk_pricing_additional_id]`,
            item?.id,
          );
        }
      });
      console.log(data?.spk_general_location);

      const restructured_data = {
        spk_general_location: data?.spk_general_location?.type,
        sales_name: data?.spk_general_salesman?.value?.salesman_name,
        sales_id: data?.spk_general_salesman?.value?.salesman_id,
        spk_general_date: dayjsFormatInputDate(data?.spk_general_date),
        indent_id: data?.spk_general_indent?.value?.indent_id || null,
        spk_general_method_sales:
          data?.spk_general_sales_method?.value?.method_sales_name,
        dealer_id:
          data?.spk_general_location?.value?.dealer_id ||
          data?.spk_general_location?.value,
        ...(data?.spk_general_location?.type === 'neq' && {
          dealer_neq_id: data?.spk_general_location?.value?.dealer_neq_id,
        }),
        // end of general
        color_id: data?.spk_unit_color?.value?.color_id,
        motor_id: data?.spk_unit_motor?.value?.motor_id,
        // end of unit
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
        //end of transaction
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
        marital_name: data?.spk_customer_marital?.value?.marital_name,
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
        work_name: data?.spk_customer_work?.value?.occupation_name,
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
        // end of customer
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
        // end of legal
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
        spk_pricing_commission_surveyor: 0,
        spk_pricing_broker_name:
          data?.spk_pricing_broker_name?.value?.broker_name,
        broker_id: data?.spk_pricing_broker_name?.value?.broker_id,
        spk_pricing_broker_commission: numberFormatter(
          data?.spk_pricing_broker_commission,
        ),
        spk_pricing_cashback: numberFormatter(data?.spk_pricing_cashbackn),
        spk_pricing_delivery_cost: numberFormatter(data?.spk_pricing_delivery),
        spk_pricing_on_the_road_note: data?.spk_pricing_on_the_road_note,
        spk_pricing_discount_note: data?.spk_pricing_discount_note,
        spk_pricing_subsidi_note: data?.spk_pricing_subsidi_note,
        spk_pricing_booster_note: data?.spk_pricing_booster_note,
        spk_pricing_commission_note: data?.spk_pricing_commission_note,
        spk_pricing_surveyor_commission_note:
          data?.spk_pricing_surveyor_commission_note,
        spk_pricing_broker_note: data?.spk_pricing_broker_note,
        spk_pricing_broker_commission_note:
          data?.spk_pricing_broker_commission_note,
        spk_pricing_cashback_note: data?.spk_pricing_cashback_note,
        spk_pricing_delivery_cost_note: data?.spk_pricing_delivery_cost_note,
        //end of pricing
        ...(data?.spk_delivery_pickup_option === 'ktp' && {
          spk_delivery_type: 'ktp',
          spk_delivery_ktp_customer_name: data?.spk_delivery_name,
          spk_delivery_ktp_customer_address: data?.spk_delivery_address,
          spk_delivery_ktp_city: data?.spk_delivery_city,
          spk_delivery_ktp_no_telp: data?.spk_delivery_tel_number,
          spk_delivery_ktp_no_phone: data?.spk_delivery_phone_number,
        }),
        ...(data?.spk_delivery_pickup_option === 'neq' && {
          spk_delivery_type: 'neq',
          dealer_delivery_neq_id: data?.spk_delivery_neq?.value?.dealer_neq_id,
          dealer_delivery_neq_customer_name: data?.spk_delivery_name,
          dealer_delivery_neq_customer_no_phone:
            data?.spk_delivery_phone_number,
        }),
        ...(data?.spk_delivery_pickup_option === 'dealer' && {
          spk_delivery_type: 'dealer',
          spk_delivery_dealer_customer_name: data?.spk_delivery_name,
          spk_delivery_dealer_no_phone: data?.spk_delivery_phone_number,
        }),
        ...(data?.spk_delivery_pickup_option === 'domicile' && {
          spk_delivery_type: 'domicile',
          spk_delivery_domicile_customer_name: data?.spk_delivery_name,
          spk_delivery_domicile_city: data?.spk_delivery_city,
          spk_delivery_domicile_address: data?.spk_delivery_address,
        }),
      };
      console.log({ restructured_data });

      Object.entries(restructured_data).forEach(([key, value]: any) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      handleLoading('EDIT SPK', true);
      // return;
      const response = await spk.updateSpk(id, formData);
      return response;
    },
    onSuccess: (res: any) => {
      if (res?.meta?.code === 200) {
        handleLoading('EDIT SPK', false);
        refetch();
        SweetAlert('success', 'Spk berhasil diedit', 'Sukses');
        setOnEditShow(false);
        setToggleEditGeneralInfo(false);
        setToggleEditTransactionInfo(false);
        setToggleEditUnitInfo(false);
        setToggleEditCustomerInfo(false);
        setToggleEditAdditionalFiles(false);
        setToggleEditLegalInfo(false);
        setToggleEditPricingInfo(false);
        setToggleEditDelivery(false);
      } else {
        let errorMessage = res?.response?.data?.data || 'An error occurred';
        const errorKeys = Object.keys(errorMessage);
        if (errorKeys.length > 0) {
          errorMessage = errorMessage[errorKeys[0]][0]; // Get the first error message from the first error key
        }
        SweetAlert('error', errorMessage, 'Error');
        handleLoading('EDIT SPK', false);
      }
    },
    onError: (error: any) => {
      handleLoading('EDIT SPK', false);
      SweetAlert('error', error, 'Error');
    },
  });

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

  const offTheRoad = useWatch({
    control: methods.control,
    name: 'spk_pricing_off_the_road',
  });

  const bbnValue = useWatch({
    control: methods.control,
    name: 'spk_pricing_bbn',
  });
  const onTheRoad = offTheRoad + bbnValue;
  useEffect(() => {
    methods.setValue('spk_pricing_on_the_road', onTheRoad);
  }, [offTheRoad, onTheRoad]);

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
    if (!legalProvince) {
      setValue('spk_legal_city', null);
      setValue('spk_legal_district', null);
      setValue('spk_legal_sub_district', null);
    } else if (!legalCity) {
      setValue('spk_legal_district', null);
      setValue('spk_legal_subdistrict', null);
    } else if (!legalDistict) {
      setValue('spk_legal_subdistrict', null);
    }
  }, [legalProvince, legalCity, legalDistict]);

  const navigate = useNavigate();

  const { mutate: handleSpkStatus } = useMutation({
    mutationFn: async (data: { spk_status: string }) => {
      if (data?.spk_status === 'cancel') {
        handleLoading('VOID SPK', true);
      } else {
        handleLoading('FINANCE APPROVE', true);
      }
      const response = await spk.updateStatusSpk(id!, data);
      return response;
    },
    onSuccess: (res: any) => {
      if (res.meta.code === 200) {
        handleLoading('VOID SPK', false);
        handleLoading('FINANCE APPROVE', false);
        SweetAlert('success', 'Status SPK diubah', 'Sukses');
        refetch();
      }
    },
  });

  const onChangeStatusSpk = (status: any) => {
    Swal.fire({
      title: 'Change SPK status?',
      text:
        status === `finance_check`
          ? `Approve SPK ${data?.data?.spk_number} ?`
          : `Void SPK ${data?.data?.spk_number} ?`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#D40000',
      confirmButtonText: 'YES',
      confirmButtonColor: '#00029D',
    }).then((result) => {
      if (result.isConfirmed) {
        const data: { spk_status: string } = {
          spk_status: status,
        };
        handleSpkStatus(data);
      }
    });
  };

  const { mutate: deleteSpk } = useMutation({
    mutationFn: async () => {
      handleLoading('DELETE SPK', true);
      const response = await spk.deleteSpk(id!);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        handleLoading('DELETE SPK', false);
        SweetAlert('success', 'SPK dihapus', 'success');
        navigate('/transaction/spk-regular');
      }
    },
    onError: (res: any) => {
      handleLoading('DELETE SPK', false);
      SweetAlert('error', res, 'error');
    },
  });

  const onDeleteSpk = () => {
    Swal.fire({
      title: 'Hapus Spk?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#D40000',
      confirmButtonText: 'YES',
      confirmButtonColor: '#00029D',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSpk();
      }
    });
  };
  const spk_data = data?.data;

  return isLoading ? (
    <Container>
      <div className="grid grid-cols-12">
        <div className="col-span-12 h-100 items-center justify-center flex">
          <Loader2 />
        </div>
      </div>
    </Container>
  ) : (
    <div>
      <Container>
        <ModalPo detailPo={data?.data} />
        <ModalImage />
        <ModalShipment detailUnit={data?.data} />
        <ModalCroCheck detailCro={data?.data} />
        <div>
          <div className="grid grid-cols-12 my-5">
            <div className="col-span-6 lg:col-span-2">
              <p className="detail-title">Nomor SPK</p>
            </div>
            <div className="col-span-6 lg:col-span-6 flex items-center gap-x-2">
              <p className="hidden lg:block detail-title">:</p>
              <p className="detail-title text-base">{data?.data?.spk_number}</p>
            </div>
            <div className="col-span-6 lg:col-span-2">
              <p className="detail-title">Status SPK</p>
            </div>
            <div className="col-span-6 lg:col-span-2 flex items-center gap-x-2">
              <p className="hidden lg:block detail-title">:</p>
              <p className="detail-title">{data?.data?.spk_status}</p>
            </div>
          </div>
        </div>
        <FormProvider {...methods}>
          <TabViews>
            {/* @ts-ignore */}
            <div label="GENERAL & TRANSACTION">
              <div className="grid grid-cols-2 gap-y-5 gap-x-10">
                <div className="col-span-2 lg:col-span-1 mt-8">
                  {toggleEditGeneralInfo ? (
                    <FormGeneralInfo />
                  ) : (
                    <DetailGeneral
                      onEditDetailGeneral={handleEditDetailGeneral}
                      isEditGeneralData={toggleEditGeneralInfo}
                      detailGeneral={data?.data}
                    />
                  )}
                  {toggleEditUnitInfo ? (
                    <FormUnit />
                  ) : (
                    <DetailUnit
                      onEditUnitInfo={handleToggleEditUnitInfo}
                      editUnitInfo={toggleEditUnitInfo}
                      detailUnit={data?.data}
                    />
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1 mt-8">
                  {toggleEditTransactionInfo ? (
                    <FormTransaction />
                  ) : (
                    <DetailTransaction
                      editTransactionInfo={toggleEditTransactionInfo}
                      onEditTransactionInfo={handleToggleEditTransactionInfo}
                      detailTransaction={data?.data}
                    />
                  )}
                  {data?.data?.spk_status === 'spk' && (
                    <DetailPO detailPO={data?.data} />
                  )}
                </div>
              </div>
            </div>
            {/* @ts-ignore */}
            <div label="CUSTOMER">
              <div className="grid grid-cols-2 gap-y-5 gap-x-10">
                <div className="col-span-2 lg:col-span-1 mt-8">
                  {toggleEditCustomerInfo ? (
                    <FormCustomerInfo />
                  ) : (
                    <DetailCustomer
                      editDetailCustomerInfo={toggleEditCustomerInfo}
                      onEditDetailCustomerInfo={handleToggleEditCustomerInfo}
                      detailCustomer={data?.data}
                    />
                  )}
                </div>
                <div className="col-span-2 lg:col-span-1 mt-8">
                  {toggleEditLegalInfo ? (
                    <FormLegal />
                  ) : (
                    <DetailLegal
                      editLegalInfo={toggleEditLegalInfo}
                      onEditLegalInfo={handleToggleEditLegalData}
                      detailLegal={data?.data}
                    />
                  )}
                  {toggleEditAdditionalFiles ? (
                    <FormAdditionalFiles
                      editCustomerFiles={toggleEditAdditionalFiles}
                      onEditCustomerFiles={(value: any) => {
                        setOnEditShow(true);
                        setToggleEditAdditionalFiles(value);
                      }}
                      customerFiles={files}
                      onChangeCustomerFiles={handleOnChangeCustomerFiles}
                      detailAdditionalFile={data?.data}
                    />
                  ) : (
                    <DetailAdditionalFiles
                      editCustomerFiles={toggleEditAdditionalFiles}
                      onEditCustomerFiles={(value: any) => {
                        setOnEditShow(true);
                        setToggleEditAdditionalFiles(value);
                      }}
                      customerFiles={files}
                      onChangeCustomerFiles={handleOnChangeCustomerFiles}
                      detailAdditionalFile={data?.data}
                    />
                  )}
                </div>
              </div>
            </div>
            {/* @ts-ignore */}
            <div label="PRICING">
              {toggleEditPricingInfo ? (
                <FormPricingInfo
                  bbnValue={bbn}
                  offTheRoad={off_the_road}
                  detailPricing={data?.data}
                  onAddAditionalPriceInput={setAdditionalPriceInput}
                  additionalPriceInput={additionalPriceInput}
                  accessoriesPriceInput={accessoriesPriceInput}
                  onAddAccessoriesInput={setAccessoriesPriceInput}
                  motor={unitData?.motor}
                />
              ) : (
                <DetailPricingInfo
                  editPricingInfo={toggleEditPricingInfo}
                  onEditPricingInfo={handleToggleEditPricingInfo}
                  detailPricing={data?.data}
                  additionalPriceInput={data?.data?.spk_pricing_additional}
                  accessoriesPriceInput={data?.data?.spk_pricing_accecories}
                />
              )}
            </div>
            {/* @ts-ignore */}
            <div label="DELIVERY">
              {toggleEditDelivery ? (
                <FormDelivery
                  customerFiles={files}
                  onChangeCustomerFiles={handleOnChangeCustomerFiles}
                  detailDelivery={data?.data}
                />
              ) : (
                <DetailDelivery
                  editDeliveryInfo={toggleEditDelivery}
                  onEditDeliveryInfo={handleToggleEditDeliveryInfo}
                  customerFiles={files}
                  onChangeCustomerFiles={files}
                  detailDelivery={data?.data}
                />
              )}
            </div>
          </TabViews>
        </FormProvider>
      </Container>
      {onEditShow && (
        <Container className="mt-5">
          <div className="grid grid-cols-1 lg:flex gap-y-5 gap-x-4 ">
            <Button
              label="EDIT SPK"
              className={'btn-edit w-auto'}
              onClick={methods.handleSubmit(onSubmitEdit)}
            />
            <Button
              label="CANCEL"
              className={'btn-delete w-auto'}
              onClick={() => onCancelEdit()}
            />
          </div>
        </Container>
      )}
      {!onEditShow && (
        <Container className="mt-5">
          <div className="grid grid-cols-1 lg:flex gap-5 flex-wrap">
            {backBtn({ onClick: () => navigate(-1) })}
            {spk_data?.spk_status === 'spk' && (
              <Button
                label="VOID SPK"
                className={'btn-delete w-auto'}
                onClick={() => onChangeStatusSpk('cancel')}
              />
            )}
            {spk_data?.is_cro_check !== null && (
              <Button
                label="CRO CHECK"
                className={'btn-edit w-auto'}
                onClick={() => handleModal('modalCroCheck', true)}
              />
            )}
            {spk_data?.spk_status !== 'spk' && (
              <Button
                label="DELETE SPK"
                className={'btn-delete w-auto'}
                onClick={() => onDeleteSpk()}
              />
            )}
            {printBtn({ onClick: () => window.alert('print') })}
            {spk_data?.spk_status === 'finance_check' && (
              <Button
                label="SHIPMENT"
                className="btn-confirm w-auto"
                onClick={() => handleModal('modalShipmentRegular', true)}
              />
            )}
            {spk_data?.spk_status === 'create' && (
              <Button
                label="FINANCE APPROVE"
                className="btn-confirm w-auto"
                onClick={() => onChangeStatusSpk('finance_check')}
              />
            )}
            {
              spk_data?.spk_status === 'spk' && (
                <Button
                  isButton={false}
                  to={`/units/unit-delivery/new/?type=spk&id=${id}`}
                  label="SURAT JALAN"
                  className="btn-confirm  w-full lg:w-auto"
                />
              )
              // createDeliveryBtn({
              //   onClick: () =>
              //     navigate(`/units/unit-delivery/new/?type=spk&id=${id}`),
              // })
            }
          </div>
          <div className="grid grid-cols-12 gap-5 mt-8">
            <div className="col-span-12">
              <p className="detail-title">Log SPK</p>
              <Table
                headers={headers}
                data={data?.data?.spk_log?.map((item: any) => ({
                  ...item,
                  created_at: (
                    <span>{dayjsFormatDateTime(item.created_at)}</span>
                  ),
                  // neq_log_action: (
                  //   <span>{statusEvent(item.neq_return_log_action)}</span>
                  // ),
                }))}
              />
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};

const headers = [
  { title: 'TANGGAL', key: 'created_at' },
  { title: 'STAFF', key: 'user.username' },
  { title: 'AKSI', key: 'spk_log_action' },
];

export default SpkRegularDetail;
