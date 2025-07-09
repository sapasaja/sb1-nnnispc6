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
$search = $_GET['search'] ?? '';
$role = $_GET['role'] ?? '';
$status = $_GET['status'] ?? '';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;

$query = "SELECT id, email, name, role, phone, address, status, email_verified, created_at 
          FROM users WHERE 1=1";

$params = array();

if (!empty($search)) {
    $query .= " AND (name LIKE ? OR email LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

if (!empty($role)) {
    $query .= " AND role = ?";
    $params[] = $role;
}

if (!empty($status)) {
    $query .= " AND status = ?";
    $params[] = $status;
}

$query .= " ORDER BY created_at DESC LIMIT " . $limit;

try {
    $stmt = $db->prepare($query);
    $stmt->execute($params);

    $users = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $user = array(
            "id" => $row['id'],
            "email" => $row['email'],
            "name" => $row['name'],
            "role" => $row['role'],
            "phone" => $row['phone'],
            "address" => $row['address'],
            "status" => $row['status'],
            "email_verified" => (bool)$row['email_verified'],
            "created_at" => $row['created_at']
        );
        $users[] = $user;
    }

    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "data" => $users,
        "count" => count($users),
        "message" => "Data users dari database phpMyAdmin"
    ));

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ));
}
?>