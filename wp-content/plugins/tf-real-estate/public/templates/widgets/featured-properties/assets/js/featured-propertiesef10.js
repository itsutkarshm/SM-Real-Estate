(function ($) {
    var widgetFeaturedPropertiesOwlCarousel = function () {
        $(this).delay(500).queue(function() {
                var options = $('.tfre-list-featured-properties .owl-carousel').data('options');
                if ($().owlCarousel) {
                    $('.tfre-list-featured-properties .owl-carousel').owlCarousel(options);
                }
                $(this).dequeue();
             });
    }

    $(document).ready(function () {
        widgetFeaturedPropertiesOwlCarousel();
    })
})(jQuery);