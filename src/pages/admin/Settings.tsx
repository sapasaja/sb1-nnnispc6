import React, { useState, useEffect } from 'react';
import { Save, Globe, CreditCard, Truck, Mail, Phone, MapPin } from 'lucide-react';
import apiService from '../../services/api';

interface Settings {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  ipaymu_va: string;
  ipaymu_api_key: string;
  shipping_cost: string;
  free_shipping_minimum: string;
  currency: string;
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<Settings>({
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    ipaymu_va: '',
    ipaymu_api_key: '',
    shipping_cost: '',
    free_shipping_minimum: '',
    currency: 'IDR',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const tabs = [
    { id: 'general', name: 'Umum', icon: Globe },
    { id: 'payment', name: 'Pembayaran', icon: CreditCard },
    { id: 'shipping', name: 'Pengiriman', icon: Truck },
    { id: 'contact', name: 'Kontak', icon: Mail },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await apiService.getSettings();
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Set default values
      setSettings({
        site_name: 'Buku-ku',
        site_description: 'Toko buku online terpercaya dengan koleksi lengkap',
        contact_email: 'info@bukuku.com',
        contact_phone: '+62 21 1234 5678',
        contact_address: 'Jakarta, Indonesia',
        ipaymu_va: '0000001225297227',
        ipaymu_api_key: 'SANDBOX159D00F3-EA61-4AC0-987E-79CE088BEA7A',
        shipping_cost: '15000',
        free_shipping_minimum: '200000',
        currency: 'IDR',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiService.updateSettings(settings);
      if (response.success) {
        setMessage('Pengaturan berhasil disimpan');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage('Gagal menyimpan pengaturan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Pengaturan Sistem</h1>
        <p className="text-gray-600 mt-2">Kelola konfigurasi aplikasi Buku-ku</p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600">{message}</p>
        </div>
      )}

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
            <form onSubmit={handleSave}>
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Pengaturan Umum</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Website
                    </label>
                    <input
                      type="text"
                      value={settings.site_name}
                      onChange={(e) => setSettings({...settings, site_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi Website
                    </label>
                    <textarea
                      value={settings.site_description}
                      onChange={(e) => setSettings({...settings, site_description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mata Uang
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => setSettings({...settings, currency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="IDR">Indonesian Rupiah (IDR)</option>
                      <option value="USD">US Dollar (USD)</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Pengaturan Pembayaran</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ipaymu Virtual Account
                    </label>
                    <input
                      type="text"
                      value={settings.ipaymu_va}
                      onChange={(e) => setSettings({...settings, ipaymu_va: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Virtual Account untuk pembayaran ipaymu
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ipaymu API Key
                    </label>
                    <input
                      type="text"
                      value={settings.ipaymu_api_key}
                      onChange={(e) => setSettings({...settings, ipaymu_api_key: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      API Key untuk integrasi dengan ipaymu
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Pengaturan Pengiriman</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biaya Pengiriman Default (Rp)
                    </label>
                    <input
                      type="number"
                      value={settings.shipping_cost}
                      onChange={(e) => setSettings({...settings, shipping_cost: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Pembelian Gratis Ongkir (Rp)
                    </label>
                    <input
                      type="number"
                      value={settings.free_shipping_minimum}
                      onChange={(e) => setSettings({...settings, free_shipping_minimum: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                      min="0"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Pembelian di atas jumlah ini akan mendapat gratis ongkos kirim
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Informasi Kontak</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email Kontak
                    </label>
                    <input
                      type="email"
                      value={settings.contact_email}
                      onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={settings.contact_phone}
                      onChange={(e) => setSettings({...settings, contact_phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="inline h-4 w-4 mr-1" />
                      Alamat
                    </label>
                    <textarea
                      value={settings.contact_address}
                      onChange={(e) => setSettings({...settings, contact_address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;