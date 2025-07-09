import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, ShoppingCart, DollarSign, TrendingUp, Package } from 'lucide-react';
import apiService from '../../services/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsResponse, ordersResponse] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getOrders({ limit: 5 })
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.data);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Diproses' },
      shipped: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Dikirim' },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat dashboard dari database...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Data real-time dari database phpMyAdmin - bukuku_ecommerce</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Buku</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.totalBooks || 0}</p>
                <p className="text-sm text-green-600 mt-1">Dari database</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pengguna</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.totalUsers || 0}</p>
                <p className="text-sm text-green-600 mt-1">Terdaftar</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.totalOrders || 0}</p>
                <p className="text-sm text-green-600 mt-1">+{stats?.ordersGrowth || 0}%</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <ShoppingCart className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pendapatan</p>
                <p className="text-2xl font-bold text-gray-800">{formatPrice(stats?.totalRevenue || 0)}</p>
                <p className="text-sm text-green-600 mt-1">+{stats?.revenueGrowth || 0}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Pesanan Terbaru</h2>
              <Link to="/admin/orders" className="text-green-600 hover:text-green-700 font-medium">
                Lihat Semua
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders.slice(0, 4).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">#{order.order_number}</p>
                    <p className="text-sm text-gray-600">{order.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{formatPrice(order.total_amount)}</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/books/add"
                className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <BookOpen className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-green-600">Tambah Buku</span>
              </Link>
              <Link
                to="/admin/users"
                className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-blue-600">Kelola User</span>
              </Link>
              <Link
                to="/admin/orders"
                className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Package className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-purple-600">Kelola Pesanan</span>
              </Link>
              <Link
                to="/admin/analytics"
                className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <TrendingUp className="h-8 w-8 text-yellow-600 mb-2" />
                <span className="text-sm font-medium text-yellow-600">Analitik</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Database Info */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 text-sm font-medium">🗄️ Database Connection Status</p>
          <p className="text-green-700 text-xs mt-1">
            Connected to: bukuku_ecommerce (phpMyAdmin)<br />
            Last updated: {new Date().toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;