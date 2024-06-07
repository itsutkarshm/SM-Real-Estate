(function( $ ) {
    if (typeof agent_variables !== "undefined") {
		var listing_property_url = agent_variables.listing_property_url,
			alert_not_found = agent_variables.alert_not_found;
	}
    var tfre_show_tab_content = function () {   
        $('.property-status-tab').on('click', function (event) {
            var $this = $(this);
            var tabValue = $(this).data('tab-value');
            const tabContents = document.getElementsByClassName('agent-property-tab');
            for (let i = 0; i < tabContents.length; i++) {
                tabContents[i].classList.remove('active');
            }
            const tabTitles = document.getElementsByClassName('property-status-tab');
            for (let i = 0; i < tabTitles.length; i++) {
                tabTitles[i].classList.remove('active');
            }
            const selectedTab = document.getElementById(tabValue);
            selectedTab.classList.add('active');
            event.currentTarget.className += " active";
        })
    }

    var tfre_listing_property_redirect = function () {   
        $(document).on('click', '.tfre_listing_property_button', function () {
            if (listing_property_url != "") {
                window.location.href = listing_property_url;
            } else {
                alert(alert_not_found);
            }
            return false;
        });
    }
    var onClickViewMode = function () {        
        $('a.agent-view-grid-list').on('click', function () {
            var value = $(this).attr('data-value');
            var newURL = replaceUrlParam(window.location.href, 'view', value )
            window.location.href = newURL;
        });
    }
    var onChangeSearchAgency = function () {   
        $('#agency_search').on('change', function() {
            var searchTerm = $(this).val();
            var newURL = replaceUrlParam(window.location.href, 'agency_search', searchTerm )
            window.location.href = newURL;
        });
    }
    var onChangeOrderByAgent = function () {   
        $('#agent_order_by').on('change', function() {
            var newURL = $(this).val();
            window.location.href = newURL;
        });
    }
    var replaceUrlParam = function(url, paramName, paramValue) {
        if (paramValue == null) {
            paramValue = '';
        }
        var updatedURL = url.replace(/\/page\/\d+/, '');
        var pattern = new RegExp('\\b('+paramName+'=).*?(&|#|$)');
        if (updatedURL.search(pattern)>=0) {
            return updatedURL.replace(pattern,'$1' + paramValue + '$2');
        }
        updatedURL = updatedURL.replace(/[?#]$/,'');
        return updatedURL + (updatedURL.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue;
    }

    var handleAgentSearch = function (){
        $('.tfre-search-agent-btn').on('click', function(e){
            e.preventDefault();
            var parentForm = $(this).closest('.search-agent-form');
            var searchUrl = parentForm.data('href');
            var valueAgent = parentForm.find('input[name="agent_name"]').val();
            var valueAgency = parentForm.find('select[name="agency"]').val();
            var queryString = '?';
            if(valueAgent){
                queryString+= 'agent_name='+valueAgent;
            }
            if(valueAgency){
                queryString+= '&agency='+valueAgency;
            }
            window.location.href = searchUrl + queryString;
        })

        $('.search-agent-form').find('input').keypress(function(e) {
            // Enter pressed
            if(e.which == 10 || e.which == 13) {
                $('.tfre-search-agent-btn').click();
            }
        });

        $('.search-agent-form').find('select').on('change', function(){
            $('.tfre-search-agent-btn').click();
        })
    }

    jQuery(document).ready(function($) {
        tfre_show_tab_content();
        tfre_listing_property_redirect();
        onClickViewMode();
        onChangeSearchAgency();
        handleAgentSearch();
        onChangeOrderByAgent();
    })
})( jQuery );
