$(() => {
    let $addBtn = $('.add-comment__btn'),
        $commentForm = $('.add-comment__form'),
        $commentName = $('.add-comment__form__name'),
        $commentText = $('.add-comment__form__comment'),
        $modal = $('.modal'),
        $modalOverlay = $('.modal-outer'),
        $modalClose = $('.modal__close'),
        $thankModal = $('.thank-modal-outer'),
        $editedModal = $('.edited-modal-outer'),
        $failModal = $('.fail-modal-outer'),
        $replyModal = $('.reply-modal-outer'),
        $replyForm = $('.reply-modal__form'),
        $replyName = $('.reply-comment__form__name'),
        $replyText = $('.reply-comment__form__comment'),
        $commentRow = $('.comment__row>ul'),
        $replyBtn = $('.comment__answer'),
        $editBtn = $('.comment__edit'),
        $editModal = $('.edit-modal-outer'),
        $editForm = $('.edit-modal__form'),
        $editText = $('.edit-comment__form__comment'),
        $commentLikes = $('.comment__likes'),
        $commentDislikes = $('.comment__dislikes'),
        $commentDelete = $('.comment__delete'),
        $deletedModal = $('.deleted-modal-outer'),
        $confimModal = $('.confirm-modal-outer'),
        $confirmForm = $('.confirm-modal__form');

    let parent_id = 0, id = 0, isEditTextChanged = false;


    $('body').delegate('.comment__likes', 'click', function (e) {
        e.preventDefault();

        const _this = this;
        if(!$(_this).hasClass('clicked')) {

            let likes = +$(_this).text();
            let post_id = $(_this).parent().parent().attr('id');
            let formData = new FormData();
            formData.append('likes', `${++likes}`);
            formData.append('id', post_id);
            sendAjaxForm('../php/add_like.php', formData).then((id) => {
                $(_this).html(`<i class="icon-like"></i> ${likes}`);
                $(_this).off('click');
                $(_this).addClass('clicked');
            });
        }
    });

    $('body').delegate('.comment__dislikes', 'click', function (e) {
        e.preventDefault();

        const _this = this;
        if(!$(_this).hasClass('clicked')) {
            let dislikes = +$(_this).text();
            let postId = $(_this).parent().parent().attr('id');
            let formData = new FormData();
            formData.append('dislikes', `${++dislikes}`);
            formData.append('id', postId);
            sendAjaxForm('../php/add_dislike.php', formData).then(() => {
                $(_this).html(`<i class="icon-dislike"></i> ${dislikes}`);

                $(_this).addClass('clicked');
            });
        }
    });

    $('body').delegate('.comment__delete', 'click', function (e) {
        id = $(this).parent().parent().attr('id');
        $confimModal.css('display', 'flex').hide().fadeIn();
    });

    $('body').delegate('.comment__answer', 'click', function (e) {
        e.preventDefault();
        $replyModal.css("display", "flex").hide().fadeIn();
        parent_id = $(this).parent().parent().attr('id');
    });

    $('body').delegate('.comment__edit', 'click', function (e) {
        e.preventDefault();
        $editText.val($(this).parent().prev().text());
        $('[for="edit-comment"]').addClass('active');
        id = $(this).parent().parent().attr('id');
        $editModal.css("display", "flex").hide().fadeIn();
    });

    $addBtn.on('click', function () {
        if ($(this).hasClass('dropped')) {
            $($addBtn).children('i').html('arrow_downward');
            $(this).removeClass('dropped');
            $commentForm.slideUp(400);
        } else {
            $($addBtn).children('i').html('arrow_upward');
            $(this).addClass('dropped');
            $commentForm.slideDown(400);
        }
    });

    $commentForm.on('submit', function (e) {
        e.preventDefault();
        if ($commentName.val() === "") $commentName.addClass('invalid');
        else if ($commentText.val() === "") $commentText.addClass('invalid');
        else {
            const form = getForm(this);
            let formData = new FormData(form);
            const name = $commentName.val(), text = $commentText.val(), date = getDate(),
                splittedDate = getDate().split(' ');

            formData.append('date', date);
            sendAjaxForm('../php/add_comment.php', formData).then((id) => {
                $('#thank-modal_open').trigger('click');
                $commentRow.append(getNewComment(id, name, text, splittedDate));
                updateCommentsNumber(true);
            });
        }
    });

    $replyForm.on('submit', function (e) {
        e.preventDefault();
        if ($replyName.val() === "") $replyName.addClass('invalid');
        else if ($replyText.val() === "") $replyText.addClass('invalid');
        else {
            console.log(this);
            const form = getForm(this);
            let formData = new FormData(form);
            let name = $replyName.val(),
                text = $replyText.val(),
                date = getDate(),
                splittedDate = getDate().split(' '),
                pid = parent_id;
            formData.append('date', date);
            formData.append('pid', pid);

            sendAjaxForm('../php/reply_comment.php', formData).then((id) => {
                $replyForm.trigger('reset');
                $('.reply-modal__close').trigger('click');
                $('#thank-modal_open').trigger('click');
                console.log(`#${parent_id}`);
                $(`#${parent_id}`).append(getNewComment(id, name, text, splittedDate));
                updateCommentsNumber(true);
            });
        }
    });

    $editForm.on('submit', function (e) {
        e.preventDefault();
        if ($editText.val() === "" || !isEditTextChanged) $editText.addClass('invalid');
        else {
            const form = getForm(this);
            let formData = new FormData(form);
            const text = $editText.val(), date = getDate(),
                splittedDate = getDate().split(' ');

            formData.append('date', date);
            formData.append('id', id);

            sendAjaxForm('../php/edit_comment.php', formData).then((id) => {
                isEditTextChanged = false;
                $editForm.trigger('reset');
                $('.edit-modal__close').trigger('click');
                $('#edited-modal_open').trigger('click');

                $(`#${id} > .comment__text`).html(text);
                $(`#${id} > .comment__data > .comment__time`).html(`<i class="icon-clock"></i>${splittedDate[0]} at ${splittedDate[1]}`);
            });
        }
    });

    $confirmForm.on('submit', function (e) {
        e.preventDefault();
        const _this = this;
        let postId = id;
        let formData = new FormData();
        formData.append('id', `${postId}`);
        sendAjaxForm('../php/delete_comments.php', formData).then((count) => {
            console.log(count);
            $modalClose.trigger('click');
            $(`#${postId}`).remove();
            $('#deleted-modal_open').trigger('click');
            updateCommentsNumber(false, count);
        });
    });

    $editText.on('change', () => {
        isEditTextChanged = true;
    });


    $modal.on('click', function (e) {
        e.stopPropagation();
    });

    $modalClose.on('click', function () {
        $(this).parent().parent().fadeOut();
    });

    $modalOverlay.on('click', function () {
        $(this).fadeOut();
    });

    $('#thank-modal_open').on('click', function (e) {
        e.preventDefault();
        $thankModal.css("display", "flex").hide().fadeIn();
    });

    $('#edited-modal_open').on('click', function (e) {
        e.preventDefault();
        $editedModal.css("display", "flex").hide().fadeIn();
    });

    $('#fail-modal_open').on('click', function (e) {
        e.preventDefault();
        $failModal.css("display", "flex").hide().fadeIn();
    });

    $('#reply-modal_open').on('click', function (e) {
        e.preventDefault();
        $failModal.css("display", "flex").hide().fadeIn();
    });

    $('#deleted-modal_open').on('click', function (e) {
        e.preventDefault();
        $deletedModal.css("display", "flex").hide().fadeIn();
    });

    $replyBtn.on('click', function (e) {

    });

    $editBtn.on('click', function (e) {

    });


    function getForm(formName) {
        return document.querySelector(`[name=${$(formName).attr('name')}]`);
    }

    function sendAjaxForm(url, formData) {
        return new Promise((resolve, reject) => $.ajax({
            url: url,
            type: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            cache: false,
            data: formData,
            success: function (id) {
                resolve(id);
            },
            error: function () {
                $('#fail-modal_open').trigger('click');
                reject();
            }
        }));
    }

    function getDate() {
        let date = new Date();
        let year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate(),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();

        if (+month < 10) month = `0${month}`;
        if (+day < 10) day = `0${day}`;
        if (+hours < 10) hours = `0${hours}`;
        if (+minutes < 10) minutes = `0${minutes}`;
        if (+seconds < 10) seconds = `0${seconds}`;

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    function getNewComment(id, name, text, splittedDate) {
        return `
                <div class="col comment-container" style="margin-left: 40px;" id="${id}">
                        <div class="comment__data">
                            <p class="comment__author">${name}</p>
                            <p class="comment__time"><i class="icon-clock"></i>${splittedDate[0]} at ${splittedDate[1]}</p>
                        </div>

                        <p class="comment__text">${text}</p>
                        <div class="comment__actions">
                            <div class="comment__likes">
                                <i class="icon-like"></i>
                                0
                            </div>
                            <div class="comment__dislikes">
                                <i class="icon-dislike"></i>
                                0
                            </div>
                            <a href="#" class="comment__answer"><i class="icon-reply"> </i>Answer this comment</a>
                            <a href="#" class="comment__edit"><i class="icon-edit"> </i>Edit</a>
                            <a href="#" class="comment__delete"><i class="icon-trash-empty"> </i>Delete</a>

                </div>
                `
    }

    function updateCommentsNumber(isPlus, count = 0) {
        let $statistics = $('.header__statistic > span');
        let number = +$($statistics).html();
        console.log(number);
        isPlus ? $($statistics).html(++number) : $($statistics).html(number - count + 1)

    }
});
