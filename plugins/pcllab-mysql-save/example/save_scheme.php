<?php

$dbc = mysqli_connect('localhost', 'root', 'p', 'psychology');
//include '/srv/weblab/mysql.php';


$saveScheme = [
//    "table name" => [
//        "first column name" => "name of the data from the experiment",
//        "second column name" => "name of the data from the experiment",
//        "third column name" => "name of the data from the experiment",
//        ],

    // real world sample using the new demographics plugin
    "test_experiment_demo" => [
        "workerId" => "workerId",
        "age" => "demo_age",
        "gender" => "demo_gender",
        "english" => "demo_english",
    ],

    // real world sample using the new study text
    // suppose we have two study texts in this experiment in the same session
    // since they have identical keys for data the save plugin
    // will insert two separate rows into the table
    "test_experiment_study" => [
        "workerId" => "workerId",
        "condition" => "condition",
        "time" => "study_text_time",
        "title" => "study_text_title",
    ],

];