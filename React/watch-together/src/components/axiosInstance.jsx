import axios from "axios";
import { serverURL } from "../App";

const axiosInstance = axios.create();

let setToken;

function createAxiosResponseInterceptor() {
    const interceptor = axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            // Reject promise if usual error
            if (error.response.status !== 401) {
                return Promise.reject(error);
            }
            /*
             * When response code is 401, try to refresh the token.
             * Eject the interceptor so it doesn't loop in case
             * token refresh causes the 401 response.
             *
             * Must be re-attached later on or the token refresh will only happen once
             */
            axiosInstance.interceptors.response.eject(interceptor);

            return axiosInstance
                .post(`http://${serverURL}/api/auth/refresh`, {
                }, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    }})
                .then((response) => {

                    setToken(response.data.access_token);
                    error.response.config.headers["Authorization"] =
                        "Bearer " + response.data.access_token;
                    // Retry the initial call, but with the updated token in the headers. 
                    // Resolves the promise if successful
                    return axios(error.response.config);
                })
                .catch((error2) => {
                    // Retry failed, clean up and reject the promise
                    setToken();
                    return Promise.reject(error2);
                })
                .finally(createAxiosResponseInterceptor); // Re-attach the interceptor by running the method
        }
    );
}

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


// axiosInstance.interceptors.response.use(
//     response => {
//         return response;
//     },
//     async error => {
//         const originalRequest = error.config;
//         const refreshUrl = `http://${serverURL}/api/auth/refresh`;
//         if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== refreshUrl) {
//             originalRequest._retry = true;
//             try {
//                 const response = await axiosInstance.post(`http://${serverURL}/api/auth/refresh`, {}, {
//                     withCredentials: true,
//                     headers: {
//                         'Content-Type': 'application/json',
//                     }
//                 });
//                 const { access_token } = response.data;
//                 console.log('Original token: ' + originalRequest.headers);
//                 setToken(access_token);
//                 axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
//                 error.response.config.headers["Authorization"] = `Bearer ${access_token}`;
//                 console.log('New token: ' + originalRequest.headers);
                
//                 return axiosInstance(error.response.config);
//             } catch (refreshError) {
//                 // refresh токен недействителен
//                 console.log(refreshError);
//                 setToken();
//                 //window.location.href = '/login';
//                 return Promise.reject(refreshError);
//             }
//         } 

//         return Promise.reject(error);
//     }
// );
createAxiosResponseInterceptor();
export default axiosInstance;