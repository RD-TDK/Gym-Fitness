import axios from 'axios';

// 创建 Axios 实例，统一配置 baseURL 和拦截器
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' },
});

// 请求拦截：自动添加 Authorization 头（若有 token）
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Attached token to request:', token);
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 响应拦截：可在此统一处理错误或日志
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 如 401 未授权，可跳转到登录页
        if (error.response && error.response.status === 401) {
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
