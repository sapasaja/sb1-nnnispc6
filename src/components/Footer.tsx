import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-green-400">Buku-ku</h3>
            <p className="text-gray-300 mb-4">
              Toko buku online terpercaya dengan koleksi lengkap buku-buku berkualitas dari berbagai genre.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Beranda</Link></li>
              <li><Link to="/categories" className="text-gray-300 hover:text-white">Kategori</Link></li>
              <li><Link to="/bestsellers" className="text-gray-300 hover:text-white">Terlaris</Link></li>
              <li><Link to="/new-arrivals" className="text-gray-300 hover:text-white">Buku Baru</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Layanan Pelanggan</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-300 hover:text-white">Bantuan</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white">Pengiriman</Link></li>
              <li><Link to="/returns" className="text-gray-300 hover:text-white">Pengembalian</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Kontak</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak Kami</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">+62 21 1234 5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400" />
                <span className="text-gray-300 text-sm">info@bukuku.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          <p>&copy; 2024 Buku-ku. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;