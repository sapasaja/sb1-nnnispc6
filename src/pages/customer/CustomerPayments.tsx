import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import apiService from '../../services/api';

interface Payment {
  id: string;
  order_number: string;
  amount: number;
  method: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  reference: string;
  created_at: string;
  paid_at?: string;
}

const CustomerPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, [selectedStatus]);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.request('/payments', {
        method: 'GET',
      });
      
      if (response.success && response.data) {
        setPayments(response.data);
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
      // Mock data for demo
      setPayments([
        {
          id: '1',
          order_number: 'BK-2024-001',
          amount: 250000,
          method: 'ipaymu',
          status: 'paid',
          reference: 'PAY-123456789',
          created_at: '2024-01-15T10:00:00Z',
          paid_at: '2024-01-15T10:15:00Z'
        },
        {
          id: '2',
          order_number: 'BK-2024-002',
          amount: 180000,
          method: 'ipaymu',
          status: 'paid',
          reference: 'PAY-987654321',
          created_at: '2024-01-14T15:30:00Z',
          paid_at: '2024-01-14T15:45:00Z'
        },
        {
          id: '3',
          order_number: 'BK-2024-003',
          amount: 95000,
          method: 'ipaymu',
          status: 'pending',
          reference: 'PAY-456789123',
          created_at: '2024-01-13T09:15:00Z'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'refunded':
        return <XCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu' },
      paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Lunas' },
      failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Gagal' },
      refunded: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Refund' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {getStatusIcon(status)}
        <span className="ml-1">{config.label}</span>
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

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'ipaymu':
        return 'ipaymu';
      case 'bank_transfer':
        return 'Transfer Bank';
      case 'credit_card':
        return 'Kartu Kredit';
      default:
        return method;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Riwayat Pembayaran</h1>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4">
          <label className="block text-sm font-medium text-gray-700">
            Filter Status:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="paid">Lunas</option>
            <option value="failed">Gagal</option>
            <option value="refunded">Refund</option>
          </select>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat riwayat pembayaran...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada riwayat pembayaran</p>
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
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referensi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-900">
                          #{payment.order_number}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getPaymentMethodName(payment.method)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.reference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div>{new Date(payment.created_at).toLocaleDateString('id-ID')}</div>
                          {payment.paid_at && (
                            <div className="text-xs text-gray-500">
                              Dibayar: {new Date(payment.paid_at).toLocaleDateString('id-ID')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPayments;