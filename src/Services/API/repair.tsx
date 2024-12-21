import instance from '../instance';

class repair {
  async getRepairUnit(query?: string) {
    return await instance
      .get(`/repair/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getDetailRepairUnit(id?: string) {
    return await instance
      .get(`/repair/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createRepair(body?: any) {
    return await instance
      .post(`/repair/create`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateRepair(id: any, body: any) {
    return await instance
      .put(`/repair/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async deleteRepair(id: any) {
    return await instance
      .delete(`/repair/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async deleteRepairUnit(id: any) {
    return await instance
      .delete(`/repair/unit/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async updateRepairStatusRequest(id?: string, data?: any) {
    return await instance
      .put(`/repair/update/status/${id}`, data)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getRepairReturnUnitList(query?: string) {
    return await instance
      .get(`/repair/return/repair-unit/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getRepairReturnDetail(id?: string) {
    return await instance
      .get(`/repair/return/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createRepairReturn(body: any) {
    return await instance
      .post('/repair/return/create', body)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }

  async updateRepairReturn(id: string, body: any) {
    return await instance
      .put(`/repair/return/update/${id}`, body)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }

  async deleteRepairReturnUnit(id: string) {
    return await instance
      .delete(`/repair/return/delete/unit/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async deleteRepairReturn(id?: string) {
    return await instance
      .delete(`/repair/return/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateRepairReturnStatus(id?: string, body?: any) {
    return await instance
      .put(`/repair/return/status/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getRepairReturnList(query?: string) {
    return await instance
      .get(`/repair/return/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
}

export default new repair();
