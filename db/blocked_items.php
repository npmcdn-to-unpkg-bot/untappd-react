<?php
$data = $_POST['data'];  //$data will contain the_id
//$json = json_encode($data, JSON_PRETTY_PRINT);
file_put_contents("blocked_items.json", $data );