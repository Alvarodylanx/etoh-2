import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('etoh_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register     = (data) => api.post('/auth/register', data);
export const login        = (data) => api.post('/auth/login', data);
export const getMe        = ()     => api.get('/auth/me');
export const updateProfile = (fd)  => api.put('/auth/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getStands   = ()     => api.get('/stands');
export const getMyStands = ()     => api.get('/stands/mine');
export const getStand    = (id)   => api.get(`/stands/${id}`);
export const createStand = (data) => api.post('/stands', data);
export const updateStand = (id, data) => api.put(`/stands/${id}`, data);
export const deleteStand          = (id)           => api.delete(`/stands/${id}`);
export const setAvailability      = (id, availability) => api.put(`/stands/${id}/availability`, { availability });

export const getProducts  = ()     => api.get('/products');
export const getProduct   = (id)   => api.get(`/products/${id}`);
export const createProduct = (fd)  => api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id)  => api.delete(`/products/${id}`);
export const uploadVoice   = (pid, fd) => api.post(`/products/${pid}/voice`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });

export const placeOrder = (data) => api.post('/orders', data);

export const getPosts    = ()     => api.get('/posts');
export const createPost  = (fd)   => api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deletePost  = (id)   => api.delete(`/posts/${id}`);
export const likePost    = (id)   => api.post(`/posts/${id}/like`);

export const chatWithAI = (message) => api.post('/ai/chat', { message });

export const getPriceItems   = ()     => api.get('/prices/items');
export const getPrices       = (city) => api.get('/prices' + (city ? `?city=${encodeURIComponent(city)}` : ''));
export const submitPrice     = (data) => api.post('/prices', data);
