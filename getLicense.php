<?php // /Volumes/USB DISK/

$file = './license.txt';

if (file_exists($file)) {

    $license = file_get_contents($file);

    echo $license;

} else {
    echo '404';
}