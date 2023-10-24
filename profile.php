<?php
session_start();

// Check if the user is logged in
if (!isset($_SESSION['email'])) {
  header("Location: login.php");
  exit();
}

// Establish database connection
$host = 'localhost';
$dbname = 'backend';
$username = 'root';
$password = '';

try {
  $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  die("Database connection failed: " . $e->getMessage());
}

// Retrieve user information from the database
$email = $_SESSION['email'];

$sql = "SELECT * FROM registrationdata WHERE email = :email";
$stmt = $pdo->prepare($sql);
$stmt->execute([':email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Display the user's information
echo "Name: " . $user['name'] . "<br>";
echo "Email: " . $user['email'] . "<br>";
echo "Phone Number: " . $user['phone_number'] . "<br>";
echo "Address: " . $user['address'] . "<br>";
?>