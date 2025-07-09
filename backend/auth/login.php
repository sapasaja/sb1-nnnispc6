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

if (!empty($data->email) && !empty($data->password)) {
    $query = "SELECT id, email, password, name, role, phone, address, status FROM users WHERE email = ? AND status = 'active'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(1, $data->email);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verify password (assuming bcrypt hash)
        if (password_verify($data->password, $row['password'])) {
            // Generate simple token (in production, use JWT)
            $token = base64_encode($row['id'] . ':' . time());
            
            $user_data = array(
                "id" => $row['id'],
                "email" => $row['email'],
                "name" => $row['name'],
                "role" => $row['role'],
                "phone" => $row['phone'],
                "address" => $row['address'],
                "createdAt" => date('c')
            );

            http_response_code(200);
            echo json_encode(array(
                "success" => true,
                "message" => "Login berhasil",
                "data" => array(
                    "user" => $user_data,
                    "token" => $token
                )
            ));
        } else {
            http_response_code(401);
            echo json_encode(array(
                "success" => false,
                "error" => "Password salah"
            ));
        }
    } else {
        http_response_code(401);
        echo json_encode(array(
            "success" => false,
            "error" => "Email tidak ditemukan atau akun tidak aktif"
        ));
    }
} else {
    http_response_code(400);
    echo json_encode(array(
        "success" => false,
        "error" => "Email dan password harus diisi"
    ));
}
?>