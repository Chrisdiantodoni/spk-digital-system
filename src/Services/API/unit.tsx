import instance from '../instance';

class Unit {
  async getUnitOrder(query?: string) {
    return await instance
      .get(`/shipping-order/list?${query}`)
      .then((res) => res.data)
      .catch((error) => {
        return error;
      });
  }

  async getUnitOrderDetail(id?: string) {
    return await instance
      .get(`/shipping-order/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => {
        return error;
      });
  }
  async updateShippingUnit(id: string, data: any) {
    return await instance
      .put(`/unit/status/${id}`, data)
      .then((res) => res.data)
      .catch((error) => {
        return error;
      });
  }

  async getStockUnit(query?: string) {
    return await instance
      .get(`/unit/list?${query}`)
      .then((res) => res.data)
      .catch((error) => {
        return error;
      });
  }
  async getStockUnitDetail(id?: string) {
    return await instance
      .get(`/unit/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => {
        return error;
      });
  }
  async syncShippingData(body: any) {
    return await instance
      .post(`/shipping-order/sync-data2`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
}

export default new Unit();
