# DVD 租借系統

**團隊成員：柯劭潔、張愷旆、久保育嘉、劉淨涵、謝楷勳、洪仁益**

## 簡介

本專案為 國立高雄大學資訊管理學系 113 學年度畢業專案。
隨著網路普及，誘餌式標題與內容農場文章氾濫，嚴重影響閱聽人獲取正確資訊的效率。
「後臺真還傳」是一款瀏覽器擴充服務。其可以自動生成新聞摘要、評估標題與內文的相符程度，並推薦相似文章，旨在提升使用者的媒體素養，防止誤導性新聞擴散 。

## 系統介面
![image]<img width="886" height="295" alt="image" src="https://github.com/user-attachments/assets/ddbde750-1838-4f11-bcc7-c916b8d80074" />

![image]<img width="827" height="443" alt="image" src="https://github.com/user-attachments/assets/856197b5-32b9-4afc-9e0a-104fb8004bca" />

![image]<img width="827" height="472" alt="image" src="https://github.com/user-attachments/assets/a8316b85-9127-44b6-9dd1-d405d172d7b8" />

## 環境
```
XAMPP v3.3.0
Apache & MYSQL
VS Code
```

## 技術

+ Python
+ MySQL Database
+ Clawer
+ JavaScript
+ NLP

## 功能

即時新聞摘要：滑鼠游標停留於標題時，自動彈出簡短內容摘要，無需點擊即可掌握核心。
相符度評估 (1-5星)：利用機器學習模型分析標題與內文的關聯性，降低被誇大標題欺騙的風險。
相關文章推薦：透過演算法識別並推薦相關背景資訊，避免單一來源偏誤。
媒體識讀互動：提供使用者反饋平台，可對內容真實性評分或留言，並由管理者維護評論環境。
側欄擴充服務：以 Google Chrome Side Panel 呈現，讓使用者在搜尋頁面即可即時獲取資訊 。
