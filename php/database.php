<?php

function sendResult($error, $result = null)
{
    die(json_encode(array("error" => $error, "result" => $result)));
}

function runQuery($sql_query)
{
    // connect
    $sqldb = new mysqli("localhost", "root", "", "myproject");
    if (mysqli_connect_errno()) {
        sendResult("Connect failed: " . mysqli_connect_error());
    }

    // fetch
    $result = $sqldb->query($sql_query) or sendResult("Fetch failed: " . mysqli_connect_error());
    $sqldb->close();

    // send result
    return $result;
}

function studentExists($regno, $student_id = 0)
{
    $result = runQuery("SELECT * FROM student WHERE regno=$regno;");

    // send result

    if (mysqli_num_rows($result) > 0) {
        $tmp = $result->fetch_all(1);
        if ($tmp[0]['student_id'] != $student_id) {
            sendResult("Student with same registration number already exists");
        }
    }
}

function sendStudent($regno)
{
    $result = runQuery("SELECT * FROM student WHERE regno=$regno;");
    $tmp = $result->fetch_all(1);
    sendResult(null, $tmp[0]);
}

function addStudent($student_name, $regno, $cgpa)
{
    studentExists($regno);
    runQuery("INSERT INTO student (student_name, regno, cgpa) VALUES('$student_name', $regno, $cgpa);");
    sendStudent($regno);
}

function updateStudent($student_id, $student_name, $regno, $cgpa)
{
    studentExists($regno, $student_id);
    runQuery("UPDATE student SET student_name='$student_name', regno=$regno, cgpa=$cgpa WHERE student_id=$student_id;");
    sendStudent($regno);
}

function deleteStudent($student_id)
{
    $result = runQuery("DELETE FROM student WHERE student_id=$student_id;");
    sendResult(null, $result);
}

function allStudents()
{
    $result = runQuery("SELECT * FROM student;");
    sendResult(null, $result->fetch_all(1));
}

function queryDatabase($sql_query)
{
    $result = runQuery($sql_query);
    sendResult(null, $result->fetch_all(1));
}