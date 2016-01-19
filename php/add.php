<?php
include_once "database.php";

$inputJSON = file_get_contents('php://input');
$student = json_decode($inputJSON, TRUE); //convert JSON into array

addStudent($student["student_name"], $student["regno"], $student["cgpa"]);