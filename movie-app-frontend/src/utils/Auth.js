import { jwtDecode } from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'movie_app_access_token';
const REFRESH_TOKEN_KEY = 'movie_app_refresh_token';
const USER_KEY = 'movie_app_user';

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  
  try {
    const decoded = jwtDecode(accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(decoded));
  } catch (error) {
    console.error('Error decoding token:', error);
  }
};

export const getToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getUser = () => {
  const userJson = localStorage.getItem(USER_KEY);
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) {
    return false;
  }
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      clearTokens();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const setUser = (userData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const updateUser = (userData) => {
  const currentUser = getUser();
  if (currentUser) {
    setUser({ ...currentUser, ...userData });
  }
};