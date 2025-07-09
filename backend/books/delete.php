<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$book_id = $_GET['id'] ?? '';

if (empty($book_id)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "error" => "Book ID is required"
    ));
    exit();
}

try {
    $query = "DELETE FROM books WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $book_id);

    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Buku berhasil dihapus dari database phpMyAdmin"
            ));
        } else {
            http_response_code(404);
            echo json_encode(array(
                "success" => false,
                "error" => "Buku tidak ditemukan"
            ));
        }
    } else {
        throw new Exception("Gagal menghapus dari database");
    }

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ));
}
?>