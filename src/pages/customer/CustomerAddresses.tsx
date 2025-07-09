import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Home, Building } from 'lucide-react';
import apiService from '../../services/api';

interface Address {
  id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  is_default: boolean;
  created_at: string;
}

const CustomerAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.request('/addresses');
      if (response.success && response.data) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
      // Mock data for demo
      setAddresses([
        {
          id: '1',
          label: 'Rumah',
          recipient_name: 'John Doe',
          phone: '081234567890',
          address: 'Jl. Sudirman No. 123, RT 01/RW 02',
          city: 'Jakarta Selatan',
          province: 'DKI Jakarta',
          postal_code: '12190',
          is_default: true,
          created_at: '2024-01-15T08:00:00Z'
        },
        {
          id: '2',
          label: 'Kantor',
          recipient_name: 'John Doe',
          phone: '081234567890',
          address: 'Jl. Thamrin No. 456, Lantai 10',
          city: 'Jakarta Pusat',
          province: 'DKI Jakarta',
          postal_code: '10230',
          is_default: false,
          created_at: '2024-01-16T09:00:00Z'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus alamat ini?')) {
      try {
        const response = await apiService.request(`/addresses/${addressId}`, {
          method: 'DELETE',
        });
        if (response.success) {
          setAddresses(addresses.filter(address => address.id !== addressId));
        }
      } catch (error) {
        console.error('Failed to delete address:', error);
      }
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await apiService.request(`/addresses/${addressId}/set-default`, {
        method: 'PUT',
      });
      if (response.success) {
        setAddresses(addresses.map(address => ({
          ...address,
          is_default: address.id === addressId
        })));
      }
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };

  const getAddressIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'rumah':
        return <Home className="h-5 w-5" />;
      case 'kantor':
        return <Building className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Alamat Pengiriman</h1>
        <button
          onClick={() => setShowAddressModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Tambah Alamat</span>
        </button>
      </div>

      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat alamat...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada alamat tersimpan</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg shadow-md p-6 relative">
              {address.is_default && (
                <div className="absolute top-4 right-4">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Utama
                  </span>
                </div>
              )}

              <div className="flex items-start space-x-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                  {getAddressIcon(address.label)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{address.label}</h3>
                  <p className="text-gray-600">{address.recipient_name}</p>
                  <p className="text-gray-600">{address.phone}</p>
                </div>
              </div>

              <div className="text-gray-600 mb-4">
                <p>{address.address}</p>
                <p>{address.city}, {address.province} {address.postal_code}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingAddress(address);
                      setShowAddressModal(true);
                    }}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Jadikan Utama
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <AddressModal
          address={editingAddress}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
          onSave={(addressData) => {
            setShowAddressModal(false);
            setEditingAddress(null);
            loadAddresses();
          }}
        />
      )}
    </div>
  );
};

// Address Modal Component
const AddressModal: React.FC<{
  address: Address | null;
  onClose: () => void;
  onSave: (addressData: any) => void;
}> = ({ address, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    label: address?.label || '',
    recipient_name: address?.recipient_name || '',
    phone: address?.phone || '',
    address: address?.address || '',
    city: address?.city || '',
    province: address?.province || '',
    postal_code: address?.postal_code || '',
    is_default: address?.is_default || false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      if (address) {
        response = await apiService.request(`/addresses/${address.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        response = await apiService.request('/addresses', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }

      if (response.success) {
        onSave(formData);
      }
    } catch (error) {
      console.error('Failed to save address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {address ? 'Edit Alamat' : 'Tambah Alamat Baru'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label Alamat
            </label>
            <select
              value={formData.label}
              onChange={(e) => setFormData({...formData, label: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Pilih Label</option>
              <option value="Rumah">Rumah</option>
              <option value="Kantor">Kantor</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Penerima
            </label>
            <input
              type="text"
              value={formData.recipient_name}
              onChange={(e) => setFormData({...formData, recipient_name: e.target.value})}
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
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat Lengkap
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kota
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kode Pos
              </label>
              <input
                type="text"
                value={formData.postal_code}
                onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provinsi
            </label>
            <input
              type="text"
              value={formData.province}
              onChange={(e) => setFormData({...formData, province: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default}
              onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="is_default" className="text-sm text-gray-700">
              Jadikan alamat utama
            </label>
          </div>

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
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerAddresses;