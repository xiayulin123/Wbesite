<!DOCTYPE html>
<html>
<head>
<title>Table with database</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<link rel="stylesheet" href="../public/home.css">
<link rel="stylesheet" href="../public/home2.css">
<style>
table {
border-collapse: collapse;
width: 100%;
color: #588c7e;
font-family: monospace;
font-size: 25px;
text-align: left;
}
th {
background-color: #588c7e;
color: white;
}
tr:nth-child(even) {background-color: #f2f2f2}
</style>
</head>
<body>
<table>
<tr>
<th>ReservationName</th>
<th>ReservationDate</th>
<th>PhoneNumber</th>
<th>ReservationMessages</th>
</tr>
<?php
$dbhost = "127.0.0.1";
$dbuser = "user";
$dbpass = "password";
$db = "db";

$conn = new mysqli($dbhost, $dbuser, $dbpass, $db) or die("Connect failed: %s\n". $conn -> error);

$sql = "SELECT * from Reservation";
$result = $conn->query($sql);
if ($result->num_rows > 0) {
// output data of each row
while($row = $result->fetch_assoc()) {
echo "<tr><td>" . $row["ReservationName"]. "</td><td>" . $row["ReservationDate"] . "</td><td>"
. $row["PhoneNumber"]. "</td><td>" . $row["ReservationMessages"]. "</td></tr>";
}
echo "</table>";
} else { echo "0 results"; }
$conn->close();

?>
</table>
</body>
</html>