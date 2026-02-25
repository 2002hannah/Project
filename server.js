const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

// 使用 bodyParser 處理 POST 請求
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 設置 CORS 標頭
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// 創建資料庫連線
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project'
});

// 連接資料庫
db.connect(err => {
    if (err) {
        console.error('資料庫連線失敗: ' + err.stack);
        return;
    }
    console.log('已連接資料庫');
});

// 處理 /save_comment 路由的 POST 請求
app.post('/save_comment', (req, res) => {
    const { message } = req.body;
    const user_id = 1; // 假設用戶ID為1, 你可以根據實際情況動態設置

    if (!message) {
        return res.status(400).json({ success: false, error: '留言不能為空' });
    }

    const sql = 'INSERT INTO user_comments (User_id, Comment_content) VALUES (?, ?)';
    db.query(sql, [user_id, message], (err, result) => {
        if (err) {
            console.error('留言儲存失敗: ' + err.stack);
            return res.status(500).json({ success: false, error: err.message });
        }

        res.json({ success: true });
    });
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`伺服器正在執行於 http://localhost:${port}`);
});
