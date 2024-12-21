import instance from '../instance';

class Authentication {
  login(body: any) {
    return instance
      .post('/authentication/login', body)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
  async logout() {
    return instance
      .post('/user/logout')
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getPermission() {
    return instance
      .get(`/user/user-permission`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }

  async getCurrentDealer() {
    return instance
      .get(`/user/current-dealer`)
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }
}

export default new Authentication();
