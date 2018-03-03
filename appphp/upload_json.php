<?php

require('UploadHandler.php');
$upload_handler = new UploadHandler(array('upload_dir' => dirname(__FILE__) . '/../json/'));

// echo json_encode(array('result' => 'good', 'uploadfile' => ''));
