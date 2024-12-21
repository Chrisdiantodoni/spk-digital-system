export const statusUnit = (status: string) => {
  switch (status) {
    case 'on_hand':
      return (
        <span style={{ color: '#00AF00', fontWeight: 600 }}>ON - HAND</span>
      );
    case 'hold':
      return <span style={{ color: '#000000', fontWeight: 600 }}>HOLD</span>;
    case 'spk':
      return <span style={{ color: '#E56B13', fontWeight: 600 }}>SPK</span>;
    case 'retur':
      return <span style={{ color: '#002B98', fontWeight: 600 }}>RETUR</span>;
    case 'repair':
      return <span style={{ color: '#FF0000', fontWeight: 600 }}>REPAIR</span>;
    case 'event':
      return <span style={{ color: '#FFA500', fontWeight: 600 }}>EVENT</span>;
    default:
      return <>-</>;
  }
};

export const statusIndent = (status: string) => {
  switch (status) {
    case 'unpaid':
    case 'create':
      return (
        <span style={{ fontWeight: 600 }} className="text-red-600">
          UNPAID
        </span>
      );
    case 'spk':
      return (
        <span style={{ fontWeight: 600 }} className="text-slate-700">
          SPK
        </span>
      );
    case 'cashier_check':
      return (
        <span style={{ fontWeight: 600 }} className="text-amber-500">
          KASIR CHECK
        </span>
      );
    case 'finance_check':
      return (
        <span style={{ fontWeight: 600 }} className="text-success">
          PAID
        </span>
      );
    case 'cancel':
      return (
        <span style={{ fontWeight: 600 }} className="text-danger">
          BATAL
        </span>
      );

    default:
      return <>-</>;
  }
};

export const statusAction = (status: string) => {
  let statusElement: JSX.Element;

  switch (status) {
    case 'transfer_neq':
      statusElement = <span>Transfer NEQ</span>;
      break;
    case 'kirim_neq':
      statusElement = <span>Kirim NEQ</span>;
      break;
    case 'transfer_event':
      statusElement = <span>Transfer Event</span>;
      break;
    case 'kirim_event':
      statusElement = <span>Kirim Event</span>;
      break;
    case 'selesai_repair':
      statusElement = <span>Selesai Repair</span>;
      break;
    case 'request_repair':
      statusElement = <span>Request Repair</span>;
      break;
    case 'repair':
      statusElement = <span>Repair</span>;
      break;
    case 'request_retur':
      statusElement = <span>Request Retur</span>;
      break;
    case 'retur':
      statusElement = <span>Retur</span>;
      break;
    case 'terima_unit':
      statusElement = <span>Terima Unit</span>;
      break;
    case 'create_spk':
      statusElement = <span>Create SPK</span>;
      break;
    case 'spk':
      statusElement = <span>SPK</span>;
      break;
    default:
      statusElement = <span>{status}</span>;
  }

  return statusElement;
};

export const statusDelivery = (status: string) => {
  let statusElement: JSX.Element;

  switch (status) {
    case 'create':
      statusElement = (
        <span className="text-amber-400 font-semibold">CREATE</span>
      );
      break;
    case 'approve':
      statusElement = (
        <span className="text-success font-semibold">PENGANTARAN</span>
      );
      break;
    case 'cancel':
      statusElement = <span className="text-danger font-semibold">BATAL</span>;
      break;
    default:
      statusElement = <span>-</span>;
      break;
  }
  return statusElement;
};

export const statusEvent = (status: string) => {
  let statusElement: JSX.Element;

  switch (status) {
    case 'create':
      statusElement = (
        <span className="text-amber-400 font-semibold">CREATE</span>
      );
      break;
    case 'approve':
      statusElement = (
        <span className="text-success font-semibold">PENGANTARAN</span>
      );
      break;
    case 'cancel':
      statusElement = <span className="text-danger font-semibold">BATAL</span>;
      break;
    default:
      statusElement = <span>-</span>;
      break;
  }
  return statusElement;
};

export const statusGeneral = (status: string) => {
  let statusElement: JSX.Element;

  switch (status) {
    case 'create':
      statusElement = (
        <span className="text-amber-400 font-semibold">CREATE</span>
      );
      break;
    case 'approve':
      statusElement = (
        <span className="text-success font-semibold">CONFIRM</span>
      );
      break;
    case 'cancel':
      statusElement = <span className="text-danger font-semibold">BATAL</span>;
      break;
    default:
      statusElement = <span>-</span>;
      break;
  }
  return statusElement;
};

export const statusRepair = (status: string) => {
  switch (status) {
    case 'create':
      return <span className="text-amber-400 font-semibold">CREATE</span>;
    case 'approve':
      return <span className="text-success font-semibold">CONFIRM</span>;
    case 'cancel':
      return <span className="text-danger font-semibold">BATAL</span>;
    default:
      <span>-</span>;
  }
};
