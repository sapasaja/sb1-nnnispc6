import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Package, CreditCard, TrendingUp, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
  wishlistCount: number;
  recentOrders: Array<{
    id: string;
    order_number: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
}

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load customer-specific data from database
      const [ordersResponse] = await Promise.all([
        apiService.getOrders({ user_id: user?.id, limit: 10 })
      ]);

      if (ordersResponse.success && ordersResponse.data) {
        const orders = ordersResponse.data;
        const totalSpent = orders.reduce((sum: number, order: any) => sum + order.total_amount, 0);
        const pendingOrders = orders.filter((order: any) => order.status === 'pending').length;
        const completedOrders = orders.filter((order: any) => order.status === 'delivered').length;
        
        setStats({
          totalOrders: orders.length,
          pendingOrders,
          completedOrders,
          totalSpent,
          wishlistCount: 5, // Mock data
          recentOrders: orders.slice(0, 3)
        });
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Mock data for demo
      setStats({
        totalOrders: 12,
        pendingOrders: 2,
        completedOrders: 8,
        totalSpent: 1250000,
        wishlistCount: 5,
        recentOrders: [
          {
            id: '1',
            order_number: 'BK-2024-001',
            total_amount: 250000,
            status: 'delivered',
            created_at: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            order_number: 'BK-2024-002',
            total_amount: 180000,
            status: 'shipped',
            created_at: '2024-01-14T15:30:00Z'
          },
          {
            id: '3',
            order_number: 'BK-2024-003',
            total_amount: 95000,
            status: 'processing',
            created_at: '2024-01-13T09:15:00Z'
          }
        ]
      });
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
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu' },
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Selamat datang kembali, {user?.name}! Data dari database phpMyAdmin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalOrders || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pesanan Pending</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.pendingOrders || 0}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Belanja</p>
              <p className="text-2xl font-bold text-gray-800">{formatPrice(stats?.totalSpent || 0)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Wishlist</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.wishlistCount || 0}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Pesanan Terbaru</h2>
            <Link to="/customer/orders" className="text-green-600 hover:text-green-700 font-medium">
              Lihat Semua
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentOrders?.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">#{order.order_number}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('id-ID')}
                  </p>
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
              to="/customer/orders"
              className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Package className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-600">Lihat Pesanan</span>
            </Link>
            <Link
              to="/customer/wishlist"
              className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Heart className="h-8 w-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-red-600">Wishlist</span>
            </Link>
            <Link
              to="/customer/addresses"
              className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <MapPin className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-600">Kelola Alamat</span>
            </Link>
            <Link
              to="/customer/payments"
              className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <CreditCard className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-600">Riwayat Bayar</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;