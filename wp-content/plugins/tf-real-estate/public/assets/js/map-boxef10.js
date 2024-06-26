jQuery(function ($) {
    let map, marker, latlng,
        fullAddressField = $('#full_address'),
        mapContainer = $('.map-container'),
        findAddressButton = mapContainer.find('.tfre-map-address-field .button-location'),
        latlngSearching = mapContainer.find('.latlng_searching'),
        addressSearching = mapContainer.find('.tfre-map-address-field').find('.tfre-map-address-field-input').find('.address_searching'),
        optionsGeoLocation = {
            enableHighAccuracy: true,
            timeout: 10000,
        };
    if (document.getElementById('map-single')) {
        mapboxgl.accessToken = map_box_variables.api_key_map_box ? map_box_variables.api_key_map_box : 'pk.eyJ1IjoidGhlbWVzZmxhdCIsImEiOiJjbGt3NGxtYncwa2F2M21saHM3M21uM3h2In0.9NbzjykXil1nELxQ1V8rkA';
        map = new mapboxgl.Map({
            container: 'map-single',
            style: 'mapbox://styles/mapbox/'+map_box_variables.map_box_style,
            center: [-122.25948, 37.87221], // Starting position [lng, lat]
            zoom: map_box_variables.map_zoom,
            draggable: true,
            pitchWithRotate: false,
            projection: 'equirectangular'
        });

        // Create custom marker
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${map_box_variables.default_marker_image ? map_box_variables.default_marker_image :
            map_box_variables.plugin_url + 'public/assets/image/map/map-marker.png'})`;
        el.style.width = map_box_variables.marker_image_width;
        el.style.height = map_box_variables.marker_image_height;
        el.style.backgroundSize = '100%';
        el.style.backgroundRepeat = 'no-repeat';
        // Initialize the marker
        marker = new mapboxgl.Marker({ element: el, draggable: true });

        const geocoder = new MapboxGeocoder({
            // Initialize the geocoder
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            marker: false, // Do not use the default marker style
            placeholder: 'Search',
        });

        // Add the geocoder to the map
        map.addControl(geocoder);

        map.on('load', () => {
            map.loadImage(
                map_box_variables.default_marker_image ? map_box_variables.default_marker_image :
                    map_box_variables.plugin_url + 'public/assets/image/map/map-marker.png',
                (error, image) => {
                    if (error) throw error;
                    map.addImage('custom-marker', image);
                });

            map.addSource('single-property', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': []
                }
            });

            map.addLayer({
                'id': 'point',
                'source': 'single-property',
                'type': 'symbol',
                'layout': {
                    'icon-image': 'custom-marker',
                    'icon-size': 0.25
                }
            });

            // Listen for the `result` event from the Geocoder 
            // `result` event is triggered when a user makes a selection
            //  Add a marker at the result's coordinates
            geocoder.on('result', (event) => {
                marker.setLngLat(event.result.geometry.coordinates).addTo(map);
                latlngSearching.val(event.result.geometry.coordinates[1] + ',' + event.result.geometry.coordinates[0]);
                addressSearching.val(event.result.place_name);
                fullAddressField.val(event.result.place_name);
            });
        });

        function onDragEnd() {
            const lngLat = marker.getLngLat();
            marker.setLngLat(lngLat).addTo(map);
            $.ajax({
                type: "GET",
                url: "https://api.mapbox.com/geocoding/v5/mapbox.places/" + lngLat.lng + "," + lngLat.lat + ".json?access_token=" + mapboxgl.accessToken,
                success: function (res) {
                    latlngSearching.val(lngLat.lat + ',' + lngLat.lng);
                    addressSearching.val(res.features[0].place_name);
                    fullAddressField.val(res.features[0].place_name);
                }
            });
        }

        marker.on('dragend', onDragEnd);

        findAddressButton.on('click', function () {
            if (addressSearching.val() !== '') {
                let address = addressSearching.val();
                $.ajax({
                    type: "GET",
                    url: "https://api.mapbox.com/geocoding/v5/mapbox.places/" + address + ".json?access_token=" + mapboxgl.accessToken,
                    success: function (res) {
                        map.flyTo({
                            center: res.features[0].geometry.coordinates,
                            zoom: map_box_variables.map_zoom,
                            pitch: 45,
                            bearing: 0,
                            essential: true,
                            duration: 3000,
                            speed: 1,
                        });
                        marker.setLngLat(res.features[0].center).addTo(map);
                        latlngSearching.val(res.features[0].center[1] + ',' + res.features[0].center[0]);
                        addressSearching.val(res.features[0].place_name);
                        fullAddressField.val(res.features[0].place_name);
                    }
                });
            }
            else {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            };
                            latlngSearching.val(position.coords.latitude + ',' + position.coords.longitude);

                            $.ajax({
                                type: "GET",
                                url: "https://api.mapbox.com/geocoding/v5/mapbox.places/" + pos.lng + "," + pos.lat + ".json?access_token=" + mapboxgl.accessToken,
                                success: function (res) {
                                    map.flyTo({
                                        center: res.features[0].geometry.coordinates,
                                        zoom: map_box_variables.map_zoom,
                                        pitch: 45,
                                        bearing: 0,
                                        essential: true,
                                        duration: 3000,
                                        speed: 1,
                                    });
                                    marker.setLngLat(res.features[0].center).addTo(map);
                                    addressSearching.val(res.features[0].place_name);
                                    fullAddressField.val(res.features[0].place_name);
                                }
                            });
                        }
                        , function () { }, optionsGeoLocation);
                } else {
                    // Browser doesn't support Geolocation
                    handleLocationError(false, infoWindow, map.getCenter());
                }
            }
        });

        addressSearching.on('keydown', function (event) {
            if (event.which === 13) {
                event.preventDefault();
                findAddressButton.trigger('click');
            }
        });

        if (latlngSearching.length && latlngSearching.val() !== '') {
            latlng = latlngSearching.val();
            latlng = latlng.split(',');
        }else{
            latlng = [0,0];
        }

        if (latlng) {
            map.flyTo({
                center: [latlng[1], latlng[0]],
                zoom: map_box_variables.map_zoom,
                pitch: 45,
                bearing: 0,
                essential: true,
                duration: 3000,
                speed: 1,
            });
            marker.setLngLat([latlng[1], latlng[0]]).addTo(map);
        }
    }
});