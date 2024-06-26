(function ($) {

    var initMapSingleAgency = function () {
        let latlng, marker, map,
            mapContainer = $('.map-container'),
            latlngSearching = mapContainer.find('.latlng_searching');
        if (!document.getElementById('map-agency')) return;

        if (latlngSearching.length && latlngSearching.val() !== '') {
            latlng = latlngSearching.val();
            latlng = latlng.split(',');
        }else{
            latlng = [0,0];
        }

        if (agency_variables.map_service == 'google-map') {
            let geocoder = new google.maps.Geocoder();
            var mapOptions = {
                center: { lat: parseFloat(latlng[1]), lng: parseFloat(latlng[0]) },
                zoom: parseInt(agency_variables.map_zoom)
            };

            map = new google.maps.Map(document.getElementById('map-agency'), mapOptions);

            marker = new google.maps.Marker({
                position: { lat: parseFloat(latlng[1]), lng: parseFloat(latlng[0]) },
                map: map,
            });
        }

        if (agency_variables.map_service == 'map-box') {
            let geoData = {
                "type": "FeatureCollection",
                "features": []
            };

            mapboxgl.accessToken = agency_variables.api_key_map_box ? agency_variables.api_key_map_box : 'pk.eyJ1IjoidGhlbWVzZmxhdCIsImEiOiJjbGt3NGxtYncwa2F2M21saHM3M21uM3h2In0.9NbzjykXil1nELxQ1V8rkA';

            map = new mapboxgl.Map({
                container: 'map-agency',
                style: 'mapbox://styles/mapbox/'+agency_variables.map_box_style,
                center: [0, 0], // [lng, lat]
                zoom: agency_variables.map_zoom,
                minZoom: 1,
                gestureHandling: 'cooperative',
                locations: [],
                draggable: false,
                scrollwheel: true,
                navigationControl: true,
                mapTypeControl: true,
                streetViewControl: false,
                pitchWithRotate: false,
            });
            map.addControl(new mapboxgl.NavigationControl());
            // Create custom marker
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = `url(${agency_variables.default_marker_image ? agency_variables.default_marker_image :
                agency_variables.plugin_url + 'public/assets/image/map/map-marker.png'})`;
            el.style.width = agency_variables.marker_image_width;
            el.style.height = agency_variables.marker_image_height;
            el.style.backgroundSize = '100%';
            el.style.backgroundRepeat= 'no-repeat';

            // Initialize the marker
            marker = new mapboxgl.Marker({ element: el, draggable: false });

            if (latlng) {
                map.flyTo({
                    center: [latlng[1], latlng[0]],
                    zoom: agency_variables.map_zoom,
                    pitch: 45,
                    bearing: 0,
                    essential: true,
                    duration: 3000,
                    speed: 1,
                });
                marker.setLngLat([latlng[1], latlng[0]]).addTo(map);
            }
        }
    }

    var replaceUrlParam = function (url, paramName, paramValue) {
        if (paramValue == null) {
            paramValue = '';
        }
        var updatedURL = url.replace(/\/page\/\d+/, '');
        var pattern = new RegExp('\\b(' + paramName + '=).*?(&|#|$)');
        if (updatedURL.search(pattern) >= 0) {
            return updatedURL.replace(pattern, '$1' + paramValue + '$2');
        }
        updatedURL = updatedURL.replace(/[?#]$/, '');
        return updatedURL + (updatedURL.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;
    }

    var onClickViewMode = function () {
        $('a.agency-view-grid-list').on('click', function () {
            var value = $(this).attr('data-value');
            var newURL = replaceUrlParam(window.location.href, 'view', value)
            window.location.href = newURL;
        });
    }

    var handleAgencySearch = function () {
        $('.tfre-search-agency-btn').on('click', function (e) {
            e.preventDefault();
            var parentForm = $(this).closest('.search-agency-form');
            var searchUrl = parentForm.data('href');
            var valueAgency = parentForm.find('input[name="agency_name"]').val();
            var queryString = '?';
            if (valueAgency) {
                queryString += 'agency_name=' + valueAgency;
            }
            window.location.href = searchUrl + queryString;
        })

        $('.search-agency-form').find('input').keypress(function(e) {
            // Enter pressed
            if(e.which == 10 || e.which == 13) {
                $('.tfre-search-agency-btn').click();
            }
        });
    }

    var onChangeOrderByAgency = function () {   
        $('#agency_order_by').on('change', function() {
            var newURL = $(this).val();
            window.location.href = newURL;
        });
    }

    $(document).ready(function () {
        initMapSingleAgency();
        onClickViewMode();
        handleAgencySearch();
        onChangeOrderByAgency();
    })
})(jQuery)