<?php
/**
 * Created by PhpStorm.
 * User: Chung
 * Date: 02/03/2018
 * Time: 4:19 PM
 */

$filename = $_POST['filename'];
$file = '../json/'.$filename.'.json';

if(is_file($file)){
    $content = file_get_contents('../json/'.$filename.'.json');    
    echo json_encode(array('result'=>'good','json'=>$content));
}else{
    echo json_encode(array('result'=>'bad','msg'=>'can not find file.'));
}
