// 獲取當前頁面的 URL
var currentUrl = window.location.href;

// 檢查當前頁面的 URL 是否包含搜尋關鍵字或路徑
if (currentUrl.includes('search') || currentUrl.includes('/search')) {
  var tooltipOpen = false; // 視窗是否已經打開的標誌
  var tooltip; // 小視窗元素
  var searchResultLinks = document.querySelectorAll('.MjjYud a'); // 取得所有搜索結果中的新聞連結
  
  var mouseoverHandler = function (event) {
    var now = event.target.closest('a');
    if (now && now.href.includes('news')) {
      var actualLink = now.href;

      var storageKey = encodeURIComponent(actualLink);

      // 檢查 Session Storage 中是否有資料
      var storedData = getSessionStorage(storageKey);
      if (storedData) {
        // 如果已經發送過請求則不再請求
        if (storedData === "processing") {
          showTooltip(event.clientX, event.clientY, '處理中...');
          return;
        }

        // 如果有存儲
        let response = JSON.parse(storedData);
        showTooltip(event.clientX, event.clientY, '處理中...');
        console.log("使用 Session Storage 中的結果:", response);

        let summary = response["摘要"] || "無摘要";
        let similarity = response["原標題與原文相似度"] || "無相似度";
        let stars = getStarRating(similarity);

        // 顯示小視窗，並更新內容
        updateTooltipContent(summary, stars);
      } else {
        // 標記為「處理中」
        setSessionStorage(storageKey, "processing");

        // 顯示小視窗，並顯示處理中
        showTooltip(event.clientX, event.clientY, '處理中...');

        // 使用 XMLHttpRequest 發送請求到指定的 URL
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost/project/test.php", true); // 初始化 POST 請求
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8"); // 設置請求頭
        xhr.timeout = 180000;
        
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.response);
            console.log("請求結果:", response);

            let summary = response["摘要"] || "無摘要";
            let similarity = response["原標題與原文相似度"] || "無相似度";
            let stars = getStarRating(similarity);

            // 更新小視窗內容
            updateTooltipContent(summary, stars);

            // 將結果存到 Session Storage，並取代「處理中」的狀態
            setSessionStorage(storageKey, JSON.stringify(response));

          } else if (xhr.readyState === 4 && xhr.status !== 200) {
            console.error("請求失敗");
            // 如果請求失敗，可以將「處理中」狀態移除，允許重新嘗試
            sessionStorage.removeItem(storageKey);
          }
        };
        
        xhr.ontimeout = function () {
          console.error("請求超時");
          updateTooltipContent("無法取得資料，請聯絡管理員", "");
          // 如果請求超時，移除「處理中」狀態
          sessionStorage.removeItem(storageKey);
        };
        
        xhr.send("url=" + encodeURIComponent(actualLink));
      }
    } else {
      if (tooltipOpen) {
        showTooltip(event.clientX, event.clientY, '處理中...');
      }
    }
  };

  // 新增事件監聽
  searchResultLinks.forEach(function (link) {
    link.addEventListener('mouseover', mouseoverHandler);
  });
}

