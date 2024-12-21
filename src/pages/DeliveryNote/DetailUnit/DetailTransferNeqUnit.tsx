import Table from '../../../components/Tables/Table';
import { dayJsFormatDate } from './../../../utils/dayjs';

export default function DetailTransferNeqUnit({ data }: any) {
  const dataTransfer = data;

  return (
    <div className="grid grid-cols-12 gap-y-6">
      <div className="col-span-12">
        <span className="detail-title">DETAIL TRANSFER NEQ </span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">No. Transfer</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">{dataTransfer?.neq_number}</span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">Tanggal Pengiriman</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">
          {dayJsFormatDate(dataTransfer?.neq_shipping_date)}
        </span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">Nama Neq</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">
          {dataTransfer?.dealer_neq?.dealer_neq_name}
        </span>
      </div>

      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">Catatan</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">{dataTransfer?.neq_note}</span>
      </div>

      <div className="col-span-12">
        <Table
          headers={header}
          data={dataTransfer?.neq_unit?.map((item: any, index: number) => ({
            ...item,
            no: index + 1,
          }))}
        />
      </div>
    </div>
  );
}

const header = [
  { title: 'NO.', key: 'no' },
  { title: 'TIPE MOTOR', key: 'unit.motor.motor_name' },
  { title: 'NO. RANGKA', key: 'unit.unit_frame' },
  { title: 'NO. MESIN', key: 'unit.unit_engine' },
  { title: 'WARNA', key: 'unit.color.color_name' },
];
