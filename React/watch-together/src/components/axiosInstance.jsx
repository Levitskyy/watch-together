import axios from "axios";
import { serverURL } from "../App";

const axiosInstance = axios.create();

let setToken;

export const setTokenFunction = (fn) => {
    setToken = fn;
  };

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;
        const refreshUrl = `http://${serverURL}/api/auth/refresh`;
        if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== refreshUrl) {
            originalRequest._retry = true;
            try {
                const response = await axiosInstance.post(`http://${serverURL}/api/auth/refresh`, {}, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const { data } = response;
                const { access_token } = data;
                setToken(access_token);
                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // refresh токен недействителен
                setToken();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        } 

        return Promise.reject(error);
    }
);

export default axiosInstance;