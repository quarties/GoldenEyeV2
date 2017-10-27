<?php

$dir = '/media/pi/';
$file = $_POST['fileName'];


$filesDir = scandir($dir);
$filesDir[2] .= '/';
$allFiles = scandir($dir.$filesDir[2]);

$extension = pathinfo($dir.$filesDir[2].$file, PATHINFO_EXTENSION);
$extension = strtolower($extension);

if ($extension === 'txt' && $file != 'license.txt' && $file != 'extra.txt') {
    $content = file_get_contents($dir.$filesDir[2].$file);
    echo mb_convert_encoding($content, 'UTF-8', mb_detect_encoding($content, 'UTF-8, ISO-8859-1', true));
    file_get_contents($dir.$filesDir[2] . $file);
} elseif ($extension === 'txt' || $extension === 'jpg' || $extension === 'jpeg' || $extension === 'png') {
    $data = file_get_contents($dir.$filesDir[2] . $file);
    $base64 = 'data:image/' . $extension . ';base64,' . base64_encode($data);
    echo '<img src="' . $base64 . '" class="filterImage" alt="' . $file . '">';
} else
    echo '';
