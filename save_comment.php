<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// 資料庫連線設定
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "project";

// 創建連接
$conn = new mysqli($servername, $username, $password, $dbname);

// 檢查連接
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => '資料庫連接失敗: ' . $conn->connect_error]));
}

// 檢查是否有POST資料
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_name = trim($_POST['user_name'] ?? '匿名');
    $message = trim($_POST['message'] ?? '');
    $url = trim($_POST['url'] ?? '');

    if (empty($message)) {
        echo json_encode(['success' => false, 'error' => '留言不能為空']);
        exit();
    }

    // 檢查和過濾輸入
    $user_name = htmlspecialchars($user_name, ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

    // 插入新使用者
    $stmt = $conn->prepare("INSERT INTO user (User_login, User_gmail, User_name) VALUES (0, '', ?)"); // User_login 預設為 0，User_gmail 預設為空
    $stmt->bind_param("s", $user_name);
    if ($stmt->execute()) {
        $user_id = $stmt->insert_id; // 取得新插入的 User_id
    } else {
        echo json_encode(['success' => false, 'error' => '插入使用者失敗: ' . $stmt->error]);
        $stmt->close();
        $conn->close();
        exit();
    }
    $stmt->close();

    // 儲存留言
    $stmt = $conn->prepare("INSERT INTO user_comments (User_id, Comment_content, News_url) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user_id, $message, $url);

    $response = array();
    if ($stmt->execute()) {
        $response['success'] = true;
    } else {
        $response['success'] = false;
        $response['error'] = '留言儲存失敗: ' . $stmt->error;
    }

    $stmt->close();
    $conn->close();

    echo json_encode($response);
    exit();
}
?>
