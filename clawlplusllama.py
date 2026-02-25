# -*- coding:utf-8 -*-
import sys
import urllib.request as req
from bs4 import BeautifulSoup
import requests
import ollama
import time
import traceback
from sentence_transformers import SentenceTransformer, util
import mysql.connector

start_time = time.time()
#傳入的HTML
url = sys.argv[1]

with open("errormessage.txt","w") as file:
    file.writelines("test:" + url)

# 解析HTML
try:
    g = req.Request(url, headers={
        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    })
    with req.urlopen(g) as response:
        data = response.read().decode("utf-8")
    root = BeautifulSoup(data, "html.parser")
    
    #找出標題與內文
    newsTitle = root.find('h1').text    
    root = root.select("div.story p") 

    # 清理內文中非文章之資料(刪除p內帶有strong、iframe、img標籤者)
    root = [con for con in root if not(con.find("strong")) and not(con.find("iframe")) and not(con.find("img"))]
    # 第一個p標籤為記者資訊，串接除了記者資訊外的所有p內文
    content = "".join([con.text for con in root[1:]])

    with open("new.txt","w", encoding='UTF-8') as newfile:
        for i in root:
            newfile.writelines(i.text)
    fullContent = ''.join([i.text for i in root])       

except Exception as e:
    with open("new.txt","w", encoding='UTF-8') as newfile:
        newfile.write("Error occur : ")
        newfile.write(traceback.format_exc())

titleResponse = ollama.chat(model='llama3', messages=[
    {
        'role': 'user',
        'content': f"請為以下文章提供以下內容（請使用繁體中文回答）：\n20-30字的摘要即可\n\n文章內容：{fullContent}\n\n請按照以下格式回答：\n摘要：[您的摘要]。(請按照格式回答，不要出現其他的文字)"
    }
])
exportContent = titleResponse['message']['content']


#相似度分析
model = SentenceTransformer('paraphrase-distilroberta-base-v1')

# 文章をベクトルに変換
embeddingTitle = model.encode(newsTitle, convert_to_tensor=True)
embeddingsContent = model.encode(fullContent, convert_to_tensor=True)

# コサイン類似度の計算
cosine_score = util.pytorch_cos_sim(embeddingsContent, embeddingTitle)[0][0].item() #轉float

# end_time = time.time()
# elapsed_time = end_time - start_time 
# print(f"程式執行時間：{elapsed_time:.2f} 秒")


summary = exportContent.split('：')[1]

db_connection = mysql.connector.connect(
    host="localhost",
    user="root",
    database="project"
)

cursor = db_connection.cursor()

# 寫入資料庫
sql = "INSERT INTO preview_page (PP_summary, PP_Conformity, PP_URL) VALUES (%s, %s, %s)"
values = (summary, cosine_score, url)

try:
    cursor.execute(sql, values)
    db_connection.commit()
    print("資料成功插入")
except mysql.connector.Error as err:
    print(f"錯誤: {err}")
finally:
    cursor.close()
    db_connection.close()
