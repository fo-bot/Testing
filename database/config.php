<?php
$host = "localhost";
$dbname = "restaurantfinder"; 
$username = "root"; 
$password = "Bhagtana2311!"; 

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>