<?php

$file = 'satStatus.json';

file_put_contents($file,json_encode($_POST['json']));