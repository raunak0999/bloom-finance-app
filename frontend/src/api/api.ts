import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
});

export const register = (data: any) => api.post('/register', data);
export const login = (data: any) => api.post('/login', data);
export const getUser = () => api.get('/user');
export const getBudget = () => api.get('/budget');
export const updateBudget = (data: any) => api.put('/budget', data);
export const getTips = () => api.get('/ai/tips');

export default api;
