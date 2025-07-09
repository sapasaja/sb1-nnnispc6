import React, { useState, useEffect } from 'react';
import { Send, Users, User, Bell, MessageSquare, Calendar, Eye, Trash2 } from 'lucide-react';
import apiService from '../../services/api';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'all' | 'individual';
  target_user_id?: string;
  target_user_name?: string;
  status: 'draft' | 'sent';
  created_at: string;
  sent_at?: string;
}

const NotificationManagement: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersResponse] = await Promise.all([
        apiService.getUsers()
      ]);

      if (usersResponse.success) {
        setUsers(usersResponse.data);
      }

      // Mock notifications data
      setNotifications([
        {
          id: '1',
          title: 'Promo Spesial Hari Ini!',
          message: 'Dapatkan diskon 30% untuk semua buku fiksi. Buruan sebelum kehabisan!',
          type: 'all',
          status: 'sent',
          created_at: '2024-01-15T10:00:00Z',
          sent_at: '2024-01-15T10:05:00Z'
        },
        {
          id: '2',
          title: 'Pesanan Anda Telah Dikirim',
          message: 'Pesanan #BK-2024-001 telah dikirim dengan nomor resi JNE123456789',
          type: 'individual',
          target_user_id: '2',
          target_user_name: 'Customer Demo',
          status: 'sent',
          created_at: '2024-01-15T14:00:00Z',
          sent_at: '2024-01-15T14:02:00Z'
        }
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus notifikasi ini?')) {
      setNotifications(notifications.filter(n => n.id !== notificationId));
      alert('Notifikasi berhasil dihapus');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Kelola Notifikasi</h1>
          <p className="text-gray-600 mt-2">Kirim pemberitahuan ke customer</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Send className="h-5 w-5" />
          <span>Buat Notifikasi</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Notifikasi</p>
              <p className="text-2xl font-bold text-gray-800">{notifications.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Notifikasi Terkirim</p>
              <p className="text-2xl font-bold text-gray-800">
                {notifications.filter(n => n.status === 'sent').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Send className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Customer</p>
              <p className="text-2xl font-bold text-gray-800">
                {users.filter(u => u.role === 'customer').length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Riwayat Notifikasi</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat notifikasi...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div key={notification.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-800">
                        {notification.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.status === 'sent' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {notification.status === 'sent' ? 'Terkirim' : 'Draft'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.type === 'all' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {notification.type === 'all' ? 'Semua Customer' : 'Individual'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Dibuat: {new Date(notification.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      {notification.sent_at && (
                        <div className="flex items-center space-x-1">
                          <Send className="h-4 w-4" />
                          <span>
                            Dikirim: {new Date(notification.sent_at).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      )}
                      {notification.type === 'individual' && (
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>Ke: {notification.target_user_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedNotification(notification)}
                      className="text-blue-600 hover:text-blue-700"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <CreateNotificationModal
          users={users.filter(u => u.role === 'customer')}
          onClose={() => setShowCreateModal(false)}
          onSave={(notificationData) => {
            const newNotification = {
              id: Date.now().toString(),
              ...notificationData,
              status: 'sent' as const,
              created_at: new Date().toISOString(),
              sent_at: new Date().toISOString()
            };
            setNotifications([newNotification, ...notifications]);
            setShowCreateModal(false);
            alert('Notifikasi berhasil dikirim!');
          }}
        />
      )}

      {/* View Notification Modal */}
      {selectedNotification && (
        <ViewNotificationModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
};

// Create Notification Modal Component
const CreateNotificationModal: React.FC<{
  users: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ users, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'all',
    target_user_id: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const notificationData = {
        ...formData,
        target_user_name: formData.type === 'individual' 
          ? users.find(u => u.id === formData.target_user_id)?.name 
          : undefined
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(notificationData);
    } catch (error) {
      alert('Gagal mengirim notifikasi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Buat Notifikasi Baru</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul Notifikasi
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Masukkan judul notifikasi"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pesan
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
              placeholder="Tulis pesan notifikasi..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kirim Ke
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value, target_user_id: ''})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">Semua Customer</option>
              <option value="individual">Customer Tertentu</option>
            </select>
          </div>

          {formData.type === 'individual' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Customer
              </label>
              <select
                value={formData.target_user_id}
                onChange={(e) => setFormData({...formData, target_user_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Pilih Customer</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Mengirim...' : 'Kirim Notifikasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Notification Modal Component
const ViewNotificationModal: React.FC<{
  notification: Notification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Detail Notifikasi</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Judul
            </label>
            <p className="text-gray-900">{notification.title}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pesan
            </label>
            <p className="text-gray-900">{notification.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target
            </label>
            <p className="text-gray-900">
              {notification.type === 'all' 
                ? 'Semua Customer' 
                : `${notification.target_user_name} (Individual)`
              }
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              notification.status === 'sent' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {notification.status === 'sent' ? 'Terkirim' : 'Draft'}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waktu
            </label>
            <p className="text-gray-900 text-sm">
              Dibuat: {new Date(notification.created_at).toLocaleString('id-ID')}
              {notification.sent_at && (
                <>
                  <br />
                  Dikirim: {new Date(notification.sent_at).toLocaleString('id-ID')}
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationManagement;