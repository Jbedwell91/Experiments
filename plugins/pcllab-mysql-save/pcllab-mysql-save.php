<?php

include "../save_scheme.php";

if (!isset($saveScheme)) {
    die("Please provide a saving scheme.");
}

if (!isset($dbc)) {
    die("Database connection is missing.");
}

$data = json_decode($_POST['data'], true);

if (!isset($data) || !$data) {
    die("Data is not in a correct format.");
}


$queryStructs = [];
foreach ($saveScheme as $tableName => $tableScheme) {
    $newQueryStructs = generateQueryStruct($tableName, $tableScheme, $data);
    if (!empty($newQueryStructs)) {
        $queryStructs = array_merge($queryStructs, $newQueryStructs);
    }
}

foreach ($queryStructs as $queryStruct) {
    $query = generateQueryString($queryStruct, $dbc);
    if (!mysqli_query($dbc, $query)) {
        mysqli_close($dbc);
        die("Could not save the data.");
    }
}



// functions

function generateQueryStruct($tableName, $tableScheme, $data) {
    $queryStructs = [];
    foreach ($data as $trial) {
        $tempQueryStruct = ["tableName" => $tableName, "columns" => [], "values" => []];
        foreach ($tableScheme as $columnName => $dataKey) {
            if (!array_key_exists($dataKey, $trial)) {
                $tempQueryStruct = null;
                break;
            }
            array_push($tempQueryStruct["columns"], $columnName);
            array_push($tempQueryStruct["values"], (string)$trial[$dataKey]);
        }
        if (!is_null($tempQueryStruct)) {
            array_push($queryStructs, $tempQueryStruct);
        }
    }

    return $queryStructs;
}


function generateQueryString($queryStruct, $dbc) {

    $tableName = mysqli_real_escape_string($dbc, $queryStruct["tableName"]);

    $keys = "";
    $values = "";
    for ($i = 0; $i < count($queryStruct["columns"]); $i++) {
        if ($keys != "") {
            $keys .= ',';
            $values .= ',';
        }
        $keys .= '`' . mysqli_real_escape_string($dbc, $queryStruct["columns"][$i]) . '`';
        $values .= '\'' . mysqli_real_escape_string($dbc, $queryStruct["values"][$i]) . '\'';
    }

    return "INSERT INTO $tableName ($keys) VALUES ($values);";
}
