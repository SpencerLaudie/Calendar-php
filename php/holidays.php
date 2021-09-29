<?php

//mysql credentials
$mysql_host = "127.0.0.1";
$mysql_username = "root";
$mysql_password = "";
$mysql_database = "project_8";

$result_array = array();

$conn = mysqli_connect($mysql_host, $mysql_username, $mysql_password, $mysql_database);

if(mysqli_connect_errno()) {
  $msg = "Database connection failed: ";
  $msg .= mysqli_connect_error();
  $msg .= " : " . mysqli_connect_errno();
  exit($msg);
}

$sql = "SELECT date, description FROM holidays";
$events = $conn->query($sql);

if ($events->num_rows > 0) {
  while($row = $events->fetch_assoc()) {
    array_push($result_array, $row);
  }
}

header('Content-type: application/json');
echo json_encode($result_array);

$conn->close();

?>
