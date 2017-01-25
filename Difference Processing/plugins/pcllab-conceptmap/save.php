<?php
    if (empty($_POST['data']) || empty($_POST['workerId'])) {
        die("Variables not set correctly");
    }

    //Extract image data
    $img = $_POST['data'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $fileData = base64_decode($img);

    //Extract workerId (Grabs only alphanumeric chars and converts to lowercase)
    $workerId = $_POST['workerId'];
    $workerId = preg_replace("/[^a-zA-Z0-9]+/", "", $workerId);
    $workerId = strtolower($workerId);

    //Save as canvas.<workerId>.<data>.png
    $date = date("Y_m_d_H_i_s", time());
    $fileName = "canvas.$workerId.$date.png";

    file_put_contents($fileName, $fileData);
?>
