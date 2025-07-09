# Database Setup untuk Aplikasi Buku-ku

## Cara Install Database

1. **Buka phpMyAdmin** di server Anda
2. **Buat database baru** dengan nama `bukuku_ecommerce`
3. **Import file SQL**:
   - Klik tab "Import" di phpMyAdmin
   - Pilih file `bukuku_database.sql`
   - Klik "Go" untuk mengeksekusi

## Struktur Database

### Tabel Utama

1. **users** - Data pengguna (admin & customer)
2. **categories** - Kategori buku
3. **books** - Data buku lengkap
4. **carts** - Keranjang belanja
5. **orders** - Data pesanan
6. **order_items** - Detail item pesanan
7. **reviews** - Review dan rating buku
8. **wishlists** - Wishlist pengguna
9. **settings** - Pengaturan aplikasi
10. **banners** - Banner promosi

### Views (Tampilan)

- **book_details** - Gabungan data buku dengan kategori dan rating
- **order_summary** - Ringkasan pesanan dengan data customer

### Stored Procedures

- **UpdateBookRating** - Update rating buku otomatis
- **GetBooksByCategory** - Ambil buku berdasarkan kategori
- **GetFeaturedBooks** - Ambil buku pilihan
- **GetBestsellerBooks** - Ambil buku terlaris

## Data Sample

Database sudah terisi dengan data sample:

### Users
- **Admin**: admin@bukuku.com (password: password)
- **Customer**: customer@bukuku.com (password: password)
- **Demo Users**: john.doe@email.com, jane.smith@email.com, bob.wilson@email.com

### Books
- 12 buku sample dari berbagai kategori
- Lengkap dengan cover image, rating, dan review
- Data stok dan harga realistis

### Categories
- Fiksi, Non-Fiksi, Pendidikan, Agama, Teknologi, Biografi

### Orders
- 4 sample pesanan dengan berbagai status
- Data pembayaran ipaymu terintegrasi

## Konfigurasi ipaymu

Kredensial ipaymu sudah tersimpan di tabel `settings`:
- **VA**: 0000001225297227
- **API Key**: SANDBOX159D00F3-EA61-4AC0-987E-79CE088BEA7A

## Folder Upload

Pastikan membuat folder struktur untuk upload cover buku:
```
uploads/
├── 2024/
│   ├── 01/
│   │   ├── 15/
│   │   │   ├── laskar-pelangi-cover.jpg
│   │   │   ├── bumi-manusia-cover.jpg
│   │   │   └── ...
├── banners/
│   ├── hero-banner-1.jpg
│   └── promo-banner-1.jpg
```

## Password Hash

Semua password di database menggunakan bcrypt hash.
Default password untuk semua user: **password**

## Catatan Keamanan

1. Ganti password default setelah install
2. Update API key ipaymu dengan yang production
3. Pastikan folder uploads memiliki permission yang tepat
4. Backup database secara berkala