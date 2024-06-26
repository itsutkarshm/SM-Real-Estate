;(function($) {

    "use strict";

    var tf_counter = function() {       
        $('.tf-counter').each(function(){
            var $this = $(this),
            counter_number = $this.find('.counter-number'),
            to_value = counter_number.data('to_value'),
            duration = counter_number.data('duration'),
            delimiter = counter_number.data('delimiter');            
            var waypoint = new Waypoint({
                element: $this,
                handler: function(direction) {
                    counter_number.numerator({
                        duration: duration, // the length of the animation.
                        delimiter: delimiter,
                        toValue: to_value // animate to this value.
                    });
                },
                offset: '100%'
            });
        });        
    }

    $(window).on('elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/tf-counter.default', tf_counter );
    });

})(jQuery);
