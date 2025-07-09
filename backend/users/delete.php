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

$user_id = $_GET['id'] ?? '';

if (empty($user_id)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "error" => "User ID is required"
    ));
    exit();
}

try {
    // Check if user exists
    $check_query = "SELECT id, name FROM users WHERE id = ?";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(1, $user_id);
    $check_stmt->execute();

    if ($check_stmt->rowCount() == 0) {
        http_response_code(404);
        echo json_encode(array(
            "success" => false,
            "error" => "User tidak ditemukan"
        ));
        exit();
    }

    $user_data = $check_stmt->fetch(PDO::FETCH_ASSOC);

    // Delete user
    $query = "DELETE FROM users WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $user_id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array(
            "success" => true,
            "message" => "User '{$user_data['name']}' berhasil dihapus dari database phpMyAdmin"
        ));
    } else {
        throw new Exception("Gagal menghapus user dari database");
    }

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ));
}
?>