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

$query = "SELECT * FROM categories ORDER BY name ASC";
$stmt = $db->prepare($query);
$stmt->execute();

$categories = array();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $category = array(
        "id" => $row['id'],
        "name" => $row['name'],
        "slug" => $row['slug'],
        "description" => $row['description'],
        "created_at" => $row['created_at']
    );
    $categories[] = $category;
}

http_response_code(200);
echo json_encode(array(
    "success" => true,
    "data" => $categories
));
?>