// Mock API Service untuk simulasi backend PHP dan database phpMyAdmin
// Data ini mensimulasikan data dari database bukuku_ecommerce

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Mock data dari database phpMyAdmin
const mockUsers = [
  {
    id: '1',
    email: 'admin@bukuku.com',
    password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Administrator',
    role: 'admin',
    phone: '081234567890',
    address: 'Jakarta, Indonesia',
    status: 'active',
    email_verified: true,
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    email: 'customer@bukuku.com',
    password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Customer Demo',
    role: 'customer',
    phone: '081234567891',
    address: 'Bandung, Indonesia',
    status: 'active',
    email_verified: true,
    created_at: '2024-01-15T08:00:00Z'
  }
];

const mockCategories = [
  { id: '1', name: 'Fiksi', slug: 'fiksi', description: 'Novel dan cerita fiksi', created_at: '2024-01-15T08:00:00Z' },
  { id: '2', name: 'Non-Fiksi', slug: 'non-fiksi', description: 'Buku pengetahuan dan faktual', created_at: '2024-01-15T08:00:00Z' },
  { id: '3', name: 'Pendidikan', slug: 'pendidikan', description: 'Buku pelajaran dan edukasi', created_at: '2024-01-15T08:00:00Z' },
  { id: '4', name: 'Agama', slug: 'agama', description: 'Buku keagamaan dan spiritual', created_at: '2024-01-15T08:00:00Z' },
  { id: '5', name: 'Teknologi', slug: 'teknologi', description: 'Buku teknologi dan komputer', created_at: '2024-01-15T08:00:00Z' },
  { id: '6', name: 'Biografi', slug: 'biografi', description: 'Riwayat hidup tokoh', created_at: '2024-01-15T08:00:00Z' }
];

let mockBooks = [
  {
    id: '1',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    price: 85000,
    description: 'Novel yang mengisahkan tentang perjuangan anak-anak sekolah di Belitung untuk mendapatkan pendidikan yang layak.',
    category: 'Fiksi',
    category_id: 1,
    stock: 25,
    coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    publishYear: 2005,
    isbn: '9789792218305',
    rating: 4.8,
    reviews: 1250,
    featured: true,
    bestseller: true,
    new_arrival: false,
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    title: 'Bumi Manusia',
    author: 'Pramoedya Ananta Toer',
    price: 95000,
    description: 'Novel sejarah Indonesia yang menceritakan kehidupan pada masa kolonial Belanda.',
    category: 'Fiksi',
    category_id: 1,
    stock: 18,
    coverImage: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400',
    publishYear: 1980,
    isbn: '9789794338045',
    rating: 4.9,
    reviews: 2100,
    featured: true,
    bestseller: true,
    new_arrival: false,
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '3',
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 120000,
    description: 'Panduan praktis untuk membangun kebiasaan baik dan menghilangkan kebiasaan buruk.',
    category: 'Non-Fiksi',
    category_id: 2,
    stock: 32,
    coverImage: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400',
    publishYear: 2018,
    isbn: '9780735211292',
    rating: 4.7,
    reviews: 890,
    featured: true,
    bestseller: true,
    new_arrival: false,
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '4',
    title: 'Sejarah Indonesia Modern',
    author: 'M.C. Ricklefs',
    price: 150000,
    description: 'Sejarah lengkap Indonesia dari masa kolonial hingga era reformasi.',
    category: 'Pendidikan',
    category_id: 3,
    stock: 15,
    coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    publishYear: 2020,
    isbn: '9786020633473',
    rating: 4.6,
    reviews: 456,
    featured: false,
    bestseller: false,
    new_arrival: true,
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '5',
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    price: 180000,
    description: 'Panduan terbaik untuk memahami JavaScript dan praktik terbaik programming.',
    category: 'Teknologi',
    category_id: 5,
    stock: 22,
    coverImage: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400',
    publishYear: 2008,
    isbn: '9780596517748',
    rating: 4.5,
    reviews: 678,
    featured: false,
    bestseller: false,
    new_arrival: true,
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '6',
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    price: 165000,
    description: 'Biografi lengkap pendiri Apple Inc yang mengubah dunia teknologi.',
    category: 'Biografi',
    category_id: 6,
    stock: 12,
    coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    publishYear: 2011,
    isbn: '9781451648539',
    rating: 4.4,
    reviews: 1890,
    featured: false,
    bestseller: false,
    new_arrival: true,
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '7',
    title: 'Negeri 5 Menara',
    author: 'Ahmad Fuadi',
    price: 78000,
    description: 'Novel inspiratif tentang perjuangan santri meraih mimpi.',
    category: 'Fiksi',
    category_id: 1,
    stock: 28,
    coverImage: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400',
    publishYear: 2009,
    isbn: '9789792248661',
    rating: 4.6,
    reviews: 1567,
    featured: true,
    bestseller: false,
    new_arrival: false,
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '8',
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    price: 135000,
    description: 'Panduan spiritual untuk hidup di masa sekarang.',
    category: 'Agama',
    category_id: 4,
    stock: 19,
    coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    publishYear: 1997,
    isbn: '9781577314806',
    rating: 4.3,
    reviews: 723,
    featured: false,
    bestseller: false,
    new_arrival: false,
    status: 'active',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z'
  }
];

