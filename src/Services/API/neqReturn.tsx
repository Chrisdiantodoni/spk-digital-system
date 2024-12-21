import instance from '../instance';

class neqReturn {
  async getNeqReturnList(query?: string) {
    return await instance
      .get(`/neq/return/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getNeqReturnDetail(id?: string) {
    return await instance
      .get(`/neq/return/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async createNeqReturn(body: any) {
    return await instance
      .post(`/neq/return/create`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async updateNeqReturn(id: string, body: any) {
    return await instance
      .put(`/neq/return/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getNeqReturnUnitList(id?: string) {
    return await instance
      .get(`/neq/return/neq-unit/list/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async deleteNeqUnit(id?: string) {
    return await instance
      .delete(`/neq/return/neq-unit/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async deleteNeqReturn(id?: string) {
    return await instance
      .delete(`/neq/return/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateNeqReturnStatus(id?: string, body?: any) {
    return await instance
      .put(`/neq/return/status/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
}

export default new neqReturn();
