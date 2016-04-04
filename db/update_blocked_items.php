<?php
$data = $_POST['data']; 
$savedJsonData = file_get_contents("blocked_items.json");
$saved_json_obj = json_decode($savedJsonData);
$json_obj = json_decode($data);
$unset_queue = array();

foreach ( $json_obj->Results as $i => $item )
{
    if ($item->username == "google")
    {
        $unset_queue[] = $i;
    }
}

foreach ( $unset_queue as $index )
{
    unset($json_obj->Results[$index]);
}

// rebase the array
$json_obj->Results = array_values($json_obj->Results);

$new_json_string = json_encode($json_obj);