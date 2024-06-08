/**
    * Modal_Right
    * menu_Modal_Left
    * headerFixed
    * themesflatSearch
    * btn_switch_layout
    * menuAdminActive
    * selectTypeForm
    * niceSelectForm
    * bg_bottom
    * tabFooter
    * goTop
    * removePreloader
 */

(function ($) {
    "use strict";

    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (
                isMobile.Android() ||
                isMobile.BlackBerry() ||
                isMobile.iOS() ||
                isMobile.Opera() ||
                isMobile.Windows()
            );
        },
    };

    var dashboard_Sidebar = function () {
        const dashboard = $(".sidebar-dashboard");
        var adminbar = $("#wpadminbar").height();
        $(".sidebar-dashboard").css({ top: adminbar });
        if (dashboard.length) {
            const open = function () {
                dashboard.addClass("active");
                $(".dashboard-overlay").addClass("active");
            };
            const close = function () {
                dashboard.removeClass("active");
                $(".dashboard-overlay").removeClass("active");
            };
            $(".dashboard-toggle").on("click", function () {
                open();
            });
            $(".dashboard-overlay, .btn-menu").on(
                "click",
                function () {
                    close();
                }
            );
        }
    };

    var menu_Modal_Left = function () {
        var menuType = "desktop";

        $(window).on("load resize", function () {
            var currMenuType = "desktop";
            var adminbar = $("#wpadminbar").height();

            if (matchMedia("only screen and (max-width: 991px)").matches) {
                currMenuType = "mobile";
            }

            if (currMenuType !== menuType) {
                menuType = currMenuType;

                if (currMenuType === "mobile") {
                    var hasChildMenu = $("#mainnav_canvas").find("li:has(ul)");
                    hasChildMenu.children("ul").hide();
                    if (hasChildMenu.find(">span").length == 0) {
                        hasChildMenu
                            .children("a")
                            .after('<span class="btn-submenu"></span>');
                    }
                    $(".btn-menu").removeClass("active");
                } else {
                    $("#header").find(".canvas-nav-wrap").removeClass("active");
                }
            }
        });

        $(".btn-menu").on("click", function (e) {
            $(this)
                .closest("#header")
                .find(".canvas-nav-wrap")
                .addClass("active");
        });

        $(".canvas-nav-wrap .overlay-canvas-nav").on("click", function (e) {
            $(this)
                .closest("#header")
                .find(".canvas-nav-wrap")
                .removeClass("active");
        });

        $(document).on(
            "click",
            "#mainnav_canvas li .btn-submenu",
            function (e) {
                $(this).toggleClass("active").next("ul").slideToggle(300);
                e.stopImmediatePropagation();
            }
        );
    };

    var menuAdminActive = function () {
        var url = window.location.pathname, 
        urlRegExp = new RegExp(url == '/' ? window.location.origin + '/?$' : url.replace(/\/$/,''));
        $('.user-dropdown .user-dropdown-menu .list-group-item a, .db-dashboard-menu ul li a').each(function(){
            if(urlRegExp.test(this.href.replace(/\/$/,''))){
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }

    var selectTypeForm = function () {
        if ($(".tfre-login-form").length > 0) {

            $(".tfre-login-form .modal-content .tfre_login_redirect_button, .display-pop-login, .display-pop-login.login").click(function () {
                $(this).closest("body").find('.thumb-login').show();
                $(this).closest("body").find('.thumb-register').hide();
            });

            $(".tfre-login-form .modal-content .tfre_register_button, .display-pop-login.register").click(function () {
                $(this).closest("body").find('.thumb-register').show();
                $(this).closest("body").find('.thumb-login').hide();
            });

        }
    };

    var headerFixed = function () {
        if ($("body:not(.page-template-page-dashboard)").hasClass("header_sticky")) {
            var header = $("#header"),
                hd_height = $("#header").height(),
                injectSpace = $("<div />", { height: hd_height }).insertAfter(
                    $("#header")
                );
            injectSpace.hide();
            $(window).on("load scroll resize", function () {
                    var wpadminbar = $("#wpadminbar").height();
                    if ($(window).scrollTop() >= hd_height) {
                        header.addClass("fixed-show");
                        injectSpace.show();
                    } else {
                        header.removeClass("fixed-show");
                        injectSpace.hide();
                    }
                    if ( $(window).scrollTop() > 500 ) {
                        header.addClass('header-sticky');
                        $(".header-sticky").css("top", wpadminbar);
                    } else {
                        $(".header-sticky").removeAttr("style");
                        header.removeClass('header-sticky');
                    }
            });
        }
    };

    var themesflatSearch = function () {
        $(document).on("click", function (e) {
            var clickID = e.target.id;
            if (clickID != "s") {
                $(".top-search").removeClass("show");
                $(".show-search").removeClass("active");
            }
        });

        $(".show-search").on("click", function (event) {
            event.stopPropagation();
        });

        $(".search-form").on("click", function (event) {
            event.stopPropagation();
        });

        $(".show-search").on("click", function (e) {
            if (!$(this).hasClass("active")) $(this).addClass("active");
            else $(this).removeClass("active");
            e.preventDefault();

            if (!$(".top-search").hasClass("show"))
                $(".top-search").addClass("show");
            else $(".top-search").removeClass("show");
        });
    };

    var niceSelectForm = function () {
        if ($("select").length > 0) {
            $("select:not(.tfre-property-neighborhood-ajax.search-field):not(.tfre-province-state-ajax.search-field)").niceSelect();
        }
    };

    var tabFooter = function () {
        if ($(".menu-tab-footer").length > 0) {
            for(var i = 1; i < 5; i++) {
                var item = $("#footer .wrap-widgets-"+i);
                item.find(".widget-title").insertBefore(item);
            }
            $("#footer .footer-widgets .widgets-areas > .widget-title").on("click", function () {
                $(this).toggleClass("active");
                $(this).closest(".widgets-areas").find(".wrap-widgets").toggleClass("active");
            });
        }
    };

    var goTop = function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 500) {
                $(".go-top").addClass("show");
            } else {
                $(".go-top").removeClass("show");
            }
        });
        $(".go-top").on("click", function (event) {
            event.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, 0);
        });
    };

    var removePreloader = function () {
        $("#preloader").fadeOut("slow", function () {
            setTimeout(function () {
                $("#preloader").remove();
            }, 1000);
        });
    };


    // Dom Ready
    $(function () {
        dashboard_Sidebar();
        menu_Modal_Left();
        headerFixed();
        themesflatSearch();
        menuAdminActive();
        selectTypeForm();
        niceSelectForm();
        tabFooter();
        goTop();
        removePreloader();
    });
})(jQuery);
