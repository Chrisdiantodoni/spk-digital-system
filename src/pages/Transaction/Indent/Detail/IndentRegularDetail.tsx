import { useMutation, useQuery } from '@tanstack/react-query';
import Container from '../../../../components/Container';
import createStore from '../../../../context';
import { useEffect, useState } from 'react';
import Loader2 from '../../../../common/Loader/Loader';
import { useNavigate, useParams } from 'react-router-dom';
import { dayJsFormatDate, dayjsFormatDateTime } from '../../../../utils/dayjs';
import Table from '../../../../components/Tables/Table';
import { statusIndent } from '../../../../utils/statusUtils';
import Swal from 'sweetalert2';
import { useButtonApproval } from '../../../../hooks/useButtonApproval';
import indent from '../../../../Services/API/transaction/indent';
import { formatRupiah } from '../../../../utils/formatter';
import ModalPaymentIndent from '../../../../components/Modal/transaction/ModalPaymentIndent';
import Button from '../../../../components/Forms/Button/Button';
import ModalPreviewImage from '../../../../components/Modal/Preview/PreviewImageModal';
import { Printer, Trash } from 'react-bootstrap-icons';
import ModalImage2 from '../../../../components/Modal/Preview/ModalImage2';
import LoaderButton from '../../../../common/Loader/LoaderButton';
import ModalRefundIndent from '../../../../components/Modal/transaction/ModalRefundIndent';

