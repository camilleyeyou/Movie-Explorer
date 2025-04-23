import axios from 'axios';
import { getToken, clearTokens } from '../utils/auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearTokens();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/token/', credentials),
  
  register: (userData) => {
    if (userData instanceof FormData) {
      console.log('Registering with FormData:');
      for (let pair of userData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File - ${pair[1].name} (${pair[1].size} bytes, type: ${pair[1].type})`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }
      
      return api.post('/users/register/', userData, {
        headers: {
          'Accept': 'application/json',
        }
      });
    } else {
      return api.post('/users/register/', userData);
    }
  },
  
  refreshToken: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
  
  getProfile: () => api.get('/users/profile/'),
  
  updateProfile: (userData) => {
    if (userData instanceof FormData) {
      console.log('Updating profile with FormData:');
      for (let pair of userData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File - ${pair[1].name} (${pair[1].size} bytes, type: ${pair[1].type})`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }
      
      return api.put('/users/profile/', userData, {
        headers: {
          'Accept': 'application/json',
        }
      });
    } else {
      return api.put('/users/profile/', userData);
    }
  },
  
  changePassword: (passwordData) => api.post('/users/change-password/', passwordData),
  
  deleteAccount: () => api.delete('/users/delete-account/'),
};


export const moviesAPI = {
  getPopular: (page = 1) => api.get(`/movies/popular/?page=${page}`),
  getTopRated: (page = 1) => api.get(`/movies/top_rated/?page=${page}`),
  getNowPlaying: (page = 1) => api.get(`/movies/now_playing/?page=${page}`),
  getUpcoming: (page = 1) => api.get(`/movies/upcoming/?page=${page}`),
  
  searchMovies: (query, page = 1) => api.get(`/movies/search/?query=${query}&page=${page}`),
  getMovieDetails: (tmdbId) => api.get(`/movies/details/${tmdbId}/`),
  
  getFavorites: (page = 1) => api.get(`/movies/favorites/?page=${page}`),
  getWatchlist: (page = 1) => api.get(`/movies/watchlist/?page=${page}`),
  getWatched: (page = 1) => api.get(`/movies/watched/?page=${page}`),
  getRated: (page = 1) => api.get(`/movies/rated/?page=${page}`),
  
  toggleFavorite: (tmdbId) => api.post(`/movies/favorite/${tmdbId}/`),
  toggleWatchlist: (tmdbId) => api.post(`/movies/watchlist/${tmdbId}/`),
  toggleWatched: (tmdbId) => api.post(`/movies/watched/${tmdbId}/`),
  rateMovie: (tmdbId, rating) => api.post(`/movies/rate/${tmdbId}/`, { rating }),
};

export default api;