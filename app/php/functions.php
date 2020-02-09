<?php

    require_once 'connection.php';
    $link = new mysqli(HOST, USER, PASSWORD, DATABASE);

    function add_comment($link, $pid, $author, $text, $date)
    {

        $data = [
           'pid' => $pid,
           'author' => $author,
           'text' => $text,
           'date' => $date
        ];

        $link->query("INSERT INTO `comments` (`pid`, `author`, `text`, `date`)  VALUES ('{$data['pid']}', '{$data['author']}', '{$data['text']}', '{$data['date']}')");

    }

    function add_like($link, $id, $like) {
        $data = [
           'id' => $id,
           'like' => $like,
        ];

        $link->query("UPDATE `comments` SET `likes`='{$data['like']}' WHERE id='{$data['id']}'");
    }

    function add_dislike($link, $id, $dislike) {
        $data = [
           'id' => $id,
           'dislike' => $dislike,
        ];

        $link->query("UPDATE `comments` SET `dislikes`='{$data['dislike']}' WHERE id='{$data['id']}'");
    }

    function edit_comment($link, $id, $text, $date)
    {

        $data = [
           'id' => $id,
           'text' => $text,
           'date' => $date
        ];

        $link->query("UPDATE `comments` SET `text`='{$data['text']}', date='{$data['date']}' WHERE id='{$data['id']}'");
    }

    function get_comments_count($link)
    {
        $query = $link->query('SELECT * FROM comments');
        return $query->num_rows;
    }

    function get_comments($link)
    {
        $query = $link->query('SELECT * FROM comments');

        $arr_com = [];

        for ($i = 0; $i < $query->num_rows; $i++) {
            $row = $query->fetch_assoc();
            if (empty($arr_com[$row['pid']])) {
                $arr_com[$row['pid']] = [];
            }
            $arr_com[$row['pid']][] = $row;
        }
        return $arr_com;
    }

    function delete_comments($link, $arr_del, $pid) {
        for ($i = 0; $i < count($arr_del[$pid]); $i++) {

            $link->query("DELETE FROM `comments` WHERE `id`='{$arr_del[$pid][$i]['id']}'");
            delete_comments($link, $arr_del, $arr_del[$pid][$i]['id']);
        }
    }

    function show_comments($arr_com, $pid = 0)
    {

        echo "<ul>";
        for ($i = 0; $i < count($arr_com[$pid]); $i++) {

            $date = explode(' ', $arr_com[$pid][$i]['date']);

            echo "
        			<div class=\"col comment-container\" style=\"margin-left: 40px;\" id=\"{$arr_com[$pid][$i]['id']}\">
                        <div class=\"comment__data\">
                            <p class=\"comment__author\">{$arr_com[$pid][$i]['author']}</p>
                            <p class=\"comment__time\"><i class=\"icon-clock\"></i>{$date[0]} at {$date[1]}</p>
                        </div>

                        <p class=\"comment__text\">{$arr_com[$pid][$i]['text']}</p>
                        <div class=\"comment__actions\">
                            <div class=\"comment__likes\">
                                <i class=\"icon-like\"></i>
                                {$arr_com[$pid][$i]['likes']}
                            </div>
                            <div class=\"comment__dislikes\">
                                <i class=\"icon-dislike\"></i>
                                {$arr_com[$pid][$i]['dislikes']}
                            </div>
                            <a href=\"#\" class=\"comment__answer\"><i class=\"icon-reply\"> </i>Answer this comment</a>
                            <a href=\"#\" class=\"comment__edit\"><i class=\"icon-edit\"> </i>Edit</a>
                            <a href=\"#\" class=\"comment__delete\"><i class=\"icon-trash-empty\"> </i>Delete</a>
						</div>";
            show_comments($arr_com, $arr_com[$pid][$i]['id']);
            echo "</div>";
        }
    }
