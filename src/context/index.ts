import { create } from 'zustand';

const initialState = {
  loadingButton: {},
  modal: {
    modalUnitOrder: false,
    modalRepairUnit: false,
    modalReturUnit: false,
    modalPublishSpk: false,
    modalChangePassword: false,
    modalListReturUnit: false,
    modalEventForm: false,
    modalSyncData: false,
    modalPaymentIndent: false,
    modalPreviewImage: false,
    modalImage: false,
    modalImage2: false,
    modalRefundIndent: false,
    modalPo: false,
    modalShipmentRegular: false,
    modalCroCheck: false,
    modalPriceList: false,
    modalClonePriceList: false,
    modalAddUnitInstance: false,
    modalAdditionalCost: false,
    modalAddListUnit: false,
    modalDeliveryInfoInstance: false,
    modalLegalInfo: false,
  },
  formSpk: {
    provinceCustomer: false,
    cityCustomer: false,
    districtCustomer: false,
  },

  typeModal: '',
  loadingPage: false,
  pageTitle: '',
  search: '',
  permissionUsers: [],
  account_dealer: {},
};

const createStore = create((set: any) => ({
  ...initialState,
  handleSpkFormChange: (fieldName: string, value: boolean) =>
    set((state: any) => ({
      ...state,
      formSpk: {
        ...state.formSpk,
        [fieldName]: value,
      },
    })),
  handleModal: (name: any, value: any, items?: any, type?: any) =>
    set((state: any) => ({
      ...state,
      modal: {
        ...state.modal,
        [name]: value,
      },
      modalItem: items,
      typeModal: type !== undefined ? type : state.typeModal,
    })),
  handle: (name: any, value: any) =>
    set((state: any) => ({
      ...state,
      [name]: value,
    })),
  handleLoading: (id: any, value: any) =>
    set((state: any) => ({
      ...state,
      loadingButton: {
        ...state.loadingButton,
        [id]: value,
      },
    })),
  setTitle: (value: any) =>
    set((state: any) => ({
      ...state,
      pageTitle: value,
    })),
}));

export default createStore;