let mockOrders = [
  {
    id: '1',
    order_number: 'BK-2024-001',
    user_id: '2',
    customer_name: 'Customer Demo',
    customer_email: 'customer@bukuku.com',
    total_amount: 250000,
    status: 'pending',
    payment_status: 'pending',
    created_at: '2024-01-15T10:00:00Z',
    items: [
      { book_title: 'Laskar Pelangi', quantity: 2, price: 85000 },
      { book_title: 'Negeri 5 Menara', quantity: 1, price: 78000 }
    ]
  },
  {
    id: '2',
    order_number: 'BK-2024-002',
    user_id: '3',
    customer_name: 'John Doe',
    customer_email: 'john.doe@email.com',
    total_amount: 180000,
    status: 'processing',
    payment_status: 'paid',
    created_at: '2024-01-14T15:30:00Z',
    items: [
      { book_title: 'Atomic Habits', quantity: 1, price: 120000 },
      { book_title: 'The Power of Now', quantity: 1, price: 135000 }
    ]
  }
];

class MockApiService {
  private delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Auth API
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    await this.delay();
    
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return {
        success: false,
        error: 'Email tidak ditemukan atau akun tidak aktif'
      };
    }

    // Simulasi password verification (dalam real app gunakan bcrypt)
    if (password !== 'password') {
      return {
        success: false,
        error: 'Password salah'
      };
    }

    const token = btoa(user.id + ':' + Date.now());
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      address: user.address,
      createdAt: user.created_at
    };

    return {
      success: true,
      message: 'Login berhasil',
      data: {
        user: userData,
        token: token
      }
    };
  }

  async register(userData: any): Promise<ApiResponse<any>> {
    await this.delay();

    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        success: false,
        error: 'Email sudah terdaftar'
      };
    }

    const newUser = {
      id: this.generateId(),
      email: userData.email,
      password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // hashed password
      name: userData.name,
      role: 'customer',
      phone: userData.phone || null,
      address: userData.address || null,
      status: 'active',
      email_verified: true,
      created_at: new Date().toISOString()
    };

    mockUsers.push(newUser);

    const token = btoa(newUser.id + ':' + Date.now());
    const responseUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
      address: newUser.address,
      createdAt: newUser.created_at
    };

    return {
      success: true,
      message: 'Registrasi berhasil',
      data: {
        user: responseUser,
        token: token
      }
    };
  }

  async logout(): Promise<ApiResponse<any>> {
    await this.delay(200);
    return { success: true, message: 'Logout berhasil' };
  }

  // Books API
  async getBooks(params?: any): Promise<ApiResponse<any>> {
    await this.delay();

    let filteredBooks = [...mockBooks];

    if (params?.featured) {
      filteredBooks = filteredBooks.filter(book => book.featured);
    }

    if (params?.bestseller) {
      filteredBooks = filteredBooks.filter(book => book.bestseller);
    }

    if (params?.new_arrival) {
      filteredBooks = filteredBooks.filter(book => book.new_arrival);
    }

    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
      );
    }

    if (params?.category) {
      filteredBooks = filteredBooks.filter(book => 
        book.category.toLowerCase() === params.category.toLowerCase()
      );
    }

    const limit = params?.limit || 50;
    filteredBooks = filteredBooks.slice(0, limit);

    return {
      success: true,
      data: filteredBooks,
      message: `Data dari database phpMyAdmin - bukuku_ecommerce`
    };
  }

  async getBook(id: string): Promise<ApiResponse<any>> {
    await this.delay();
    const book = mockBooks.find(b => b.id === id);
    
    if (!book) {
      return {
        success: false,
        error: 'Buku tidak ditemukan'
      };
    }

    return {
      success: true,
      data: book
    };
  }

  async createBook(bookData: any): Promise<ApiResponse<any>> {
    await this.delay();

    const newBook = {
      id: this.generateId(),
      title: bookData.title || bookData.get?.('title'),
      author: bookData.author || bookData.get?.('author'),
      price: parseFloat(bookData.price || bookData.get?.('price') || '0'),
      description: bookData.description || bookData.get?.('description'),
      category: bookData.category || bookData.get?.('category'),
      category_id: mockCategories.find(c => c.name === (bookData.category || bookData.get?.('category')))?.id || '1',
      stock: parseInt(bookData.stock || bookData.get?.('stock') || '0'),
      coverImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
      publishYear: parseInt(bookData.publishYear || bookData.get?.('publishYear') || new Date().getFullYear().toString()),
      isbn: bookData.isbn || bookData.get?.('isbn'),
      rating: 0,
      reviews: 0,
      featured: bookData.featured || bookData.get?.('featured') === 'true' || false,
      bestseller: bookData.bestseller || bookData.get?.('bestseller') === 'true' || false,
      new_arrival: bookData.new_arrival || bookData.get?.('new_arrival') === 'true' || true,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    mockBooks.push(newBook);

    return {
      success: true,
      data: newBook,
      message: 'Buku berhasil ditambahkan ke database phpMyAdmin'
    };
  }

  async updateBook(id: string, bookData: any): Promise<ApiResponse<any>> {
    await this.delay();

    const bookIndex = mockBooks.findIndex(b => b.id === id);
    if (bookIndex === -1) {
      return {
        success: false,
        error: 'Buku tidak ditemukan'
      };
    }

    const updatedBook = {
      ...mockBooks[bookIndex],
      title: bookData.title || bookData.get?.('title') || mockBooks[bookIndex].title,
      author: bookData.author || bookData.get?.('author') || mockBooks[bookIndex].author,
      price: parseFloat(bookData.price || bookData.get?.('price') || mockBooks[bookIndex].price.toString()),
      description: bookData.description || bookData.get?.('description') || mockBooks[bookIndex].description,
      category: bookData.category || bookData.get?.('category') || mockBooks[bookIndex].category,
      stock: parseInt(bookData.stock || bookData.get?.('stock') || mockBooks[bookIndex].stock.toString()),
      publishYear: parseInt(bookData.publishYear || bookData.get?.('publishYear') || mockBooks[bookIndex].publishYear.toString()),
      isbn: bookData.isbn || bookData.get?.('isbn') || mockBooks[bookIndex].isbn,
      featured: bookData.featured || bookData.get?.('featured') === 'true' || mockBooks[bookIndex].featured,
      bestseller: bookData.bestseller || bookData.get?.('bestseller') === 'true' || mockBooks[bookIndex].bestseller,
      new_arrival: bookData.new_arrival || bookData.get?.('new_arrival') === 'true' || mockBooks[bookIndex].new_arrival,
      updatedAt: new Date().toISOString()
    };

    mockBooks[bookIndex] = updatedBook;

    return {
      success: true,
      data: updatedBook,
      message: 'Buku berhasil diupdate di database phpMyAdmin'
    };
  }

  async deleteBook(id: string): Promise<ApiResponse<any>> {
    await this.delay();

    const bookIndex = mockBooks.findIndex(b => b.id === id);
    if (bookIndex === -1) {
      return {
        success: false,
        error: 'Buku tidak ditemukan'
      };
    }

    mockBooks.splice(bookIndex, 1);

    return {
      success: true,
      message: 'Buku berhasil dihapus dari database phpMyAdmin'
    };
  }

  // Categories API
  async getCategories(): Promise<ApiResponse<any>> {
    await this.delay();
    return {
      success: true,
      data: mockCategories
    };
  }

  // Users API
  async getUsers(params?: any): Promise<ApiResponse<any>> {
    await this.delay();

    let filteredUsers = mockUsers.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      address: user.address,
      status: user.status,
      email_verified: user.email_verified,
      created_at: user.created_at
    }));

    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    if (params?.role) {
      filteredUsers = filteredUsers.filter(user => user.role === params.role);
    }

    if (params?.status) {
      filteredUsers = filteredUsers.filter(user => user.status === params.status);
    }

    return {
      success: true,
      data: filteredUsers
    };
  }

  async createUser(userData: any): Promise<ApiResponse<any>> {
    await this.delay();

    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        success: false,
        error: 'Email sudah terdaftar'
      };
    }

    const newUser = {
      id: this.generateId(),
      email: userData.email,
      password: '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      name: userData.name,
      role: userData.role || 'customer',
      phone: userData.phone || null,
      address: userData.address || null,
      status: 'active',
      email_verified: true,
      created_at: new Date().toISOString()
    };

    mockUsers.push(newUser);

    return {
      success: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address,
        status: newUser.status,
        email_verified: newUser.email_verified,
        created_at: newUser.created_at
      },
      message: 'User berhasil ditambahkan ke database phpMyAdmin'
    };
  }

  async updateUser(id: string, userData: any): Promise<ApiResponse<any>> {
    await this.delay();

    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return {
        success: false,
        error: 'User tidak ditemukan'
      };
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...userData
    };

    return {
      success: true,
      data: {
        id: mockUsers[userIndex].id,
        email: mockUsers[userIndex].email,
        name: mockUsers[userIndex].name,
        role: mockUsers[userIndex].role,
        phone: mockUsers[userIndex].phone,
        address: mockUsers[userIndex].address,
        status: mockUsers[userIndex].status,
        email_verified: mockUsers[userIndex].email_verified,
        created_at: mockUsers[userIndex].created_at
      },
      message: 'User berhasil diupdate di database phpMyAdmin'
    };
  }

  async deleteUser(id: string): Promise<ApiResponse<any>> {
    await this.delay();

    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return {
        success: false,
        error: 'User tidak ditemukan'
      };
    }

    mockUsers.splice(userIndex, 1);

    return {
      success: true,
      message: 'User berhasil dihapus dari database phpMyAdmin'
    };
  }

  // Orders API
  async getOrders(params?: any): Promise<ApiResponse<any>> {
    await this.delay();

    let filteredOrders = [...mockOrders];

    if (params?.status) {
      filteredOrders = filteredOrders.filter(order => order.status === params.status);
    }

    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        order.order_number.toLowerCase().includes(searchTerm) ||
        order.customer_name.toLowerCase().includes(searchTerm) ||
        order.customer_email.toLowerCase().includes(searchTerm)
      );
    }

    return {
      success: true,
      data: filteredOrders
    };
  }

  async updateOrderStatus(id: string, status: string): Promise<ApiResponse<any>> {
    await this.delay();

    const orderIndex = mockOrders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return {
        success: false,
        error: 'Pesanan tidak ditemukan'
      };
    }

    mockOrders[orderIndex].status = status as any;

    return {
      success: true,
      data: mockOrders[orderIndex],
      message: 'Status pesanan berhasil diupdate di database phpMyAdmin'
    };
  }

  // Dashboard Stats API
  async getDashboardStats(): Promise<ApiResponse<any>> {
    await this.delay();

    const stats = {
      totalRevenue: 2500000,
      totalOrders: mockOrders.length,
      totalBooks: mockBooks.length,
      totalUsers: mockUsers.length,
      revenueGrowth: 15,
      ordersGrowth: 23,
      topBooks: [
        { title: 'Laskar Pelangi', author: 'Andrea Hirata', sales: 150, revenue: 12750000 },
        { title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', sales: 120, revenue: 11400000 },
        { title: 'Atomic Habits', author: 'James Clear', sales: 100, revenue: 12000000 }
      ],
      topCategories: [
        { name: 'Fiksi', sales: 300, revenue: 25000000 },
        { name: 'Non-Fiksi', sales: 200, revenue: 18000000 },
        { name: 'Pendidikan', sales: 150, revenue: 15000000 }
      ],
      salesByMonth: [
        { month: 'Jan', revenue: 2000000, orders: 45 },
        { month: 'Feb', revenue: 2200000, orders: 52 },
        { month: 'Mar', revenue: 2500000, orders: 58 },
        { month: 'Apr', revenue: 2800000, orders: 65 },
        { month: 'May', revenue: 3000000, orders: 70 },
        { month: 'Jun', revenue: 3200000, orders: 75 }
      ]
    };

    return {
      success: true,
      data: stats,
      message: 'Data statistik dari database phpMyAdmin - bukuku_ecommerce'
    };
  }

  // Settings API
  async getSettings(): Promise<ApiResponse<any>> {
    await this.delay();

    const settings = {
      site_name: 'Buku-ku',
      site_description: 'Toko buku online terpercaya dengan koleksi lengkap',
      contact_email: 'info@bukuku.com',
      contact_phone: '+62 21 1234 5678',
      contact_address: 'Jakarta, Indonesia',
      ipaymu_va: '0000001225297227',
      ipaymu_api_key: 'SANDBOX159D00F3-EA61-4AC0-987E-79CE088BEA7A',
      shipping_cost: '15000',
      free_shipping_minimum: '200000',
      currency: 'IDR'
    };

    return {
      success: true,
      data: settings
    };
  }

  async updateSettings(settings: any): Promise<ApiResponse<any>> {
    await this.delay();
    return {
      success: true,
      message: 'Pengaturan berhasil disimpan ke database phpMyAdmin'
    };
  }

  // Generic request method untuk kompatibilitas
  async request(endpoint: string, options: any = {}): Promise<ApiResponse<any>> {
    await this.delay();
    
    // Route berdasarkan endpoint
    if (endpoint.includes('/books')) {
      return this.getBooks();
    } else if (endpoint.includes('/categories')) {
      return this.getCategories();
    } else if (endpoint.includes('/users')) {
      return this.getUsers();
    } else if (endpoint.includes('/orders')) {
      return this.getOrders();
    } else if (endpoint.includes('/dashboard/stats')) {
      return this.getDashboardStats();
    } else if (endpoint.includes('/settings')) {
      return this.getSettings();
    }

    return {
      success: true,
      data: [],
      message: 'Mock API response'
    };
  }
}

export const mockApiService = new MockApiService();
export default mockApiService;