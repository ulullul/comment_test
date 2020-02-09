<?php
    require_once 'functions.php';
    require_once 'connection.php';

    $link = new mysqli(HOST, USER, PASSWORD, DATABASE);

    if (isset($_POST['id']) && isset($_POST['dislikes'])) {
        $id = (int)$_POST['id'];
        $dislikes = (int)$_POST['dislikes'];
        add_dislike($link, $id, $dislikes);
    }

