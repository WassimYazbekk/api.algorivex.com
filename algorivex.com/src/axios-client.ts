import axios from "axios";
import router from "./router";

const http = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/V${import.meta.env.VITE_API_VERSION}`,
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_NAME);
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

http.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_NAME);
            router.navigate("/login");
            return error;
        }
        throw error;
    },
);

export default http;
