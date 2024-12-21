import instance from '../../instance';

class indent {
  async createIndent(body?: string) {
    return await instance
      .post('/indent/create', body)
      .then((res) => res.data)
      .catch((res) => console.log(res));
  }

  async getIndentList(query?: string) {
    return await instance
      .get(`/indent/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getIndentDetail(id?: string) {
    return await instance
      .get(`/indent/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async createIndentPayment(id?: string, body?: any) {
    return await instance
      .post(`/indent/payment/${id}`, body)
      .then((res) => res.data);
  }
  async updateIndent(id?: string, body?: any) {
    return await instance
      .put(`/indent/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateIndentStatus(id?: string, body?: any) {
    return await instance
      .put(`/indent/status/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async deleteRefundPayment(id: string) {
    return await instance
      .put(`/indent/payment/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateIndentCancel(id?: string) {
    return await instance
      .put(`/indent/cancel/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateRefundAllPayment(id?: string, body?: any) {
    return await instance
      .put(`/indent/payment/refund-all/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async exportPdfEachPayment(id?: string) {
    return await instance
      .get(`/export/faktur/indent-payment/${id}`, {
        responseType: 'blob',
      })
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async exportPdfIndentPayment(id?: string) {
    return await instance
      .get(`/export/faktur/indent/${id}`, {
        responseType: 'blob',
      })
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getListIndentInstance(query?: string) {
    return await instance
      .get(`/indent-instansi/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getIndentInstanceDetail(id: string) {
    return await instance
      .get(`/indent-instansi/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createIndentInstance(body: any) {
    return await instance
      .post(`/indent-instansi/create`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateIndentInstanceStatus(indent_instance_id: string, body: any) {
    return await instance
      .put(`/indent-instansi/status/${indent_instance_id}`, body)
      .then((res) => res.data)
      .catch((err) => err.data);
  }
  async updateIndentInstance(indent_instance_id: string, body: any) {
    return await instance
      .put(`/indent-instansi/update/${indent_instance_id}`, body)
      .then((res) => res.data)
      .catch((err) => err.data);
  }

  async createIndentInstancePayment(indent_instance_id: string, body: any) {
    return await instance
      .post(`/indent-instansi/payment/${indent_instance_id}`, body)
      .then((res) => res.data)
      .catch((err) => err.data);
  }
  async deleteIndentInstancePayment(indent_instance_id: String) {
    return await instance
      .delete(`/indent-instansi/payment/delete/${indent_instance_id}`)
      .then((res) => res.data)
      .catch((err) => err.data);
  }
  async updateIndentInstancePaymentRefundAll(
    indent_instance_id: string,
    body: any,
  ) {
    return await instance
      .put(`/indent-instansi/payment/refund-all/${indent_instance_id}`, body)
      .then((res) => res.data)
      .catch((err) => err.data);
  }

  async updateIndentInstanceIndentCancel(indent_instance_id: string) {
    return await instance
      .put(`/indent-instansi/cancel/${indent_instance_id}`)
      .then((res) => res.data)
      .catch((err) => err.data);
  }
}

export default new indent();
