 <?php
    set_time_limit(0);
    header('Access-Control-Allow-Origin: *');
    //header('Content-Type: text/html; charset=utf-8');
    header('Content-Type: application/json; charset=utf-8');

    // 資料庫開啟
    $link = mysqli_connect('localhost','root','','project');
    if(!mysqli_select_db($link,'project')){
        die("無法開啟資料庫<br/>");
    }

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        if (isset($_POST["url"])) {
            $url = $_POST["url"];
            if(@$result = GetData($link, $url)){
                if($result->num_rows==0){
                    //呼叫python
                    $command = escapeshellcmd('python .\clawlplusllama.py '. $url);
                    $output = shell_exec($command);
                    if ($output === null) {
                        echo "Error: Unable to execute the command\n";
                    } else {
                        $result = GetData($link, $url);
                        echo LetDataIntoJSON($result);
                    }
                }else{
                    echo LetDataIntoJSON($result);
                }
            }
        } else {
            echo "URL not received.";
        }
    } else {
        echo "No POST request received.";
    }

    //從SQL抓資料
    function GetData($link, $url) {
        $sql = "SELECT PP_summary, PP_URL, PP_Conformity FROM preview_page WHERE PP_URL = ?";
        
        $state = $link->prepare($sql);
        $state->bind_param("s", $url);
        $state->execute();
        $result = $state->get_result();
        return $result;
    }
    
    //把資料轉成JSON到前端
    function LetDataIntoJSON($result) {
        if ($result->num_rows > 0) {

            $row = $result->fetch_assoc();
            $summary = $row['PP_summary'];
            $conformity = $row['PP_Conformity'];
    
            $output = array(
                "摘要" => $summary,
                "原標題與原文相似度" => (float)$conformity
            );
    
            // 轉JSON
            return json_encode($output, JSON_UNESCAPED_UNICODE);
        } else {
            return json_encode(array("error" => "No data found"), JSON_UNESCAPED_UNICODE);
        }
    }
?>