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
                    const errorMessage = error.response?.data?.message || '';
                    const isExpired = errorMessage.includes('expiré') || errorMessage.includes('expired');
                    const redirectUrl = isExpired ? '/login?session=expired' : '/login';
                    window.location.href = redirectUrl;
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

export const ApplicationsAPI = {
    list: (params) => api.get('/applications', { params }).then(res => res.data),
    get: (id) => api.get(`/applications/${id}`).then(res => res.data),
    create: (payload) => api.post('/applications', payload).then(res => res.data),
    update: (id, payload) => api.put(`/applications/${id}`, payload).then(res => res.data),
    remove: (id) => api.delete(`/applications/${id}`).then(res => res.data),
};

export default api;
