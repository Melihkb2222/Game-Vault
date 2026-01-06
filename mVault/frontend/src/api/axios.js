// src/api/axios.js
import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL, // This is http://localhost:8080/api
  timeout: 5000,
});

export default api;