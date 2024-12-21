import openApiInstance from '../openApiInstance';

class masterOpenApi {
  async getProvince(query?: string) {
    return await openApiInstance
      .get(`/public/province/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getCity(query?: string) {
    return await openApiInstance
      .get(`/public/cities/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getDistrict(query?: string) {
    return await openApiInstance
      .get(`/public/district/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getSubDistrict(query?: string) {
    return await openApiInstance
      .get(`/public/sub-district/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getMaritalStatus(query?: string) {
    return await openApiInstance
      .get(`/public/marital/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async getHobbies(query?: string) {
    return await openApiInstance
      .get(`/public/hobbies/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getResidence(query?: string) {
    return await openApiInstance
      .get(`/public/residence/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getMotorBrand(query?: string) {
    return await openApiInstance
      .get(`/public/motor-brand/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getEducation(query?: string) {
    return await openApiInstance
      .get(`/public/education/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getOccupation(query?: string) {
    return await openApiInstance
      .get(`/public/occupation/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getExpense(query?: string) {
    return await openApiInstance
      .get(`/public/expend/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getIncome(query?: string) {
    return await openApiInstance
      .get(`/public/income/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getMethodSales(query?: string) {
    return await openApiInstance
      .get(`/public/method-sales/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getSalesman(query?: string) {
    return await openApiInstance
      .get(`/public/salesman/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getMicrofinance(query?: string) {
    return await openApiInstance
      .get(`/public/microfinance/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getMainDealer(query?: string) {
    return await openApiInstance
      .get(`/public/main-dealer/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getLeasing(query?: string) {
    return await openApiInstance
      .get(`/public/leasing/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getTenor(query?: string) {
    return await openApiInstance
      .get(`/public/tenor/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getDealerList(query?: string) {
    return await openApiInstance
      .get(`/public/dealer/list?${query}`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
}

export default new masterOpenApi();
