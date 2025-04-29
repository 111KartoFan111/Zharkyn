// src/services/api.js
import axios from 'axios';

// Base API URL - this should be updated based on your environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API services
const authService = {
  login: async (credentials) => {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    
    const response = await apiClient.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await apiClient.post('/register', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  }
};

const carService = {
  getCars: async (filters = {}) => {
    const response = await apiClient.get('/cars', { params: filters });
    return response.data;
  },
  
  getCarById: async (id) => {
    const response = await apiClient.get(`/cars/${id}`);
    return response.data;
  },
  
  searchCars: async (filterData) => {
    const response = await apiClient.post('/cars/search', filterData);
    return response.data;
  }
};

const reviewService = {
  getCarReviews: async (carId) => {
    const response = await apiClient.get(`/reviews/car/${carId}`);
    return response.data;
  },
  
  getUserReviews: async () => {
    const response = await apiClient.get('/reviews/user');
    return response.data;
  },
  
  addReview: async (reviewData) => {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  },
  
  updateReview: async (reviewId, reviewData) => {
    const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },
  
  deleteReview: async (reviewId) => {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response.data;
  }
};

const userService = {
  updateProfile: async (userId, userData) => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },
  
  getFavorites: async () => {
    const response = await apiClient.get('/users/favorites');
    return response.data;
  },
  
  addFavorite: async (carId) => {
    const response = await apiClient.post(`/users/favorites/${carId}`);
    return response.data;
  },
  
  removeFavorite: async (carId) => {
    const response = await apiClient.delete(`/users/favorites/${carId}`);
    return response.data;
  },
};

  const adminService = {
    // Car management
    getAllCars: async (skip = 0, limit = 100) => {
      const response = await apiClient.get('/cars', { params: { skip, limit } });
      return response.data;
    },
    
    createCar: async (carData) => {
      const response = await apiClient.post('/cars', carData);
      return response.data;
    },
    
    updateCar: async (carId, carData) => {
      const response = await apiClient.put(`/cars/${carId}`, carData);
      return response.data;
    },
    
    deleteCar: async (carId) => {
      const response = await apiClient.delete(`/cars/${carId}`);
      return response.data;
    },
    
    // User management
    getAllUsers: async (skip = 0, limit = 100) => {
      const response = await apiClient.get('/users', { params: { skip, limit } });
      return response.data;
    },
    
    updateUser: async (userId, userData) => {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return response.data;
    },
    
    deleteUser: async (userId) => {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    }
  };
  
  export { authService, carService, reviewService, userService, adminService };