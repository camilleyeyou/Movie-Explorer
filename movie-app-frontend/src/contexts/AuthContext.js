import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { 
  setTokens, 
  clearTokens, 
  isAuthenticated, 
  getUser, 
  setUser,
  getRefreshToken 
} from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const refreshUserProfile = useCallback(async () => {
    try {
      const response = await authAPI.getProfile();
      const userData = response.data;
      
      setUserState(userData);
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      throw error;
    }
  }, []);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (isAuthenticated()) {
          const userData = getUser();
          setUserState(userData);
          
          await refreshUserProfile();
        }
      } catch (error) {
        console.error('Authentication check error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [refreshUserProfile]);
  
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login({ email, password });
      
      setTokens(response.data.access, response.data.refresh);
      
      await refreshUserProfile();
      
      return true;
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const isFormData = userData instanceof FormData;
      
      let formData;
      if (!isFormData && userData.profile_picture instanceof File) {
        formData = new FormData();
        
        Object.keys(userData).forEach(key => {
          if (userData[key] !== undefined && userData[key] !== null) {
            if (key === 'profile_picture' && userData[key] instanceof File) {
              formData.append(key, userData[key]);
              console.log(`Adding file to FormData: ${userData[key].name} (${userData[key].size} bytes)`);
            } else {
              formData.append(key, userData[key]);
            }
          }
        });
      }
      
      await authAPI.register(formData || userData);
      
      if (formData) {
        const email = userData.email;
        const password = userData.password;
        return await login(email, password);
      } else if (isFormData) {
        const email = userData.get('email');
        const password = userData.get('password');
        return await login(email, password);
      } else {
        return await login(userData.email, userData.password);
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        
        if (typeof errorData === 'string') {
          setError(errorData);
        } else if (typeof errorData === 'object') {
          const errorMessages = [];
          
          Object.entries(errorData).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              errorMessages.push(`${field}: ${errors.join(', ')}`);
            } else if (typeof errors === 'string') {
              errorMessages.push(`${field}: ${errors}`);
            }
          });
          
          setError(errorMessages.join('; '));
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setError('Registration failed. Please check your network connection.');
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    clearTokens();
    setUserState(null);
  };
  
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const isFormData = userData instanceof FormData;
      
      let formData;
      if (!isFormData && userData.profile_picture instanceof File) {
        formData = new FormData();
        
        Object.keys(userData).forEach(key => {
          if (userData[key] !== undefined && userData[key] !== null) {
            if (key === 'profile_picture' && userData[key] instanceof File) {
              formData.append(key, userData[key]);
              console.log(`Adding file to FormData: ${userData[key].name} (${userData[key].size} bytes)`);
            } else {
              formData.append(key, userData[key]);
            }
          }
        });
        
        console.log("Created FormData for profile update");
      }
      
      const response = await authAPI.updateProfile(formData || userData);
      
      setUserState(response.data);
      setUser(response.data);
      
      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      
      if (error.response) {
        const errorData = error.response.data;
        
        if (typeof errorData === 'string') {
          setError(errorData);
        } else if (typeof errorData === 'object') {
          const errorMessages = [];
          
          Object.entries(errorData).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              errorMessages.push(`${field}: ${errors.join(', ')}`);
            } else if (typeof errors === 'string') {
              errorMessages.push(`${field}: ${errors}`);
            }
          });
          
          setError(errorMessages.join('; '));
        } else {
          setError('Failed to update profile. Please try again.');
        }
      } else {
        setError('Failed to update profile. Please check your network connection.');
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      await authAPI.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      
      return true;
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to change password.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteAccount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await authAPI.deleteAccount();
      
      logout();
      
      return true;
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to delete account.');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      logout();
      return null;
    }
    
    try {
      const response = await authAPI.refreshToken(refreshToken);
      
      setTokens(response.data.access, response.data.refresh);
      
      return response.data.access;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      logout();
      return null;
    }
  };
  
  const contextValue = {
    user,
    loading,
    error,
    setError,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    refreshUserProfile,
    changePassword,
    deleteAccount,
    refreshAccessToken
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;