if (currentUrl.includes('/news/') || currentUrl.includes('news.html') || currentUrl.includes('news.asp')) {
  // 在新闻页面上执行弹出窗口的相关代码

  // 加入CSS樣式
  const style = document.createElement('style');
  style.textContent = `
    Popupbutton {
      position: fixed;
      bottom: 15px;
      right: 15px;
      border-radius: 50%;
      padding: 8px 18px;
      background-color: #D9D8D6;
      color: white;
      border: none;
      cursor: pointer;
      z-index: 9999;
    }
    #popup {
      display: none;
      position: fixed;
      bottom: 5%;
      right: 5%;
      padding: 2%;
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 15px;
      max-width: 40%;
      max-height: 80%;
      overflow-y: auto;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      z-index: 9999;
    }
    #popup #close {
      cursor: pointer;
      float: right;
      z-index: 9999;
    }
    .scrollable-div {
      display: flex;
      width: 500px;
      overflow-x: auto;
      overflow-y: hidden;
      border: 1px solid #ccc;
      padding: 10px;
      z-index: 9999;
    }
    .scrollable-content {
      display: inline-block;
      border: 1px solid #ccc;
      padding: 10px;
      width: 150px;
      height: 230px;
      margin-right: 10px;
      background-color: #f0f0f0;
      z-index: 9999;
    }
    a {
      text-decoration: none;
      color: #007bff;
    }
    a:hover {
      text-decoration: underline;
    }
    img {
      object-fit: cover;
    }
    .article_img {
      width: 100px;
      height: 60px;
    }
    .commentForm {
      margin-top: 16px;
      background-color: 007bff;
    }
    .message {
      width: 250px;
      height: 100px;
      border: 1px solid #ccc;
      padding: 10px;
      margin-bottom: 0px;
    }
    .name {
      border: 1px solid #ccc;
    }
    .submit {
      border-radius: 50px;
      padding: 6px 14px;
      font-size: 16px;
      background-color: #D9D8D6;
      color: white;
      border: none;
      cursor: pointer;
    }
    .news_title {
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      bottom: 10px;
    }
    .article {
      margin-top: 16px;
      margin-bottom: 0px;
    }
    .article_preview {
      border: 2px solid #ccc;
      padding: 20px;
      width: 180px;
      margin: 20px;
    }
    .article_text {
      border: 1px solid #ccc;
    }
    .other_message {
      margin-top: 16px;
    }
  `;
  document.head.appendChild(style);

  // 創建 Popupbutton 並添加樣式
  function createPopupButton(text, positionBottom, positionRight) {
    const button = document.createElement('Popupbutton');
    button.textContent = text;
    button.style.position = 'fixed';
    button.style.bottom = positionBottom;
    button.style.right = positionRight;
    button.style.zIndex = '9999';
    return button;
  }

  // 使用 Fetch 發送請求到後端
  fetch("http://localhost/project/test.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
    body: new URLSearchParams({ url: currentUrl }),
  })
    .then(response => response.json())
    .then(response => {
      console.log("popup請求結果:", response);
      const summary = response["摘要"] || "無摘要";
      const similarity = response["原標題與原文相似度"] || "無相似度";
      const stars = getStarRating(similarity);

      popupContainer.innerHTML = `
        <div id="popup">
          <p><strong>摘要：</strong>${summary}</p>
          <p><strong>標題與文章相符程度：</strong>${stars}</p>
          <p class="article"><strong>相關文章：</strong></p>
          <div class="scrollable-div">
            <div class="scrollable-content">
              <a href="https://star.ettoday.net/news/2792267">
                <img src="https://cdn2.ettoday.net/images/7785/d7785904.jpg" alt="文章圖片" class="article_img">
                <p class="news_title">KID雙腳受傷「忍痛衝浪」豁出去了！　峮峮在旁感動：好像看自己的小孩</p>
              </a>
            </div>
          </div>
          <div class="other_message">
            <p><strong>其他留言：</strong></p>
            <div id="comments"></div>
          </div>
          <div>
            <form id="commentForm" class="commentForm" method="POST">
              <label for="name"><strong>名稱：</strong></label><br>
              <input type="text" id="name" name="name" class="name" placeholder="輸入你的名稱"><br>
              <label for="message"><strong>留言區：</strong></label><br>
              <textarea id="message" class="message" name="message"></textarea>
              <input type="submit" class="submit" value="送出">
            </form>
          </div>
        </div>
      `;
      
      document.getElementById("commentForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("name").value.trim() || "匿名";
        const message = document.getElementById("message").value.trim();
        if (message === "") {
          alert("留言不能為空！");
          return;
        }

        fetch("http://localhost/project/save_comment.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `user_name=${encodeURIComponent(name)}&message=${encodeURIComponent(message)}&url=${encodeURIComponent(currentUrl)}`
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            document.getElementById("name").value = "";
            document.getElementById("message").value = "";
            alert("success");
            fetchComments();
          } else {
            alert("留言儲存失敗！");
          }
        })
        .catch(error => {
          console.error("錯誤:", error);
          alert(error);
        });
      });
    })
    .catch(error => console.error("錯誤:", error));

  const popupContainer = document.createElement('div');
  document.body.appendChild(popupContainer);

  const openBtn = createPopupButton('Open', '20px', '20px');
  const closeBtn = createPopupButton('Close', '20px', '20px');
  closeBtn.style.display = 'none'; 
  
  //開啟按鈕的監聽事件
  openBtn.addEventListener('click', () => {
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
    openBtn.style.display = 'none';
    closeBtn.style.display = 'block';
  });

  //關閉按鈕的監聽事件
  closeBtn.addEventListener('click', () => {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
    closeBtn.style.display = 'none';
    openBtn.style.display = 'block';
  });

  document.body.appendChild(openBtn);
  document.body.appendChild(closeBtn);

  // 加載資料庫中的留言
  document.addEventListener('DOMContentLoaded', fetchComments);

  // 取得並顯示資料庫中的留言
  function fetchComments() {
    fetch('http://localhost/project/get_comment.php?url=' + encodeURIComponent(currentUrl))
      .then(response => response.json())
      .then(data => {
        const commentsDiv = document.getElementById('comments');
        commentsDiv.innerHTML = '';
        data.comments.forEach(comment => {
          if (comment.user_name && comment.comment_content) {
            commentsDiv.innerHTML += `<p>${comment.user_name}: ${comment.comment_content}</p>`;
          }
        });
      })
      .catch(error => console.error("錯誤:", error));
  }
}

