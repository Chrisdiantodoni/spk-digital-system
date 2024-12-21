import axios from 'axios';

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_OPEN_API_URL}`,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response.status === 401 ||
      error.response.message === 'Unauthenticated.'
    ) {
      if (window.location.pathname !== '/auth/sign-in') {
        localStorage.clear();
        window.location.href = '/auth/sign-in';
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
