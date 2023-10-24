<?php
// Database connection parameters
$servername = "localhost";
$username = "root"; // Replace with your MySQL username
$password = ""; // Replace with your MySQL password
$dbname = "backend";

// Create a connection to MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the connection is successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve data from the form
$name = $_POST['name'];
$address = $_POST['address'];
$phone = $_POST['phone'];
$email = $_POST['email'];
// $dob = $_POST['dob'];
$password1 = $_POST['password1'];
$password2 = $_POST['password2'];

// Insert the data into the submitdata table
$sql = "INSERT INTO registrationdata (name, address, phone, email, password1,password2) VALUES ('$name', '$address','$phone','$email', '$password1','$password2')";

if ($conn->query($sql) === TRUE) {
    echo "Data submitted successfully!";
    
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Close the database connection
$conn->close();
?>
