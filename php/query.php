<?php
include_once "database.php";

$inputJSON = file_get_contents('php://input');
$input =  json_decode($inputJSON, TRUE); //convert JSON into array

queryDatabase($input["query"]);