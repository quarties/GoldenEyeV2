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

       header("Content-Type: application/json");

       $sql = "SELECT * from satStatus";

       $array = array();
       $ret = $db->query($sql);
       while($row = $ret->fetchArray(SQLITE3_ASSOC) ) {
           $array[] = $row;
       }

       echo json_encode($array);
   }

$db->close();
