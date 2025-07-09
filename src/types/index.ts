export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  coverImage: string;
  publishYear: number;
  isbn: string;
  rating: number;
  reviews: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  bookId: string;
  quantity: number;
  book: Book;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}