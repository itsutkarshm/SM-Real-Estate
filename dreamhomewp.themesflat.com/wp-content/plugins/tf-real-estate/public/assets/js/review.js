(function ($) {
    var onChangeRatingStar = function () {
        $('.star-rating').on('click', 'i', function () {
            var rating = $(this).data('rating');
            var stars = $(this).parent('.star-rating').children();
            for (let i = 0; i < 5; i++) {
                stars[i].classList.remove('active');
            }
            for (let i = 0; i < rating; i++) {
                stars[i].classList.add('active');
            }
        });
    }
    var submitReview = function () {
        $('.tfre-submit-property-rating').click(function (e) {
            e.preventDefault();
            var $this = $(this);
            var rating = $this.parents('form').find('.star-rating > i.active').length;
            var rating_element = document.getElementById('rating-submit');
            rating_element.value = rating;
            var $form = $this.parents('form');
            var reviewField = $this.parents('form').find('#review');
            if (reviewField.val().trim() === "") {
                e.preventDefault();
                reviewField.next().html(review_variables.message_required_review);
                return;
            } else {
                reviewField.next().html("")
            }
            $.ajax({
                type: 'POST',
                url: review_variables.ajaxUrl,
                data: $form.serialize(),
                dataType: 'json',
                beforeSend: function () {
                    $this.children('i').remove();
                    $this.append('<i class="fa-left fa fa-spinner fa-spin"></i>');
                },
                success: function () {
                    window.location.reload();
                },
                complete: function () {
                    $this.children('i').removeClass('fa fa-spinner fa-spin');
                    $this.children('i').addClass('fa fa-check');
                }
            });

        });
    }

    var onClickEditReview = function () {
        $('.tfre-edit-review').click(function (e) {
            var reviewId = $(this).data('id');
            if (reviewId) {
                var editForm = document.getElementById('tfre-edit-review-in-line-' + reviewId);
                editForm.style.display = 'block';
            }

        });
    }

    var updateReview = function () {
        $('.tfre_update_review').click(function (e) {
            e.preventDefault();
            var $this = $(this);
            var review_ID, review_content, rating, rating_element, security;
            review_ID = $this.parents('form').data('id');
            review_content = $this.parents('form').find('.tf-edit-review-in-line').val();
            rating = $this.parents('form').find('.star-rating > i.active').length;
            rating_element = document.getElementById('rating-submit');
            security = $("#tfre_security_update_review").val();

            var $messages = $this.parents('form').find('.tfre_message');
            var reviewField = $this.parents('form').find('.tf-edit-review-in-line');

            if (reviewField.val().trim() === "") {
                e.preventDefault();
                $this.parents('form').next().html(review_variables.message_required_review);
                return;
            } else {
                $this.parents('form').next().html("")
            }
            $.ajax({
                type: 'POST',
                url: review_variables.ajaxUrl,
                data: {
                    'action': 'tfre_update_review_ajax',
                    'review_ID': review_ID,
                    'review_content': review_content,
                    'rating': rating,
                    'tfre_security_update_review': security
                },
                dataType: 'json',
                beforeSend: function () {
                    $this.children('i').remove();
                    $this.append('<i class="fa-left fa fa-spinner fa-spin"></i>');
                },
                success: function (response) {
                    if (response.status) {
                        $messages.empty().append('<span class="success text-success"><i class="fa fa-check"></i> ' + response.message + '</span>');
                        rating_element.value = rating;
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        $messages.empty().append('<span class="error text-danger"><i class="fa fa-close"></i> ' + response.message + '</span>');
                    }
                },
                complete: function () {
                    $this.children('i').removeClass('fa fa-spinner fa-spin');
                    $this.children('i').addClass('fa fa-check');
                }
            });

        });
    }

    var onChangeReviewOrder = function () {
        $('select#order_review').on('change', function (e) {
            var selected = $(this).find(":selected").val();
            var currentURL = window.location.href;
            // Create a URL object
            var url = new URL(currentURL);
            url.searchParams.set('reviewOrderby', selected);
            var updatedURL = url.toString();
            window.location.href = updatedURL;

        })
    }

    jQuery(document).ready(function ($) {
        onChangeRatingStar();
        submitReview();
        onChangeReviewOrder();
        onClickEditReview();
        updateReview();
    })
})(jQuery);
