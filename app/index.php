<?php
	require_once 'php/functions.php';

?>

<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport"
		  content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<link href="css/libs.css" rel="stylesheet">
	<link href="css/fonts.css" rel="stylesheet">
	<link href="css/pages/index.css" rel="stylesheet">
	<title>Test Comments</title>
</head>
<body>
<header class="header">
	<div class="container">
		<div class="row header__row">
			<div class="col">
				<a href="index.php" class="header__link"><img src="img/logo.png" alt="logo" class="header__logo"></a>
				<p class="header__text"></p>
			</div>
			<div class="col">
				<p class="header__statistic">Number of comments: <span><?php echo get_comments_count($link) ?></span>
				</p>
			</div>
		</div>
	</div>
</header>
<section class="comment">
	<div class="container">
		<div class="row comment__row">
            <?php
                $result = get_comments($link);
                show_comments($result);
            ?>
		</div>
</section>
<section class="add-comment">
	<div class="container">
		<div class="row add-comment__row">
            <a class="waves-effect waves-light btn-large scale-transition add-comment__btn"><i class="material-icons left">arrow_downward</i>Add a commentary</a>
			<form class="add-comment__form" method="post" name="add-comment__form">
				<div class="input-field">
					<input id="name" type="text" class="validate add-comment__form__name" name="name">
					<label for="name">Your name</label>
				</div>
                <div class="input-field">
                    <textarea id="comment" class="materialize-textarea add-comment__form__comment" name="comment"></textarea>
                    <label for="comment">Your comment</label>
                </div>
                <button class="btn waves-effect waves-light add-comment__form__submit" type="submit">Submit
                    <i class="material-icons right">send</i>
                </button>
			</form>
		</div>
	</div>
</section>
<footer class="footer">
	<div class="container">
		<div class="row footer__row">
			<div class="col footer__col"><span class="footer__name">Andrii Prytula</span> <a href="mailto:andrik.pritula@gmail.com" class="footer__mail">andrik.pritula@gmail.com</a> <span class="footer__year"><?php echo date('Y'); ?></span>
			</div>
		</div>
	</div>
</footer>

<div class="thank-modal-outer modal-outer">
	<div class="thank-modal modal">
		<p class="thank-modal__text modal__text">Thank You! Your comment was successfully added.</p>
		<img src="img/close.svg" alt="close" class="thank-modal__close modal__close">
	</div>
</div>

<div class="deleted-modal-outer modal-outer">
	<div class="deleted-modal modal">
		<p class="deleted-modal__text modal__text">Thank You! Comment was successfully deleted.</p>
		<img src="img/close.svg" alt="close" class="deleted-modal__close modal__close">
	</div>
</div>

<div class="edited-modal-outer modal-outer">
	<div class="edited-modal modal">
		<p class="edited-modal__text modal__text">Thank You! Comment was successfully updated.</p>
		<img src="img/close.svg" alt="close" class="edited-modal__close modal__close">
	</div>
</div>

<div class="fail-modal-outer modal-outer">
	<div class="fail-modal modal">
		<p class="fail-modal__text modal__text">Please, check Your connection to the internet.</p>
		<img src="img/close.svg" alt="close" class="fail-modal__close modal__close">
	</div>
</div>

<div class="reply-modal-outer modal-outer">
	<div class="reply-modal modal">
		<h2 class="reply-modal__header modal__header">Write Your name and comment in the fields below</h2>
		<form class="reply-modal__form" method="POST" name="reply-modal">
			<div class="input-field">
				<input id="name" type="text" class="validate reply-comment__form__name" name="reply-name">
				<label for="name">Your name</label>
			</div>
			<div class="input-field">
				<textarea id="comment" class="materialize-textarea reply-comment__form__comment" name="reply-comment"></textarea>
				<label for="comment">Your comment</label>
			</div>
			<button class="btn waves-effect waves-light reply-comment__form__submit" type="submit">Submit
				<i class="material-icons right">send</i>
			</button>
		</form>
		<img src="img/close.svg" alt="close" class="reply-modal__close modal__close">
	</div>
</div>

<div class="confirm-modal-outer modal-outer">
	<div class="confirm-modal modal">
		<h2 class="confirm-modal__header modal__header">Are you sure?</h2>
		<form class="confirm-modal__form" method="POST" name="reply-modal">
			<button class="btn waves-effect waves-light red lighten-1 reply-comment__form__submit" type="submit">Yes
				<i class="material-icons right">delete</i>
			</button>
		</form>
		<img src="img/close.svg" alt="close" class="reply-modal__close modal__close">
	</div>
</div>

<div class="edit-modal-outer modal-outer">
	<div class="edit-modal modal">
		<h2 class="edit--modal__header modal__header">Edit text in the field below</h2>
		<form class="edit-modal__form" method="POST" name="edit-modal">
			<div class="input-field">
				<textarea id="edit-comment" class="materialize-textarea edit-comment__form__comment" name="edit-comment"></textarea>
				<label for="edit-comment">Your comment</label>
			</div>
			<button class="btn waves-effect waves-light edit-comment__form__submit" type="submit">Submit
				<i class="material-icons right">send</i>
			</button>
		</form>
		<img src="img/close.svg" alt="close" class="edit-modal__close modal__close">
	</div>
</div>

<a id="thank-modal_open" href="#" rel="modal:open"></a>
<a id="edited-modal_open" href="#" rel="modal:open"></a>
<a id="deleted-modal_open" href="#" rel="modal:open"></a>
<a id="fail-modal_open" href="#" rel="modal:open"></a>
<a id="reply-modal_open" href="#" rel="modal:open"></a>
<a id="edit-modal_open" href="#" rel="modal:open"></a>

<script src="./js/libs.min.js"></script>
<script src="./js/common.js"></script>
<?php
/*    $link = new mysqli(HOST, USER, PASSWORD, DATABASE);

    delete_comments($link, get_comments($link), 1);*/
?>

</body>
</html>
