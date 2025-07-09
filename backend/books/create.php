<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get POST data
$title = $_POST['title'] ?? '';
$author = $_POST['author'] ?? '';
$price = $_POST['price'] ?? 0;
$description = $_POST['description'] ?? '';
$category = $_POST['category'] ?? '';
$stock = $_POST['stock'] ?? 0;
$publishYear = $_POST['publishYear'] ?? date('Y');
$isbn = $_POST['isbn'] ?? '';
$featured = isset($_POST['featured']) ? 1 : 0;
$bestseller = isset($_POST['bestseller']) ? 1 : 0;
$new_arrival = isset($_POST['new_arrival']) ? 1 : 0;

// Validate required fields
if (empty($title) || empty($author) || empty($price) || empty($category)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "error" => "Title, author, price, dan category wajib diisi"
    ));
    exit();
}

// Get category_id
$cat_query = "SELECT id FROM categories WHERE name = ?";
$cat_stmt = $db->prepare($cat_query);
$cat_stmt->bindParam(1, $category);
$cat_stmt->execute();

$category_id = 1; // default
if ($cat_stmt->rowCount() > 0) {
    $cat_row = $cat_stmt->fetch(PDO::FETCH_ASSOC);
    $category_id = $cat_row['id'];
}

// Handle file upload with date folder structure
$cover_image = 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400';

if (isset($_FILES['cover_image']) && $_FILES['cover_image']['error'] == 0) {
    // Create date-based folder structure
    $currentDate = new DateTime();
    $year = $currentDate->format('Y');
    $month = $currentDate->format('m');
    $day = $currentDate->format('d');
    
    $upload_dir = "../uploads/" . $year . "/" . $month . "/" . $day . "/";
    
    // Create directory if it doesn't exist
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }
    
    $file_extension = strtolower(pathinfo($_FILES['cover_image']['name'], PATHINFO_EXTENSION));
    $file_name = uniqid() . '_' . time() . '.' . $file_extension;
    $target_file = $upload_dir . $file_name;
    
    // Validate file type and size
    $allowed_types = array('jpg', 'jpeg', 'png', 'gif');
    $max_size = 5 * 1024 * 1024; // 5MB
    
    if (!in_array($file_extension, $allowed_types)) {
        http_response_code(400);
        echo json_encode(array(
            "success" => false,
            "error" => "Format file tidak didukung. Gunakan JPG, PNG, atau GIF."
        ));
        exit();
    }
    
    if ($_FILES['cover_image']['size'] > $max_size) {
        http_response_code(400);
        echo json_encode(array(
            "success" => false,
            "error" => "Ukuran file terlalu besar. Maksimal 5MB."
        ));
        exit();
    }
    
    if (move_uploaded_file($_FILES['cover_image']['tmp_name'], $target_file)) {
        $cover_image = "http://localhost/bukuku-api/uploads/" . $year . "/" . $month . "/" . $day . "/" . $file_name;
    } else {
        http_response_code(500);
        echo json_encode(array(
            "success" => false,
            "error" => "Gagal mengupload gambar ke local storage"
        ));
        exit();
    }
}

try {
    $query = "INSERT INTO books (title, author, price, description, category_id, stock, cover_image, publish_year, isbn, featured, bestseller, new_arrival, status) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $title);
    $stmt->bindParam(2, $author);
    $stmt->bindParam(3, $price);
    $stmt->bindParam(4, $description);
    $stmt->bindParam(5, $category_id);
    $stmt->bindParam(6, $stock);
    $stmt->bindParam(7, $cover_image);
    $stmt->bindParam(8, $publishYear);
    $stmt->bindParam(9, $isbn);
    $stmt->bindParam(10, $featured);
    $stmt->bindParam(11, $bestseller);
    $stmt->bindParam(12, $new_arrival);

    if ($stmt->execute()) {
        $book_id = $db->lastInsertId();
        
        http_response_code(201);
        echo json_encode(array(
            "success" => true,
            "message" => "Buku berhasil ditambahkan ke database phpMyAdmin dengan gambar tersimpan di local storage",
            "data" => array(
                "id" => $book_id,
                "title" => $title,
                "author" => $author,
                "price" => (float)$price,
                "category" => $category,
                "stock" => (int)$stock,
                "cover_image" => $cover_image
            )
        ));
    } else {
        throw new Exception("Gagal menyimpan ke database");
    }

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ));
}
?>