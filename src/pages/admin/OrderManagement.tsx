import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle, Clock, MapPin, CreditCard, Edit, Save } from 'lucide-react';
import apiService from '../../services/api';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  payment_reference?: string;
  shipping_address: string;
  shipping_cost: number;
  tracking_number?: string;
  shipping_notes?: string;
  notes?: string;
  created_at: string;
  items: Array<{
    book_title: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [searchTerm, selectedStatus]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getOrders({
        search: searchTerm,
        status: selectedStatus,
      });
      
      if (response.success && response.data) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await apiService.updateOrderStatus(orderId, newStatus);
      if (response.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus as any } : order
        ));
        alert('Status pesanan berhasil diupdate di database phpMyAdmin');
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Gagal mengupdate status pesanan');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
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
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {getStatusIcon(status)}
        <span className="ml-1">{config.label}</span>
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Lunas' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Gagal' },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Refund' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === '' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kelola Pesanan</h1>
          <p className="text-gray-600 mt-1">Data pesanan dari database phpMyAdmin - bukuku_ecommerce</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={loadOrders}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Pesanan
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari berdasarkan nomor pesanan atau customer..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Pesanan
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Diproses</option>
              <option value="shipped">Dikirim</option>
              <option value="delivered">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat data pesanan dari database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pesanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Pesanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pembayaran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          #{order.order_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items?.length || 0} item(s)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Diproses</option>
                        <option value="shipped">Dikirim</option>
                        <option value="delivered">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentStatusBadge(order.payment_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-green-600 hover:text-green-700 flex items-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredOrders.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Tidak ada pesanan yang ditemukan di database</p>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={(orderId, status) => {
            handleStatusChange(orderId, status);
            setSelectedOrder(null);
          }}
          onTrackingUpdate={(orderId, trackingData) => {
            // Update tracking info
            setOrders(orders.map(order => 
              order.id === orderId ? { ...order, ...trackingData } : order
            ));
          }}
        />
      )}

      {/* Database Info */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm font-medium">🗄️ Database Connection Status</p>
        <p className="text-green-700 text-xs mt-1">
          Connected to: bukuku_ecommerce.orders (phpMyAdmin)<br />
          Real-time data sync • Manual order management • Tracking system
        </p>
      </div>
    </div>
  );
};

// Order Detail Modal Component
const OrderDetailModal: React.FC<{
  order: Order;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: string) => void;
  onTrackingUpdate: (orderId: string, trackingData: any) => void;
}> = ({ order, onClose, onStatusUpdate, onTrackingUpdate }) => {
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '');
  const [shippingNotes, setShippingNotes] = useState(order.shipping_notes || '');
  const [isUpdatingTracking, setIsUpdatingTracking] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleUpdateTracking = async () => {
    setIsUpdatingTracking(true);
    try {
      const response = await apiService.request(`/orders/update-tracking.php?id=${order.id}`, {
        method: 'POST',
        body: JSON.stringify({
          tracking_number: trackingNumber,
          shipping_notes: shippingNotes
        })
      });

      if (response.success) {
        onTrackingUpdate(order.id, {
          tracking_number: trackingNumber,
          shipping_notes: shippingNotes
        });
        alert('Informasi tracking berhasil disimpan ke database phpMyAdmin');
      } else {
        alert('Gagal menyimpan informasi tracking');
      }
    } catch (error) {
      console.error('Failed to update tracking:', error);
      alert('Terjadi kesalahan saat menyimpan tracking');
    } finally {
      setIsUpdatingTracking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Detail Pesanan #{order.order_number}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Customer & Shipping Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Informasi Customer & Pengiriman
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nama Customer</p>
                    <p className="font-medium">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{order.customer_email}</p>
                  </div>
                </div>
                {order.customer_phone && (
                  <div>
                    <p className="text-sm text-gray-600">Telepon</p>
                    <p className="font-medium">{order.customer_phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Alamat Pengiriman</p>
                  <p className="font-medium">{order.shipping_address}</p>
                </div>
                {order.notes && (
                  <div>
                    <p className="text-sm text-gray-600">Catatan Customer</p>
                    <p className="font-medium text-blue-600">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                Informasi Pembayaran
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Metode Pembayaran</p>
                    <p className="font-medium">{order.payment_method || 'ipaymu'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status Pembayaran</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {order.payment_status === 'paid' ? 'Lunas' : 'Menunggu'}
                    </span>
                  </div>
                </div>
                {order.payment_reference && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600">Referensi Pembayaran</p>
                    <p className="font-medium">{order.payment_reference}</p>
                  </div>
                )}
                <div className="mt-3">
                  <p className="text-sm text-gray-600">Biaya Pengiriman</p>
                  <p className="font-medium">{formatPrice(order.shipping_cost)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Order Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Item Pesanan</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.book_title}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                    <p className="font-medium">{formatPrice(item.total)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Ringkasan Pesanan</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">{formatPrice(order.total_amount)}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Termasuk ongkos kirim: {formatPrice(order.shipping_cost)}
                </div>
              </div>
            </div>

            {/* Status Update & Tracking */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Edit className="h-5 w-5 mr-2 text-purple-600" />
                Update Status & Tracking
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Pesanan
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) => onStatusUpdate(order.id, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Diproses</option>
                    <option value="shipped">Dikirim</option>
                    <option value="delivered">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Resi Pengiriman
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Masukkan nomor resi..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Pengiriman
                  </label>
                  <textarea
                    value={shippingNotes}
                    onChange={(e) => setShippingNotes(e.target.value)}
                    placeholder="Catatan untuk customer tentang pengiriman..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <button
                  onClick={handleUpdateTracking}
                  disabled={isUpdatingTracking}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{isUpdatingTracking ? 'Menyimpan...' : 'Simpan Tracking Info'}</span>
                </button>
                <p className="text-xs text-gray-500 text-center">
                  Informasi ini akan tersimpan di database dan dapat dilihat customer
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;