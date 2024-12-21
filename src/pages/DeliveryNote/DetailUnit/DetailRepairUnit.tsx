import Table from '../../../components/Tables/Table';

export default function DetailRepairUnit({ data }: any) {
  const dataRepair = data?.data || data;

  return (
    <div className="grid grid-cols-12 gap-y-6">
      <div className="col-span-12">
        <span className="detail-title">DETAIL REPAIR UNIT</span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">No. Repair</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">{dataRepair?.repair_number}</span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">Gudang</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">{dataRepair?.main_dealer_name}</span>
      </div>
      <div className="col-span-6 lg:col-span-3 flex gap-2 items-center">
        <span className="detail-label">Alasan Repair</span>
      </div>
      <div className="col-span-6 lg:col-span-9 gap-2 flex items-center">
        <p>:</p>
        <span className="detail-label">{dataRepair?.repair_reason}</span>
      </div>
      <div className="col-span-12">
        <Table
          headers={header}
          data={dataRepair?.repair_unit.map((item: any, index: number) => ({
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
