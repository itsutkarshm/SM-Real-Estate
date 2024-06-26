(function( $ ) {
    "use strict";
   
    
    var iziModal = function(){
        if ($('body').find('div').hasClass('izimodal')) {
            $(".izimodal").iziModal({
                width: 850,
                top: null,
                bottom: null,
                borderBottom: false,
                padding: 0,
                radius: 3,
                zindex: 999999,
                iframe: false,
                iframeHeight: 400,
                iframeURL: null,
                focusInput: false,
                group: '',
                loop: false,
                arrowKeys: true,
                navigateCaption: true,
                navigateArrows: true, // Boolean, 'closeToModal', 'closeScreenEdge'
                history: false,
                restoreDefaultContent: true,
                autoOpen: 0, // Boolean, Number
                bodyOverflow: false,
                fullscreen: false,
                openFullscreen: false,
                closeOnEscape: true,
                closeButton: true,
                appendTo: 'body', // or false
                appendToOverlay: 'body', // or false
                overlay: true,
                overlayClose: true,
                overlayColor: 'rgba(0, 0, 0, .7)',
                timeout: false,
                timeoutProgressbar: false,
                pauseOnHover: false,
                timeoutProgressbarColor: 'rgba(255,255,255,0)',
                transitionIn: 'comingIn',
                transitionOut: 'comingOut',
                transitionInOverlay: 'fadeIn',
                transitionOutOverlay: 'fadeOut',
                onFullscreen: function(){},
                onResize: function(){},
                onOpening: function(){},
                onOpened: function(){},
                onClosing: function(){},
                onClosed: function(){},
                afterRender: function(){}
            });

            $(document).on('click', '.trigger', function (event) {
                event.preventDefault();
                $('.izimodal').iziModal('setZindex', 99999999);
                $('.izimodal').iziModal('open', { zindex: 99999999 });
                $('.izimodal').iziModal('open');
            });
        }
    }

    $(function() {
        iziModal();
    })

})(jQuery);