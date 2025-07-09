<?php
// Database configuration untuk koneksi ke phpMyAdmin
class Database {
    private $host = "localhost";
    private $db_name = "bukuku_ecommerce";
    private $username = "root"; // Sesuaikan dengan username phpMyAdmin Anda
    private $password = "";     // Sesuaikan dengan password phpMyAdmin Anda
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>