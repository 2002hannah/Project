<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
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
    die(json_encode(['success' => false, 'error' => '資料庫連接失敗']));
}
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $url = trim($_GET['url']);

    // 查詢所有留言及使用者名稱
    $sql = "
        SELECT uc.Comment_content, user.User_name
        FROM user_comments AS uc
        JOIN user ON uc.User_id = user.User_id
        WHERE News_url = ?
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $url);

    $stmt->execute();
    $result = $stmt->get_result();

    $comments = [];
    if ($result->num_rows > 0) {
        // 將每一筆留言和使用者名稱添加到陣列中
        while($row = $result->fetch_assoc()) {
            $comments[] = [
                'user_name' => $row['User_name'],
                'comment_content' => $row['Comment_content']
            ];
        }
    }

    // 返回留言JSON格式
    echo json_encode(['comments' => $comments]);

    $conn->close();
}
?>

