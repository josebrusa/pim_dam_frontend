import axios from 'axios';
import { appConfig } from '@/app/config';

export const http = axios.create({
  baseURL: appConfig.apiUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export function isAuthSessionError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
