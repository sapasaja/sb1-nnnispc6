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

// Get query parameters
$featured = isset($_GET['featured']) ? $_GET['featured'] : null;
$bestseller = isset($_GET['bestseller']) ? $_GET['bestseller'] : null;
$new_arrival = isset($_GET['new_arrival']) ? $_GET['new_arrival'] : null;
$search = isset($_GET['search']) ? $_GET['search'] : null;
$category = isset($_GET['category']) ? $_GET['category'] : null;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;

$query = "SELECT b.*, c.name as category_name 
          FROM books b 
          LEFT JOIN categories c ON b.category_id = c.id 
          WHERE b.status = 'active'";

$params = array();

if ($featured) {
    $query .= " AND b.featured = 1";
}

if ($bestseller) {
    $query .= " AND b.bestseller = 1";
}

if ($new_arrival) {
    $query .= " AND b.new_arrival = 1";
}

if ($search) {
    $query .= " AND (b.title LIKE ? OR b.author LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

if ($category) {
    $query .= " AND c.slug = ?";
    $params[] = $category;
}

$query .= " ORDER BY b.created_at DESC LIMIT " . $limit;

try {
    $stmt = $db->prepare($query);
    $stmt->execute($params);

    $books = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $book = array(
            "id" => $row['id'],
            "title" => $row['title'],
            "author" => $row['author'],
            "price" => (float)$row['price'],
            "description" => $row['description'],
            "category" => $row['category_name'] ?? 'Uncategorized',
            "stock" => (int)$row['stock'],
            "coverImage" => $row['cover_image'] ?? 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
            "publishYear" => (int)$row['publish_year'],
            "isbn" => $row['isbn'],
            "rating" => (float)$row['rating'],
            "reviews" => (int)$row['reviews_count'],
            "featured" => (bool)$row['featured'],
            "bestseller" => (bool)$row['bestseller'],
            "new_arrival" => (bool)$row['new_arrival'],
            "createdAt" => $row['created_at'],
            "updatedAt" => $row['updated_at']
        );
        $books[] = $book;
    }

    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "data" => $books,
        "count" => count($books),
        "message" => "Data berhasil diambil dari database phpMyAdmin"
    ));

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ));
}
?>