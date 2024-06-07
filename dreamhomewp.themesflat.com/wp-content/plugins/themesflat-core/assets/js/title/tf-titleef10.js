;(function($) {

    "use strict";

    var textSplit = function() {
        if($(".tf-split-text").length) {
            Splitting();
            var themesflat_animation_text = function (container, item) {
                $(window).scroll(function () {
                    var windowBottom = $(this).scrollTop() + $(this).innerHeight();
                    $(container).each(function (index, value) {
                        var objectBottom = $(this).offset().top + $(this).outerHeight() * 0.1;
                        
                        if (objectBottom < windowBottom) { 
                            var seat = $(this).find(item);
                            for (var i = 0; i < seat.length; i++) {
                                (function (index) {
                                    setTimeout(function () {
                                        seat.eq(index).addClass('tf-animated');
                                    }, 200 * index);
                                })(i);
                            }
                        }
                    });
                }).scroll();
            };
        
            $(function() {
                themesflat_animation_text(".tf-title-section", ".splitting");
            });
        }
    }

    $(window).on('elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/tf-title-section.default', textSplit );
    });

})(jQuery);
