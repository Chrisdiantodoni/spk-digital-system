import { useEffect } from 'react';
import Container from '../../../components/Container';
import createStore from '../../../context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import spk from '../../../Services/API/transaction/spk';
import { useNavigate, useParams } from 'react-router-dom';
import Loader2 from '../../../common/Loader/Loader';
import { formatRupiah } from '../../../utils/formatter';
import Button from '../../../components/Forms/Button/Button';
import Table from '../../../components/Tables/Table';
import { dayJsFormatDate, dayjsFormatDateTime } from '../../../utils/dayjs';
import { Printer, Trash } from 'react-bootstrap-icons';
import LoaderButton from '../../../common/Loader/LoaderButton';
import ModalImage from '../../../components/Modal/Preview/ModalImage';
import ModalPaymentIndent from '../../../components/Modal/transaction/ModalPaymentIndent';
import ModalRefundIndent from '../../../components/Modal/transaction/ModalRefundIndent';
import Swal from 'sweetalert2';
import { SweetAlert } from '../../../utils/Swal';

const PaymentRegularDetail = () => {
  const { setTitle, handleModal } = createStore();
  useEffect(() => {
    setTitle('DETAIL PAYMENT');
  }, []);
  const { id } = useParams();
  const loadingRefundPayment = false;
  const handleLoadingButton = createStore((state: any) => state.handleLoading);

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['detail_payment'],
    queryFn: async () => {
      const response = await spk.getSpkRegularPaymentDetail(id);
      return response;
    },
  });

  const dataPaymentRegular = data?.data;

  const handleSpkPaymentType = () => {
    switch (dataPaymentRegular?.spk_payment_type) {
      case 'cash':
        return 'CASH';
      case 'dp':
        return 'DOWN PAYMENT';
      case 'leasing':
        return 'LEASING';
      default:
        break;
    }
  };

  const navigate = useNavigate();

  const handleTotalAccessories = () => {
    const totalAccessoriesPrice =
      dataPaymentRegular?.spk?.spk_pricing_accecories?.reduce(
        (total: number, price: { spk_pricing_accecories_price: number }) =>
          total + price?.spk_pricing_accecories_price || 0,
        0,
      );
    return totalAccessoriesPrice;
  };

  const handleTotalPayed = () => {
    const totalPayment = dataPaymentRegular?.spk_payment_list?.reduce(
      (total: number, price: { spk_payment_list_amount: number }) =>
        total + price?.spk_payment_list_amount || 0,
      0,
    );
    return totalPayment;
  };

  const queryClient = useQueryClient();

  const { mutate: handleDeleteSpkPayment } = useMutation({
    mutationFn: async (id: string) => {
      const response = await spk.deleteSpkPayment(id);
      return response;
    },
    onSuccess: (res: any) => {
      if (res.meta.code === 200) {
        queryClient.invalidateQueries({ queryKey: ['detail_payment'] });
      }
    },
  });

  const { mutate: handleChangeStatusPayment } = useMutation({
    mutationFn: async (spk_payment_status: any) => {
      const body = {
        spk_payment_status: spk_payment_status,
      };
      if (spk_payment_status === 'cashier_check') {
        handleLoadingButton('KASIR APPROVE', true);
      } else {
        handleLoadingButton('FINANCE APPROVE', true);
      }
      const response = await spk.updateSpkPaymentStatus(id, body);
      return response;
    },
    onSuccess: (res) => {
      if (res?.meta?.code === 200) {
        handleLoadingButton('KASIR APPROVE', false);
        handleLoadingButton('FINANCE APPROVE', false);
        SweetAlert('success', 'Pembayaran diupdate', 'Sukses');
        refetch();
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleRequest = (status?: string) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'NO',
      cancelButtonColor: '#D40000',
      confirmButtonText: 'YES',
      confirmButtonColor: '#00029D',
    }).then((result) => {
      if (result.isConfirmed) {
        handleChangeStatusPayment(status);
      }
    });
  };

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
      <ModalImage />
      <ModalPaymentIndent
        type={'spk'}
        items={{
          amount_remaining:
            dataPaymentRegular?.spk_payment_amount_total - handleTotalPayed(),
        }}
      />
      <ModalRefundIndent id={id} />
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2 lg:col-span-1">
          <div className="grid grid-cols-12  gap-6">
            <div className="col-span-12 lg:col-span-12">
              <p className="detail-title">DETAIL PEMBAYARAN</p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Pembayar</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {dataPaymentRegular?.spk_payment_for?.toUpperCase()}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Jenis</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">: {handleSpkPaymentType()}</p>
            </div>
            <div className="col-span-12 lg:col-span-12 mt-8">
              <p className="detail-title">DETAIL SPK</p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">No. SPK</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {dataPaymentRegular?.spk?.spk_number}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Metode Pembayaran</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                :{' '}
                {dataPaymentRegular?.spk?.spk_transaction
                  ?.spk_transaction_method_payment === 'cash'
                  ? 'CASH'
                  : 'CREDIT'}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Tipe Motor</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {dataPaymentRegular?.spk?.spk_unit?.motor?.motor_name}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Warna</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {dataPaymentRegular?.spk?.spk_unit?.color?.color_name}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">No. Rangka</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {dataPaymentRegular?.spk?.spk_unit?.unit?.unit_frame}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">No. Mesin</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {dataPaymentRegular?.spk?.spk_unit?.unit?.unit_engine}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Tahun Produksi</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {dataPaymentRegular?.spk?.spk_unit?.spk_unit_year}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Konsumen</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {dataPaymentRegular?.spk?.spk_customer?.spk_customer_name}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Nama STNK</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {dataPaymentRegular?.spk?.spk_legal?.spk_legal_name}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">No. Telp</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {dataPaymentRegular?.spk?.spk_customer?.spk_customer_telp}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">No. Ponsel</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {dataPaymentRegular?.spk?.spk_customer?.spk_customer_no_phone}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1 mt-8 lg:mt-0">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-12 flex justify-between">
              <p className="detail-title">DETAIL HARGA</p>
              <p className="detail-title">
                {dataPaymentRegular?.spk_payment_status}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Off The Road</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                :{' '}
                {formatRupiah(
                  dataPaymentRegular?.spk?.spk_pricing?.spk_pricing_on_the_road,
                )}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">BBN</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                :{' '}
                {formatRupiah(
                  dataPaymentRegular?.spk?.spk_pricing?.spk_pricing_bbn,
                )}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">On The Road</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                :{' '}
                {formatRupiah(
                  dataPaymentRegular?.spk?.spk_pricing?.spk_pricing_on_the_road,
                )}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Indent</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                :{' '}
                {formatRupiah(
                  dataPaymentRegular?.spk?.spk_pricing
                    ?.spk_pricing_indent_nominal,
                )}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Discount</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                :{' '}
                {formatRupiah(
                  dataPaymentRegular?.spk?.spk_pricing?.spk_pricing_discount,
                )}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Over Discount</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                :{' '}
                {formatRupiah(
                  dataPaymentRegular?.spk?.spk_pricing
                    ?.spk_pricing_over_discount,
                )}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Subsidi</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                :{' '}
                {formatRupiah(
                  dataPaymentRegular?.spk?.spk_pricing?.spk_pricing_subsidi,
                )}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Booster</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                :{' '}
                {formatRupiah(
                  dataPaymentRegular?.spk?.spk_pricing?.spk_pricing_booster,
                )}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Komisi</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                :{' '}
                {formatRupiah(
                  dataPaymentRegular?.spk?.spk_pricing?.spk_pricing_commission,
                )}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Komisi Broker</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                :{' '}
                {formatRupiah(
                  dataPaymentRegular?.spk?.spk_pricing
                    ?.spk_pricing_broker_commission,
                )}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Biaya Pengantaran</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                :{' '}
                {formatRupiah(
                  dataPaymentRegular?.spk?.spk_pricing
                    ?.spk_pricing_delivery_cost,
                )}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Total Aksesoris</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {formatRupiah(handleTotalAccessories())}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Nominal</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {formatRupiah(dataPaymentRegular?.spk_payment_amount_total)}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Pembayaran</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                : {formatRupiah(handleTotalPayed())}
              </p>
            </div>
            <div className="lg:col-span-6 col-span-6">
              <p className="detail-label">Sisa</p>
            </div>
            <div className="col-span-6 lg:col-span-6">
              <p className="detail-label">
                :{' '}
                {formatRupiah(
                  dataPaymentRegular?.spk_payment_amount_total -
                    handleTotalPayed(),
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="grid grid-cols-1 lg:flex flex-wrap gap-5">
            <Button
              className="btn-back w-auto"
              label="BACK"
              onClick={() => navigate(-1)}
            />
            {dataPaymentRegular?.spk_payment_status !== 'cancel' && (
              <>
                <Button
                  className="btn-edit w-auto"
                  label="PRINT"
                  onClick={() => navigate(-1)}
                />
                <Button
                  className="btn-payment w-auto"
                  label="PAYMENT"
                  onClick={() =>
                    handleModal('modalPaymentIndent', true, '', 'spk')
                  }
                />
                {dataPaymentRegular?.spk_payment_status === 'unpaid' &&
                  dataPaymentRegular?.spk_payment_list?.length > 0 && (
                    <Button
                      className="btn-confirm w-auto"
                      label="KASIR APPROVE"
                      onClick={() => handleRequest('cashier_check')}
                    />
                  )}
                {dataPaymentRegular?.spk_payment_status === 'cashier_check' && (
                  <Button
                    className="btn-confirm w-auto"
                    label="FINANCE APPROVE"
                    onClick={() => handleRequest('finance_check')}
                  />
                )}
                {dataPaymentRegular?.spk_payment_status === 'finance_check' && (
                  <Button
                    label="REFUND"
                    className={'btn-request w-full lg:w-auto'}
                    onClick={() =>
                      handleModal('modalRefundIndent', true, '', 'spk')
                    }
                  />
                )}
              </>
            )}
          </div>
        </div>
        <div className="col-span-2 mt-5">
          <p className="detail-title">List Detail Pembayaran</p>
        </div>
        <div className="col-span-2">
          <Table
            headers={headersPayment}
            data={dataPaymentRegular?.spk_payment_list?.map(
              (item: any, index: number) => ({
                ...item,
                no: <span>{index + 1}</span>,
                spk_payment_number: (
                  <span>{item?.spk_payment_list_number}</span>
                ),
                spk_payment_date: (
                  <span>{dayJsFormatDate(item?.spk_payment_list_date)}</span>
                ),
                spk_payment_method: (
                  <span>{item?.spk_payment_list_method}</span>
                ),
                spk_payment_nominal: (
                  <span className="whitespace-nowrap">
                    {formatRupiah(item?.spk_payment_list_amount)}
                  </span>
                ),
                spk_payment_bank: <span>{item?.bank?.bank_name}</span>,
                proof_images: item?.spk_payment_list_img && (
                  <Button
                    label="[Lihat]"
                    className={
                      'text-black hover:underline text-center flex w-full'
                    }
                    onClick={() =>
                      handleModal('modalImage', true, item?.indent_payment_img)
                    }
                  />
                ),
                action: (
                  <div className="gap-2 flex justify-center ">
                    {dataPaymentRegular?.spk_payment_status === 'unpaid' &&
                      (loadingRefundPayment ? (
                        <LoaderButton
                          className="btn-delete w-auto"
                          without_label={true}
                        />
                      ) : (
                        <Button
                          label=""
                          Icon={<Trash size={18} />}
                          className={'btn-delete w-auto'}
                          onClick={() =>
                            handleDeleteSpkPayment(item?.spk_payment_list_id)
                          }
                        />
                      ))}
                    <Button
                      label=""
                      Icon={<Printer size={18} />}
                      className={'btn-primary w-auto'}
                      //   onClick={() =>
                      //     handlePrinteachPaymentInvoice(item?.indent_payment_id)
                      //   }
                    />
                  </div>
                ),
              }),
            )}
          />
        </div>
        {dataPaymentRegular?.spk_payment_refund?.length !== 0 && (
          <>
            <div className="col-span-2 mt-5">
              <p className="detail-title">List Refund</p>
            </div>
            <div className="col-span-2">
              <Table
                headers={headersRefund}
                data={dataPaymentRegular?.spk_payment_list_refund?.map(
                  (item: any, index: number) => ({
                    ...item,
                    no: <span>{index + 1}</span>,
                    nomor_refund: (
                      <span>{item?.spk_payment_list_refund_number}</span>
                    ),
                    refund_date: (
                      <span>{dayJsFormatDate(item.created_at)}</span>
                    ),
                    spk_payment_list_refund_amount_total: (
                      <span>
                        {formatRupiah(
                          item?.spk_payment_list_refund_amount_total,
                        )}
                      </span>
                    ),
                    note: <span>{item?.spk_payment_list_refund_note}</span>,
                  }),
                )}
              />
            </div>
          </>
        )}
        <div className="col-span-2 mt-5">
          <p className="detail-title">Log Pembayaran</p>
        </div>
        <div className="col-span-2">
          <Table
            headers={headers}
            data={dataPaymentRegular?.spk_payment_log?.map((item: any) => ({
              ...item,
              created_at: <span>{dayjsFormatDateTime(item.created_at)}</span>,
              spk_log_action: <span>{item.spk_payment_log_action}</span>,
            }))}
          />
        </div>
      </div>
    </Container>
  );
};

const headers = [
  { title: 'TANGGAL', key: 'created_at' },
  { title: 'STAFF', key: 'user.username' },
  { title: 'AKSI', key: 'spk_log_action' },
];

const headersPayment = [
  { title: 'NO.', key: 'no' },
  { title: 'NOMOR', key: 'spk_payment_number' },
  { title: 'TANGGAL BAYAR', key: 'spk_payment_date' },
  { title: 'NOMINAL', key: 'spk_payment_nominal' },
  { title: 'METODE BAYAR', key: 'spk_payment_method' },
  { title: 'BANK', key: 'spk_payment_bank' },
  { title: 'BUKTI BAYAR', key: 'proof_images' },
  { title: 'AKSI', key: 'action' },
];

const headersRefund = [
  { title: 'NO.', key: 'no' },
  { title: 'NOMOR', key: 'nomor_refund' },
  { title: 'TANGGAL REFUND', key: 'refund_date' },
  { title: 'NOMINAL', key: 'spk_payment_list_refund_amount_total' },
  { title: 'ALASAN', key: 'note' },
];

export default PaymentRegularDetail;
