import { lazy } from 'react';
import OverPaymentRegular from './pages/Payment/OverPaymentRegular';
const Ecommerce = lazy(() => import('./pages/Dashboard/ECommerce'));
const UnitOrder = lazy(() => import('./pages/Unit/UnitOrder'));
const UnitOrderDetail = lazy(
  () => import('./pages/Unit/Detail/UnitOrderDetail'),
);
const Unit = lazy(() => import('./pages/Unit/Unit'));
const UnitDetail = lazy(() => import('./pages/Unit/Detail/UnitDetail'));
const UnitReport = lazy(() => import('./pages/Report/Unit/UnitReport'));
const UnitStock = lazy(() => import('./pages/Report/Unit/UnitStock'));

const UnitRetur = lazy(() => import('./pages/Unit/UnitRetur'));
const UnitReturnForm = lazy(() => import('./pages/Unit/Form/AddUnitReturn'));
const UnitRepair = lazy(() => import('./pages/Unit/UnitRepair'));
const UnitDeliveryNote = lazy(
  () => import('./pages/DeliveryNote/Unit/UnitDeliveryNote'),
);
const UnitReturDetail = lazy(
  () => import('./pages/Unit/Detail/UnitReturDetail'),
);
const UnitRepairDetail = lazy(
  () => import('./pages/Unit/Detail/UnitRepairDetail'),
);
const UnitDeliveryNoteDetail = lazy(
  () => import('./pages/DeliveryNote/Unit/Detail/UnitDeliveryNoteDetail'),
);
const AddUnitDeliveryNote = lazy(
  () => import('./pages/DeliveryNote/Unit/AddUnitDeliveryNote'),
);
const AddUnitRepair = lazy(() => import('./pages/Unit/Form/AddUnitRepair'));
const TransferEvent = lazy(() => import('./pages/Event/TransferEvent'));
const TransferEventForm = lazy(
  () => import('./pages/Event/Form/TransferEventForm'),
);
const TransferEventDetail = lazy(
  () => import('./pages/Event/Detail/TransferEventDetail'),
);
const UnitRepairReturn = lazy(
  () => import('./pages/Unit/Return/UnitRepairReturn'),
);

const AddUnitRepairReturn = lazy(
  () => import('./pages/Unit/Form/AddUnitRepairReturn'),
);
const UnitRepairReturnDetail = lazy(
  () => import('./pages/Unit/Detail/UnitRepairReturnDetail'),
);
const EventList = lazy(() => import('./pages/Event/EventList'));
const ReturnEvent = lazy(() => import('./pages/Event/ReturnEvent'));
const DetailMasterEvent = lazy(
  () => import('./pages/Event/Detail/DetailMasterEvent'),
);
const ReturnEventDetail = lazy(
  () => import('./pages/Event/Detail/ReturnEventDetail'),
);
const ReturnEventForm = lazy(
  () => import('./pages/Event/Form/ReturnEventForm'),
);
const TransferNeq = lazy(() => import('./pages/Neq/TransferNeq'));
const ReturnNeq = lazy(() => import('./pages/Neq/ReturnNeq'));
const TransferNeqDetail = lazy(
  () => import('./pages/Neq/Detail/TransferNeqDetail'),
);
const TransferNeqForm = lazy(() => import('./pages/Neq/Form/TransferNeqForm'));
const ReturnNeqForm = lazy(() => import('./pages/Neq/Form/ReturnNeqForm'));
const ReturnNeqDetail = lazy(
  () => import('./pages/Neq/Detail/ReturnNeqDetail'),
);
// Transaction Section
const SpkRegular = lazy(() => import('./pages/Transaction/SPK/SpkRegular'));

const SpkInstance = lazy(() => import('./pages/Transaction/SPK/SpkInstance'));
const IndentRegularDetail = lazy(
  () => import('./pages/Transaction/Indent/Detail/IndentRegularDetail'),
);
const IndentInstanceDetail = lazy(
  () => import('./pages/Transaction/Indent/Detail/IndentInstanceDetail'),
);
const AddIndentRegular = lazy(
  () => import('./pages/Transaction/Indent/Form/AddIndentRegular'),
);
const AddIndentInstance = lazy(
  () => import('./pages/Transaction/Indent/Form/AddIndentInstance'),
);
const AddSpkRegular = lazy(
  () => import('./pages/Transaction/SPK/Form/AddSpkRegular'),
);
const AddInstancePO = lazy(
  () => import('./pages/Transaction/SPK/Form/AddInstancePO'),
);
const InstancePODetail = lazy(
  () => import('./pages/Transaction/SPK/Detail/InstancePODetail'),
);
const InstancePO = lazy(() => import('./pages/Transaction/SPK/InstancePO'));
const SpkRegularDetail = lazy(
  () => import('./pages/Transaction/SPK/Detail/SpkRegularDetail'),
);
const SpkInstanceDetail = lazy(
  () => import('./pages/Transaction/SPK/Detail/SpkInstanceDetail'),
);

const IndentRegular = lazy(
  () => import('./pages/Transaction/Indent/IndentRegular'),
);
const IndentInstance = lazy(
  () => import('./pages/Transaction/Indent/IndentInstance'),
);

