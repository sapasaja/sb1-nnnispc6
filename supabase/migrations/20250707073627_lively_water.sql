-- Database: bukuku_ecommerce
-- Aplikasi E-commerce Toko Buku "Buku-ku"
-- Created: 2024

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
(1, 'Laskar Pelangi', 'Andrea Hirata', 85000.00, 'Novel yang mengisahkan tentang perjuangan anak-anak sekolah di Belitung untuk mendapatkan pendidikan yang layak. Kisah inspiratif tentang persahabatan, mimpi, dan tekad yang kuat.', 1, 25, 'uploads/2024/01/15/laskar-pelangi-cover.jpg', 2005, '9789792218305', 4.8, 1250, 529, 'Bahasa Indonesia', 'Bentang Pustaka', 0.45, '19 x 13 cm', 'active', 1, 1, 0, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(2, 'Bumi Manusia', 'Pramoedya Ananta Toer', 95000.00, 'Novel sejarah Indonesia yang menceritakan kehidupan pada masa kolonial Belanda. Mengisahkan perjuangan Minke, seorang pribumi yang berjuang melawan ketidakadilan sistem kolonial.', 1, 18, 'uploads/2024/01/15/bumi-manusia-cover.jpg', 1980, '9789794338045', 4.9, 2100, 535, 'Bahasa Indonesia', 'Hasta Mitra', 0.50, '20 x 14 cm', 'active', 1, 1, 0, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(3, 'Atomic Habits', 'James Clear', 120000.00, 'Panduan praktis untuk membangun kebiasaan baik dan menghilangkan kebiasaan buruk. Buku ini memberikan strategi yang terbukti secara ilmiah untuk mengubah hidup Anda.', 2, 32, 'uploads/2024/01/15/atomic-habits-cover.jpg', 2018, '9780735211292', 4.7, 890, 320, 'Bahasa Indonesia', 'Gramedia Pustaka Utama', 0.35, '18 x 12 cm', 'active', 1, 1, 0, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(4, 'Sejarah Indonesia Modern', 'M.C. Ricklefs', 150000.00, 'Sejarah lengkap Indonesia dari masa kolonial hingga era reformasi. Analisis mendalam tentang perkembangan politik, ekonomi, dan sosial Indonesia modern.', 3, 15, 'uploads/2024/01/15/sejarah-indonesia-cover.jpg', 2020, '9786020633473', 4.6, 456, 720, 'Bahasa Indonesia', 'Serambi Ilmu Semesta', 0.80, '23 x 15 cm', 'active', 0, 0, 0, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(5, 'JavaScript: The Good Parts', 'Douglas Crockford', 180000.00, 'Panduan terbaik untuk memahami JavaScript dan praktik terbaik programming. Buku wajib bagi developer yang ingin menguasai JavaScript dengan benar.', 5, 22, 'uploads/2024/01/15/javascript-good-parts-cover.jpg', 2008, '9780596517748', 4.5, 678, 176, 'Bahasa Indonesia', 'Oreilly Media', 0.25, '17 x 11 cm', 'active', 0, 0, 0, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(6, 'Steve Jobs', 'Walter Isaacson', 165000.00, 'Biografi lengkap pendiri Apple Inc yang mengubah dunia teknologi. Kisah hidup visioner yang revolusioner dalam industri teknologi dan desain.', 6, 12, 'uploads/2024/01/15/steve-jobs-cover.jpg', 2011, '9781451648539', 4.4, 1890, 656, 'Bahasa Indonesia', 'Bentang Pustaka', 0.60, '21 x 14 cm', 'active', 0, 0, 0, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(7, 'Negeri 5 Menara', 'Ahmad Fuadi', 78000.00, 'Novel inspiratif tentang perjuangan santri meraih mimpi. Kisah persahabatan dan perjuangan enam santri di Pondok Madani Ponorogo untuk meraih cita-cita mereka.', 1, 28, 'uploads/2024/01/15/negeri-5-menara-cover.jpg', 2009, '9789792248661', 4.6, 1567, 423, 'Bahasa Indonesia', 'Gramedia Pustaka Utama', 0.40, '19 x 13 cm', 'active', 1, 0, 0, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(8, 'The Power of Now', 'Eckhart Tolle', 135000.00, 'Panduan spiritual untuk hidup di masa sekarang. Buku yang mengajarkan cara menemukan kedamaian dan kebahagiaan melalui kesadaran akan momen saat ini.', 4, 19, 'uploads/2024/01/15/power-of-now-cover.jpg', 1997, '9781577314806', 4.3, 723, 236, 'Bahasa Indonesia', 'Gramedia Pustaka Utama', 0.30, '18 x 12 cm', 'active', 0, 0, 0, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(9, 'Sapiens: Riwayat Singkat Umat Manusia', 'Yuval Noah Harari', 145000.00, 'Sejarah evolusi manusia dari zaman batu hingga era modern. Analisis mendalam tentang bagaimana Homo sapiens menjadi spesies dominan di Bumi.', 2, 35, 'uploads/2024/01/15/sapiens-cover.jpg', 2014, '9786020318875', 4.7, 2340, 512, 'Bahasa Indonesia', 'Pustaka Alvabet', 0.55, '20 x 13 cm', 'active', 1, 1, 1, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(10, 'Matematika SMA Kelas XII', 'Tim Penulis', 95000.00, 'Buku pelajaran matematika untuk siswa SMA kelas XII. Materi lengkap sesuai kurikulum terbaru dengan contoh soal dan pembahasan.', 3, 45, 'uploads/2024/01/15/matematika-sma-cover.jpg', 2023, '9786025735421', 4.2, 234, 384, 'Bahasa Indonesia', 'Erlangga', 0.65, '25 x 17 cm', 'active', 0, 0, 1, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(11, 'Tafsir Al-Quran Tematik', 'Dr. Ahmad Syukri', 175000.00, 'Tafsir Al-Quran dengan pendekatan tematik yang mudah dipahami. Penjelasan ayat-ayat Al-Quran berdasarkan tema-tema kehidupan sehari-hari.', 4, 20, 'uploads/2024/01/15/tafsir-quran-cover.jpg', 2022, '9786024553127', 4.8, 567, 892, 'Bahasa Indonesia', 'Mizan Pustaka', 1.20, '24 x 17 cm', 'active', 0, 0, 1, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(12, 'React.js untuk Pemula', 'Budi Raharjo', 125000.00, 'Panduan lengkap belajar React.js dari dasar hingga mahir. Cocok untuk pemula yang ingin menguasai library JavaScript populer ini.', 5, 30, 'uploads/2024/01/15/reactjs-pemula-cover.jpg', 2023, '9786026233127', 4.4, 445, 298, 'Bahasa Indonesia', 'Informatika', 0.40, '19 x 13 cm', 'active', 0, 0, 1, '2024-01-15 08:00:00', '2024-01-15 08:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `book_id` (`book_id`),
  UNIQUE KEY `user_book` (`user_id`, `book_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

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
(8, 4, 9, 1, 145000.00, 145000.00, '2024-01-15 13:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `book_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(1) NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
  `comment` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `book_id` (`book_id`),
  KEY `user_id` (`user_id`),
  KEY `status` (`status`),
  UNIQUE KEY `user_book_review` (`user_id`, `book_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `book_id`, `user_id`, `rating`, `comment`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 5, 'Buku yang sangat menginspirasi! Cerita tentang perjuangan anak-anak Belitung sangat menyentuh hati.', 'approved', '2024-01-15 14:00:00', '2024-01-15 14:00:00'),
(2, 1, 3, 5, 'Masterpiece Andrea Hirata. Wajib dibaca oleh semua orang Indonesia.', 'approved', '2024-01-15 15:00:00', '2024-01-15 15:00:00'),
(3, 2, 4, 5, 'Karya terbaik Pramoedya. Memberikan perspektif baru tentang sejarah Indonesia.', 'approved', '2024-01-15 16:00:00', '2024-01-15 16:00:00'),
(4, 3, 5, 4, 'Buku yang praktis untuk mengubah kebiasaan. Sangat mudah dipahami dan diterapkan.', 'approved', '2024-01-15 17:00:00', '2024-01-15 17:00:00'),
(5, 9, 2, 5, 'Buku yang membuka mata tentang sejarah umat manusia. Sangat recommended!', 'approved', '2024-01-15 18:00:00', '2024-01-15 18:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `book_id` (`book_id`),
  UNIQUE KEY `user_book_wishlist` (`user_id`, `book_id`),
  CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

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

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `position` enum('hero','sidebar','footer') DEFAULT 'hero',
  `status` enum('active','inactive') DEFAULT 'active',
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `position` (`position`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `subtitle`, `image`, `link`, `position`, `status`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, 'Temukan Buku Impian Anda', 'Koleksi lengkap buku dari berbagai genre dengan harga terjangkau', 'uploads/banners/hero-banner-1.jpg', '/books', 'hero', 'active', 1, '2024-01-15 08:00:00', '2024-01-15 08:00:00'),
(2, 'Diskon Spesial Buku Fiksi', 'Hemat hingga 30% untuk semua buku fiksi pilihan', 'uploads/banners/promo-banner-1.jpg', '/category/fiksi', 'sidebar', 'active', 1, '2024-01-15 08:00:00', '2024-01-15 08:00:00');

-- --------------------------------------------------------

--
-- Indexes and Auto Increment
--

ALTER TABLE `categories` AUTO_INCREMENT = 7;
ALTER TABLE `users` AUTO_INCREMENT = 6;
ALTER TABLE `books` AUTO_INCREMENT = 13;
ALTER TABLE `carts` AUTO_INCREMENT = 1;
ALTER TABLE `orders` AUTO_INCREMENT = 5;
ALTER TABLE `order_items` AUTO_INCREMENT = 9;
ALTER TABLE `reviews` AUTO_INCREMENT = 6;
ALTER TABLE `wishlists` AUTO_INCREMENT = 1;
ALTER TABLE `settings` AUTO_INCREMENT = 11;
ALTER TABLE `banners` AUTO_INCREMENT = 3;

-- --------------------------------------------------------

--
-- Views for easier data access
--

CREATE VIEW `book_details` AS
SELECT 
    b.*,
    c.name as category_name,
    c.slug as category_slug,
    COALESCE(AVG(r.rating), 0) as avg_rating,
    COUNT(r.id) as total_reviews
FROM books b
LEFT JOIN categories c ON b.category_id = c.id
LEFT JOIN reviews r ON b.id = r.book_id AND r.status = 'approved'
GROUP BY b.id;

-- --------------------------------------------------------

CREATE VIEW `order_summary` AS
SELECT 
    o.*,
    u.name as customer_name,
    u.email as customer_email,
    COUNT(oi.id) as total_items,
    SUM(oi.quantity) as total_quantity
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- --------------------------------------------------------

--
-- Stored Procedures
--

DELIMITER $$

CREATE PROCEDURE `UpdateBookRating`(IN book_id INT)
BEGIN
    DECLARE avg_rating DECIMAL(2,1);
    DECLARE review_count INT;
    
    SELECT AVG(rating), COUNT(*) 
    INTO avg_rating, review_count
    FROM reviews 
    WHERE book_id = book_id AND status = 'approved';
    
    UPDATE books 
    SET rating = COALESCE(avg_rating, 0), 
        reviews_count = review_count 
    WHERE id = book_id;
END$$

CREATE PROCEDURE `GetBooksByCategory`(IN category_slug VARCHAR(100))
BEGIN
    SELECT b.*, c.name as category_name
    FROM books b
    JOIN categories c ON b.category_id = c.id
    WHERE c.slug = category_slug AND b.status = 'active'
    ORDER BY b.created_at DESC;
END$$

CREATE PROCEDURE `GetFeaturedBooks`(IN limit_count INT)
BEGIN
    SELECT * FROM book_details
    WHERE status = 'active' AND featured = 1
    ORDER BY avg_rating DESC, total_reviews DESC
    LIMIT limit_count;
END$$

CREATE PROCEDURE `GetBestsellerBooks`(IN limit_count INT)
BEGIN
    SELECT * FROM book_details
    WHERE status = 'active' AND bestseller = 1
    ORDER BY avg_rating DESC, total_reviews DESC
    LIMIT limit_count;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Triggers
--

DELIMITER $$

CREATE TRIGGER `update_book_rating_after_review` 
AFTER INSERT ON `reviews` 
FOR EACH ROW 
BEGIN
    CALL UpdateBookRating(NEW.book_id);
END$$

CREATE TRIGGER `update_book_rating_after_review_update` 
AFTER UPDATE ON `reviews` 
FOR EACH ROW 
BEGIN
    CALL UpdateBookRating(NEW.book_id);
END$$

CREATE TRIGGER `update_book_rating_after_review_delete` 
AFTER DELETE ON `reviews` 
FOR EACH ROW 
BEGIN
    CALL UpdateBookRating(OLD.book_id);
END$$

DELIMITER ;

COMMIT;