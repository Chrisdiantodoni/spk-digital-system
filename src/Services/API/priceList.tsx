import instance from '../instance';

class pricelist {
  async getPriceList(query?: string) {
    return await instance
      .get(`/unit/pricelist/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getPriceListDetail(id?: string) {
    return await instance
      .get(`/unit/pricelist/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async createPriceList(body?: any) {
    return await instance
      .post(`/unit/pricelist/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async clonePriceList(body?: any) {
    return await instance
      .post(`/unit/pricelist/clone`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updatePriceList(id: string, body: any) {
    return await instance
      .put(`/unit/pricelist/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
}

export default new pricelist();
