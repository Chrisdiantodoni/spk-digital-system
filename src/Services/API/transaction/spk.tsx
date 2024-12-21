import instance from '../../instance';

class spk {
  async getListSpkRegular(query?: string) {
    return await instance
      .get(`/spk/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createSpkRegular(body: any) {
    return await instance
      .post(`/spk/create`, body)
      .then((res) => res.data)
      .catch((error) => error);
  }

  async getDetailSpkRegular(id?: string) {
    return await instance
      .get(`/spk/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateSpk(id?: string, body?: any) {
    return await instance
      .post(`/spk/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => error);
  }

  async deleteSpkDocumentAdditional(id: string) {
    return await instance
      .delete(`/spk/delete/dcmt-another/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async deleteSpkDocumentSK(id: string) {
    return await instance
      .delete(`/spk/delete/dcmt-file-sk/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async deleteAccessoriesPrice(id?: string) {
    return await instance
      .delete(`/spk/delete/price-accessories/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async resetPo(id?: string) {
    return await instance
      .delete(`/spk/purchase-order/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async createPo(id: string, body: any) {
    return await instance
      .post(`/spk/purchase-order/create/${id}`, body)
      .then((res) => res.data)
      .catch((error) => error);
  }

  async updatePoActTac(id: string, body: any) {
    return await instance
      .put(`/spk/purchase-order/create-act-tac/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateStatusSpk(id: string, body: any) {
    return await instance
      .put(`/spk/status/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createShipment(id: string, body: any) {
    return await instance
      .post(`/spk/shipment/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createCroCheck(id: string, body: any) {
    return await instance
      .post(`/spk/cro/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async deleteSpk(id: string) {
    return await instance
      .delete(`/spk/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getSpkRegularPayment(query?: string) {
    return await instance
      .get(`/spk/payment/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getSpkRegularPaymentDetail(id?: string) {
    return await instance
      .get(`/spk/payment/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createSpkPaymentRegular(id?: string, body?: any) {
    return await instance
      .post(`/spk/payment/create/${id}`, body)
      .then((res) => res.data)
      .catch((error) => error);
  }

  async deleteSpkPayment(id?: string) {
    return await instance
      .delete(`/spk/payment/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async refundSpkPayment(id?: string, body?: any) {
    return await instance
      .put(`/spk/payment/refund/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateSpkPaymentStatus(id?: string, body?: any) {
    return await instance
      .put(`/spk/payment/status/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getExcessSpkPayment(query?: string) {
    return await instance
      .get(`spk/excess-payment/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createInstanceSpk(body: any) {
    return await instance
      .post(`/spk-instansi/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async getSpkInstanceList(query?: string) {
    return await instance
      .get(`/spk-instansi/list/${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getSpkInstanceDetail(id: string) {
    return await instance
      .get(`/spk-instansi/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createMotorInstanceSpk(id: any, body: any) {
    return await instance
      .get(`/spk-instansi/add-motor/${id}`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }
  async createAdditionalInstance(id: any, body: any) {
    return await instance
      .get(`/spk-instansi/add-additional/${id}`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }
}

export default new spk();
