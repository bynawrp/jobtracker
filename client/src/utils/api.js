import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

//Token interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//Error interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url || '';
            if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
                localStorage.removeItem('token');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

//API endpoints
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData).then(res => res.data),
    login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
    logout: () => api.post('/auth/logout').then(res => res.data),
    getMe: () => api.get('/auth/me').then(res => res.data),
};

export default api;
