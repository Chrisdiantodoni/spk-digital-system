export interface unitProps {
  id: string | number;
  date: Date | string;
  motorcycle_name: string;
  color: string;
  chassis_no: string;
  engine_no: string;
  dealer: string;
  location: string;
  stock: string;
}
export interface ListUnitStock {
  id: string | number;
  model: string;
  amount: number;
  available: number;
  spk: number;
  retour: number;
  repair: number;
  hold: number;
  sold: number;
}

export interface unitOrderProps {
  id: string | number;
  date_shipping: Date | string;
  sales_order: string;
  delivery_number: string;
  dealer: string;
  branch: string;
  unit: number;
  receive: number;
  status: string;
}

export interface ListDetailUnitOrder {
  id: string | number;
  model: string;
  color: string;
  code: string;
  chassis_no: string;
  engine_no: string;
  date_receive: string;
  status: string;
}

export interface ListDetailUnitHistory {
  id: string | number;
  time: string;
  action: string;
  staff_id: string;
  dealer: string;
  neq: string;
  branch: string;
  event: string;
  depo: string;
  status: string;
}

export interface ListDetailStockUnit {
  id: string | number;
  date: string;
  model_name: string;
  color: string;
  no_chassis: string;
  no_engine: string;
  status: string;
}

export interface HistoryUnit {
  model: string;
  color: string;
  year: string;
  chassis_no: string;
  engine_no: string;
  shipment_date: string;
  dealer: string;
  dealer_code: string;
  sales_order: string;
  delivery_order: string;
}

export interface UnitLog {
  time: string;
  sales_order: string;
  action: string;
  staff: string;
  branch: string;
  neq_event: string;
  status: string;
}
