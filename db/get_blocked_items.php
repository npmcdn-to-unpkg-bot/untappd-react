<?php
$jsonData = file_get_contents("blocked_items.json");
header( 'Content-Type: application/json' );
print( $jsonData );