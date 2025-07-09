import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Book } from '../types';
import { useCart } from '../context/CartContext';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link to={`/book/${book.id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {book.featured && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Pilihan
              </span>
            )}
            {book.stock <= 5 && book.stock > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Terbatas
              </span>
            )}
            {book.stock === 0 && (
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Habis
              </span>
            )}
          </div>

          {/* Hover Actions */}
          <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors">
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Discount Badge */}
          {book.rating >= 4.5 && (
            <div className="absolute bottom-2 left-2">
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Bestseller
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-green-600 transition-colors text-sm">
            {book.title}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{book.author}</p>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <Star className="h-3 w-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600 ml-1">{book.rating}</span>
            </div>
            <span className="text-xs text-gray-400 ml-2">({book.reviews})</span>
          </div>
          
          {/* Price */}
          <div className="mb-3">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(book.price)}
            </span>
          </div>
          
          {/* Stock Info */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500">
              {book.stock > 0 ? `Stok: ${book.stock}` : 'Stok habis'}
            </span>
            <span className="text-xs text-gray-400">{book.category}</span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={book.stock === 0}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{book.stock === 0 ? 'Stok Habis' : '+ Keranjang'}</span>
          </button>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;