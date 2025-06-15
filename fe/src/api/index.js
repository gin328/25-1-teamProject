import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 필요 없으면 false로 바꿔도 돼
});

export default api;
