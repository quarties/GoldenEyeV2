<?php

$dir = '/Volumes/USB DISK/';
$file = $_POST['fileName'];

$extension = pathinfo($dir.$file, PATHINFO_EXTENSION);

if ($extension === 'txt')
    echo file_get_contents($dir.$file);
else
    echo '';
