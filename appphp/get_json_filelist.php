<?php
/**
 * Created by PhpStorm.
 * User: Chung
 * Date: 03/03/2018
 * Time: 9:13 PM
 */

$file_list = [];
$current_dir = '../json';

if (is_dir($current_dir)) {
    if ($dh = opendir($current_dir)) {
        while (($file = readdir($dh)) !== false) {
            if ($file !== '.' && $file !== '..') {
                $file_list[] = $file;
            }
        }
    }
}

echo json_encode(array('filelist'=>$file_list));
