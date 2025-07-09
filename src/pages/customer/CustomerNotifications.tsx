import React, { useState, useEffect } from 'react';
import { Bell, Eye, Trash2, Calendar, User, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CustomerNotification {
  id: string;
  title: string;
  message: string;
  type: 'all' | 'individual';
  is_read: boolean;
  created_at: string;
  sent_at: string;
}

const CustomerNotifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState<CustomerNotification | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // Mock notifications for customer
      setNotifications([
        {
          id: '1',
          title: 'Promo Spesial Hari Ini!',
          message: 'Dapatkan diskon 30% untuk semua buku fiksi. Buruan sebelum kehabisan! Gunakan kode FIKSI30 saat checkout.',
          type: 'all',
          is_read: false,
          created_at: '2024-01-15T10:00:00Z',
          sent_at: '2024-01-15T10:05:00Z'
        },
        {
          id: '2',
          title: 'Pesanan Anda Telah Dikirim',
          message: 'Pesanan #BK-2024-001 telah dikirim dengan nomor resi JNE123456789. Estimasi tiba 2-3 hari kerja.',
          type: 'individual',
          is_read: true,
          created_at: '2024-01-15T14:00:00Z',
          sent_at: '2024-01-15T14:02:00Z'
        },
        {
          id: '3',
          title: 'Buku Baru Telah Tersedia!',
          message: 'Koleksi buku terbaru dari penulis favorit Anda sudah tersedia. Jangan sampai kehabisan!',
          type: 'all',
          is_read: false,
          created_at: '2024-01-14T09:00:00Z',
          sent_at: '2024-01-14T09:05:00Z'
        }
      ]);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, is_read: true } : n
    ));
  };

  const handleDeleteNotification = (notificationId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus notifikasi ini?')) {
      setNotifications(notifications.filter(n => n.id !== notificationId));
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Notifikasi</h1>
          <p className="text-gray-600 mt-2">
            {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 text-green-600" />
          <span className="text-lg font-semibold text-gray-800">{notifications.length}</span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat notifikasi...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada notifikasi</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-6 hover:bg-gray-50 cursor-pointer ${
                  !notification.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => {
                  setSelectedNotification(notification);
                  if (!notification.is_read) {
                    markAsRead(notification.id);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-lg font-medium ${
                        !notification.is_read ? 'text-blue-800' : 'text-gray-800'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.is_read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.type === 'all' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {notification.type === 'all' ? (
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>Umum</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>Personal</span>
                          </div>
                        )}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{notification.message}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(notification.sent_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNotification(notification);
                        if (!notification.is_read) {
                          markAsRead(notification.id);
                        }
                      }}
                      className="text-blue-600 hover:text-blue-700"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
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

// View Notification Modal Component
const ViewNotificationModal: React.FC<{
  notification: CustomerNotification;
  onClose: () => void;
}> = ({ notification, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{notification.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-gray-900 leading-relaxed">{notification.message}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                {notification.type === 'all' ? (
                  <>
                    <Users className="h-4 w-4" />
                    <span>Notifikasi Umum</span>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4" />
                    <span>Notifikasi Personal</span>
                  </>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(notification.sent_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerNotifications;