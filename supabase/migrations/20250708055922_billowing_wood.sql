-- Database: bukuku_ecommerce
-- Aplikasi E-commerce Toko Buku "Buku-ku"
-- Fixed version untuk mengatasi syntax error MariaDB

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Database structure for `bukuku_ecommerce`
--

CREATE DATABASE IF NOT EXISTS `bukuku_ecommerce` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `bukuku_ecommerce`;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Fiksi', 'fiksi', 'Novel dan cerita fiksi', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(2, 'Non-Fiksi', 'non-fiksi', 'Buku pengetahuan dan faktual', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(3, 'Pendidikan', 'pendidikan', 'Buku pelajaran dan edukasi', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(4, 'Agama', 'agama', 'Buku keagamaan dan spiritual', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(5, 'Teknologi', 'teknologi', 'Buku teknologi dan komputer', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(6, 'Biografi', 'biografi', 'Riwayat hidup tokoh', '2024-01-15 08:00:00', '2024-01-15 08:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` enum('admin','customer') NOT NULL DEFAULT 'customer',
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT 0,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `name`, `role`, `phone`, `address`, `avatar`, `email_verified`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin@bukuku.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin', '081234567890', 'Jakarta, Indonesia', NULL, 1, 'active', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(2, 'customer@bukuku.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer Demo', 'customer', '081234567891', 'Bandung, Indonesia', NULL, 1, 'active', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(3, 'john.doe@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', 'customer', '081234567892', 'Surabaya, Indonesia', NULL, 1, 'active', '2024-01-15 09:00:00', '2024-01-15 09:00:00'),
(4, 'jane.smith@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith', 'customer', '081234567893', 'Medan, Indonesia', NULL, 1, 'active', '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
(5, 'bob.wilson@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob Wilson', 'customer', '081234567894', 'Yogyakarta, Indonesia', NULL, 1, 'active', '2024-01-15 11:00:00', '2024-01-15 11:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text,
  `category_id` int(11) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `cover_image` varchar(255) DEFAULT NULL,
  `publish_year` int(4) DEFAULT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 0.0,
  `reviews_count` int(11) DEFAULT 0,
  `pages` int(11) DEFAULT NULL,
  `language` varchar(50) DEFAULT 'Bahasa Indonesia',
  `publisher` varchar(255) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `dimensions` varchar(50) DEFAULT NULL,
  `status` enum('active','inactive','out_of_stock') DEFAULT 'active',
  `featured` tinyint(1) DEFAULT 0,
  `bestseller` tinyint(1) DEFAULT 0,
  `new_arrival` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `isbn` (`isbn`),
  KEY `status` (`status`),
  KEY `featured` (`featured`),
  KEY `bestseller` (`bestseller`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `price`, `description`, `category_id`, `stock`, `cover_image`, `publish_year`, `isbn`, `rating`, `reviews_count`, `pages`, `language`, `publisher`, `weight`, `dimensions`, `status`, `featured`, `bestseller`, `new_arrival`, `created_at`, `updated_at`) VALUES
(1, 'Laskar Pelangi', 'Andrea Hirata', 85000.00, 'Novel yang mengisahkan tentang perjuangan anak-anak sekolah di Belitung untuk mendapatkan pendidikan yang layak. Kisah inspiratif tentang persahabatan, mimpi, dan tekad yang kuat.', 1, 25, 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400', 2005, '9789792218305', 4.8, 1250, 529, 'Bahasa Indonesia', 'Bentang Pustaka', 0.45, '19 x 13 cm', 'active', 1, 1, 0, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(2, 'Bumi Manusia', 'Pramoedya Ananta Toer', 95000.00, 'Novel sejarah Indonesia yang menceritakan kehidupan pada masa kolonial Belanda. Mengisahkan perjuangan Minke, seorang pribumi yang berjuang melawan ketidakadilan sistem kolonial.', 1, 18, 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400', 1980, '9789794338045', 4.9, 2100, 535, 'Bahasa Indonesia', 'Hasta Mitra', 0.50, '20 x 14 cm', 'active', 1, 1, 0, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(3, 'Atomic Habits', 'James Clear', 120000.00, 'Panduan praktis untuk membangun kebiasaan baik dan menghilangkan kebiasaan buruk. Buku ini memberikan strategi yang terbukti secara ilmiah untuk mengubah hidup Anda.', 2, 32, 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400', 2018, '9780735211292', 4.7, 890, 320, 'Bahasa Indonesia', 'Gramedia Pustaka Utama', 0.35, '18 x 12 cm', 'active', 1, 1, 0, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(4, 'Sejarah Indonesia Modern', 'M.C. Ricklefs', 150000.00, 'Sejarah lengkap Indonesia dari masa kolonial hingga era reformasi. Analisis mendalam tentang perkembangan politik, ekonomi, dan sosial Indonesia modern.', 3, 15, 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400', 2020, '9786020633473', 4.6, 456, 720, 'Bahasa Indonesia', 'Serambi Ilmu Semesta', 0.80, '23 x 15 cm', 'active', 0, 0, 1, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(5, 'JavaScript: The Good Parts', 'Douglas Crockford', 180000.00, 'Panduan terbaik untuk memahami JavaScript dan praktik terbaik programming. Buku wajib bagi developer yang ingin menguasai JavaScript dengan benar.', 5, 22, 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400', 2008, '9780596517748', 4.5, 678, 176, 'Bahasa Indonesia', 'Oreilly Media', 0.25, '17 x 11 cm', 'active', 0, 0, 1, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(6, 'Steve Jobs', 'Walter Isaacson', 165000.00, 'Biografi lengkap pendiri Apple Inc yang mengubah dunia teknologi. Kisah hidup visioner yang revolusioner dalam industri teknologi dan desain.', 6, 12, 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400', 2011, '9781451648539', 4.4, 1890, 656, 'Bahasa Indonesia', 'Bentang Pustaka', 0.60, '21 x 14 cm', 'active', 0, 0, 1, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(7, 'Negeri 5 Menara', 'Ahmad Fuadi', 78000.00, 'Novel inspiratif tentang perjuangan santri meraih mimpi. Kisah persahabatan dan perjuangan enam santri di Pondok Madani Ponorogo untuk meraih cita-cita mereka.', 1, 28, 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400', 2009, '9789792248661', 4.6, 1567, 423, 'Bahasa Indonesia', 'Gramedia Pustaka Utama', 0.40, '19 x 13 cm', 'active', 1, 0, 0, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(8, 'The Power of Now', 'Eckhart Tolle', 135000.00, 'Panduan spiritual untuk hidup di masa sekarang. Buku yang mengajarkan cara menemukan kedamaian dan kebahagiaan melalui kesadaran akan momen saat ini.', 4, 19, 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400', 1997, '9781577314806', 4.3, 723, 236, 'Bahasa Indonesia', 'Gramedia Pustaka Utama', 0.30, '18 x 12 cm', 'active', 0, 0, 0, '2024-01-15 08:00:00', '2024-01-15 08:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled','refunded') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `payment_reference` varchar(100) DEFAULT NULL,
  `shipping_address` text NOT NULL,
  `shipping_cost` decimal(10,2) DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `shipped_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`),
  KEY `payment_status` (`payment_status`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_number`, `user_id`, `total_amount`, `status`, `payment_method`, `payment_status`, `payment_reference`, `shipping_address`, `shipping_cost`, `notes`, `shipped_at`, `delivered_at`, `created_at`, `updated_at`) VALUES
