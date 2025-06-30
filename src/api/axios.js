import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://employee-backend-kifp.onrender.com', // 👌 Correct backend URL
  withCredentials: true, // 👌 For cross-origin credentials (if needed)
});

// 🔐 Automatically attach token from localStorage
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default instance;
