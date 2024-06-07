(function ($) {
    var hexToRGB = function (hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        return alpha ? "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")" : "rgb(" + r + ", " + g + ", " + b + ")";
    }

    var initChartAjax = function () {
        var $this = $('#insight-chart');
        var ctx = $this.get(0);
        themePrimaryColor = $(":root").css('--theme-primary-color');
        if (!themePrimaryColor) {
            themePrimaryColor = '#FFA920';
        }
        var filterChartValueSessionStorage = sessionStorage.getItem('FILTER_CHART_VALUE');
        trackingViewDay = filterChartValueSessionStorage ? filterChartValueSessionStorage : 7;
        if (ctx != null) {
            $.ajax({
                url: dashboard_variables.ajax_url,
                type: 'post',
                dataType: 'json',
                data: {
                    action: 'dashboard_insight_chart_ajax',
                    nonce: dashboard_variables.nonce,
                    tracking_view_day: trackingViewDay
                },
                success: function (res) {
                    setTimeout(() => {
                        ctx = ctx.getContext('2d');
                        window['gradient'] = ctx.createLinearGradient(0, 0, 0, 300);
                        window['gradient'].addColorStop(0, hexToRGB(themePrimaryColor, '0.33'));
                        window['gradient'].addColorStop(0.5, hexToRGB(themePrimaryColor, '0.15'));
                        window['gradient'].addColorStop(1, hexToRGB(themePrimaryColor, '0'));
                        var chartConfig = {
                            type: res.chart_type,
                            data: {
                                labels: res.chart_labels,
                                datasets: [{
                                    label: res.chart_label,
                                    data: res.chart_data,
                                    pointBackgroundColor: themePrimaryColor,
                                    pointBorderColor: '#fff',
                                    pointBorderWidth: 4,
                                    pointRadius: 6,
                                    backgroundColor: window['gradient'],
                                    borderColor: hexToRGB(themePrimaryColor, '1'),
                                    borderWidth: 2,
                                    fill: true,
                                    tension: 0,
                                }]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                },
                                //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
                                scaleBeginAtZero: true,
                                //Boolean - Whether grid lines are shown across the chart
                                scaleShowGridLines: false,
                                //String - Colour of the grid lines
                                scaleGridLineColor: "rgba(0,0,0,.05)",
                                //Number - Width of the grid lines
                                scaleGridLineWidth: 1,
                                //Boolean - Whether to show horizontal lines (except X axis)
                                scaleShowHorizontalLines: true,
                                //Boolean - Whether to show vertical lines (except Y axis)
                                scaleShowVerticalLines: true,
                                //Boolean - If there is a stroke on each bar
                                barShowStroke: false,
                                //Number - Pixel width of the bar stroke
                                barStrokeWidth: 2,
                                //Number - Spacing between each of the X value sets
                                barValueSpacing: 5,
                                //Number - Spacing between data sets within X values
                                barDatasetSpacing: 1,
                                legend: { display: false },
                                tooltips: {
                                    enabled: true,
                                    mode: 'x-axis',
                                    cornerRadius: 4
                                },
                            }
                        };
                        if (typeof (chart) !== 'undefined') {
                            chart.destroy();
                        }
                        // Create the chart
                        chart = new Chart(ctx, chartConfig);
                    }, 200);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    }

    var onChangeFilterDashboardChart = function () {
        var btnFilterChart = document.querySelectorAll(".tfre-page-insight-filter .tfre-page-insight-filter-button .btn-filter-chart");
        btnFilterChart.forEach(element => {
            var filterValueElement = element.getAttribute('data-value');
            var filterChartValueSessionStorage = sessionStorage.getItem('FILTER_CHART_VALUE');
            filterChartValueSessionStorage = filterChartValueSessionStorage ? filterChartValueSessionStorage : 7;
            if (filterValueElement == filterChartValueSessionStorage) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }

    var onClickFilterDashboardChart = function () {
        var $this = $('#insight-chart');
        if ($this.length <= 0) {
            return;
        }
        $('.tfre-page-insight-filter .tfre-page-insight-filter-button .btn-filter-chart').on('click', function (event) {
            event.preventDefault();
            var filterValue = $(this).data('value');
            sessionStorage.setItem('FILTER_CHART_VALUE', filterValue);
            onChangeFilterDashboardChart();
            initChartAjax();
        });
    }

    var onChangeSearchProperty = function () {
        $('#title_search').on('change', function () {
            var searchTerm = $(this).val();
            var newURL = replaceUrlParam(window.location.href, 'title_search', searchTerm)
            window.location.href = newURL;
        });
    }

    var onChangeFromDateProperty = function () {
        $('#from-date').on('change', function () {


            var fromDate = $(this).val();
            var newURL = replaceUrlParam(window.location.href, 'from_date', fromDate)
            window.location.href = newURL;
        });
    }

    var onChangeToDateProperty = function () {
        $('#to-date').on('change', function () {


            var toDate = $(this).val();
            var newURL = replaceUrlParam(window.location.href, 'to_date', toDate)
            window.location.href = newURL;
        });
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

    var actionProperty = function () {
        $('.tfre-dashboard-action-delete, .tfre-dashboard-action-sold').on('click', function (event) {
            event.preventDefault();
            var $this = $(this);
            var property_id = $this.attr('data-property-id');
            var action = $this.attr('data-action');
            var confirmed = confirm(dashboard_variables.confirm_action_property_text + action + '?');
            if (confirmed) {
                $.ajax({
                    type: 'post',
                    url: dashboard_variables.ajax_url,
                    dataType: 'json',
                    data: {
                        'action': 'action_property_dashboard',
                        'property_action': action,
                        'property_id': property_id,
                        'security': dashboard_variables.nonce
                    },
                    success: function (response) {
                        if (response.status) {
                            setTimeout(() => {
                                window.location.reload();
                            }, 500);
                        }
                    },
                    error: function (xhr, status, error) {
                        // Handle the registration error response
                        console.log(error);
                    }
                });
            }
        });
    }

    jQuery(document).ready(function ($) {
        initChartAjax();
        onChangeFilterDashboardChart();
        onClickFilterDashboardChart();
        onChangeSearchProperty();
        onChangeFromDateProperty();
        onChangeToDateProperty();
        actionProperty();
    });
})(jQuery);