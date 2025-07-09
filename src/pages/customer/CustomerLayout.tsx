import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  Settings, 
  LogOut,
  Package,
  CreditCard,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CustomerLayout: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/customer', icon: User },
    { name: 'Pesanan Saya', href: '/customer/orders', icon: ShoppingBag },
    { name: 'Wishlist', href: '/customer/wishlist', icon: Heart },
    { name: 'Alamat', href: '/customer/addresses', icon: MapPin },
    { name: 'Notifikasi', href: '/customer/notifications', icon: Bell },
    { name: 'Riwayat Pembayaran', href: '/customer/payments', icon: CreditCard },
    { name: 'Pengaturan', href: '/customer/settings', icon: Settings },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href || (href !== '/customer' && location.pathname.startsWith(href));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <Link to="/" className="text-2xl font-bold text-green-600">
            Buku-ku
          </Link>
          <div className="mt-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">Customer</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActiveRoute(item.href)
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default CustomerLayout;