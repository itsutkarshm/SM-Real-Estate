var compare = compare || {};
(function ($) {
    'use strict';
    if (typeof compare_variables !== "undefined") {
		var ajax_url = compare_variables.ajax_url,
			compare_button_url = compare_variables.compare_button_url,
			alert_message = compare_variables.alert_message,
			alert_not_found = compare_variables.alert_not_found,
			compare_listings = $('#tfre-compare-listings'),
			item = $('.tfre-compare-property', '#tfre-compare-properties-listings').length;
	}
    compare = {
        init: function () {
            this.tfre_register_event_compare();
			this.tfre_compare_property();
			this.tfre_open_compare();
			this.tfre_close_compare();
			this.tfre_compare_listing();
            this.tfre_compare_redirect();
			this.tfre_check_show_compare_listing();
        },
        tfre_register_event_compare: function () {
			$(document).on('click','a.tfre-compare-property', function (e) {
				if (!$(this).hasClass('on-handle')) {
					var item = $('.tfre-compare-property', '#tfre-compare-properties-listings').length;
					e.preventDefault();
					var $this = $(this).addClass('on-handle'),
						property_inner = $this.closest('.property-inner').addClass('property-active-hover'),
						property_id = $this.data('property-id');
					$('.tfre-listing-btn').removeClass('d-none');
					var count_item = $('.tfre-compare-property', '#tfre-compare-properties-listings').length;
					if (count_item == 4) {
						if ($this.children().hasClass('plus')) {
							item--;
							$this.find('i.fa-minus').removeClass('fa-minus').addClass('fa-spinner fa-spin');
						}
						else {
                            alert(alert_message);
						}
					}
					else {
						if (!($this.children().hasClass('plus'))) {
							item++;
							$this.find('i.fa-plus').removeClass('fa-plus').addClass('fa-spinner fa-spin minus');
						}
						else {
							item--;
							$this.find('i.fa-minus').removeClass('fa-minus').addClass('fa-spinner fa-spin');
						}
					}
					$.ajax ({
						url: ajax_url,
						method: 'post',
						data: {
							action: 'tfre_compare_add_remove_property_ajax',
							property_id: property_id
						},
						success: function (html) {
							if (($this.children().hasClass('minus'))) {
								$this.find('i.minus').removeClass('fa-spinner fa-spin minus').addClass('fa-minus plus');
								$this.addClass('active');
							} else {
								$this.find('i.fa-spinner').removeClass('fa-spinner fa-spin plus').addClass('fa-plus');
								$this.removeClass('active');
							}
							$('div#tfre-compare-properties-listings').replaceWith(html);
							compare.tfre_compare_listing();
							if (item == 0) {
								$('.tfre-listing-btn').addClass('hidden');
								compare.tfre_close_compare();
								compare.tfre_check_show_compare_listing();
							} else {
								compare.tfre_open_compare();
								compare.tfre_check_show_compare_listing();
							}
							$this.removeClass('on-handle');
							property_inner.removeClass('property-active-hover');
						}
					});
				}
			});
		},
        tfre_compare_listing: function () {
            $('.tfre-listing-btn').off('click').on('click', function () {
				var compare_listings = $('#tfre-compare-listings');
				if (compare_listings.hasClass('listing-open')) {
					compare_listings.removeClass('listing-open');
					$('.tfre-listing-btn').find('i.fa-angle-right').removeClass('fa-angle-right').addClass('fa-angle-left');
				} else {
					compare_listings.addClass('listing-open');
					$('.tfre-listing-btn').find('i.fa-angle-left').removeClass('fa-angle-left').addClass('fa-angle-right');
				}
			});
        },
        tfre_close_compare: function () {
			var compare_listings = $('#tfre-compare-listings');
			if (compare_listings.hasClass('listing-open')) {
				compare_listings.removeClass('listing-open');
				$('.tfre-listing-btn').find('i.fa-angle-right').removeClass('fa-angle-right').addClass('fa-angle-left');
			}
        },
        tfre_open_compare: function () {
			var compare_listings = $('#tfre-compare-listings');
			compare_listings.addClass('listing-open');
			if($('.tfre-listing-btn').find('i.fa-angle-left').length > 0 ){
				$('.tfre-listing-btn').find('i.fa-angle-left').removeClass('fa-angle-left').addClass('fa-angle-right');
			}
			
        },
        tfre_compare_property: function () {
			if (compare_listings) {
				$('div.tfre-compare-property').each(function () {
					var property_id = $(this).attr('data-property-id'),
						property = $("a[data-property-id='" + property_id + "']");
					$('i.fa-plus', property).removeClass('fa-plus').addClass('fa-minus plus');
					$('i.plus', property).parent().addClass('active')
				});
                
				compare.tfre_compare_listing();
				if ($('.tfre-compare-property').length > 0) {
					compare.tfre_register_event_compare();
					var $handle = true;
					$(document).on('click', '#tfre-compare-properties-listings .compare-property-remove', function (e) {
						var item = $('.tfre-compare-property', '#tfre-compare-properties-listings').length;
						e.preventDefault();
						if($handle) {
							$handle = false;
							var $this = $(this),
								property_id = $this.parent().attr('data-property-id'),
								property = $("a[data-property-id='" + property_id + "']");
							$this.parent().addClass('remove');
							$('i.plus', property).removeClass('fa-minus plus').addClass('fa-plus');

							item--;
							if (item == 0) {
								$('#tfre-compare-properties-listings').addClass('d-none');
								$('.tfre-listing-btn').addClass('d-none');
								compare.tfre_check_show_compare_listing();
								compare.tfre_close_compare();
							}
							$.ajax({
								url: ajax_url,
								method: 'post',
								data: {
									action: 'tfre_compare_add_remove_property_ajax',
									property_id: property_id
								},
								success: function (html) {
									$('div#tfre-compare-properties-listings').replaceWith(html);
									compare.tfre_compare_listing();
									if (item == 0) {
										$('.tfre-listing-btn').addClass('d-none');
										compare.tfre_close_compare();
									} else {
										compare.tfre_open_compare();
									}
									$handle = true;
								},
								error: function () {
									$handle = true;
								}
							});
						}
					});

					
				}
			}
		},
		tfre_compare_redirect: function () {
			// Go to Page Compare
			$(document).on('click', '.tfre-compare-properties-button', function () {
				if (compare_button_url != "") {
					window.location.href = compare_button_url;
				} else {
					alert(alert_not_found);
				}
				return false;
			});
		},
		tfre_check_show_compare_listing: function (){
			var item = $('.tfre-compare-property', '#tfre-compare-properties-listings').length;
			var compare_listing_wrap =  $('#compare_listing_wrap');
			if( item == 0){
				compare_listing_wrap.addClass('compare-listing-hidden');
			}else{
				compare_listing_wrap.removeClass('compare-listing-hidden');
			}
		}
    };
    $(document).ready(function () {
        compare.init();
    });
})(jQuery);