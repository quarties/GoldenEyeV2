<?php // /Volumes/USB DISK/

header('Content-type: application/json');

$dir = '/media/pi/';

if (file_exists($dir.'LICENSE')) {

    $licenseFile = 'license.txt';

    if (file_exists($dir.$licenseFile)) {

        $license = file_get_contents($dir.$licenseFile);

        $json = array(
            'license' => $license
        );

    } else {
        $json = array(
            'license' => '404'
        );
    }

} else {

    $filesDir = scandir($dir);
    print_r($filesDir);
    if ($filesDir[2]) {
        $allFiles = scandir($filesDir[2]);
        $json = array(
            'license' => 'files',
            'files' => array()
        );
        $i = 0;
        $pag = 0;
        foreach ($allFiles as $file) {
            if (substr($file, 0, 1) !== '.') {
                $extension = pathinfo($dir . $file, PATHINFO_EXTENSION);
                $extension = strtolower($extension);
                if ($extension === 'txt' || $extension === 'jpg' || $extension === 'jpeg' || $extension === 'png') {
                    $json['files'][$pag][$i] = $file;
                    if ($i % 9 === 0 && $i > 0) {
                        $pag++;
                        $i = 0;
                    } else {
                        $i++;
                    }
                }
            }
        }
    } else {
        $json = array(
            'license' => '404'
        );
    }

}

echo json_encode($json);