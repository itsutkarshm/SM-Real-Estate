(function ($) {
    var propertiesOwlCarousel = function ($scope) {
        if ($().owlCarousel) {
            $scope.find('.tf-properties-wrap.has-carousel .owl-carousel').each(function () {
                var
                    $this = $(this),
                    item = $this.data("column"),
                    item2 = $this.data("column2"),
                    item3 = $this.data("column3"),
                    item4 = $this.data("column4"),
                    spacing = $this.data("spacing");

                var loop = false;
                if ($this.data("loop") == 'yes') {
                    loop = true;
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
                    nav: false,
                    rtl: rtl,
                    dots: bullets,
                    autoplay: auto,
                    autoplayTimeout: 5000,
                    smartSpeed: 850,
                    autoplayHoverPause: true,
                    responsive: {
                        0: {
                            items: item3
                        },
                        768: {
                            items: item2
                        },
                        1000: {
                            items: item4
                        },
                        1400: {
                            items: item
                        }
                    }
                });
            });
        }
    }

    var viewGalleryMagnificPopup = function () {
        $('[data-mfp-event]').each(function () {
            var $this = $(this),
                defaults = {
                    type: 'image',
                    closeOnBgClick: true,
                    closeBtnInside: false,
                    mainClass: 'mfp-zoom-in',
                    midClick: true,
                    removalDelay: 500,
                    callbacks: {
                        beforeOpen: function () {
                            // just a hack that adds mfp-anim class to markup
                            switch (this.st.type) {
                                case 'image':
                                    this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                                    break;
                                case 'iframe':
                                    this.st.iframe.markup = this.st.iframe.markup.replace('mfp-iframe-scaler', 'mfp-iframe-scaler mfp-with-anim');
                                    break;
                            }
                        },
                        beforeClose: function () { },
                        close: function () { },
                        change: function () {
                            var _this = this;
                            if (this.isOpen) {
                                this.wrap.removeClass('mfp-ready');
                                setTimeout(function () {
                                    _this.wrap.addClass('mfp-ready');
                                }, 10);
                            }
                        }
                    }
                },
                mfpConfig = $.extend({}, defaults, $this.data("mfp-options"));

            var gallery = $this.data('gallery');
            if ((typeof (gallery) !== "undefined")) {
                var items = [],
                    items_src = [];

                if (gallery && gallery.length !== 0) {
                    for (var i = 0; i < gallery.length; i++) {
                        var src = gallery[i];
                        if (items_src.indexOf(src) < 0) {
                            items_src.push(src);
                            items.push({
                                src: src
                            });
                        }
                    }
                }

                mfpConfig.items = items;
                mfpConfig.gallery = {
                    enabled: true
                };
                mfpConfig.callbacks.beforeOpen = function () {
                    switch (this.st.type) {
                        case 'image':
                            this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                            break;
                        case 'iframe':
                            this.st.iframe.markup = this.st.iframe.markup.replace('mfp-iframe-scaler', 'mfp-iframe-scaler mfp-with-anim');
                            break;
                    }
                };
            }

            $this.magnificPopup(mfpConfig);
        });
    }

    var propertiesFilterTabsTaxonomy = function ($scope) {
        $scope.find('.show_filter_tabs .wrap-properties-post').each(function () {
            var $wrap_container = $(this).closest('.wrap-properties-post');
            var loading = '<span class="loading-icon"><span class="dot-flashing"></span></span>';
            $(this).children('.content-tab').children().hide();
            $(this).children('.content-tab').children().first().show().addClass('active');

            $(this).find('.filter-bar').children('a').hover(function (e) {
                e.preventDefault();
                var itemActive = $(this).index(),
                    contentActive = $(this).siblings().parents('.show_filter_tabs .wrap-properties-post').children('.content-tab').children().eq(itemActive);
                var numItems = contentActive.find('.properties').find('.item').length;
                $(this).closest('.filter-bar').find('.content').text(numItems + ' property');
            });

            $(this).find('.filter-bar').children('a').on('click', function (e) {
                e.preventDefault();

                $wrap_container.find('.content-tab').children().children().append(loading);
                var itemActive = $(this).index(),
                    contentActive = $(this).siblings().removeClass('active').parents('.show_filter_tabs .wrap-properties-post').children('.content-tab').children().eq(itemActive);
                $(this).addClass('active')
                contentActive.addClass('active').fadeIn('slow');
                var numItems = contentActive.find('.properties').find('.item').length;

                $(this).closest('.filter-bar').find('.content').text(numItems + ' property');

                contentActive.siblings().removeClass('active');
                $(this).addClass('active').parents('.show_filter_tabs .wrap-properties-post').children('.content-tab').children().eq(itemActive).siblings().hide();

                setTimeout(function () {
                    $wrap_container.find('.properties .loading-icon').fadeOut('', function () {
                        setTimeout(function () {
                            $wrap_container.find('.properties .loading-icon').remove();
                        }, 500);
                    });
                }, 700);
            });
        });
    }

    var swiperGalleryImages = function () {
        $(this).delay().queue(function () {
            new Swiper(".swiper-container.carousel-image-box", {
                slidesPerView: 1,
                spaceBetween: 30,
                navigation: {
                    clickable: true,
                    nextEl: ".swiper-button-next2",
                    prevEl: ".swiper-button-prev2",
                },
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                    dynamicBullets: true,
                    dynamicMainBullets: 1
                },
            });
            $(this).dequeue();
        });
    }

    var propertyQuickViewElementorWidget = function (elementorId) {
        $('#property_quick_view_modal_' + elementorId).find('.modal-body').children().remove();
        $('#property_quick_view_modal_' + elementorId).off().on('shown.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var propertyId = button.data('property-id');
            var modal = $(this);
            setTimeout(() => {
                $.ajax({
                    type: 'post',
                    url: property_variables.ajax_url,
                    data: {
                        'action': 'get_property_detail',
                        'property_id': propertyId
                    },
                    beforeSend: function () {
                        modal.find('.modal-body').html('<div class="loading"><i class="fa fa-spinner fa-spin"></i></div>');
                    },
                    success: function (response) {
                        modal.children('i').removeClass('fa-spinner fa-spin');
                        modal.find('.modal-body').html(response);
                        var swiperThumb = new Swiper('#property_quick_view_modal_' + elementorId + " .popup-property-container .property-gallery .thumb-swiper", {
                            spaceBetween: 10,
                            slidesPerView: 4,
                            freeMode: true,
                            watchSlidesProgress: true,
                            watchSlidesVisibility: true,
                            watchSlidesProgress: true,
                            centerInsufficientSlides: true,
                            slideToClickedSlide: true,
                        });

                        var swiperMain = new Swiper('#property_quick_view_modal_' + elementorId + " .popup-property-container .property-gallery .main-swiper", {
                            spaceBetween: 10,
                            navigation: {
                                nextEl: ".swiper-button-next",
                                prevEl: ".swiper-button-prev",
                            },
                            thumbs: {
                                swiper: swiperThumb
                            },
                        });
                    },
                    error: function () {
                        modal.children('i').removeClass('fa-spinner fa-spin');
                    }
                });
            }, 500);
        })
    }

    var onClickQuickView = function () {
        $('a.property-quick-view').on('click', function (e) {
            var elementorId = $(this).data('elementor-id');
            propertyQuickViewElementorWidget(elementorId);
        });
    }

    var galleryCarousel = function () {
        if ($('.single-property-image-main').length > 0) {
            var thumb1 = $(".single-property-image-main");
            var thumb2 = $(".single-property-image-thumb");
            var dataItem = thumb2.data("item");
            var slidesPerPage = 3;
            var syncedSecondary = true;

            thumb1.owlCarousel({
                items: 1,
                slideSpeed: 5000,
                nav: false,
                autoplay: false,
                dots: false,
                loop: false,
                touchDrag: false,
                mouseDrag: false,
                animateIn: 'fadeIn',
                animateOut: 'fadeOut',
                responsiveRefreshRate: 200,
            }).on('changed.owl.carousel', syncPosition);

            thumb2
                .on('initialized.owl.carousel', function () {
                    thumb2.find(".owl-item").eq(0).addClass("current");
                })
                .owlCarousel({
                    items: dataItem,
                    dots: false,
                    nav: false,
                    touchDrag: false,
                    mouseDrag: false,
                    smartSpeed: 200,
                    slideSpeed: 500,
                    slideBy: slidesPerPage,
                    responsiveRefreshRate: 100,
                }).on('changed.owl.carousel', syncPosition2);

            function syncPosition(el) {
                var count = el.item.count - 1;
                var current = Math.round(el.item.index - (el.item.count / 2) - .5);

                if (current < 0) {
                    current = count;
                }
                if (current > count) {
                    current = 0;
                }

                thumb2
                    .find(".owl-item")
                    .removeClass("current")
                    .eq(current)
                    .addClass("current");
                var onscreen = thumb2.find('.owl-item').length - 1;
                var start = thumb2.find('.owl-item').first().index();
                var end = thumb2.find('.owl-item').last().index();

                if (current > end) {
                    thumb2.data('owl.carousel').to(current, 100, true);
                }
                if (current < start) {
                    thumb2.data('owl.carousel').to(current - onscreen, 100, true);
                }
            }

            function syncPosition2(el) {
                if (syncedSecondary) {
                    var number = el.item.index;
                    thumb1.data('owl.carousel').to(number, 100, true);
                }
            }

            thumb2.on("click", ".owl-item", function (e) {
                $(this).closest('.owl-stage').find('.owl-item').removeClass('item-active');
                $(this).addClass('item-active');
                e.preventDefault();
                var number = $(this).index();
                thumb1.data('owl.carousel').to(number, 300, true);
            });
        };

        if ($('.single-property-image-main-1').length > 0) {
            var thumb1 = $(".single-property-image-main-1");

            thumb1.owlCarousel({
                items: 1,
                slideSpeed: 5000,
                nav: false,
                autoplay: false,
                dots: false,
                loop: false,
                touchDrag: false,
                mouseDrag: false,
                animateIn: 'fadeIn',
                animateOut: 'fadeOut',
                responsiveRefreshRate: 200,
            });

            document.getElementById('next-slide').addEventListener('click', function () {
                $('.single-property-image-main-1').trigger('next.owl.carousel');
            });

            document.getElementById('prev-slide').addEventListener('click', function () {
                $('.single-property-image-main-1').trigger('prev.owl.carousel');
            });
        };
    };

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/tf_properties_list.default', viewGalleryMagnificPopup);
        elementorFrontend.hooks.addAction('frontend/element_ready/tf_properties_list.default', propertiesOwlCarousel);
        elementorFrontend.hooks.addAction('frontend/element_ready/tf_properties_list.default', function () {
            swiperGalleryImages();
            $('.show_filter_tabs .wrap-properties-post').find('.filter-bar').children('a').on('click', function (e) {
                swiperGalleryImages();
            })
        });
        elementorFrontend.hooks.addAction('frontend/element_ready/tf_properties_list.default', propertiesFilterTabsTaxonomy);
        elementorFrontend.hooks.addAction('frontend/element_ready/tf_properties_list.default', onClickQuickView);
        // Single Property Widget 
        elementorFrontend.hooks.addAction('frontend/element_ready/tf_featured_single_property.default', galleryCarousel);
    });
})(jQuery);