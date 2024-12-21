import instance from '../instance';

class delivery {
  async createDelivery(body?: string) {
    return await instance
      .post(`/delivery/create`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getDeliveryList(query?: string) {
    return await instance
      .get(`/delivery/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getDeliveryDetail(id?: string) {
    return await instance
      .get(`/delivery/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async updateDeliveryStatus(id?: string, body?: any) {
    return await instance
      .put(`/delivery/status/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateDelivery(id?: string, body?: any) {
    return await instance
      .put(`/delivery/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async deleteDelivery(id?: string) {
    return await instance
      .delete(`/delivery/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
}

export default new delivery();
