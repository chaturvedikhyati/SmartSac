// ===== API CLIENT =====
// Centralized API communication module

const API_CONFIG = {
  baseURL: 'http://localhost:5000/api', // Change to your backend URL
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to get auth token
function getAuthToken() {
  return localStorage.getItem('auth_token');
}

// Helper function to set auth header
function getHeaders() {
  const headers = { ...API_CONFIG.headers };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Fetch wrapper with error handling
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'API Error');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ===== API ENDPOINTS =====
const API = {
  // Classification
  classify: async (formData) => {
    return fetchAPI('/classify', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    });
  },

  getResult: async (id) => {
    return fetchAPI(`/result/${id}`, { method: 'GET' });
  },

  // History
  getHistory: async (params = {}) => {
    const query = new URLSearchParams(params);
    return fetchAPI(`/history?${query}`, { method: 'GET' });
  },

  // Dashboard
  getDashboard: async () => {
    return fetchAPI('/dashboard', { method: 'GET' });
  },

  // Admin Endpoints
  getAdminStats: async () => {
    return fetchAPI('/admin/stats', { method: 'GET' });
  },

  getClassifications: async (params = {}) => {
    const query = new URLSearchParams(params);
    return fetchAPI(`/admin/classifications?${query}`, { method: 'GET' });
  },

  deleteClassification: async (id) => {
    return fetchAPI(`/admin/classifications/${id}`, { method: 'DELETE' });
  },

  // Categories
  getCategories: async () => {
    return fetchAPI('/admin/categories', { method: 'GET' });
  },

  createCategory: async (data) => {
    return fetchAPI('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCategory: async (id, data) => {
    return fetchAPI(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCategory: async (id) => {
    return fetchAPI(`/admin/categories/${id}`, { method: 'DELETE' });
  },

  // Recommendations
  getRecommendations: async () => {
    return fetchAPI('/admin/recommendations', { method: 'GET' });
  },

  createRecommendation: async (data) => {
    return fetchAPI('/admin/recommendations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateRecommendation: async (id, data) => {
    return fetchAPI(`/admin/recommendations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteRecommendation: async (id) => {
    return fetchAPI(`/admin/recommendations/${id}`, { method: 'DELETE' });
  },
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = API;
}
