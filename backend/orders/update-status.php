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

$order_id = $_GET['id'] ?? '';
$data = json_decode(file_get_contents("php://input"));
$status = $data->status ?? '';

if (empty($order_id) || empty($status)) {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "error" => "Order ID dan status wajib diisi"
    ));
    exit();
}

try {
    $query = "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $status);
    $stmt->bindParam(2, $order_id);

    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Status pesanan berhasil diupdate di database phpMyAdmin"
            ));
        } else {
            http_response_code(404);
            echo json_encode(array(
                "success" => false,
                "error" => "Pesanan tidak ditemukan"
            ));
        }
    } else {
        throw new Exception("Gagal update status");
    }

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ));
}
?>