import axios, { type AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Ensure baseURL includes exactly one `/api`
const BASE_URL = `${(API_URL || '').replace(/\/$/, '')}/api`;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (
    fullName: string,
    email: string,
    password: string,
    country: string
  ) => {
    const response = await api.post('/register', {
      name: fullName,
      email,
      password,
      country,
    });
    return response.data;
  },
  login: (email: string, password: string) =>
    api.post('/login', { email, password }),
};

export const transactionAPI = {
  getAll: () => api.get('/transactions'),
  create: (data: any) => api.post('/transactions', data),
  update: (id: string, data: any) =>
    api.put(`/transactions/${id}`, data),
  delete: (id: string) =>
    api.delete(`/transactions/${id}`),
};

export const budgetAPI = {
  get: () => api.get('/budget'),
  update: (data: any) => api.put('/budget', data),
};

export const goalAPI = {
  getAll: () => api.get('/goals'),
  create: (data: any) => api.post('/goals', data),
  update: (id: string, data: any) =>
    api.put(`/goals/${id}`, data),
  delete: (id: string) =>
    api.delete(`/goals/${id}`),
};

export const aiAPI = {
  getTips: () => api.get('/ai/tips'),
};

export default api;
