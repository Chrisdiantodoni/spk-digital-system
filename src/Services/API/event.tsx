import instance from '../instance';

class event {
  async createEvent(body: any) {
    return await instance
      .post('/event/create', body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getEvent(query?: string) {
    return await instance
      .get(`/event/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getEventDetail(id?: string) {
    return await instance
      .get(`/event/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async updateEvent(id?: string, body?: any) {
    return await instance
      .put(`/event/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateEventStatus(id?: string, body?: any) {
    return await instance
      .put(`/event/status/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async deleteEventUnit(id?: string) {
    return await instance
      .delete(`/event/unit/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async deleteEventDetail(id?: string) {
    return await instance
      .delete(`/event/delete/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
}

export default new event();
