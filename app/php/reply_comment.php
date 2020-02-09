<?php
    require_once 'functions.php';

    require_once 'connection.php';
    $link = new mysqli(HOST, USER, PASSWORD, DATABASE);


    if (isset($_POST['reply-name']) && isset($_POST['reply-comment']) && isset($_POST['date']) && isset($_POST['pid'])) {
        $name = $_POST['reply-name'];
        $comment = $_POST['reply-comment'];
        $time = $_POST['date'];
        $pid = (int)$_POST['pid'];
        add_comment($link, $pid, $name, $comment, $time);
        echo $link->insert_id;
    }
