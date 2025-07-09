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

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->email) && !empty($data->password) && !empty($data->name)) {
    // Check if email already exists
    $check_query = "SELECT id FROM users WHERE email = ?";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(1, $data->email);
    $check_stmt->execute();

    if ($check_stmt->rowCount() > 0) {
        http_response_code(400);
        echo json_encode(array(
            "success" => false,
            "error" => "Email sudah terdaftar"
        ));
        exit();
    }

    // Hash password
    $hashed_password = password_hash($data->password, PASSWORD_BCRYPT);

    $query = "INSERT INTO users (email, password, name, role, phone, address, status, email_verified) 
              VALUES (?, ?, ?, 'customer', ?, ?, 'active', 1)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $data->email);
    $stmt->bindParam(2, $hashed_password);
    $stmt->bindParam(3, $data->name);
    $stmt->bindParam(4, $data->phone ?? null);
    $stmt->bindParam(5, $data->address ?? null);

    if ($stmt->execute()) {
        $user_id = $db->lastInsertId();
        
        // Generate token
        $token = base64_encode($user_id . ':' . time());
        
        $user_data = array(
            "id" => $user_id,
            "email" => $data->email,
            "name" => $data->name,
            "role" => "customer",
            "phone" => $data->phone ?? null,
            "address" => $data->address ?? null,
            "createdAt" => date('c')
        );

        http_response_code(201);
        echo json_encode(array(
            "success" => true,
            "message" => "Registrasi berhasil",
            "data" => array(
                "user" => $user_data,
                "token" => $token
            )
        ));
    } else {
        http_response_code(500);
        echo json_encode(array(
            "success" => false,
            "error" => "Gagal membuat akun"
        ));
    }
} else {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "error" => "Email, password, dan nama harus diisi"
    ));
}
?>