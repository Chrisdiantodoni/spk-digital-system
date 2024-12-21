import instance from '../instance';

class retur {
  async getListRetur(query?: string) {
    return await instance
      .get(`/retur-unit/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getReturUnitDetail(id?: string) {
    return await instance
      .get(`/retur-unit/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createReturUnit(body: any) {
    return await instance
      .post(`/retur-unit/create`, body)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async updateReturUnit(id?: string, data?: any) {
    return await instance
      .put(`/retur-unit/update/${id}`, data)
      .then((res) => res.data)
      .catch((error) => error.data);
  }
  async confirmReturUnit(id?: string) {
    return await instance
      .put(`/retur-unit/confirm/${id}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }

  async deleteReturUnitList(id?: string) {
    return await instance
      .delete(`/retur-unit/unit-list/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }
  async deleteReturUnitDetail(id?: string) {
    return await instance
      .delete(`/retur-unit/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => error.data);
  }
}

export default new retur();
