<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Get total books
    $books_query = "SELECT COUNT(*) as total FROM books WHERE status = 'active'";
    $books_stmt = $db->prepare($books_query);
    $books_stmt->execute();
    $total_books = $books_stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Get total users
    $users_query = "SELECT COUNT(*) as total FROM users WHERE status = 'active'";
    $users_stmt = $db->prepare($users_query);
    $users_stmt->execute();
    $total_users = $users_stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Get total orders
    $orders_query = "SELECT COUNT(*) as total, SUM(total_amount) as revenue FROM orders";
    $orders_stmt = $db->prepare($orders_query);
    $orders_stmt->execute();
    $orders_data = $orders_stmt->fetch(PDO::FETCH_ASSOC);
    $total_orders = $orders_data['total'] ?? 0;
    $total_revenue = $orders_data['revenue'] ?? 0;

    // Get top books
    $top_books_query = "SELECT b.title, b.author, COUNT(oi.id) as sales, SUM(oi.total) as revenue
                        FROM books b
                        LEFT JOIN order_items oi ON b.id = oi.book_id
                        LEFT JOIN orders o ON oi.order_id = o.id
                        WHERE o.status IN ('delivered', 'shipped')
                        GROUP BY b.id, b.title, b.author
                        ORDER BY sales DESC
                        LIMIT 5";
    $top_books_stmt = $db->prepare($top_books_query);
    $top_books_stmt->execute();
    $top_books = $top_books_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get top categories
    $top_categories_query = "SELECT c.name, COUNT(oi.id) as sales, SUM(oi.total) as revenue
                            FROM categories c
                            LEFT JOIN books b ON c.id = b.category_id
                            LEFT JOIN order_items oi ON b.id = oi.book_id
                            LEFT JOIN orders o ON oi.order_id = o.id
                            WHERE o.status IN ('delivered', 'shipped')
                            GROUP BY c.id, c.name
                            ORDER BY sales DESC
                            LIMIT 5";
    $top_categories_stmt = $db->prepare($top_categories_query);
    $top_categories_stmt->execute();
    $top_categories = $top_categories_stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get sales by month
    $sales_by_month_query = "SELECT 
                            DATE_FORMAT(created_at, '%b') as month,
                            SUM(total_amount) as revenue,
                            COUNT(*) as orders
                            FROM orders 
                            WHERE status IN ('delivered', 'shipped')
                            AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                            GROUP BY MONTH(created_at), DATE_FORMAT(created_at, '%b')
                            ORDER BY created_at";
    $sales_stmt = $db->prepare($sales_by_month_query);
    $sales_stmt->execute();
    $sales_by_month = $sales_stmt->fetchAll(PDO::FETCH_ASSOC);

    $stats = array(
        "totalRevenue" => (float)$total_revenue,
        "totalOrders" => (int)$total_orders,
        "totalBooks" => (int)$total_books,
        "totalUsers" => (int)$total_users,
        "revenueGrowth" => 15, // Mock growth percentage
        "ordersGrowth" => 23,  // Mock growth percentage
        "topBooks" => $top_books,
        "topCategories" => $top_categories,
        "salesByMonth" => $sales_by_month
    );

    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "data" => $stats,
        "message" => "Data statistik dari database phpMyAdmin - bukuku_ecommerce"
    ));

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ));
}
?>