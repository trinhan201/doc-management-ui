import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { refresh } from '~/services/authServices';

const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

const accessToken = localStorage.getItem('accessToken');

httpRequest.interceptors.request.use(
    async (config) => {
        let currentDate = new Date();
        if (accessToken) {
            const decodedToken = jwt_decode(accessToken);
            if (decodedToken.exp * 1000 < currentDate.getTime()) {
                const res = await refresh();
                config.headers.authorization = `Bearer ${res.accessToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default httpRequest;
