<?php


    require_once 'functions.php';

    require_once 'connection.php';
    $link = new mysqli(HOST, USER, PASSWORD, DATABASE);


    if (isset($_POST['id']) && isset($_POST['edit-comment']) && isset($_POST['date'])) {
        $id = $_POST['id'];
        $new_text = $_POST['edit-comment'];
        $time = $_POST['date'];

        edit_comment($link, $id, $new_text, $time);
        echo $id;
    }

