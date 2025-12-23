// API
import axios from 'axios';

const API_BASE_URL = import.meta.env.API_URL 
    ? `${import.meta.env.API_URL}/api` 
    : '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

//token interceptor for requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//error interceptor for responses redirect to ErrorHandler
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

const extractData = (response) => {
    const data = response.data;
    return data?.data !== undefined ? data.data : data;
};

const extractListData = (response) => {
    const data = response.data;
    return data?.data || (Array.isArray(data) ? data : []);
};

//API endpoints
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData).then(extractData),
    login: (credentials) => api.post('/auth/login', credentials).then(extractData),
    logout: () => api.post('/auth/logout').then(extractData),
    getMe: () => api.get('/auth/me').then(extractData),
    updateProfile: (profileData) => api.put('/auth/profile', profileData).then(extractData),
};

export const ApplicationsAPI = {
    list: (params) => api.get('/applications', { params }).then(extractListData),
    get: (id) => api.get(`/applications/${id}`).then(extractData),
    create: (payload) => api.post('/applications', payload).then(extractData),
    update: (id, payload) => api.put(`/applications/${id}`, payload).then(extractData),
    remove: (id) => api.delete(`/applications/${id}`).then(extractData),
};

export const AdminAPI = {
    getUsers: () => api.get('/admin/users').then(extractListData),
    getUser: (id) => api.get(`/admin/users/${id}`).then(extractData),
    updateUser: (id, payload) => api.put(`/admin/users/${id}`, payload).then(extractData),
    deleteUser: (id) => api.delete(`/admin/users/${id}`).then(extractData),
};

export default api;
