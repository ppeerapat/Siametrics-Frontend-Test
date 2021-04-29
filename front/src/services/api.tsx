import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';
import { BACKEND_API } from '../constants/api';

const api = axios.create({
  baseURL: BACKEND_API,
});

api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data && response.headers['content-type'].includes('application/json')) {
      response.data = camelizeKeys(response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      return Promise.reject(error.response);
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use((config: AxiosRequestConfig) => {
  const newConfig = { ...config };
  if (config.params) {
    newConfig.params = decamelizeKeys(config.params);
  }
  if (config.data) {
    newConfig.data = decamelizeKeys(config.data);
  }
  return newConfig;
});

export default api;
