<?php

//mysql credentials
$mysql_host = "127.0.0.1";
$mysql_username = "root";
$mysql_password = "";
$mysql_database = "project_8";

$username = htmlspecialchars($_GET["un"]);
$description = htmlspecialchars($_GET["desc"]);
$date = htmlspecialchars($_GET["d"]);

$conn = mysqli_connect($mysql_host, $mysql_username, $mysql_password, $mysql_database);

if(mysqli_connect_errno()) {
  $msg = "Database connection failed: ";
  $msg .= mysqli_connect_error();
  $msg .= " : " . mysqli_connect_errno();
  exit($msg);
}

$sql = "INSERT INTO events (username, description, date) VALUES ('{$username}', '{$description}', '{$date}')";
$conn->query($sql);
$conn->close();

?>
