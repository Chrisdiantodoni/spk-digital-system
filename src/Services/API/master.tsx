import instance from '../instance';

class master {
  async getMotorcycle(query?: string) {
    return await instance
      .get(`/master/motor?${query}`)
      .then((res) => res.data)
      .catch((error) => {
        return error;
      });
  }

  async getLocationCurrent(query?: string) {
    return await instance
      .get(`/master/location-current?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getMainDealer(query?: string) {
    return await instance
      .get(`/master/main-dealer?${query}`)
      .then((res) => res.data)
      .catch((error) => {
        return error;
      });
  }

  async getDealerNeq(query?: string) {
    return await instance
      .get(`/master/dealer-neq?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getEventList(query?: string) {
    return await instance
      .get(`/master/event/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getEventDetail(id?: string) {
    return await instance
      .get(`/master/event/detail/${id}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async createEvent(body: any) {
    return await instance
      .post(`/master/event/create`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateEventStatus(id: string, body: any) {
    return await instance
      .put(`/master/event/status/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async updateEvent(id: string, body: any) {
    return await instance
      .put(`/master/event/update/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getSalesData(query?: string) {
    return await instance
      .get(`/master/sales/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getMicrofinanceData(query?: string) {
    return await instance
      .get(`/master/microfinance/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getLeasingData(query?: string) {
    return await instance
      .get(`/master/leasing/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getColorData(query?: string) {
    return await instance
      .get(`/master/color/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getBank(query?: string) {
    return await instance
      .get(`/master/bank/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getMarital(query?: string) {
    return await instance
      .get(`/master/marital/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getHobby(query?: string) {
    return await instance
      .get(`/master/hobby/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getTenor(query?: string) {
    return await instance
      .get(`/master/tenor/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getProvince(query?: string) {
    return await instance
      .get(`/master/province/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getCity(query?: string) {
    return await instance
      .get(`/master/cities/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getDistrict(query?: string) {
    return await instance
      .get(`/master/district/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getSubDistrict(query?: string) {
    return await instance
      .get(`/master/subdistrict/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getResidence(query?: string) {
    return await instance
      .get(`/master/residence/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getEducation(query?: string) {
    return await instance
      .get(`/master/education/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getListWork(query?: string) {
    return await instance
      .get(`/master/work/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getListBroker(query?: string) {
    return await instance
      .get(`/master/broker/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getListMotorBrand(query?: string) {
    return await instance
      .get(`/master/motor-brand/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getListDealerSelected(query?: string) {
    return await instance
      .get(`/master/dealer-selected?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async selectDealer(id: string, body: any) {
    return await instance
      .put(`/user/select-dealer/${id}`, body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
}

export default new master();
