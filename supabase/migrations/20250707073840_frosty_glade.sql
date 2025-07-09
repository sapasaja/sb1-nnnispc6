-- Sample Queries untuk Testing Database Buku-ku

-- 1. Ambil semua buku dengan detail kategori dan rating
SELECT 
    b.id,
    b.title,
    b.author,
    b.price,
    c.name as category,
    b.rating,
    b.reviews_count,
    b.stock
FROM books b
JOIN categories c ON b.category_id = c.id
WHERE b.status = 'active'
ORDER BY b.rating DESC;

-- 2. Ambil buku terlaris (rating tinggi dan banyak review)
SELECT * FROM book_details
WHERE status = 'active' AND bestseller = 1
ORDER BY avg_rating DESC, total_reviews DESC
LIMIT 8;

-- 3. Ambil buku berdasarkan kategori
SELECT b.*, c.name as category_name
FROM books b
JOIN categories c ON b.category_id = c.id
WHERE c.slug = 'fiksi' AND b.status = 'active'
ORDER BY b.created_at DESC;

-- 4. Cari buku berdasarkan judul atau penulis
SELECT * FROM book_details
WHERE (title LIKE '%laskar%' OR author LIKE '%andrea%')
AND status = 'active'
ORDER BY avg_rating DESC;

-- 5. Ambil keranjang user tertentu
SELECT 
    c.id,
    c.quantity,
    b.title,
    b.author,
    b.price,
    b.cover_image,
    (c.quantity * b.price) as subtotal
FROM carts c
JOIN books b ON c.book_id = b.id
WHERE c.user_id = 2;

-- 6. Ambil detail pesanan dengan items
SELECT 
    o.order_number,
    o.total_amount,
    o.status,
    o.created_at,
    u.name as customer_name,
    oi.quantity,
    b.title,
    oi.price
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN books b ON oi.book_id = b.id
WHERE o.id = 1;

-- 7. Statistik penjualan per kategori
SELECT 
    c.name as category,
    COUNT(oi.id) as total_sold,
    SUM(oi.total) as total_revenue
FROM categories c
JOIN books b ON c.id = b.category_id
JOIN order_items oi ON b.id = oi.book_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status IN ('delivered', 'shipped')
GROUP BY c.id, c.name
ORDER BY total_revenue DESC;

-- 8. Review terbaru untuk buku tertentu
SELECT 
    r.rating,
    r.comment,
    r.created_at,
    u.name as reviewer_name
FROM reviews r
JOIN users u ON r.user_id = u.id
WHERE r.book_id = 1 AND r.status = 'approved'
ORDER BY r.created_at DESC;

-- 9. Buku dengan stok rendah (alert untuk admin)
SELECT 
    title,
    author,
    stock,
    category_name
FROM book_details
WHERE stock <= 10 AND status = 'active'
ORDER BY stock ASC;

-- 10. Top 5 customer berdasarkan total pembelian
SELECT 
    u.name,
    u.email,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) as total_spent
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status IN ('delivered', 'shipped')
GROUP BY u.id, u.name, u.email
ORDER BY total_spent DESC
LIMIT 5;

-- 11. Laporan penjualan harian
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_orders,
    SUM(total_amount) as daily_revenue
FROM orders
WHERE status IN ('delivered', 'shipped')
AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- 12. Buku yang belum pernah dibeli
SELECT b.*
FROM books b
LEFT JOIN order_items oi ON b.id = oi.book_id
WHERE oi.book_id IS NULL
AND b.status = 'active';

-- 13. Update stok setelah pembelian (contoh untuk book_id = 1, quantity = 2)
UPDATE books 
SET stock = stock - 2 
WHERE id = 1 AND stock >= 2;

-- 14. Tambah item ke keranjang (atau update jika sudah ada)
INSERT INTO carts (user_id, book_id, quantity) 
VALUES (2, 1, 1)
ON DUPLICATE KEY UPDATE 
quantity = quantity + VALUES(quantity);

-- 15. Hapus item dari keranjang
DELETE FROM carts 
WHERE user_id = 2 AND book_id = 1;