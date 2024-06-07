(function ($) {

    var agentsOwlCarousel = function () {
        if ($().owlCarousel) {
            $('.tf-agent-wrap.has-carousel .owl-carousel').each(function () {
                var
                    $this = $(this),
                    item = $this.data("column"),
                    item2 = $this.data("column2"),
                    item3 = $this.data("column3"),
                    prev_icon = $this.data("prev_icon"),
                    next_icon = $this.data("next_icon");

                var loop = false;
                if ($this.data("loop") == 'yes') {
                    loop = true;
                }

                var arrow = false;
                if ($this.data("arrow") == 'yes') {
                    arrow = true;
                }

                var bullets = false;
                if ($this.data("bullets") == 'yes') {
                    bullets = true;
                }

                var auto = false;
                if ($this.data("auto") == 'yes') {
                    auto = true;
                }

                var rtl = false;
                if ($this.data("rtl") == 'yes') {
                    rtl = true;
                }

                $this.owlCarousel({
                    loop: loop,
                    margin: 0,
                    nav: arrow,
                    dots: bullets,
                    rtl: rtl,
                    autoplay: auto,
                    autoplayTimeout: 5000,
                    smartSpeed: 850,
                    autoplayHoverPause: true,
                    navText: ["<i class=\"" + prev_icon + "\"></i>", "<i class=\"" + next_icon + "\"></i>"],
                    responsive: {
                        0: {
                            items: item3
                        },
                        768: {
                            items: item2
                        },
                        1000: {
                            items: item
                        }
                    }
                });

            });
        }
    }

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tf_agents_list.default', agentsOwlCarousel);
    })

})(jQuery);
