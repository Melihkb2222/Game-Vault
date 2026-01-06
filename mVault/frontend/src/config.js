// src/config.js

// Backend base URL pointing to port 8080
export const BACKEND_BASE_URL = 'http://localhost:8080';

// API base URL including the /api prefix
export const API_BASE_URL = `${BACKEND_BASE_URL}/api`;

export const resolveImageUrl = (pathOrUrl) => {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (!pathOrUrl.startsWith('/')) pathOrUrl = `/${pathOrUrl}`;
  return `${BACKEND_BASE_URL}${pathOrUrl}`;
};