import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, User, Lock, Bell, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';

const CustomerSettings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'password', name: 'Keamanan', icon: Lock },
    { id: 'notifications', name: 'Notifikasi', icon: Bell },
    { id: 'privacy', name: 'Privasi', icon: Shield },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Pengaturan Akun</h1>
        <p className="text-gray-600 mt-2">Kelola informasi dan preferensi akun Anda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {message && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600">{message}</p>
              </div>
            )}

            {activeTab === 'profile' && (
              <ProfileSettings 
                user={user} 
                onSave={(data) => setMessage('Profil berhasil diperbarui')}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}

            {activeTab === 'password' && (
              <PasswordSettings 
                onSave={() => setMessage('Password berhasil diubah')}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationSettings 
                onSave={() => setMessage('Pengaturan notifikasi berhasil disimpan')}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}

            {activeTab === 'privacy' && (
              <PrivacySettings 
                onSave={() => setMessage('Pengaturan privasi berhasil disimpan')}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile Settings Component
const ProfileSettings: React.FC<{
  user: any;
  onSave: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}> = ({ user, onSave, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiService.updateProfile(formData);
      if (response.success) {
        onSave(formData);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Informasi Profil</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nomor Telepon
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alamat
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
        </button>
      </form>
    </div>
  );
};

// Password Settings Component
const PasswordSettings: React.FC<{
  onSave: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}> = ({ onSave, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.new_password !== formData.confirm_password) {
      alert('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password,
      });
      
      if (response.success) {
        setFormData({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
        onSave();
      }
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Ubah Password</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password Saat Ini
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.current_password}
              onChange={(e) => setFormData({...formData, current_password: e.target.value})}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password Baru
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.new_password}
              onChange={(e) => setFormData({...formData, new_password: e.target.value})}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Konfirmasi Password Baru
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirm_password}
              onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? 'Mengubah...' : 'Ubah Password'}</span>
        </button>
      </form>
    </div>
  );
};

// Notification Settings Component
const NotificationSettings: React.FC<{
  onSave: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}> = ({ onSave, isLoading, setIsLoading }) => {
  const [settings, setSettings] = useState({
    email_notifications: true,
    order_updates: true,
    promotional_emails: false,
    new_arrivals: true,
    price_alerts: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API call to save notification settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSave();
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pengaturan Notifikasi</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.email_notifications}
              onChange={(e) => setSettings({...settings, email_notifications: e.target.checked})}
              className="mr-3"
            />
            <span>Notifikasi Email</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.order_updates}
              onChange={(e) => setSettings({...settings, order_updates: e.target.checked})}
              className="mr-3"
            />
            <span>Update Status Pesanan</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.promotional_emails}
              onChange={(e) => setSettings({...settings, promotional_emails: e.target.checked})}
              className="mr-3"
            />
            <span>Email Promosi</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.new_arrivals}
              onChange={(e) => setSettings({...settings, new_arrivals: e.target.checked})}
              className="mr-3"
            />
            <span>Notifikasi Buku Baru</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.price_alerts}
              onChange={(e) => setSettings({...settings, price_alerts: e.target.checked})}
              className="mr-3"
            />
            <span>Alert Perubahan Harga</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
        </button>
      </form>
    </div>
  );
};

// Privacy Settings Component
const PrivacySettings: React.FC<{
  onSave: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}> = ({ onSave, isLoading, setIsLoading }) => {
  const [settings, setSettings] = useState({
    profile_visibility: 'private',
    show_purchase_history: false,
    allow_recommendations: true,
    data_sharing: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API call to save privacy settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSave();
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pengaturan Privasi</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visibilitas Profil
          </label>
          <select
            value={settings.profile_visibility}
            onChange={(e) => setSettings({...settings, profile_visibility: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="public">Publik</option>
            <option value="private">Privat</option>
            <option value="friends">Hanya Teman</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.show_purchase_history}
              onChange={(e) => setSettings({...settings, show_purchase_history: e.target.checked})}
              className="mr-3"
            />
            <span>Tampilkan Riwayat Pembelian</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.allow_recommendations}
              onChange={(e) => setSettings({...settings, allow_recommendations: e.target.checked})}
              className="mr-3"
            />
            <span>Izinkan Rekomendasi Personal</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.data_sharing}
              onChange={(e) => setSettings({...settings, data_sharing: e.target.checked})}
              className="mr-3"
            />
            <span>Berbagi Data untuk Analitik</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
        </button>
      </form>
    </div>
  );
};

export default CustomerSettings;