const PaymentRegular = lazy(() => import('./pages/Payment/PaymentRegular'));
const PaymentRegularDetail = lazy(
  () => import('./pages/Payment/Detail/PaymentRegularDetail'),
);
const CroCheck = lazy(() => import('./pages/Transaction/SPK/CRO/CroCheck'));

const MasterPriceList = lazy(() => import('./pages/Master/PriceList'));
const MasterPriceListDetail = lazy(
  () => import('./pages/Master/Detail/PriceListDetail'),
);

const routesUnit = [
  {
    path: '/dashboard',
    component: Ecommerce,
  },
  {
    path: 'units/shipping-order',
    component: UnitOrder,
  },
  {
    path: 'units/shipping-order/:id',
    component: UnitOrderDetail,
  },
  {
    path: 'units/unit-list',
    component: Unit,
  },
  {
    path: 'units/unit-list/:id',
    component: UnitDetail,
  },
  {
    path: 'units/unit-return',
    component: UnitRetur,
  },
  {
    path: 'units/unit-return/form',
    component: UnitReturnForm,
  },
  {
    path: 'units/unit-return/:id',
    component: UnitReturDetail,
  },
  {
    path: 'units/unit-repair',
    component: UnitRepair,
  },
  {
    path: 'units/unit-repair/:id',
    component: UnitRepairDetail,
  },
  {
    path: 'units/unit-repair/unit-repair-form',
    component: AddUnitRepair,
  },
  {
    path: 'units/delivery',
    component: UnitDeliveryNote,
  },
  {
    path: 'units/unit-delivery/:id',
    component: UnitDeliveryNoteDetail,
  },
  {
    path: 'units/unit-return-repair',
    component: UnitRepairReturn,
  },
  {
    path: 'units/unit-return-repair/unit-return-repair-form',
    component: AddUnitRepairReturn,
  },
  {
    path: 'units/unit-return-repair/:id',
    component: UnitRepairReturnDetail,
  },
  {
    path: 'units/unit-delivery/new',
    component: AddUnitDeliveryNote,
  },
];

const routesEvent = [
  {
    path: 'events/event-list',
    component: EventList,
  },
  {
    path: 'events/event-list/:id',
    component: DetailMasterEvent,
  },
  {
    path: 'events/transfer-event',
    component: TransferEvent,
  },
  {
    path: 'events/transfer-event/form',
    component: TransferEventForm,
  },
  {
    path: 'events/transfer-event/:id',
    component: TransferEventDetail,
  },
  {
    path: 'events/return-event',
    component: ReturnEvent,
  },
  {
    path: 'events/return-event/:id',
    component: ReturnEventDetail,
  },
  {
    path: 'events/return-event/form',
    component: ReturnEventForm,
  },
];

const routesNeq = [
  {
    path: 'neqs/transfer-neq/form',
    component: TransferNeqForm,
  },
  {
    path: 'neqs/transfer-neq',
    component: TransferNeq,
  },
  {
    path: 'neqs/transfer-neq/:id',
    component: TransferNeqDetail,
  },
  {
    path: 'neqs/return-neq/form',
    component: ReturnNeqForm,
  },
  {
    path: 'neqs/return-neq',
    component: ReturnNeq,
  },
  {
    path: 'neqs/return-neq/:id',
    component: ReturnNeqDetail,
  },
];

const routesTransaction = [
  {
    path: 'transaction/indent-instance',
    component: IndentInstance,
  },
  {
    path: 'transaction/indent-instance/form',
    component: AddIndentInstance,
  },
  {
    path: 'transaction/indent-instance/:id',
    component: IndentInstanceDetail,
  },
  {
    path: 'transaction/indent-regular',
    component: IndentRegular,
  },
  {
    path: 'transaction/indent-regular/form',
    component: AddIndentRegular,
  },
  {
    path: 'transaction/indent-regular/:id',
    component: IndentRegularDetail,
  },
  {
    path: 'transaction/spk-regular/form',
    component: AddSpkRegular,
  },
  {
    path: 'transaction/spk-instance',
    component: SpkInstance,
  },

  {
    path: 'transaction/spk-instance/:id',
    component: SpkInstanceDetail,
  },
  {
    path: 'transaction/po-instance/form',
    component: AddInstancePO,
  },
  {
    path: 'transaction/po-instance',
    component: InstancePO,
  },
  {
    path: 'transaction/po-instance/:id',
    component: InstancePODetail,
  },
  {
    path: 'transaction/spk-regular',
    component: SpkRegular,
  },
  {
    path: 'transaction/spk-regular/:id',
    component: SpkRegularDetail,
  },
  {
    path: 'transaction/cro',
    component: CroCheck,
  },
];

const routesPayment = [
  {
    path: 'payment/payment-regular',
    component: PaymentRegular,
  },
  {
    path: 'payment/overpayment-regular',
    component: OverPaymentRegular,
  },
  {
    path: 'payment/payment-regular/:id',
    component: PaymentRegularDetail,
  },
];

const routesMaster = [
  {
    path: 'settings/pricelist',
    component: MasterPriceList,
  },
  {
    path: 'settings/pricelist/:id',
    component: MasterPriceListDetail,
  },
];

const routes = [
  ...routesUnit,
  ...routesEvent,
  ...routesNeq,
  ...routesTransaction,
  ...routesPayment,
  ...routesMaster,
];
export default routes;