// 儲存到 Session Storage 
function setSessionStorage(key, value) {
  sessionStorage.setItem(key, value);
}

// 取得 Session Storage 資料
function getSessionStorage(key) {
  return sessionStorage.getItem(key);
}

// 取得相似度的 function
function getStarRating(similarity) {
  if (similarity >= 0 && similarity < 0.2) return '★✩✩✩✩';
  if (similarity >= 0.2 && similarity < 0.4) return '★★✩✩✩';
  if (similarity >= 0.4 && similarity < 0.6) return '★★★✩✩';
  if (similarity >= 0.6 && similarity < 0.8) return '★★★★✩';
  if (similarity >= 0.8 && similarity <= 1) return '★★★★★';
  return '無相似度';
}

// 顯示小視窗
function showTooltip(x, y, content) {

  // 處理中的動畫
  var loadingHtml = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
      <div style="text-align: center;">
        <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        <p style="margin-top: 10px;">${content}</p>
      </div>
    </div>
  `;

  if (tooltipOpen) {
    tooltip.innerHTML = loadingHtml;
    return;
  }

  tooltipOpen = true;

  tooltip = document.createElement('div');
  tooltip.id = 'extensionTooltip';
  Object.assign(tooltip.style, {
    position: 'fixed',
    right: '10px',
    top: '140px',
    width: '300px',
    height: '200px',
    backgroundColor: '#fff',
    padding: '10px',
    border: '1px solid #ccc',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  });
  
  tooltip.innerHTML = loadingHtml;

  // 加入 CSS 動畫
  var style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // 顯示關閉按鈕
  tooltip.appendChild(createCloseButton());

  document.body.appendChild(tooltip);
}

// 更新小視窗內容
function updateTooltipContent(summary, stars) {
  if (tooltip) {
    tooltip.innerHTML = `<strong>摘要：</strong>${summary}<br><p><strong>標題與文章相符程度：</strong>${stars}</p>`;

    //顯示關閉按鈕
    tooltip.appendChild(createCloseButton());
  }
}

// 關閉按鈕
function createCloseButton() {
  var closeButton = document.createElement('button');
  closeButton.textContent = '關閉';
  Object.assign(closeButton.style, {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    borderRadius: '50%',
    padding: '8px 18px',
    backgroundColor: '#D9D8D6',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    zIndex: '9999',
  });
  closeButton.addEventListener('click', function () {
    hideTooltip();
    tooltipOpen = false;
  });
  return closeButton;
}

// 隱藏小視窗
function hideTooltip() {
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
    tooltipOpen = false;
  }
}