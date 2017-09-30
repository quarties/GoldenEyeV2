<?php // /Volumes/USB DISK/

header('Content-type: application/json');

$dir = '/Volumes/USB DISK/';
$licenseFile = 'license.txt';

if (file_exists($dir.$licenseFile)) {

    $license = file_get_contents($dir.$licenseFile);

    $json = array(
        'license' => $license
    );

} else {
    $allFiles = scandir($dir);
    $json = array(
        'license' => 'files',
        'files' => ''
    );
    foreach ($allFiles as $file) {
        if (substr($file,0,1) !== '.') {
            $extension = pathinfo($dir.$file, PATHINFO_EXTENSION);
            if ($extension === 'txt' || $extension === 'jpg' || $extension === 'jpeg' || $extension === 'png') {
                $json['files'][] = $file;
            }
        }
    }
}

echo json_encode($json);