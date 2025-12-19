import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api' });

// Custom function to get tab-specific storage key
const getTabStorageKey = (key) => {
  const tabId = sessionStorage.getItem('tabId') || Math.random().toString(36).substr(2, 9);
  sessionStorage.setItem('tabId', tabId);
  return `${tabId}_${key}`;
};

API.interceptors.request.use(config => {
  const token = localStorage.getItem(getTabStorageKey('token'));
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

export default API;