import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ArrowLeft, Plus, Minus, Share2, BookOpen, User, Calendar } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useBooks } from '../context/BookContext';
import { Book } from '../types';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books } = useBooks();
  const { addToCart } = useCart();
  const [book, setBook] = useState<Book | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (id && books.length > 0) {
      const foundBook = books.find(b => b.id === id);
      setBook(foundBook || null);
      setIsLoading(false);
    }
  }, [id, books]);

  const handleAddToCart = () => {
    if (book) {
      addToCart(book, quantity);
      // Show success message or redirect
      alert(`${book.title} berhasil ditambahkan ke keranjang!`);
    }
  };

  const handleBuyNow = () => {
    if (book) {
      addToCart(book, quantity);
      navigate('/checkout');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat detail buku...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Buku Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-8">Buku yang Anda cari tidak tersedia</p>
            <button
              onClick={() => navigate('/')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1 hover:text-green-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali</span>
          </button>
          <span>/</span>
          <span>{book.category}</span>
          <span>/</span>
          <span className="text-gray-800 font-medium">{book.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Book Image */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Book Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">oleh {book.author}</p>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(book.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {book.rating} ({book.reviews} ulasan)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(book.price)}
              </span>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {book.stock > 0 ? (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">
                    Tersedia ({book.stock} stok)
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Stok Habis</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {book.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(book.stock, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-6">
              {book.stock > 0 ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Tambah ke Keranjang</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Beli Sekarang
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-gray-400 text-white py-3 px-6 rounded-lg cursor-not-allowed"
                >
                  Stok Habis
                </button>
              )}
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Book Details */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Detail Buku</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Kategori:</span>
                  <span className="ml-2 font-medium">{book.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tahun Terbit:</span>
                  <span className="ml-2 font-medium">{book.publishYear}</span>
                </div>
                <div>
                  <span className="text-gray-600">ISBN:</span>
                  <span className="ml-2 font-medium">{book.isbn}</span>
                </div>
                <div>
                  <span className="text-gray-600">Stok:</span>
                  <span className="ml-2 font-medium">{book.stock}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'description'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Deskripsi
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === 'reviews'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Ulasan ({book.reviews})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Deskripsi Buku</h3>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Ulasan Pembaca</h3>
                <div className="space-y-4">
                  {/* Mock reviews */}
                  <div className="border-b pb-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Ahmad Rizki</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">2 hari yang lalu</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Buku yang sangat bagus! Ceritanya menarik dan mudah dipahami. 
                      Sangat direkomendasikan untuk dibaca.
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Sari Dewi</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-400 fill-current"
                              />
                            ))}
                            <Star className="h-4 w-4 text-gray-300" />
                          </div>
                          <span className="text-sm text-gray-500">1 minggu yang lalu</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">
                      Kualitas buku bagus, pengiriman cepat. Isi bukunya sesuai ekspektasi.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;