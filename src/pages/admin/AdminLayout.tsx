import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ShoppingCart, 
  Settings, 
  BarChart3,
  Package,
  LogOut,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Kelola Buku', href: '/admin/books', icon: BookOpen },
    { name: 'Kelola User', href: '/admin/users', icon: Users },
    { name: 'Pesanan', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Kategori', href: '/admin/categories', icon: Package },
    { name: 'Notifikasi', href: '/admin/notifications', icon: Bell },
    { name: 'Analitik', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href || (href !== '/admin' && location.pathname.startsWith(href));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <Link to="/" className="text-2xl font-bold text-green-600">
            Buku-ku Admin
          </Link>
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

export default AdminLayout;