import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const authAPI = {
  register: async (fullName: string, email: string, password: string, country: string) => {
    return api.post('/register', { fullName, email, password, country });
  },
  login: (email: string, password: string) =>
    api.post('/login', { email, password }),
};  



export const transactionAPI = {
  getAll: () => api.get('/transactions'),  // 🔥 Uses interceptor token!
  create: (data: any) => api.post('/transactions', data),
  update: (id: string, data: any) => api.put(`/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};




export const budgetAPI = {
  get: () => api.get('/budgets'),
  create: (data: any) => api.post('/budgets', data),
  update: (data: any) => api.put('/budgets', data),
  delete: (id: string) => api.delete(`/budgets/${id}`),
};


export const goalAPI = {
  getAll: () => api.get('/goals'),  // 🔥 Already has token!
  // ... rest unchanged
};

export const aiAPI = {
  getTips: () => api.get('/ai/tips'),  // 🔥 Already has token!
};

export const investmentAPI = {
  getByCountry: (country: string) => api.get(`/investments/${country}`),
};



export default api;
