<?php

//mysql credentials
$mysql_host = "127.0.0.1";
$mysql_username = "root";
$mysql_password = "";
$mysql_database = "project_8";


$username = htmlspecialchars($_GET["un"]);
$password = htmlspecialchars($_GET["pw"]);

$conn = mysqli_connect($mysql_host, $mysql_username, $mysql_password, $mysql_database);

if(mysqli_connect_errno()) {
  $msg = "Database connection failed: ";
  $msg .= mysqli_connect_error();
  $msg .= " : " . mysqli_connect_errno();
  exit($msg);
}

$sql = "SELECT * FROM users WHERE username='{$username}'";

$result = $conn->query($sql);


if (mysqli_num_rows($result) > 0) {
  $sql2 = "SELECT * FROM users WHERE username='{$username}' AND password='{$password}'";
  $val_pw = $conn->query($sql2);
  if (mysqli_num_rows($val_pw) > 0) {
    $sql3 = "SELECT date, description FROM events WHERE username='{$username}'";
    $dates = $conn->query($sql3);
    if (mysqli_num_rows($dates) > 0) {
      $row = $dates->fetch_assoc();
      $dates = "{$row['date']} {$row['description']}";
    }
    echo "<div id='username' class='accordion'>{$username}</div>
          <div id='account-panel' class='panel'></div>
          <div class='accordion'>Create Event</div>
          <div id='event-panel' class='panel'>
            <div id='event-box' class='box'>
              <div id='inputs'>
                <div>
                  <label>Title</label>
                  <input id='event-desc' class='input-text input' type='text' name='description' required>
                </div>
                <div>
                  <label>Date</label>
                  <input id='event-date' class='input-text input' type='date' name='date' required>
                </div>
                <div>
                  <label>Time</label>
                  <input id='event-time' class='input-text input' type='time' name='time' required>
                </div>
              </div>
              <button type='' onclick='makeEvent()'>Create</button>
            </div>
          </div>";
  } else {
    echo "<div id='login-btn' class='accordion'>Login</div>
          <div id='login-panel' class='panel'>
            <div id='login-box' class='box'>
              <div id='inputs'>
                <div>
                  <label for='username'>Username</label>
                  <input id='login-un' class='input-text input' type='text' name='username' required>
                </div>
                <div>
                  <label for='password'>Password</label>
                  <input id='login-pw' class='input-text input' type='password' minlength='8' name='password' required>
                </div>
              </div>
              <p id='bad-pw'>invalid credentials</p>
              <button type='' onclick='login()'>Login</button>
            </div>
          </div>";

  }
}
else {
  $sql3 = "INSERT INTO users (username, password) VALUES ('{$username}', '{$password}')";
  $conn->query($sql3);
  $conn->close();
  echo "<div id='username' class='accordion'>{$username}</div>
        <div id='account-panel' class='panel'></div>
        <div class='accordion'>Create Event</div>
        <div id='event-panel' class='panel'>
          <div id='event-box' class='box'>
            <div id='inputs'>
              <div>
                <label>Title</label>
                <input id='event-desc' class='input-text input' type='text' name='description' required>
              </div>
              <div>
                <label>Date</label>
                <input id='event-date' class='input-text input' type='date' name='date' required>
              </div>
              <div>
                <label>Time</label>
                <input id='event-time' class='input-text input' type='time' name='time' required>
              </div>
            </div>
            <button type='' onclick='makeEvent()'>Create</button>
          </div>
        </div>";
}


// $sql3 = "SELECT date, description FROM events WHERE username='{$username}'";
// $dates = $conn->query($sql3);
// if (mysqli_num_rows($dates) > 0) {
//   $row = $dates->fetch_assoc();
//   echo "{$row['date']} {$row['description']}";
// }

?>
