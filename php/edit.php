<?php
include_once "database.php";

$inputJSON = file_get_contents('php://input');
$student = json_decode($inputJSON, TRUE); //convert JSON into array

updateStudent($student["student_id"], $student["student_name"], $student["regno"], $student["cgpa"]);