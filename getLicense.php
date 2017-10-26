<?php // /Volumes/USB DISK/

header('Content-type: application/json');

$dir = '/Users/michalsypko/Documents/usb/';

if (file_exists($dir)) {

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
            'files' => array()
        );
        $i = 0;
        $pag = 0;
        foreach ($allFiles as $file) {
            if (substr($file,0,1) !== '.') {
                $extension = pathinfo($dir.$file, PATHINFO_EXTENSION);
                $extension = strtolower($extension);
                if ($extension === 'txt' || $extension === 'jpg' || $extension === 'jpeg' || $extension === 'png') {
                    $json['files'][$pag][$i] = $file;
                    if ($i%9 === 0 && $i > 0) {
                        $pag++;
                        $i=0;
                    } else {
                        $i++;
                    }
                }
            }
        }
    }

} else {
    $json = array(
        'license' => '404'
    );
}

echo json_encode($json);