export default function IndentRegularDetail() {
  const { setTitle } = createStore();
  const handleModal = createStore((state: any) => state.handleModal);
  const [indentDetail, setIndentDetail] = useState<any>({});
  const [indentPayment, setIndentPayment] = useState<number>(0);
  const navigate = useNavigate();

  const { backBtn, paymentBtn, cancelBtn } = useButtonApproval();

  const { id } = useParams<string>();

  const { isLoading, refetch } = useQuery({
    queryKey: ['detail_indent'],
    queryFn: async () => {
      const response = await indent.getIndentDetail(id);
      if (response?.meta.code === 200) {
        setIndentDetail(response?.data);
        const totalPayment = response?.data?.indent_payment?.reduce(
          (total: any, payment: any) =>
            total + payment?.indent_payment_amount || 0,
          0,
        );

        setIndentPayment(totalPayment);
      }
      return true;
    },
  });

  const { mutate: handleDeletePaymentIndent, isPending: loadingRefundPayment } =
    useMutation({
      mutationFn: async (id: string) => {
        const response = await indent.deleteRefundPayment(id);
        return response;
      },
      onSuccess: (res) => {
        if (res.meta.code === 200) {
          Swal.fire({
            title: 'Sukses!',
            text: 'Pembayaran dihapus',
            icon: 'success',
          });
          refetch();
        }
      },
    });

  const { mutate: handleRequestCancelUnit, isPending: loadingRequest } =
    useMutation({
      mutationFn: async () => {
        const response = await indent.updateIndentCancel(id);
        return response;
      },
      onSuccess: (res) => {
        if (res.meta.code === 200) {
          Swal.fire({
            title: 'Sukses!',
            text: 'Indent dibatalkan.',
            icon: 'success',
          });
        }
        refetch();
      },
    });

  const { mutate: handleRequestCheck, isPending: loadingCheck } = useMutation({
    mutationFn: async (indent_status?: string) => {
      const body = {
        indent_status,
      };
      const response = await indent.updateIndentStatus(id, body);
      return response;
    },
    onSuccess: (res) => {
      if (res.meta.code === 200) {
        Swal.fire({
          title: 'Sukses!',
          text: 'Status Indent diupdate',
          icon: 'success',
        });
        refetch();
      }
    },
  });

  const handleRequest = (type: string, status?: string) => {
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
        if (type === 'cancel') {
          handleRequestCancelUnit();
        } else if (type === 'check') {
          handleRequestCheck(status);
        }
      }
    });
  };

  const handlePrinteachPaymentInvoice = async (indent_payment_id: any) => {
    try {
      const pdfData = await indent.exportPdfEachPayment(indent_payment_id);
      const pdfObjectUrl = URL.createObjectURL(pdfData);
      window.open(pdfObjectUrl, '_blank'); // Open PDF in a new tab
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handlePrintPaymentInvoice = async () => {
    try {
      const pdfData = await indent.exportPdfIndentPayment(id);
      const pdfObjectUrl = URL.createObjectURL(pdfData);
      window.open(pdfObjectUrl, '_blank'); // Open PDF in a new tab
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleDeletePayment = (indent_payment_id: string) => {
    Swal.fire({
      title: 'Apakah Anda Yakin?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'NO',
      confirmButtonColor: '#D40000',
      confirmButtonText: 'YES',
      cancelButtonColor: '#00029D',
      showLoaderOnConfirm: loadingRefundPayment,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeletePaymentIndent(indent_payment_id);
      }
    });
  };

  useEffect(() => {
    setTitle('INDENT DETAIL');
  }, []);

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
      <ModalPaymentIndent
        type={'indent'}
        items={{
          amount_remaining: indentDetail?.amount_total - indentPayment,
        }}
      />
      <ModalPreviewImage />
      <ModalImage2 />
      <ModalRefundIndent id={id} />
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-6 col-span-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-12 xsm:col-span-12 col-span-12">
              <span className="detail-title">DETAIL INDENT REGULAR</span>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Tipe Motor</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">
                : {indentDetail?.motor?.motor_name}{' '}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Warna</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">
                : {indentDetail?.color?.color_name}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Konsumen</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">
                : {indentDetail?.indent_people_name}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">NIK</p>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <p className="detail-label">: {indentDetail?.indent_nik}</p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Whatsapp</p>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <p className="detail-label">: {indentDetail?.indent_wa_number}</p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">No. Handphone</p>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <p className="detail-label">
                : {indentDetail?.indent_phone_number}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Salesman</p>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <p className="detail-label">: {indentDetail?.salesman_name}</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-6 col-span-12">
          <div className="grid grid-cols-12 gap-6">
            <div className="lg:col-span-12 xsm:col-span-12 col-span-12">
              <span className="detail-title">
                {statusIndent(indentDetail?.indent_status)}
                {indentDetail?.indent_status === 'unpaid' &&
                indentDetail?.indent_payment_refund?.length > 0
                  ? ' - REFUND'
                  : ''}
              </span>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Tanggal</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">
                : {dayJsFormatDate(indentDetail?.created_at)}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Nomor Indent</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">: {indentDetail?.indent_number}</p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Jenis Transaksi</p>
            </div>
            <div className="col-span-6 lg:col-span-9">
              <p className="detail-label">
                : {indentDetail?.indent_type?.toUpperCase()}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">
                {' '}
                {indentDetail?.indent_type === 'credit'
                  ? 'Leasing'
                  : 'Microfinance'}
              </p>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <p className="detail-label">
                :{' '}
                {indentDetail?.indent_type === 'credit'
                  ? indentDetail?.leasing_name
                  : indentDetail?.microfinance_name}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Amount</p>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <p className="detail-label">
                : {formatRupiah(indentDetail?.amount_total)}
              </p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Bayar</p>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <p className="detail-label">: {formatRupiah(indentPayment)}</p>
            </div>
            <div className="lg:col-span-3 col-span-6">
              <p className="detail-label">Sisa</p>
            </div>
            <div className="lg:col-span-9 col-span-6">
              <p className="detail-label">
                : {formatRupiah(indentDetail?.amount_total - indentPayment)}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-12 ">
          <div className="grid grid-cols-12 lg:flex items-center gap-x-4 gap-y-3">
            <div className="col-span-12 lg:col-span-2 2xl:col-span-2 3xl:col-span-1">
              {backBtn({
                onClick: () => navigate('/transaction/indent-regular'),
              })}
            </div>
            {indentDetail?.indent_status !== 'cancel' && (
              <>
                {indentDetail?.indent_status !== 'finance_check' && (
                  <div className="col-span-12 lg:col-span-2 2xl:col-span-2 3xl:col-span-1">
                    <Button
                      isButton={false}
                      to={`/transaction/indent-regular/form?id=${indentDetail?.indent_id}`}
                      className="btn-edit w-full lg:w-auto"
                      label="EDIT"
                    />
                  </div>
                )}
                {indentDetail?.amount_total - indentPayment !== 0 && (
                  <div className="col-span-12 lg:col-span-2 2xl:col-span-2  3xl:col-span-1">
                    {paymentBtn({
                      onClick: () =>
                        handleModal('modalPaymentIndent', true, '', 'indent'),
                    })}
                  </div>
                )}
                {indentDetail?.indent_status === 'unpaid' &&
                  indentDetail?.amount_total - indentPayment === 0 && (
                    <div className="col-span-12 lg:col-span-2 2xl:col-span-2">
                      {loadingCheck ? (
                        <LoaderButton className="btn-submit" />
                      ) : (
                        <Button
                          label="KASIR CHECK"
                          className={'btn-submit'}
                          onClick={() =>
                            handleRequest('check', 'cashier_check')
                          }
                        />
                      )}
                    </div>
                  )}
                {indentDetail?.indent_status === 'cashier_check' && (
                  <div className="col-span-12 lg:col-span-2 2xl:col-span-2">
                    {loadingCheck ? (
                      <LoaderButton className="btn-submit" />
                    ) : (
                      <Button
                        label="FINANCE CHECK"
                        className={'btn-submit'}
                        onClick={() => handleRequest('check', 'finance_check')}
                      />
                    )}
                  </div>
                )}
                {indentDetail?.indent_status === 'unpaid' ||
                  (indentDetail?.indent_payment?.length > 0 && (
                    <div className="col-span-12 lg:col-span-2 2xl:col-span-2">
                      <Button
                        label="REFUND"
                        className={'btn-request'}
                        onClick={() =>
                          handleModal('modalRefundIndent', true, '', 'indent')
                        }
                      />
                    </div>
                  ))}
                {indentDetail?.indent_payment?.length === 0 && (
                  <div className="col-span-12 lg:col-span-2 2xl:col-span-2">
                    {cancelBtn({
                      onClick: () => handleRequest('cancel'),
                    })}
                  </div>
                )}
                <div className="col-span-12 lg:col-span-2 2xl:col-span-2">
                  <Button
                    label="PRINT"
                    className={'btn-primary'}
                    onClick={handlePrintPaymentInvoice}
                  />
                </div>

                {/* <div className="col-span-12 lg:col-span-2 2xl:col-span-1">
                  {loadingDelete ? (
                    <LoaderButton className={'btn-back'} />
                  ) : (
                    deleteBtn({
                      onClick: () => handleDelete(id),
                    })
                  )}
                </div> */}
              </>
            )}
          </div>
        </div>
        <div className="col-span-12 mt-5">
          <p className="detail-title">List Detail Pembayaran</p>
        </div>
        <div className="col-span-12">
          <Table
            headers={headersPayment}
            data={indentDetail?.indent_payment?.map(
              (item: any, index: number) => ({
                ...item,
                no: <span>{index + 1}</span>,
                indent_payment_number: (
                  <span>{item?.indent_payment_number}</span>
                ),
                indent_nominal: (
                  <span>{formatRupiah(item?.indent_payment_amount)}</span>
                ),
                indent_payment_date: (
                  <span>{dayJsFormatDate(item?.indent_payment_date)}</span>
                ),
                indent_payment_method: (
                  <span>{item?.indent_payment_method.toUpperCase()}</span>
                ),
                bank_name: <span>{item?.bank?.bank_name || '-'}</span>,
                proof_images: item?.indent_payment_img?.length > 0 && (
                  <Button
                    label="[Lihat]"
                    className={
                      'text-black hover:underline text-center flex w-full'
                    }
                    onClick={() =>
                      handleModal('modalImage2', true, item?.indent_payment_img)
                    }
                  />
                ),
                action: (
                  <div className="gap-2 flex justify-center ">
                    {indentDetail?.indent_status === 'unpaid' &&
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
                            handleDeletePayment(item?.indent_payment_id)
                          }
                        />
                      ))}
                    <Button
                      label=""
                      Icon={<Printer size={18} />}
                      className={'btn-primary w-auto'}
                      onClick={() =>
                        handlePrinteachPaymentInvoice(item?.indent_payment_id)
                      }
                    />
                  </div>
                ),
              }),
            )}
          />
        </div>
        {indentDetail?.indent_payment_refund?.length !== 0 && (
          <>
            <div className="col-span-12 mt-5">
              <p className="detail-title">List Refund</p>
            </div>
            <div className="col-span-12">
              <Table
                headers={headersRefund}
                data={indentDetail?.indent_payment_refund?.map(
                  (item: any, index: number) => ({
                    ...item,
                    no: <span>{index + 1}</span>,
                    nomor_refund: (
                      <span>{item?.indent_payment_refund_number}</span>
                    ),
                    indent_refund_date: (
                      <span>{dayJsFormatDate(item.created_at)}</span>
                    ),
                    indent_nominal_refund: (
                      <span>
                        {formatRupiah(item?.indent_payment_refund_amount_total)}
                      </span>
                    ),
                    note: <span>{item?.indent_payment_refund_note}</span>,
                  }),
                )}
              />
            </div>
          </>
        )}
        <div className="col-span-12 mt-5">
          <p className="detail-title">Log Aktivitas</p>
        </div>
        <div className="lg:col-span-12 col-span-12">
          <Table
            headers={headers}
            data={indentDetail?.indent_log?.map((item: any) => ({
              ...item,
              created_at: <span>{dayjsFormatDateTime(item.created_at)}</span>,
              indent_log_action: <span>{item.indent_log_action}</span>,
            }))}
          />
        </div>
      </div>
    </Container>
  );
}

const headers = [
  { title: 'TANGGAL', key: 'created_at' },
  { title: 'STAFF', key: 'user.username' },
  { title: 'AKSI', key: 'indent_log_action' },
];

const headersPayment = [
  { title: 'NO.', key: 'no' },
  { title: 'NOMOR', key: 'indent_payment_number' },
  { title: 'TANGGAL BAYAR', key: 'indent_payment_date' },
  { title: 'NOMINAL', key: 'indent_nominal' },
  { title: 'METODE BAYAR', key: 'indent_payment_method' },
  { title: 'BANK', key: 'bank_name' },
  { title: 'BUKTI BAYAR', key: 'proof_images' },
  { title: 'AKSI', key: 'action' },
];

const headersRefund = [
  { title: 'NO.', key: 'no' },
  { title: 'NOMOR', key: 'nomor_refund' },
  { title: 'TANGGAL REFUND', key: 'indent_refund_date' },
  { title: 'NOMINAL', key: 'indent_nominal_refund' },
  { title: 'Alasan', key: 'note' },
];
