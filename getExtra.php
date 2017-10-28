<?php // /Volumes/USB DISK/

header('Content-type: application/json');

$dir = '/media/pi/EXTRA/';

if (file_exists($dir)) {

    $licenseFile = 'extra.txt';

    if (file_exists($dir.$licenseFile)) {

        $license = file_get_contents($dir.$licenseFile);

        $json = array(
            'extra' => $license
        );

    } else {
        $json = array(
            'license' => '404'
        );
    }

} else {
    $json = array(
        'license' => '404'
    );
}

echo json_encode($json);