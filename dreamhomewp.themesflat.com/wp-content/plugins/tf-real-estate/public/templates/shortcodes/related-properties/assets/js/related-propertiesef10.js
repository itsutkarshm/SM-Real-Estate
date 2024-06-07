(function ($) {
    var propertiesOwlCarousel = function ($scope) {
        if ($().owlCarousel) {
            $('.related-properties .owl-carousel').each(function () {
                var
                    $this = $(this),
                    desktop = $this.data("desk"),
                    laptop = $this.data("laptop"),
                    tablet = $this.data("tablet"),
                    mobile = $this.data("mobile"),
                    spacing = $this.data("spacing"),
                    prev_icon = $this.data("prev_icon"),
                    next_icon = $this.data("next_icon");

                var loop = false;
                if ($this.data("loop") == true) {
                    loop = true;
                }

                var arrow = false;
                if ($this.data("arrow") == true) {
                    arrow = true;
                }

                var bullets = false;
                if ($this.data("bullets") == true) {
                    bullets = true;
                }

                var auto = false;
                if ($this.data("auto") == true) {
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
                    rtl: rtl,
                    autoplay: auto,
                    autoplayTimeout: 5000,
                    smartSpeed: 850,
                    autoplayHoverPause: true,
                    navText: ["<i class=\"" + prev_icon + "\"></i>", "<i class=\"" + next_icon + "\"></i>"],
                    responsive: {
                        0: {
                            items: mobile
                        },
                        600: {
                            items: tablet
                        },
                        1000: {
                            items: laptop
                        },
                        1400: {
                            items: desktop
                        }
                    }
                });
            });
        }
    }

    $(document).ready(function () {
        propertiesOwlCarousel();
    })
})(jQuery);