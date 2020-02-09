<?php

    require_once 'functions.php';

    require_once 'connection.php';
    $link = new mysqli(HOST, USER, PASSWORD, DATABASE);

    if(isset($_POST['id'])) {
        $id = $_POST['id'];

        $children = get_comments($link);

        delete_comments($link, $children, $id);

        $link->query("DELETE FROM `comments` WHERE `id`='{$id}'");
        echo count($children) + 1;
    }
