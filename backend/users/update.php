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

$user_id = $_GET['id'] ?? '';

if (empty($user_id)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "error" => "User ID is required"
    ));
    exit();
}

$data = json_decode(file_get_contents("php://input"));

// Check if user exists
$check_query = "SELECT id FROM users WHERE id = ?";
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

try {
    $query = "UPDATE users SET 
              name = ?, 
              role = ?, 
              phone = ?, 
              address = ?, 
              status = ?, 
              updated_at = CURRENT_TIMESTAMP 
              WHERE id = ?";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $data->name);
    $stmt->bindParam(2, $data->role ?? 'customer');
    $stmt->bindParam(3, $data->phone ?? null);
    $stmt->bindParam(4, $data->address ?? null);
    $stmt->bindParam(5, $data->status ?? 'active');
    $stmt->bindParam(6, $user_id);

    if ($stmt->execute()) {
        // Get updated user data
        $get_query = "SELECT id, email, name, role, phone, address, status, email_verified, created_at FROM users WHERE id = ?";
        $get_stmt = $db->prepare($get_query);
        $get_stmt->bindParam(1, $user_id);
        $get_stmt->execute();
        $updated_user = $get_stmt->fetch(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode(array(
            "success" => true,
            "message" => "User berhasil diupdate di database phpMyAdmin",
            "data" => $updated_user
        ));
    } else {
        throw new Exception("Gagal update user");
    }

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ));
}
?>