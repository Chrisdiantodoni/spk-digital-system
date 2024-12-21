import Table from '../../../components/Tables/Table';
import { dayJsFormatDate } from './../../../utils/dayjs';

export default function DetailReturnEventUnit({ data }: any) {
  const dataReturn = data;
  console.log(dataReturn);

  return (
    <div className="grid grid-cols-12 gap-y-6">
      <div className="col-span-12">
        <span className="detail-title">DETAIL KEMBALI EVENT </span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">No. Kembali Event</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">{dataReturn?.event_return_number}</span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">Tanggal Event</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">
          {dayJsFormatDate(dataReturn?.master_event?.master_event_date)}
        </span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">Nama Event</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">
          {dataReturn?.master_event?.master_event_name}
        </span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">Lokasi</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">
          {dataReturn?.master_event?.master_event_location}
        </span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">Catatan</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">
          {dataReturn?.master_event?.master_event_note}
        </span>
      </div>

      <div className="col-span-12">
        <Table
          headers={header}
          data={dataReturn?.event_return_unit.map(
            (item: any, index: number) => ({
              ...item,
              no: index + 1,
            }),
          )}
        />
      </div>
    </div>
  );
}

const header = [
  { title: 'NO.', key: 'no' },
  { title: 'TIPE MOTOR', key: 'event_list_unit.unit.motor.motor_name' },
  { title: 'NO. RANGKA', key: 'event_list_unit.unit.unit_frame' },
  { title: 'NO. MESIN', key: 'event_list_unit.unit.unit_engine' },
  { title: 'WARNA', key: 'event_list_unit.unit.color.color_name' },
];
