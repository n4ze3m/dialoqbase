import axios from "axios";
import { getToken } from "./cookie";

export const baseURL = import.meta.env.VITE_API_V2_URL || "/api/v2";

const apiV2 = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiV2.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers!.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

apiV2.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;
        if (err.response) {
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;
                try {
                    return apiV2(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            } else if (err.response.status === 401 && originalConfig._retry) {
                window.location.href = "/#/login";
            }

            if (err.response.status === 403 && err.response.data) {
                return Promise.reject(err.response.data);
            }
        }

        return Promise.reject(err);
    },
);

export {
    apiV2
}
