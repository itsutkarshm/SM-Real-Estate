(function ($) {
    var getNearbyPlacesMapBox = function () {
        var latlng, accessToken, mapContainer = $('.map-container'),
            latlngSearching = mapContainer.find('.latlng_searching');

        if (latlngSearching.length && latlngSearching.val() !== '') {
            latlng = latlngSearching.val();
            latlng = latlng.split(',');
        }else{
            latlng = [0,0];
        }
        accessToken = nearby_places_variables.api_key_map_box ? nearby_places_variables.api_key_map_box : 'pk.eyJ1IjoidGhlbWVzZmxhdCIsImEiOiJjbGt3NGxtYncwa2F2M21saHM3M21uM3h2In0.9NbzjykXil1nELxQ1V8rkA';

        $.ajax({
            type: 'GET',
            url: "https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/tilequery/" + latlng[1] + "," + latlng[0] + ".json?radius=1000&limit=10&layers=poi_label&access_token=" + accessToken,
            success: function (response) {
                var result = [];
                var html = '';
                if (response.features.length <= 0) {
                    $('.nearby-place-wrapper').append('<p>No nearby places</p>');
                } else {

                    result = response.features.reduce((newObj, data) => {
                        if (data.properties.category_en) {
                            var array = newObj[data.properties.category_en] = newObj[data.properties.category_en] || [];
                        } else {
                            var array = newObj[data.properties.type] = newObj[data.properties.type] || [];
                        }

                        array[array.length] = data;
                        return newObj;
                    }, {})

                    Object.keys(result).forEach(function (key) {
                        html += '<div class="place"><div class="place-icon"><i class="far fa-map-marker-alt"></i></div><div class="place-info"><h4 class="place-title">' + key + '</h4><ul class="place-list">';
                        result[key].forEach(function (elem) {
                            var distance_from_current_location = (elem.properties.tilequery.distance / 1609.344).toFixed(3);
                            html += '<li>' + (elem.properties.name ? elem.properties.name : elem.properties.type) + '<span class="place-distance"> ' + distance_from_current_location + ' miles</span></li>';
                        })
                        html += '</ul></div></div>';
                    })

                    $('.nearby-place-wrapper').append(html);
                }

            },
            error: function (xhr, status, error) {
                // Handle the registration error response
                console.log(error);
                $('.nearby-place-wrapper').append('<p>No nearby places</p>');
            },
        })
    }

    $(document).ready(function () {
        nearby_places_variables.map_service == 'map-box' && getNearbyPlacesMapBox();
    })
})(jQuery);