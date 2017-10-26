<?php

$dir = '/Users/michalsypko/Documents/usb/';
$file = $_POST['fileName'];

$extension = pathinfo($dir.$file, PATHINFO_EXTENSION);
$extension = strtolower($extension);

if ($extension === 'txt') {
    $content = file_get_contents($dir.$file);
    echo mb_convert_encoding($content, 'UTF-8', mb_detect_encoding($content, 'UTF-8, ISO-8859-1', true));
    file_get_contents($dir . $file);
} elseif ($extension === 'txt' || $extension === 'jpg' || $extension === 'jpeg' || $extension === 'png') {
    $data = file_get_contents($dir . $file);
    $base64 = 'data:image/' . $extension . ';base64,' . base64_encode($data);
    echo '<img src="' . $base64 . '" class="filterImage" alt="' . $file . '">';
} else
    echo '';
