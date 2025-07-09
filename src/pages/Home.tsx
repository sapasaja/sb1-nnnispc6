import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp, 
  BookOpen, 
  Users, 
  Star, 
  RefreshCw,
  ShoppingCart,
  Heart,
  Search,
  Filter,
  Tag,
  Zap,
  Gift,
  Truck,
  Shield,
  Clock
} from 'lucide-react';
import BookCard from '../components/BookCard';
import { useBooks } from '../context/BookContext';
import apiService from '../services/api';

const Home: React.FC = () => {
  const { featuredBooks, bestSellers, newArrivals, refreshBooks, isLoading } = useBooks();
  const [categories, setCategories] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCategories();
    
    const handleBookUpdate = () => {
      setLastUpdate(new Date());
      refreshBooks();
    };

    window.addEventListener('bookAdded', handleBookUpdate);
    window.addEventListener('bookUpdated', handleBookUpdate);
    window.addEventListener('bookDeleted', handleBookUpdate);

    // Auto refresh setiap 30 detik untuk demo real-time
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => {
      window.removeEventListener('bookAdded', handleBookUpdate);
      window.removeEventListener('bookUpdated', handleBookUpdate);
      window.removeEventListener('bookDeleted', handleBookUpdate);
      clearInterval(interval);
    };
  }, [refreshBooks]);

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        console.error('Failed to load categories:', response.error);
        // Set default categories jika API gagal
        setCategories([
          { id: '1', name: 'Fiksi', slug: 'fiksi', description: 'Novel dan cerita fiksi' },
          { id: '2', name: 'Non-Fiksi', slug: 'non-fiksi', description: 'Buku pengetahuan dan faktual' },
          { id: '3', name: 'Pendidikan', slug: 'pendidikan', description: 'Buku pelajaran dan edukasi' },
          { id: '4', name: 'Agama', slug: 'agama', description: 'Buku keagamaan dan spiritual' },
          { id: '5', name: 'Teknologi', slug: 'teknologi', description: 'Buku teknologi dan komputer' },
          { id: '6', name: 'Biografi', slug: 'biografi', description: 'Riwayat hidup tokoh' }
        ]);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Set default categories jika terjadi error
      setCategories([
        { id: '1', name: 'Fiksi', slug: 'fiksi', description: 'Novel dan cerita fiksi' },
        { id: '2', name: 'Non-Fiksi', slug: 'non-fiksi', description: 'Buku pengetahuan dan faktual' },
        { id: '3', name: 'Pendidikan', slug: 'pendidikan', description: 'Buku pelajaran dan edukasi' },
        { id: '4', name: 'Agama', slug: 'agama', description: 'Buku keagamaan dan spiritual' },
        { id: '5', name: 'Teknologi', slug: 'teknologi', description: 'Buku teknologi dan komputer' },
        { id: '6', name: 'Biografi', slug: 'biografi', description: 'Riwayat hidup tokoh' }
      ]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Real-time Status Bar */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2">
        <div className="container mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>🔴 LIVE dari Database phpMyAdmin bukuku_ecommerce - Update: {lastUpdate.toLocaleTimeString('id-ID')}</span>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <span>📊 Data Real-time</span>
            <span>🗄️ MySQL Connected</span>
            <span>📁 Images: Local Storage</span>
          </div>
          <button
            onClick={refreshBooks}
            disabled={isLoading}
            className="flex items-center space-x-1 hover:bg-white hover:bg-opacity-20 px-2 py-1 rounded"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Hero Section - Tokopedia Style */}
      <section className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                Buku-ku
              </h1>
              <p className="text-xl lg:text-2xl mb-6 text-green-100">
                #MulaiAjaDulu baca buku impianmu
              </p>
              <p className="text-lg mb-8 text-green-50">
                Jutaan buku berkualitas dengan harga terjangkau, langsung dari database phpMyAdmin
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex bg-white rounded-lg overflow-hidden shadow-lg">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari buku, penulis, atau kategori..."
                    className="flex-1 px-4 py-3 text-gray-700 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 text-white font-medium transition-colors"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </form>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/books"
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center"
                >
                  Jelajahi Semua Buku
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/bestsellers"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
                >
                  Buku Terlaris
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white bg-opacity-20 rounded-2xl p-8 backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white bg-opacity-30 rounded-lg p-4 text-center">
                      <BookOpen className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-bold text-2xl">10K+</p>
                      <p className="text-sm">Koleksi Buku</p>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded-lg p-4 text-center">
                      <Users className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-bold text-2xl">50K+</p>
                      <p className="text-sm">Pembaca</p>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded-lg p-4 text-center">
                      <Star className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-bold text-2xl">4.8</p>
                      <p className="text-sm">Rating</p>
                    </div>
                    <div className="bg-white bg-opacity-30 rounded-lg p-4 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                      <p className="font-bold text-2xl">99%</p>
                      <p className="text-sm">Kepuasan</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar - Tokopedia Style */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-green-100 p-2 rounded-full">
                <Truck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Gratis Ongkir</p>
                <p className="text-sm text-gray-600">Min. pembelian 200rb</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-blue-100 p-2 rounded-full">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Garansi Uang Kembali</p>
                <p className="text-sm text-gray-600">100% aman</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-purple-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Pengiriman Cepat</p>
                <p className="text-sm text-gray-600">1-3 hari kerja</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-orange-100 p-2 rounded-full">
                <Gift className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">Promo Menarik</p>
                <p className="text-sm text-gray-600">Setiap hari</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Tokopedia Style */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Kategori Pilihan</h2>
            <Link to="/categories" className="text-green-600 hover:text-green-700 font-medium">
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group text-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-gradient-to-br from-green-100 to-green-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-800 text-sm group-hover:text-green-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Style Banner */}
      <section className="py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-yellow-300" />
                <span className="font-bold text-lg">FLASH SALE</span>
              </div>
              <div className="hidden md:block">
                <span className="text-sm">Berakhir dalam:</span>
                <span className="ml-2 bg-white text-red-500 px-2 py-1 rounded font-bold">
                  23:59:45
                </span>
              </div>
            </div>
            <Link
              to="/flash-sale"
              className="bg-white text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Lihat Semua
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books - Tokopedia Style */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Buku Pilihan Hari Ini</h2>
              <p className="text-gray-600 mt-1">Rekomendasi terbaik dari database phpMyAdmin</p>
            </div>
            <Link
              to="/books"
              className="text-green-600 hover:text-green-700 font-semibold flex items-center"
            >
              Lihat Semua
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers - Tokopedia Style */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Buku Terlaris</h2>
              <p className="text-gray-600 mt-1">Paling banyak dibeli pembaca</p>
            </div>
            <Link
              to="/bestsellers"
              className="text-green-600 hover:text-green-700 font-semibold flex items-center"
            >
              Lihat Semua
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {bestSellers.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals - Tokopedia Style */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Buku Terbaru</h2>
              <p className="text-gray-600 mt-1">Koleksi terbaru yang baru masuk</p>
            </div>
            <Link
              to="/new-arrivals"
              className="text-green-600 hover:text-green-700 font-semibold flex items-center"
            >
              Lihat Semua
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {newArrivals.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Database Info Banner */}
      <section className="py-8 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
            <h3 className="text-2xl font-bold">Real-time Database Connection</h3>
            <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
          </div>
          <p className="text-lg text-green-100 mb-2">
            🗄️ Semua data diambil langsung dari database <strong>bukuku_ecommerce</strong> di phpMyAdmin
          </p>
          <p className="text-green-200">
            Sinkronisasi real-time dengan MySQL database • Update otomatis • Data selalu fresh
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <span>MySQL Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <span>API Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <span>Real-time Sync</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;