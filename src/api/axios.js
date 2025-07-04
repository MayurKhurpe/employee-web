// 📁 src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://employee-backend-kifp.onrender.com/api',
});

// 🔐 Interceptor to always attach token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No token found in localStorage');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
