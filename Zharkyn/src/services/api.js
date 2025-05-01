// src/services/api.js (extended with listing and blog functionality)
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

// Auth service
const authService = {
  login: async (credentials) => {
    const formData = new FormData();
    formData.append('username', credentials.username);
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

// Car service
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
    // Clean up filter data by removing empty strings and null values
    const cleanFilterData = {};
    
    Object.keys(filterData).forEach(key => {
      const value = filterData[key];
      if (value !== null && value !== undefined && value !== '') {
        cleanFilterData[key] = value;
      }
    });
    
    try {
      const response = await apiClient.post('/cars/search', cleanFilterData);
      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      throw error;
    }
  },
  
  // Listing management methods
  createListing: async (listingData) => {
    const response = await apiClient.post('/listings', listingData);
    return response.data;
  },
  
  getUserListings: async (status = null) => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/listings/user', { params });
    return response.data;
  },
  
  getListingById: async (id) => {
    const response = await apiClient.get(`/listings/${id}`);
    return response.data;
  },
  
  updateListing: async (id, data) => {
    const response = await apiClient.put(`/listings/${id}`, data);
    return response.data;
  },
  
  deleteListing: async (id) => {
    const response = await apiClient.delete(`/listings/${id}`);
    return response.data;
  },
  
  // Admin listing methods
  getAllListings: async (status = null, skip = 0, limit = 20) => {
    const params = { skip, limit };
    if (status) params.status = status;
    const response = await apiClient.get('/admin/listings', { params });
    return response.data;
  },
  
  moderateListing: async (listingId, status, comment = '') => {
    const response = await apiClient.put(`/admin/listings/${listingId}/moderate`, {
      status,
      moderator_comment: comment
    });
    return response.data;
  }
};

// Review service
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

// User service
const userService = {
  updateProfile: async (userId, userData) => {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  },
  
  getFavorites: async () => {
    const response = await apiClient.get('/users/me/favorites');
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

// Blog service
const blogService = {
  getAllBlogs: async (skip = 0, limit = 10) => {
    const response = await apiClient.get('/blogs', { params: { skip, limit } });
    return response.data;
  },
  
  getFeaturedBlogs: async (limit = 3) => {
    const response = await apiClient.get('/blogs/featured', { params: { limit } });
    return response.data;
  },
  
  getBlogById: async (id) => {
    const response = await apiClient.get(`/blogs/${id}`);
    // Increment views
    await apiClient.post(`/blogs/${id}/view`);
    return response.data;
  },
  
  getUserBlogs: async (status = null) => {
    const params = status ? { status } : {};
    const response = await apiClient.get('/blogs/user', { params });
    return response.data;
  },
  
  createBlog: async (blogData) => {
    const response = await apiClient.post('/blogs', blogData);
    return response.data;
  },
  
  updateBlog: async (id, data) => {
    const response = await apiClient.put(`/blogs/${id}`, data);
    return response.data;
  },
  
  deleteBlog: async (id) => {
    const response = await apiClient.delete(`/blogs/${id}`);
    return response.data;
  },
  
  // Blog interactions
  likeBlog: async (id) => {
    const response = await apiClient.post(`/blogs/${id}/like`);
    return response.data;
  },
  
  unlikeBlog: async (id) => {
    const response = await apiClient.delete(`/blogs/${id}/like`);
    return response.data;
  },
  
  addComment: async (blogId, comment) => {
    const response = await apiClient.post(`/blogs/${blogId}/comments`, { content: comment });
    return response.data;
  },
  
  deleteComment: async (blogId, commentId) => {
    const response = await apiClient.delete(`/blogs/${blogId}/comments/${commentId}`);
    return response.data;
  },
  
  // Admin blog moderation
  getAllBlogsAdmin: async (status = null, skip = 0, limit = 20) => {
    const params = { skip, limit };
    if (status) params.status = status;
    const response = await apiClient.get('/admin/blogs', { params });
    return response.data;
  },
  
  moderateBlog: async (blogId, status, comment = '') => {
    const response = await apiClient.put(`/admin/blogs/${blogId}/moderate`, {
      status,
      moderator_comment: comment
    });
    return response.data;
  }
};

// Admin service
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

export { 
  authService, 
  carService, 
  reviewService, 
  userService, 
  blogService, 
  adminService 
};