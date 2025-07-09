import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import apiService from '../../services/api';

interface WishlistItem {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
    cover_image: string;
    stock: number;
    rating: number;
  };
  created_at: string;
}

const CustomerWishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getWishlist();
      if (response.success && response.data) {
        setWishlistItems(response.data);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      // Mock data for demo
      setWishlistItems([
        {
          id: '1',
          book: {
            id: '1',
            title: 'Laskar Pelangi',
            author: 'Andrea Hirata',
            price: 85000,
            cover_image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 25,
            rating: 4.8
          },
          created_at: '2024-01-15T08:00:00Z'
        },
        {
          id: '2',
          book: {
            id: '3',
            title: 'Atomic Habits',
            author: 'James Clear',
            price: 120000,
            cover_image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400',
            stock: 32,
            rating: 4.7
          },
          created_at: '2024-01-16T10:00:00Z'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (bookId: string) => {
    try {
      const response = await apiService.removeFromWishlist(bookId);
      if (response.success) {
        setWishlistItems(wishlistItems.filter(item => item.book.id !== bookId));
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleAddToCart = (book: any) => {
    addToCart(book);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Wishlist Saya</h1>
        <p className="text-gray-600">{wishlistItems.length} item</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat wishlist...</p>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Wishlist Anda masih kosong</p>
          <p className="text-gray-400 mt-2">Tambahkan buku favorit Anda ke wishlist</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={item.book.cover_image}
                  alt={item.book.title}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => handleRemoveFromWishlist(item.book.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
                >
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                  {item.book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{item.book.author}</p>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600 ml-1">{item.book.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    {formatPrice(item.book.price)}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item.book)}
                      disabled={item.book.stock === 0}
                      className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item.book.id)}
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  {item.book.stock > 0 ? `Stok: ${item.book.stock}` : 'Stok habis'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Ditambahkan: {new Date(item.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerWishlist;