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
$status = $_GET['status'] ?? '';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;

$query = "SELECT o.*, u.name as customer_name, u.email as customer_email
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.id
          WHERE 1=1";

$params = array();

if (!empty($search)) {
    $query .= " AND (o.order_number LIKE ? OR u.name LIKE ? OR u.email LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

if (!empty($status)) {
    $query .= " AND o.status = ?";
    $params[] = $status;
}

$query .= " ORDER BY o.created_at DESC LIMIT " . $limit;

try {
    $stmt = $db->prepare($query);
    $stmt->execute($params);

    $orders = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // Get order items
        $items_query = "SELECT oi.*, b.title as book_title 
                       FROM order_items oi 
                       LEFT JOIN books b ON oi.book_id = b.id 
                       WHERE oi.order_id = ?";
        $items_stmt = $db->prepare($items_query);
        $items_stmt->bindParam(1, $row['id']);
        $items_stmt->execute();
        $items = $items_stmt->fetchAll(PDO::FETCH_ASSOC);

        $order = array(
            "id" => $row['id'],
            "order_number" => $row['order_number'],
            "customer_name" => $row['customer_name'],
            "customer_email" => $row['customer_email'],
            "total_amount" => (float)$row['total_amount'],
            "status" => $row['status'],
            "payment_status" => $row['payment_status'],
            "created_at" => $row['created_at'],
            "items" => $items
        );
        $orders[] = $order;
    }

    http_response_code(200);
    echo json_encode(array(
        "success" => true,
        "data" => $orders,
        "count" => count($orders),
        "message" => "Data orders dari database phpMyAdmin"
    ));

} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "error" => "Database error: " . $e->getMessage()
    ));
}
?>