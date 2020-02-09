<?php

    require_once 'functions.php';
    require_once 'connection.php';

    $link = new mysqli(HOST, USER, PASSWORD, DATABASE);

    if (isset($_POST['id']) && isset($_POST['likes'])) {
        $id = (int)$_POST['id'];
        $likes = (int)$_POST['likes'];
        add_like($link, $id, $likes);
    }

