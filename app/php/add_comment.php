<?php
    require_once 'functions.php';

    require_once 'connection.php';
    $link = new mysqli(HOST, USER, PASSWORD, DATABASE);


    if (isset($_POST['name']) && isset($_POST['comment']) && isset($_POST['date'])) {
        $name = $_POST['name'];
        $comment = $_POST['comment'];
        $time = $_POST['date'];
        add_comment($link, 0, $name, $comment, $time);
        echo $link->insert_id;
    }
