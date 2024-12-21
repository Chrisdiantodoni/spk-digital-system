import instance from '../instance';

class neq {
  async createNeq(body: any) {
    return await instance
      .post(`/neq/create`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getNeqList(query?: string) {
    return await instance
      .get(`/neq/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getNeqDetail(id?: string) {
    return await instance
      .get(`/neq/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateNeqStatus(id?: string, body?: string) {
    return await instance
      .put(`/neq/status/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateNeq(id?: string, body?: string) {
    return await instance
      .put(`/neq/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async deleteNeq(id?: string) {
    return await instance
      .delete(`/neq/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async deleteNeqUnit(id?: string) {
    return await instance
      .delete(`/neq/unit/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
}

export default new neq();
