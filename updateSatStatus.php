<?php

class MyDB extends SQLite3 {
    function __construct() {
        $this->open('GoldenEye.db');
    }
}
$db = new MyDB();
if(!$db) {
    echo $db->lastErrorMsg();
} else {

    $sql = '';

    foreach ($_POST['data'] as $post) {
        $sql = "UPDATE satStatus SET 
status = '" .$post['status']."', 
location = '".$post['location']."', 
start = '".$post['start']."', 
end = '".$post['end']."' 
WHERE satID=".$post['satID'];

        $ret = $db->exec($sql);
        if(!$ret) {
            echo $db->lastErrorMsg();
        }
    }

}

$db->close();