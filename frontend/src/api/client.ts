import axios, { type AxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch  {
    /* empty */
  }
  return config;
});

let isRefreshing = false;

type FailedRequest = {
  resolve: (token?: string | null) => void;
  reject: (error?: unknown) => void;
  config: AxiosRequestConfig;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const url = originalRequest?.url ?? '';

    const isAuthRoute =
      url.includes('/api/v1/auth/login') ||
      url.includes('/api/v1/auth/register') ||
      url.includes('/api/v1/auth/refresh') ||
      url.includes('/api/v1/auth/logout');

    if (err.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const resp = await axiosInstance.post('/api/v1/auth/refresh', {});
        const newAccessToken: string | null = resp.data?.accessToken ?? null;

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