(1, 'BK-2024-001', 2, 250000.00, 'pending', 'ipaymu', 'pending', NULL, 'Jl. Sudirman No. 123, Bandung, Jawa Barat 40123', 15000.00, 'Mohon kirim dengan bubble wrap', NULL, NULL, '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
(2, 'BK-2024-002', 3, 180000.00, 'processing', 'ipaymu', 'paid', 'PAY-123456789', 'Jl. Pemuda No. 456, Surabaya, Jawa Timur 60271', 12000.00, NULL, NULL, NULL, '2024-01-15 11:00:00', '2024-01-15 11:30:00'),
(3, 'BK-2024-003', 4, 320000.00, 'shipped', 'ipaymu', 'paid', 'PAY-987654321', 'Jl. Gatot Subroto No. 789, Medan, Sumatera Utara 20112', 18000.00, 'Pengiriman express', '2024-01-16 08:00:00', NULL, '2024-01-15 12:00:00', '2024-01-16 08:00:00'),
(4, 'BK-2024-004', 5, 150000.00, 'delivered', 'ipaymu', 'paid', 'PAY-456789123', 'Jl. Malioboro No. 321, Yogyakarta, DIY 55213', 10000.00, NULL, '2024-01-16 09:00:00', '2024-01-17 14:30:00', '2024-01-15 13:00:00', '2024-01-17 14:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `book_id`, `quantity`, `price`, `total`, `created_at`) VALUES
(1, 1, 1, 2, 85000.00, 170000.00, '2024-01-15 10:00:00'),
(2, 1, 7, 1, 78000.00, 78000.00, '2024-01-15 10:00:00'),
(3, 2, 3, 1, 120000.00, 120000.00, '2024-01-15 11:00:00'),
(4, 2, 8, 1, 135000.00, 135000.00, '2024-01-15 11:00:00'),
(5, 3, 2, 1, 95000.00, 95000.00, '2024-01-15 12:00:00'),
(6, 3, 4, 1, 150000.00, 150000.00, '2024-01-15 12:00:00'),
(7, 3, 6, 1, 165000.00, 165000.00, '2024-01-15 12:00:00'),
(8, 4, 1, 1, 85000.00, 85000.00, '2024-01-15 13:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key_name` varchar(100) NOT NULL,
  `value` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_name` (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `key_name`, `value`, `description`, `created_at`, `updated_at`) VALUES
(1, 'site_name', 'Buku-ku', 'Nama website', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(2, 'site_description', 'Toko buku online terpercaya dengan koleksi lengkap', 'Deskripsi website', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(3, 'contact_email', 'info@bukuku.com', 'Email kontak', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(4, 'contact_phone', '+62 21 1234 5678', 'Nomor telepon kontak', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(5, 'contact_address', 'Jakarta, Indonesia', 'Alamat kontak', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(6, 'ipaymu_va', '0000001225297227', 'Virtual Account ipaymu', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(7, 'ipaymu_api_key', 'SANDBOX159D00F3-EA61-4AC0-987E-79CE088BEA7A', 'API Key ipaymu', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(8, 'shipping_cost', '15000', 'Biaya pengiriman default', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(9, 'free_shipping_minimum', '200000', 'Minimum pembelian untuk gratis ongkir', '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(10, 'currency', 'IDR', 'Mata uang', '2024-01-15 08:00:00', '2024-01-15 08:00:00');

COMMIT;