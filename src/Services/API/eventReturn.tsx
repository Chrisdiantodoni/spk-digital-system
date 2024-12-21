import instance from '../instance';

class eventReturn {
  async getEventReturnList(query?: string) {
    return await instance
      .get(`/event/return/list?${query}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }
  async getEventReturnDetail(id?: string) {
    return await instance
      .get(`/event/return/detail/${id}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }
  async createEventReturn(body: any) {
    return await instance
      .post(`/event/return/create`, body)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }
  async updateEventReturn(id: any, body: any) {
    return await instance
      .put(`/event/return/update/${id}`, body)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }
  async updateEventStatus(id?: string, body?: any) {
    return await instance
      .put(`/event/return/status/${id}`, body)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }
  async getEventReturnUnitList(id?: string) {
    return await instance
      .get(`/event/return/event-unit/list/${id}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }
  async deleteEventReturn(id?: string) {
    return await instance
      .delete(`/event/return/delete/${id}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }

  async deleteEventUnitReturn(id?: string) {
    return await instance
      .delete(`/event/return/unit/delete/${id}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  }
}

export default new eventReturn();
