var mainJSTFRE = mainJSTFRE || {};
(function ($) {
    'use strict';
    var decimals = 0,
        decPoint = '.',
        thousandsSep = ',';
    mainJSTFRE = {
        init: function () {
            this.onChangeFilterPropertyStatus();
            this.onChangeOrderProperty();
            if(main_variables.toggle_lazy_load == 'on'){
                this.lazyLoadImage();
            }
        },
        numberFormat: function (number, decimal) {
            decimal = (typeof decimal !== 'undefined') ? decimal : decimals;

            // Strip all characters but numerical ones.
            number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
            var n = !isFinite(+number) ? 0 : +number,
                prec = !isFinite(+decimal) ? 0 : Math.abs(decimal),
                sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep,
                dec = (typeof decPoint === 'undefined') ? '.' : decPoint,
                s = '',
                toFixedFix = function (n, prec) {
                    var k = Math.pow(10, prec);
                    return '' + Math.round(n * k) / k;
                };
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
            }
            if ((s[1] || '').length < prec) {
                s[1] = s[1] || '';
                s[1] += new Array(prec - s[1].length + 1).join('0');
            }
            return s.join(dec);
        },
        onChangeFilterPropertyStatus: function () {
            $('select#post_status').on('change', function () {
                var selected = $(this).find(":selected").val();
                window.location.href = selected;
            })
        },
        onChangeOrderProperty: function () {
            $('select#property_order_by').on('change', function () {
                var selected = $(this).find(":selected").val();
                window.location.href = selected;
            })
        },
        lazyLoadImage: function () {
            var lazyloadImages;
            if ("IntersectionObserver" in window) {
                lazyloadImages = document.querySelectorAll("img.lazy");
                var imageObserver = new IntersectionObserver(function (entries, observer) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            var image = entry.target;
                            var src = image.dataset.src;

                            image.tagName.toLowerCase() === 'img'
                                ? image.src = src
                                : image.style.backgroundImage = "url(\'" + src + "\')";
                            image.classList.add('loaded');
                            image.classList.remove("lazy");
                            imageObserver.unobserve(image);
                        }
                    });
                });

                lazyloadImages.forEach(function (image) {
                    imageObserver.observe(image);
                });
            } else {
                var lazyloadThrottleTimeout;
                lazyloadImages = document.querySelectorAll("img.lazy");
                function lazyload() {
                    if (lazyloadThrottleTimeout) {
                        clearTimeout(lazyloadThrottleTimeout);
                    }

                    lazyloadThrottleTimeout = setTimeout(function () {
                        var scrollTop = window.pageYOffset;
                        lazyloadImages.forEach(function (img) {
                            if (img.offsetTop < (window.innerHeight + scrollTop)) {
                                var src = img.dataset.src;
                                img.tagName.toLowerCase() === 'img'
                                    ? img.src = src
                                    : img.style.backgroundImage = "url(\'" + src + "\')";
                                img.classList.add('loaded');
                                img.classList.remove("lazy");
                            }
                        });
                        if (lazyloadImages.length == 0) {
                            document.removeEventListener("scroll", lazyload);
                            window.removeEventListener("resize", lazyload);
                            window.removeEventListener("orientationChange", lazyload);
                        }
                    }, 20);
                }

                document.addEventListener("scroll", lazyload);
                window.addEventListener("resize", lazyload);
                window.addEventListener("orientationChange", lazyload);
            }
        }
    }
    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/widget', function ($scope) {
            if(main_variables.toggle_lazy_load == 'on'){
                mainJSTFRE.lazyLoadImage();
            }
        });
    })
    jQuery(document).ready(function () {
        mainJSTFRE.init();
    });
})(jQuery);