(function ($) {
    var areasOwlCarousel = function ($scope) {
        if ($().owlCarousel) {
            $scope.find('.tf-area-wrap.has-carousel .owl-carousel').each(function () {
                var
                    $this = $(this),
                    item = $this.data("column"),
                    item1 = $this.data("column1"),
                    item2 = $this.data("column2"),
                    item3 = $this.data("column3"),
                    spacing = $this.data("spacing"),
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
                    margin: spacing,
                    nav: arrow,
                    dots: bullets,
                    autoplay: auto,
                    autoplayTimeout: 5000,
                    smartSpeed: 850,
                    rtl: rtl,
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
                            items: item1
                        },
                        1350: {
                            items: item
                        }
                    }
                });

            });
        }
    }

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tf_areas_list.default', areasOwlCarousel);
    })
})(jQuery);
