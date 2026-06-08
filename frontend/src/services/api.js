import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth
export const loginApi = (data) => api.post('/auth/login', data);
export const logoutApi = () => api.post('/auth/logout');
export const checkSessionApi = () => api.get('/auth/session');

// Vehicles
export const getVehicles = (params) => api.get('/vehicles', { params });
export const getVehicle = (id) => api.get(`/vehicles/${id}`);
export const createVehicle = (data) => api.post('/vehicles', data);
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);
export const getAllVehicles = () => api.get('/vehicles/all');

// Customers
export const getCustomers = (params) => api.get('/customers', { params });
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

// Promotions
export const getPromotions = (params) => api.get('/promotions', { params });
export const getPromotion = (id) => api.get(`/promotions/${id}`);
export const createPromotion = (data) => api.post('/promotions', data);
export const updatePromotion = (id, data) => api.put(`/promotions/${id}`, data);
export const deletePromotion = (id) => api.delete(`/promotions/${id}`);
export const getAllPromotions = () => api.get('/promotions/all');

// Promotion Vehicles
export const getPromotionVehicles = (params) => api.get('/promotion-vehicles', { params });
export const getPromotionVehicle = (id) => api.get(`/promotion-vehicles/${id}`);
export const createPromotionVehicle = (data) => api.post('/promotion-vehicles', data);
export const updatePromotionVehicle = (id, data) => api.put(`/promotion-vehicles/${id}`, data);
export const deletePromotionVehicle = (id) => api.delete(`/promotion-vehicles/${id}`);

// Dashboard
export const getDashboardStats = () => api.get('/dashboard');

// Reports
export const getReports = (params) => api.get('/reports', { params });
export const getFullReport = () => api.get('/reports/full');

// Users (Admin only)
export const createUser = (data) => api.post('/auth/users', data);
export const getUsers = () => api.get('/auth/users');
export const deleteUser = (id) => api.delete(`/auth/users/${id}`);

export default api;
