// API Service untuk komunikasi dengan backend PHP dan database phpMyAdmin
// Fallback ke Mock API jika backend tidak tersedia
import mockApiService from './mockApi';

const API_BASE_URL = 'http://localhost/bukuku-api'; // URL backend PHP Anda
const USE_MOCK_API = false; // Set ke false jika backend PHP sudah ready

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Gunakan Mock API jika backend tidak tersedia
    if (USE_MOCK_API) {
      console.log('🔄 Menggunakan Mock API (simulasi database phpMyAdmin)');
      return mockApiService.request(endpoint, options) as Promise<ApiResponse<T>>;
    }

    try {
      console.log('🌐 Connecting to PHP Backend:', `${API_BASE_URL}${endpoint}`);
      const token = localStorage.getItem('auth_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      // Hapus Content-Type untuk FormData
      if (options.body instanceof FormData) {
        delete headers['Content-Type'];
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      console.log('🔄 Fallback to Mock API due to backend error');
      // Fallback ke Mock API jika backend error
      return mockApiService.request(endpoint, options) as Promise<ApiResponse<T>>;
    }
  }

  // Auth API
  async login(email: string, password: string) {
    if (USE_MOCK_API) {
      console.log('🔐 Mock Login - Database: bukuku_ecommerce');
      return mockApiService.login(email, password);
    }

    return this.request('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    if (USE_MOCK_API) {
      console.log('👤 Mock Register - Database: bukuku_ecommerce');
      return mockApiService.register(userData);
    }

    return this.request('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    if (USE_MOCK_API) {
      return mockApiService.logout();
    }

    return this.request('/auth/logout.php', {
      method: 'POST',
    });
  }

  // Books API - Semua data dari database phpMyAdmin
  async getBooks(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
    featured?: boolean;
    bestseller?: boolean;
    new_arrival?: boolean;
  }) {
    if (USE_MOCK_API) {
      console.log('📚 Mock Books API - Database: bukuku_ecommerce.books');
      return mockApiService.getBooks(params);
    }

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/books/index.php?${queryParams}`);
  }

  async getBook(id: string) {
    if (USE_MOCK_API) {
      return mockApiService.getBook(id);
    }

    return this.request(`/books/show.php?id=${id}`);
  }

  async createBook(bookData: FormData) {
    if (USE_MOCK_API) {
      console.log('➕ Mock Create Book - Database: bukuku_ecommerce.books');
      return mockApiService.createBook(bookData);
    }

    // Handle image upload to local storage with date folder structure
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    
    // Add folder structure info to FormData
    bookData.append('upload_path', `${year}/${month}/${day}`);

    return this.request('/books/create.php', {
      method: 'POST',
      body: bookData,
    });
  }

  async updateBook(id: string, bookData: FormData) {
    if (USE_MOCK_API) {
      console.log('✏️ Mock Update Book - Database: bukuku_ecommerce.books');
      return mockApiService.updateBook(id, bookData);
    }

    // Handle image upload to local storage with date folder structure
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    
    // Add folder structure info to FormData
    bookData.append('upload_path', `${year}/${month}/${day}`);
    return this.request(`/books/update.php?id=${id}`, {
      method: 'POST',
      body: bookData,
    });
  }

  async deleteBook(id: string) {
    if (USE_MOCK_API) {
      console.log('🗑️ Mock Delete Book - Database: bukuku_ecommerce.books');
      return mockApiService.deleteBook(id);
    }

    return this.request(`/books/delete.php?id=${id}`, {
      method: 'DELETE',
    });
  }

  // Users API - Data dari tabel users di phpMyAdmin
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    if (USE_MOCK_API) {
      console.log('👥 Mock Users API - Database: bukuku_ecommerce.users');
      return mockApiService.getUsers(params);
    }

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/users/index.php?${queryParams}`);
  }

  async getUser(id: string) {
    if (USE_MOCK_API) {
      return mockApiService.request(`/users/show.php?id=${id}`);
    }

    return this.request(`/users/show.php?id=${id}`);
  }

  async createUser(userData: any) {
    if (USE_MOCK_API) {
      console.log('➕ Mock Create User - Database: bukuku_ecommerce.users');
      return mockApiService.createUser(userData);
    }

    return this.request('/users/create.php', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any) {
    if (USE_MOCK_API) {
      console.log('✏️ Mock Update User - Database: bukuku_ecommerce.users');
      return mockApiService.updateUser(id, userData);
    }

    return this.request(`/users/update.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    if (USE_MOCK_API) {
      console.log('🗑️ Mock Delete User - Database: bukuku_ecommerce.users');
      return mockApiService.deleteUser(id);
    }

    return this.request(`/users/delete.php?id=${id}`, {
      method: 'DELETE',
    });
  }

  async updateProfile(userData: any) {
    if (USE_MOCK_API) {
      return mockApiService.request('/users/profile.php', { method: 'POST', body: JSON.stringify(userData) });
    }

    return this.request('/users/profile.php', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(passwordData: any) {
    if (USE_MOCK_API) {
      return mockApiService.request('/users/change-password.php', { method: 'POST', body: JSON.stringify(passwordData) });
    }

    return this.request('/users/change-password.php', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  // Orders API - Data dari tabel orders di phpMyAdmin
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    user_id?: string;
  }) {
    if (USE_MOCK_API) {
      console.log('📦 Mock Orders API - Database: bukuku_ecommerce.orders');
      return mockApiService.getOrders(params);
    }

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/orders/index.php?${queryParams}`);
  }

  async getOrder(id: string) {
    if (USE_MOCK_API) {
      return mockApiService.request(`/orders/show.php?id=${id}`);
    }

    return this.request(`/orders/show.php?id=${id}`);
  }

  async createOrder(orderData: any) {
    if (USE_MOCK_API) {
      return mockApiService.request('/orders/create.php', { method: 'POST', body: JSON.stringify(orderData) });
    }

    return this.request('/orders/create.php', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id: string, status: string) {
    if (USE_MOCK_API) {
      console.log('📝 Mock Update Order Status - Database: bukuku_ecommerce.orders');
      return mockApiService.updateOrderStatus(id, status);
    }

    return this.request(`/orders/update-status.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  async updateOrderTracking(id: string, trackingData: any) {
    if (USE_MOCK_API) {
      console.log('📦 Mock Update Order Tracking - Database: bukuku_ecommerce.orders');
      return mockApiService.request(`/orders/update-tracking.php?id=${id}`, { method: 'POST', body: JSON.stringify(trackingData) });
    }

    return this.request(`/orders/update-tracking.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify(trackingData),
    });
  }

  async cancelOrder(id: string) {
    if (USE_MOCK_API) {
      return mockApiService.request(`/orders/cancel.php?id=${id}`, { method: 'POST' });
    }

    return this.request(`/orders/cancel.php?id=${id}`, {
      method: 'POST',
    });
  }

  // Categories API - Data dari tabel categories di phpMyAdmin
  async getCategories() {
    if (USE_MOCK_API) {
      console.log('🏷️ Mock Categories API - Database: bukuku_ecommerce.categories');
      return mockApiService.getCategories();
    }

    return this.request('/categories/index.php');
  }

  async getCategory(id: string) {
    if (USE_MOCK_API) {
      return mockApiService.request(`/categories/show.php?id=${id}`);
    }

    return this.request(`/categories/show.php?id=${id}`);
  }

  async createCategory(categoryData: any) {
    if (USE_MOCK_API) {
      return mockApiService.request('/categories/create.php', { method: 'POST', body: JSON.stringify(categoryData) });
    }

    return this.request('/categories/create.php', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: any) {
    if (USE_MOCK_API) {
      return mockApiService.request(`/categories/update.php?id=${id}`, { method: 'POST', body: JSON.stringify(categoryData) });
    }

    return this.request(`/categories/update.php?id=${id}`, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string) {
    if (USE_MOCK_API) {
      return mockApiService.request(`/categories/delete.php?id=${id}`, { method: 'DELETE' });
    }

    return this.request(`/categories/delete.php?id=${id}`, {
      method: 'DELETE',
    });
  }

  // Cart API - Data dari tabel carts di phpMyAdmin
  async getCart() {
    return this.request('/cart/index.php');
  }

  async addToCart(bookId: string, quantity: number) {
    return this.request('/cart/add.php', {
      method: 'POST',
      body: JSON.stringify({ book_id: bookId, quantity }),
    });
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.request(`/cart/update.php?id=${itemId}`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: string) {
    return this.request(`/cart/remove.php?id=${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart/clear.php', {
      method: 'DELETE',
    });
  }

  // Reviews API - Data dari tabel reviews di phpMyAdmin
  async getReviews(bookId: string) {
    return this.request(`/reviews/index.php?book_id=${bookId}`);
  }

  async createReview(bookId: string, reviewData: any) {
    return this.request('/reviews/create.php', {
      method: 'POST',
      body: JSON.stringify({ ...reviewData, book_id: bookId }),
    });
  }

  async updateReview(reviewId: string, reviewData: any) {
    return this.request(`/reviews/update.php?id=${reviewId}`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(reviewId: string) {
    return this.request(`/reviews/delete.php?id=${reviewId}`, {
      method: 'DELETE',
    });
  }

  // Wishlist API - Data dari tabel wishlists di phpMyAdmin
  async getWishlist() {
    return this.request('/wishlist/index.php');
  }

  async addToWishlist(bookId: string) {
    return this.request('/wishlist/add.php', {
      method: 'POST',
      body: JSON.stringify({ book_id: bookId }),
    });
  }

  async removeFromWishlist(bookId: string) {
    return this.request(`/wishlist/remove.php?book_id=${bookId}`, {
      method: 'DELETE',
    });
  }

  // Settings API - Data dari tabel settings di phpMyAdmin
  async getSettings() {
    if (USE_MOCK_API) {
      console.log('⚙️ Mock Settings API - Database: bukuku_ecommerce.settings');
      return mockApiService.getSettings();
    }

    return this.request('/settings/index.php');
  }

  async updateSettings(settings: any) {
    if (USE_MOCK_API) {
      console.log('💾 Mock Update Settings - Database: bukuku_ecommerce.settings');
      return mockApiService.updateSettings(settings);
    }

    return this.request('/settings/update.php', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  }

  // Dashboard Stats API - Data real dari database phpMyAdmin
  async getDashboardStats() {
    if (USE_MOCK_API) {
      console.log('📊 Mock Dashboard Stats - Database: bukuku_ecommerce');
      return mockApiService.getDashboardStats();
    }

    return this.request('/dashboard/stats.php');
  }

  async getRecentActivity() {
    if (USE_MOCK_API) {
      return mockApiService.request('/dashboard/recent-activity.php');
    }

    return this.request('/dashboard/recent-activity.php');
  }

  async getSalesReport(params?: {
    start_date?: string;
    end_date?: string;
    period?: string;
  }) {
    if (USE_MOCK_API) {
      return mockApiService.request('/dashboard/sales-report.php');
    }

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return this.request(`/dashboard/sales-report.php?${queryParams}`);
  }

  // Payment API (ipaymu integration) - Data dari tabel orders
  async createPayment(orderData: any) {
    return this.request('/payment/create.php', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async checkPaymentStatus(orderId: string) {
    return this.request(`/payment/status.php?order_id=${orderId}`);
  }

  async handlePaymentCallback(callbackData: any) {
    return this.request('/payment/callback.php', {
      method: 'POST',
      body: JSON.stringify(callbackData),
    });
  }

  // Banners API - Data dari tabel banners di phpMyAdmin
  async getBanners(position?: string) {
    const queryParams = position ? `?position=${position}` : '';
    return this.request(`/banners/index.php${queryParams}`);
  }

  async createBanner(bannerData: FormData) {
    return this.request('/banners/create.php', {
      method: 'POST',
      body: bannerData,
    });
  }

  async updateBanner(id: string, bannerData: FormData) {
    return this.request(`/banners/update.php?id=${id}`, {
      method: 'POST',
      body: bannerData,
    });
  }

  async deleteBanner(id: string) {
    return this.request(`/banners/delete.php?id=${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;