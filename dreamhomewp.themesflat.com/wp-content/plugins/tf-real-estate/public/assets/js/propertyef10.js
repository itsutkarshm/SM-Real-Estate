(function ($) {
    'use strict';
    var plupload_gallery, plupload_attachment, plupload_virtual_360 = null;
    var floor_img_plupload = {};

    if (document.getElementById('map') && property_variables.map_service == 'google-map') {
        var geocoder = new google.maps.Geocoder();
    }

    if (document.getElementById('map') && property_variables.map_service == 'map-box') {
        var geoData = {
            "type": "FeatureCollection",
            "features": []
        };
        mapboxgl.accessToken = property_variables.api_key_map_box ? property_variables.api_key_map_box : 'pk.eyJ1IjoidGhlbWVzZmxhdCIsImEiOiJjbGt3NGxtYncwa2F2M21saHM3M21uM3h2In0.9NbzjykXil1nELxQ1V8rkA';
    }

    var propertyGalleryImages = function () {
        /* initialize plupload */
        plupload_gallery = new plupload.Uploader({
            browse_button: 'tfre_choose_gallery_images',
            file_data_name: 'image_file_name',
            container: 'tfre_gallery_plupload_container',
            drop_element: 'tfre_gallery_plupload_container',
            multi_selection: true,
            url: property_variables.ajax_url_upload_gallery,
            filters: {
                mime_types: [
                    { title: property_variables.file_type_title, extensions: property_variables.image_file_type }
                ],
                max_file_size: property_variables.image_max_file_size,
                prevent_duplicates: true
            }
        });
        plupload_gallery.init();

        plupload_gallery.bind('FilesAdded', function (up, files) {
            var propertyGallery = "";
            var maxfiles = property_variables.max_property_images;
            var totalFiles = $('#tfre_property_gallery_container').find('.__thumb').length + up.files.length;
            if (totalFiles > maxfiles) {
                $.each(files, function (i, file) {
                    up.removeFile(file);
                });
                alert('Only upload max ' + maxfiles + ' file(s)');
                return;
            }
            plupload.each(files, function (file) {
                propertyGallery += '<div id="img-' + file.id + '" class="col-sm-2 media-gallery-wrap"></div>';
            });
            document.getElementById('tfre_property_gallery_container').innerHTML += propertyGallery;
            up.refresh();
            up.start();
        });

        plupload_gallery.bind('UploadProgress', function (up, file) {
            document.getElementById("img-" + file.id).innerHTML = '<span><i class="fa fa-spinner fa-spin"></i></span>';
        });

        plupload_gallery.bind('Error', function (up, err) {
            document.getElementById('tfre_gallery_errors').innerHTML += "<br/>" + "Error #" + err.code + ": " + err.message;
        });

        plupload_gallery.bind('FileUploaded', function (up, file, ajax_response) {
            var response = $.parseJSON(ajax_response.response);

            if (response.success) {
                var $html =
                    '<figure class="media-thumb">' +
                    '<img loading="lazy" src="' + response.url + '"/>' +
                    '<div class="media-item-actions">' +
                    '<a class="icon icon-delete" data-property-id="0"  data-img-id="' + response.attachment_id + '" href="javascript:;" ><i class="fa fa-times"></i></a>' +
                    '<input type="hidden" class="gallery_images" name="gallery_images[]" value="' + response.attachment_id + '"/>' +
                    '<span style="display: none;" class="icon icon-loader"><i class="fa fa-spinner fa-spin"></i></span>' +
                    '</div>' +
                    '</figure>';

                document.getElementById("img-" + file.id).innerHTML = $html;

                propertyGalleryImagesEvent();
            }
        });
    };

    var propertyGalleryImagesEvent = function () {
        // Delete Image
        $('.icon-delete', '.tfre-property-gallery').off('click').on('click', function () {
            var $this = $(this),
                $wrap = $this.closest('.media-gallery-wrap'),
                file_id = $wrap.attr('id'),
                icon_delete = $this.children('i'),
                thumbnail = $this.closest('.media-gallery-wrap'),
                property_id = $this.data('property-id'),
                img_id = $this.data('img-id');
            if (typeof file_id !== typeof undefined && file_id !== false) {
                file_id = file_id.replace('img-', '');
            }

            icon_delete.addClass('fa-spinner fa-spin');
            $.ajax({
                type: 'post',
                url: property_variables.ajax_url,
                dataType: 'json',
                data: {
                    'action': 'delete_img_or_file',
                    'property_id': property_id,
                    'attachment_id': img_id,
                    'type': 'image',
                    'deleteNonce': property_variables.upload_nonce
                },
                success: function (response) {
                    if (response.success) {
                        thumbnail.remove();
                        thumbnail.hide();
                        if ((plupload_gallery)
                            && (typeof file_id !== typeof undefined && file_id !== false)) {
                            for (var i = 0; i < plupload_gallery.files.length; i++) {
                                if (plupload_gallery.files[i].id == file_id) {
                                    plupload_gallery.removeFile(plupload_gallery.files[i]);
                                    break;
                                }
                            }
                        }
                    }
                    icon_delete.removeClass('fa-spinner fa-spin');
                },
                error: function () {
                    icon_delete.removeClass('fa-spinner fa-spin');
                }
            });
        });
    };

    var propertyFileAttachments = function () {
        /* initialize plupload */
        plupload_attachment = new plupload.Uploader({
            browse_button: 'tfre_choose_attachment_files',
            file_data_name: 'file_attachments_name',
            container: 'tfre_attachment_plupload_container',
            drop_element: 'tfre_attachment_plupload_container',
            multi_selection: true,
            url: property_variables.ajax_url_upload_file_attachment,
            filters: {
                mime_types: [
                    { title: property_variables.file_type_title, extensions: property_variables.attachment_file_type }
                ],
                max_file_size: property_variables.attachment_max_file_size,
                prevent_duplicates: true
            }
        });
        plupload_attachment.init();

        plupload_attachment.bind('FilesAdded', function (up, files) {
            var propertyAttachment = "";
            var maxfiles = property_variables.max_property_attachments;
            var totalFiles = $('#tfre_property_attachment_container').find('.__thumb').length + up.files.length;
            if (totalFiles > maxfiles) {
                $.each(files, function (i, file) {
                    up.removeFile(file);
                });
                alert('Only upload max ' + maxfiles + ' file(s)');
                return;
            }
            plupload.each(files, function (file) {
                propertyAttachment += '<div id="file-' + file.id + '" class="col-sm-2 file-attachment-wrap"></div>';
            });
            document.getElementById('tfre_property_attachment_container').innerHTML += propertyAttachment;
            up.refresh();
            up.start();
        });

        plupload_attachment.bind('UploadProgress', function (up, file) {
            document.getElementById("file-" + file.id).innerHTML = '<span><i class="fa fa-spinner fa-spin"></i></span>';
        });

        plupload_attachment.bind('Error', function (up, err) {
            document.getElementById('tfre_attachment_errors').innerHTML += "<br/>" + "Error #" + err.code + ": " + err.message;
        });

        plupload_attachment.bind('FileUploaded', function (up, file, ajax_response) {
            var response = $.parseJSON(ajax_response.response);
            var fileType = response.file_name.split('.');
            var thumbUrl = property_variables.plugin_url + 'public/assets/image/attachment/attach-' + fileType[1] + '.png';
            if (response.success) {
                var $html =
                    '<div class="file-attachment-wrap __thumb">' +
                    '<figure class="attachment-file">' +
                    '<img loading="lazy" src="' + thumbUrl + '"/>' +
                    '<a href="' + response.url + '">' + response.file_name + '</a>' +
                    '<div class="media-item-actions">' +
                    '<a class="icon icon-delete" data-property-id="0"  data-attachment-id="' + response.attachment_id + '" href="javascript:;" ><i class="fa fa-times"></i></a>' +
                    '<input type="hidden" class="attachments_file" name="attachments_file[]" value="' + response.attachment_id + '"/>' +
                    '<span style="display: none;" class="icon icon-loader"><i class="fa fa-spinner fa-spin"></i></span>' +
                    '</div>' +
                    '</figure>' +
                    '</div>';

                document.getElementById("file-" + file.id).innerHTML = $html;
                propertyFileAttachmentsEvent();
            }
        });
    };

    var propertyFileAttachmentsEvent = function () {
        // Delete Image
        $('.icon-delete', '.tfre-property-attachment').off('click').on('click', function () {
            var $this = $(this),
                $wrap = $this.closest('.file-attachment-wrap'),
                file_id = $wrap.attr('id'),
                icon_delete = $this.children('i'),
                thumbnail = $this.closest('.file-attachment-wrap'),
                property_id = $this.data('property-id'),
                attachment_id = $this.data('attachment-id');
            if (typeof file_id !== typeof undefined && file_id !== false) {
                file_id = file_id.replace('file-', '');
            }

            icon_delete.addClass('fa-spinner fa-spin');
            $.ajax({
                type: 'post',
                url: property_variables.ajax_url,
                dataType: 'json',
                data: {
                    'action': 'delete_img_or_file',
                    'property_id': property_id,
                    'attachment_id': attachment_id,
                    'type': 'attachment',
                    'deleteNonce': property_variables.upload_nonce
                },
                success: function (response) {
                    if (response.success) {
                        thumbnail.remove();
                        thumbnail.hide();
                        if ((plupload_attachment)
                            && (typeof file_id !== typeof undefined && file_id !== false)) {
                            for (var i = 0; i < plupload_attachment.files.length; i++) {
                                if (plupload_attachment.files[i].id == file_id) {
                                    plupload_attachment.removeFile(plupload_attachment.files[i]);
                                    break;
                                }
                            }
                        }
                    }
                    icon_delete.removeClass('fa-spinner fa-spin');
                },
                error: function () {
                    icon_delete.removeClass('fa-spinner fa-spin');
                }
            });
        });
    };

    var propertyVirtual360 = function () {
        var plupload_virtual_360 = new plupload.Uploader({
            browse_button: 'tfre_choose_image_360',
            file_data_name: 'image_file_name',
            container: 'tfre_virtual_360_plupload_container',
            drop_element: 'tfre_virtual_360_plupload_container',
            multi_selection: true,
            url: property_variables.ajax_url_upload_gallery,
            filters: {
                mime_types: [
                    { title: property_variables.file_type_title, extensions: property_variables.image_file_type }
                ],
                max_file_size: property_variables.image_max_file_size,
                prevent_duplicates: true
            }
        });
        plupload_virtual_360.init();

        plupload_virtual_360.bind('FilesAdded', function (up, files) {
            var propertyImg360 = "";
            var maxfiles = property_variables.max_property_images;
            if (up.files.length > maxfiles) {
                $.each(files, function (i, file) {
                    up.removeFile(file);
                });
                alert('Only upload max ' + maxfiles + ' file(s)');
                return;
            }
            plupload.each(files, function (file) {
                propertyImg360 = '<div id="img-360-' + file.id + '" class="col-sm-2 img-360-wrap"></div>';
            });
            document.getElementById('tfre_property_virtual_360_view').innerHTML = propertyImg360;
            up.refresh();
            up.start();
        });
        plupload_virtual_360.bind('UploadProgress', function (up, file) {
            $('#img-360-' + file.id).html('<span><i class="fa fa-spinner fa-spin"></i></span>');
        });
        plupload_virtual_360.bind('Error', function (up, err) {
            document.getElementById('tfre_virtual_360_errors').innerHTML += "<br/>" + "Error #" + err.code + ": " + err.message;
        });
        plupload_virtual_360.bind('FileUploaded', function (up, file, ajax_response) {
            var response = $.parseJSON(ajax_response.response);
            if (response.success) {

                var plugin_url = $('#tfre_property_virtual_360_view').attr('data-plugin-url');
                var $iframe = '<a class="icon icon-delete" data-property-id="0"  data-img-id="' + response.attachment_id + '" href="javascript:;" ><i class="fa fa-times"></i></a><iframe loading="lazy" width="100%" height="200" scrolling="no" allowfullscreen src="' + plugin_url + 'public/assets/third-party/virtual-360/index.html?image=' + response.full_image + '"></iframe> <input name="virtual_tour_upload_image" type="text" id="image_360_url_' + file.id + '" class="tfre_image_360_url form-control" value="' + response.full_image + '">';

                document.getElementById("img-360-" + file.id).innerHTML = $iframe;
                propertyVirtual360Event();
            }
        });
    }

    var propertyVirtual360Event = function () {
        // Delete Image
        $('.icon-delete', '.tfre-property-virtual-360').off('click').on('click', function () {
            var $this = $(this),
                $wrap = $this.closest('.img-360-wrap'),
                file_id = $wrap.attr('id'),
                icon_delete = $this.children('i'),
                thumbnail = $this.closest('.img-360-wrap'),
                property_id = $this.data('property-id'),
                img_id = $this.data('img-id');
            if (typeof file_id !== typeof undefined && file_id !== false) {
                file_id = file_id.replace('img-360-', '');
            }

            icon_delete.addClass('fa-spinner fa-spin');
            $.ajax({
                type: 'post',
                url: property_variables.ajax_url,
                dataType: 'json',
                data: {
                    'action': 'delete_img_or_file',
                    'property_id': property_id,
                    'attachment_id': img_id,
                    'type': 'image',
                    'deleteNonce': property_variables.upload_nonce
                },
                success: function (response) {
                    if (response.success) {
                        thumbnail.remove();
                        thumbnail.hide();
                        if ((plupload_virtual_360)
                            && (typeof file_id !== typeof undefined && file_id !== false)) {
                            for (var i = 0; i < plupload_virtual_360.files.length; i++) {
                                if (plupload_virtual_360.files[i].id == file_id) {
                                    plupload_virtual_360.removeFile(plupload_virtual_360.files[i]);
                                    break;
                                }
                            }
                        }
                    }
                    icon_delete.removeClass('fa-spinner fa-spin');
                },
                error: function () {
                    icon_delete.removeClass('fa-spinner fa-spin');
                }
            });
        });
    };

    var addNewFloorsPlan = function () {
        $('#add-floors-row').on('click', function (event) {
            event.preventDefault();
            var row_index = $(this).data("floor-latest") + 1;
            $(this).data('floor-latest', row_index);
            $(this).attr({
                "data-floor-latest": row_index
            });

            var new_floor =
                '<tr>' +
                '<td>' +
                '<div class="row">' +
                '<div class="col-sm-6">' +
                '<div class="form-group">' +
                '<label for="floor_name_' + row_index + '">' + property_variables.floor_name_text + '</label>' +
                '<input name="floors_plan[' + row_index + '][floor_name]" type="text" id="floor_name_' + row_index + '" class="form-control">' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="form-group">' +
                '<label for="floor_price_' + row_index + '">' + property_variables.floor_price_text + '</label>' +
                '<input name="floors_plan[' + row_index + '][floor_price]" type="number" id="floor_price_' + row_index + '" class="form-control">' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="form-group">' +
                '<label for="floor_price_postfix_' + row_index + '">' + property_variables.floor_price_postfix_text + '</label>' +
                '<input name="floors_plan[' + row_index + '][floor_price_postfix]" type="text" id="floor_price_postfix_' + row_index + '" class="form-control">' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="form-group">' +
                '<label for="floor_size_' + row_index + '">' + property_variables.floor_size_text + '</label>' +
                '<input name="floors_plan[' + row_index + '][floor_size]" type="number" id="floor_size_' + row_index + '" class="form-control">' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="form-group">' +
                '<label for="floor_size_postfix_' + row_index + '">' + property_variables.floor_size_postfix_text + '</label>' +
                '<input name="floors_plan[' + row_index + '][floor_size_postfix]" type="text" id="floor_size_postfix_' + row_index + '" class="form-control">' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="form-group">' +
                '<label for="floor_bedrooms_' + row_index + '">' + property_variables.floor_bedrooms_text + '</label>' +
                '<input name="floors_plan[' + row_index + '][floor_bedrooms]" type="number" id="floor_bedrooms_' + row_index + '" class="form-control">' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="form-group">' +
                '<label for="floor_bathrooms_' + row_index + '">' + property_variables.floor_bathrooms_text + '</label>' +
                '<input name="floors_plan[' + row_index + '][floor_bathrooms]" type="number" id="floor_bathrooms_' + row_index + '" class="form-control">' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="form-group">' +
                '<label for="floor_image_url_' + row_index + '">' + property_variables.floor_image_text + '</label>' +
                '<div id="tfre-floor-preview-image-container-' + row_index + '" class="preview-image"></div>' +
                '<div id="tfre-floor-plupload-container-' + row_index + '" class="file-upload-block">' +
                '<input type="text" id="floor_image_url_' + row_index + '" class="tfre_floor_image_url form-control">' +
                '<input name="floors_plan[' + row_index + '][floor_image]" type="hidden" id="floor_image_id_' + row_index + '" class="tfre_floor_image_id">' +
                '<button type="button" data-row-index="' + row_index + '" id="tfre-upload-floor-img-' + row_index + '" title="' + property_variables.floor_upload_text + '" class="tfre-floors-planImg"><i class="fa fa-file-image"></i></button>' +
                '</div>' +
                '<div id="tfre-floor-errors-log"></div>' +
                '</div>' +
                '</div>' +
                '<div class="col-sm-6">' +
                '<div class="form-group">' +
                '<label for="floor_description_' + row_index + '">' + property_variables.floor_description_text + '</label>' +
                '<textarea name="floors_plan[' + row_index + '][floor_description]" rows="4" id="floor_description_' + row_index + '" class="form-control"></textarea>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</td>' +
                '<td class="row-remove">' +
                '<span data-remove="' + row_index + '" class="remove-floors-plan remove"><i class="fa fa-times"></i></span>' +
                '</td>' +
                '</tr>';

            $('#tfre-floors-plan').append(new_floor);
            removeFloorPlan();
            uploadFloorImages(row_index);
        });
    }

    var removeFloorPlan = function () {
        $('.remove-floors-plan').on('click', function (event) {
            event.preventDefault();
            var $this = $(this),
                table = $this.closest('.table'),
                addFloor = table.find('#add-floors-row'),
                floorLatest = parseInt(addFloor.data('floor-latest')) - 1;
            addFloor.data('floor-latest', floorLatest);
            addFloor.attr('data-floor-latest', floorLatest);
            $this.parent('td').parent('tr').remove();
            updateIndexFloor();
        });
    }

    var updateIndexFloor = function () {
        var $i = 0;
        $('tr', '#tfre-floors-plan').each(function () {

            $('label[for*="floor_name_"]', $(this)).attr('for', 'floor_name_' + $i);
            $('input[name*="floor_name"]', $(this)).attr('name', 'floors_plan[' + $i + '][floor_name]');
            $('input[name*="floor_name"]', $(this)).attr('id', 'floor_name_' + $i);

            $('label[for*="floor_price_"]', $(this)).attr('for', 'floor_price_' + $i);
            $('input[name*="floor_price"]', $(this)).attr('name', 'floors_plan[' + $i + '][floor_price]');
            $('input[name*="floor_price"]', $(this)).attr('id', 'floor_price_' + $i);

            $('label[for*="floor_price_postfix_"]', $(this)).attr('for', 'floor_price_postfix_' + $i);
            $('input[name*="floor_price_postfix"]', $(this)).attr('name', 'floors_plan[' + $i + '][floor_price_postfix]');
            $('input[name*="floor_price_postfix"]', $(this)).attr('id', 'floor_price_postfix_' + $i);

            $('label[for*="floor_size_"]', $(this)).attr('for', 'floor_size_' + $i);
            $('input[name*="floor_size"]', $(this)).attr('name', 'floors_plan[' + $i + '][floor_size]');
            $('input[name*="floor_size"]', $(this)).attr('id', 'floor_size_' + $i);

            $('label[for*="floor_size_postfix_"]', $(this)).attr('for', 'floor_size_postfix_' + $i);
            $('input[name*="floor_size_postfix"]', $(this)).attr('name', 'floors_plan[' + $i + '][floor_size_postfix]');
            $('input[name*="floor_size_postfix"]', $(this)).attr('id', 'floor_size_postfix_' + $i);

            $('label[for*="floor_bedrooms_"]', $(this)).attr('for', 'floor_bedrooms_' + $i);
            $('input[name*="floor_bedrooms"]', $(this)).attr('name', 'floors_plan[' + $i + '][floor_bedrooms]');
            $('input[name*="floor_bedrooms"]', $(this)).attr('id', 'floor_bedrooms_' + $i);

            $('label[for*="floor_bathrooms_"]', $(this)).attr('for', 'floor_bathrooms_' + $i);
            $('input[name*="floor_bathrooms"]', $(this)).attr('name', 'floors_plan[' + $i + '][floor_bathrooms]');
            $('input[name*="floor_bathrooms"]', $(this)).attr('id', 'floor_bathrooms_' + $i);

            $('label[for*="floor_image_url_"]', $(this)).attr('for', 'floor_image_url_' + $i);
            $('input[id*="floor_image_url"]', $(this)).attr('id', 'floor_image_url_' + $i);

            $('input[id*="floor_image_id"]', $(this)).attr('name', 'floors_plan[' + $i + '][floor_image]');
            $('input[id*="floor_image_id"]', $(this)).attr('id', 'floor_image_id_' + $i);

            $('label[for*="floor_description_"]', $(this)).attr('for', 'floor_description_' + $i);
            $('input[id*="floor_description"]', $(this)).attr('name', 'floors_plan[' + $i + '][floor_description]');
            $('input[id*="floor_description"]', $(this)).attr('id', 'floor_description_' + $i);
            $i++;
        });
    };

    var uploadFloorImages = function (index) {
        floor_img_plupload['floor' + index] = new plupload.Uploader({
            browse_button: 'tfre-upload-floor-img-' + index,
            file_data_name: 'image_file_name',
            container: 'tfre-floor-plupload-container-' + index,
            url: property_variables.ajax_url_upload_gallery,
            filters: {
                mime_types: [
                    { title: property_variables.file_type_title, extensions: property_variables.image_file_type }
                ],
                max_file_size: property_variables.image_max_file_size,
                prevent_duplicates: true
            }
        });
        floor_img_plupload['floor' + index].init();

        floor_img_plupload['floor' + index].bind('FilesAdded', function (up, files) {
            var floorImage = '';
            var maxfiles = property_variables.max_property_images;
            if (up.files.length > maxfiles) {
                $.each(files, function (i, file) {
                    up.removeFile(file);
                });
                alert('Only upload max ' + maxfiles + ' file(s)');
                return;
            }
            plupload.each(files, function (file) {
                floorImage = '<div id="floor-img-' + file.id + '" class="floor-image-wrap"></div>';
            });
            $('#tfre-floor-preview-image-container-' + index).html(floorImage);
            up.refresh();
            up.start();
        });
        floor_img_plupload['floor' + index].bind('UploadProgress', function (up, file) {
            $('#floor-img-' + file.id).html('<span><i class="fa fa-spinner fa-spin"></i></span>');
        });
        floor_img_plupload['floor' + index].bind('Error', function (up, err) {
            document.getElementById('tfre-floor-errors-log-' + index).innerHTML += "<br/>" + "Error #" + err.code + ": " + err.message;
        });
        floor_img_plupload['floor' + index].bind('FileUploaded', function (up, file, ajax_response) {
            var response = $.parseJSON(ajax_response.response);
            if (response.success) {
                var $html =
                    '<figure class="media-thumb">' +
                    '<img loading="lazy" src="' + response.url + '"/>' +
                    '<a class="icon icon-delete" data-property-id="0"  data-img-id="' + response.attachment_id + '" href="javascript:;" ><i class="fa fa-times"></i></a>' +
                    '<span style="display: none;" class="icon icon-loader"><i class="fa fa-spinner fa-spin"></i></span>' +
                    '</figure>';

                $("#floor-img-" + file.id).html($html);
                $('#tfre-floor-plupload-container-' + index).find('.tfre_floor_image_url').val(response.full_image);
                $('#tfre-floor-plupload-container-' + index).find('.tfre_floor_image_id').val(response.attachment_id);
                floorImageEvent(index)
            }
        });
    };

    var floorImageEvent = function (index) {
        // Delete Image
        $('.icon-delete', '.tfre-property-floors').off('click').on('click', function () {
            var $this = $(this),
                wrapThumbnail = $this.closest('.floor-image-wrap'),
                file_id = wrapThumbnail.attr('id'),
                icon_delete = $this.children('i'),
                property_id = $this.data('property-id'),
                img_id = $this.data('img-id');
            if (typeof file_id !== typeof undefined && file_id !== false) {
                file_id = file_id.replace('floor-img-', '');
            }

            icon_delete.addClass('fa-spinner fa-spin');
            $.ajax({
                type: 'post',
                url: property_variables.ajax_url,
                dataType: 'json',
                data: {
                    'action': 'delete_img_or_file',
                    'property_id': property_id,
                    'attachment_id': img_id,
                    'type': 'image',
                    'deleteNonce': property_variables.upload_nonce
                },
                success: function (response) {
                    if (response.success) {
                        wrapThumbnail.parent().next('.file-upload-block').find('.tfre_floor_image_url').val('');
                        wrapThumbnail.parent().next('.file-upload-block').find('.tfre_floor_image_id').val('');
                        wrapThumbnail.remove();
                        wrapThumbnail.hide();

                        if ((floor_img_plupload['floor' + index])
                            && (typeof file_id !== typeof undefined && file_id !== false)) {
                            for (var i = 0; i < floor_img_plupload['floor' + index].files.length; i++) {
                                if (floor_img_plupload['floor' + index].files[i].id == file_id) {
                                    floor_img_plupload['floor' + index].removeFile(floor_img_plupload['floor' + index].files[i]);
                                    break;
                                }
                            }
                        }
                    }
                    icon_delete.removeClass('fa-spinner fa-spin');
                },
                error: function () {
                    icon_delete.removeClass('fa-spinner fa-spin');
                }
            });
        });
    };

    var toggleEnableFloorsPlan = function () {
        var $this = $('[name="floors_plan_toggle"][checked]', '.tfre-property-enable-floor-plan'),
            table_floor_plan = $this.closest('.tfre-property-enable-floor-plan').next('.tfre-property-floors'),
            enable_value = $this.val();
        if (enable_value == 1) {
            table_floor_plan.slideDown('slow');
        } else if (enable_value == 0) {
            table_floor_plan.slideUp('slow');
        }
        $('input[name="floors_plan_toggle"]', '.tfre-property-enable-floor-plan').each(function () {
            $(this).on('click', function () {
                enable_value = $(this).val();
                if (enable_value == 1) {
                    table_floor_plan.slideDown('slow');
                } else if (enable_value == 0) {
                    table_floor_plan.slideUp('slow');
                }
            });
        });
    }

    var checkEnableAgentInformationOption = function () {
        $(".tfre-other-info-information-option").is(':checked') ? $(".tfre-other-info-information").slideDown('slow') : $(".tfre-other-info-information").slideUp('slow');

        $('input[name="agent_information_options"]').on('change', function () {
            if ($(this).val() == 'other_info') {
                $(".tfre-other-info-information").slideDown('slow');
            }
            else {
                $(".tfre-other-info-information").slideUp('slow');
            }
        });
    }

    var checkVirtual360Option = function () {
        $(".tfre-embedded-code-virtual-360-option").is(':checked') ? $(".tfre-embedded-code-virtual-360").slideDown('slow') : $(".tfre-embedded-code-virtual-360").slideUp('slow');

        $(".tfre-upload-image-virtual-360-option").is(':checked') ? $(".tfre-upload-image-virtual-360").slideDown('slow') : $(".tfre-upload-image-virtual-360").slideUp('slow');

        $('input[name="virtual_tour_type"]').on('change', function () {
            if ($(this).val() == '0') {
                $(".tfre-embedded-code-virtual-360").slideDown('slow');
                $(".tfre-upload-image-virtual-360").slideUp('slow');
            }
            else {
                $(".tfre-upload-image-virtual-360").slideDown('slow');
                $(".tfre-embedded-code-virtual-360").slideUp('slow');
            }
        });

    }

    var checkPriceToCallOnChange = function () {
        if ($('input[name="property_price_to_call"]').is(':checked')) {
            $('input[name="property_price_value"]').attr('disabled', 'disabled');
            $('select[name="property_price_unit"]').attr('disabled', 'disabled');
            $('input[name="property_price_prefix"]').attr('disabled', 'disabled');
            $('input[name="property_price_postfix"]').attr('disabled', 'disabled');
        }
        else {
            $('input[name="property_price_value"]').removeAttr('disabled');
            $('select[name="property_price_unit"]').removeAttr('disabled');
            $('input[name="property_price_prefix"]').removeAttr('disabled');
            $('input[name="property_price_postfix"]').removeAttr('disabled');
        }
        $('input[name="property_price_to_call"]').on('change', function () {
            checkPriceToCallOnChange();
        });
    }

    var handleSavePropertyAjax = function () {
        $('#submit_property_form').submit(function (event) {
            event.preventDefault();
            var form = $(this);
            var formData = form.serialize();
            if (form.valid()) {
                $.ajax({
                    type: 'POST',
                    url: property_variables.ajax_url,
                    data: formData + '&action=save_property&nonce=' + property_variables.save_property_nonce,
                    beforeSend: function () {
                        form.find('.tfre_message').empty().append('<i class="fa fa-spinner fa-spin"></i>');
                    },
                    success: function (response) {
                        // Handle the registration success response

                        if (response.status) {
                            window.location.href = response.redirect_url + '?new_property_id=' + response.property_id + '&submit_mode=' + response.submit_mode;
                        } else {
                            form.find('.tfre_message').empty().append('<span class="error text-danger"><i class="fa fa-close"></i> ' + response.message + '</span>');
                        }
                    },
                    error: function (xhr, status, error) {
                        // Handle the registration error response
                        console.log(error);
                    }
                });
                $('#submit_property_form').find('.tfre_message').empty();
            }
            else {
                $('#submit_property_form').find('.tfre_message').empty().append('<div class="tfre-message alert alert-danger" role="alert"><span class="error text-danger"><i class="fa fa-times-circle"></i> ' + property_variables.form_invalid_message + '</span></div>');
            }
            return false;
        })
    }

    var favorite = function () {
        $('.tfre-property-favorite').on('click', function (event) {
            event.preventDefault();
            var $messages = $('.tfre_message');
            if (!$(this).hasClass('on-handle')) {
                var $this = $(this).addClass('on-handle'),
                    property_id = $this.attr('data-tfre-data-property-id'),
                    title_not_favorite = $this.attr('data-tfre-data-title-not-favorite'),
                    icon_not_favorite = $this.attr('data-tfre-data-icon-not-favorite'),
                    title_favorited = $this.attr('data-tfre-data-title-favorited'),
                    icon_favorited = $this.attr('data-tfre-data-icon-favorited');
                $.ajax({
                    type: 'post',
                    url: property_variables.ajax_url,
                    dataType: 'json',
                    data: {
                        'action': 'tfre_favorite_ajax',
                        'property_id': property_id
                    },
                    beforeSend: function () {
                        $this.children('i').removeClass(icon_not_favorite).addClass('far fa-spinner fa-spin');
                    },
                    success: function (response) {
                        if ((typeof (response.added) == 'undefined') || (response.added == -1)) {
                            alert(response.message);
                            $this.children('i').addClass(icon_not_favorite);
                        }
                        if (response.added == 1) {
                            $this.children('i').removeClass(icon_not_favorite).addClass(icon_favorited);
                            $this.attr('data-tooltip', title_favorited);
                            $this.addClass('active');
                        } else if (response.added == 0) {
                            $this.children('i').removeClass(icon_favorited).addClass(icon_not_favorite);
                            $this.attr('data-tooltip', title_not_favorite);
                            $this.removeClass('active');
                        } else if (response.added == -1) {
                            alert(response.message);
                            $this.children('i').addClass(icon_not_favorite);
                        }
                        $this.children('i').removeClass('fa-spinner fa-spin');
                        $this.removeClass('on-handle');
                    },
                    error: function () {
                        $this.children('i').removeClass('fa-spinner fa-spin');
                        $this.removeClass('on-handle');
                    }
                });
            }
        });
    }

    var removeFavorite = function () {
        $('.tfre-favorite-remove').on('click', function (event) {
            event.preventDefault();
            var $messages = $('.tfre_message');
            var confirmed = confirm(property_variables.confirm_remove_property_favorite);
            if (!$(this).hasClass('on-handle') && confirmed) {
                var $this = $(this).addClass('on-handle'),
                    property_id = $this.attr('data-tfre-data-property-id');
                $.ajax({
                    type: 'post',
                    url: property_variables.ajax_url,
                    dataType: 'json',
                    data: {
                        'action': 'tfre_favorite_ajax',
                        'property_id': property_id
                    },
                    beforeSend: function () {
                        $this.children('i').addClass('fa-spinner fa-spin');
                    },
                    success: function (response) {
                        if ((typeof (response.added) == 'undefined') || response.added == -1) {
                            $messages.empty().append('<span class="error text-danger"><i class="fa fa-close"></i> ' + response.message + '</span>');
                        } else {
                            $this.parent('td').parent('tr').remove();
                            var row_data_length = $('#tfre_my_favorite > tbody >  tr').length
                            if (row_data_length == 0) {
                                resetToPreviousPage();
                            }
                        }
                    },
                    error: function () {
                        $this.children('i').removeClass('fa-spinner fa-spin');
                        $this.removeClass('on-handle');
                    }
                });
            }
        });
    }

    var resetToPreviousPage = function () {
        var currentUrl = window.location.href;
        var regex = /page\/(\d+)/;
        var matches = currentUrl.match(regex);
        var pageValue = matches ? matches[1] : null;
        if (pageValue == 2) {
            var newUrl = currentUrl.replace(/\/page\/(\d+)/, '');
            window.location.href = newUrl;
        } else if (pageValue > 2) {
            var previous_page = pageValue - 1;
            var newUrl = currentUrl.replace(/\/page\/([^\/]+)/, "/page/" + previous_page);
            window.location.href = newUrl;
        } else {
            window.location.reload();
        }
    }

    var closePreviousInfoWindow = function (infoObj) {
        if (infoObj.length > 0) {
            infoObj[0].set("marker", null);
            infoObj[0].close();
            infoObj.length = 0;
        }
    }

    var makeInfoWindowEvent = function (map, infoWindow, marker, infoObj = []) {
        closePreviousInfoWindow(infoObj);
        infoWindow.open(map, marker);
        infoObj[0] = infoWindow;
        google.maps.event.addListener(map, 'click', function () {
            if (infoWindow) {
                infoWindow.close();
            }
        });
    }

    var clickMarkerEvent = function (map, infoWindow, marker, infoObj = []) {
        google.maps.event.addListener(marker, 'click', function () {
            makeInfoWindowEvent(map, infoWindow, marker, infoObj);
        });
    }

    var mouseoverPropertyGoogleMap = function (map, infoWindow, marker, infoObj = [], propertyId) {
        $('.property-inner').on('mouseover', function () {
            if ($(this).find('.card-image .tfre-image-map').attr('data-id') == propertyId) {
                makeInfoWindowEvent(map, infoWindow, marker, infoObj);
            }
        });
    }

    var mouseoverPropertyMapBox = function (map, geoData) {
        $('.property-inner').on('mouseover', function () {
            for (const feature of geoData.features) {
                if ($(this).find('.card-image .tfre-image-map').attr('data-id') == feature.properties.property_id) {
                    jumpToProperty(map, feature);
                    createPopupMap(map, feature);
                }
            }
        });
    }

    var getMarkers = function (res, attribute) {
        return {
            "type": "Feature",
            "properties": {
                "id": res.id,
                "title": attribute['title'],
                "location": attribute['data-location'],
                "image": attribute['data-image'],
                "price": attribute['data-price'],
                "price_prefix": attribute['data-price-prefix'],
                "price_postfix": attribute['data-price-postfix'],
                "property_id": attribute['data-id']
            },
            "geometry": {
                "type": "Point",
                "coordinates": res.center
            }
        }
    }

    var createPopupMap = function (map, currentProperty) {
        var popupHtml = '<div class="pop-up-map">'
            + '<div class = "popup-content"> '
            + '<div class="popup-thumb"><img loading="lazy" src="' + currentProperty.properties.image + '" alt="' + currentProperty.properties.title + '"></div>'
            + '<div class="pop-main-content">'
            + '<div class="popup-title">' + currentProperty.properties.title + '</div>'
            + '<div class="popup-address">' + currentProperty.properties.location + '</div>'
            + '<div class="popup-price">' + currentProperty.properties.price_prefix + currentProperty.properties.price + currentProperty.properties.price_postfix + '</div>'
            + '</div>'
            + '</div>'
            + '</div>';

        const popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();
        new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: true,
            offset: 5,
            focusAfterOpen: false,
        }).setLngLat(currentProperty.geometry.coordinates).setHTML(popupHtml).addTo(map);
    }

    var jumpToProperty = function (map, currentProperty) {
        map.jumpTo({
            center: currentProperty.geometry.coordinates,
            zoom: property_variables.map_zoom,
            pitch: 0,
            bearing: 0,
            essential: true,
            duration: 3000,
            speed: 1,
        });
    }

    var listingPropertiesInMap = function () {
        var attributesArray = [];
        var elements = document.querySelectorAll('[data-id]');

        elements.forEach(function (element) {
            var attributes = element.attributes;
            var attributeObject = {};
            for (var i = 0; i < attributes.length; i++) {
                var attributeName = attributes[i].name;
                var attributeValue = attributes[i].value;
                attributeObject[attributeName] = attributeValue;
            }
            attributesArray.push(attributeObject);
        });

        const delay = 100;

        if (document.getElementById('map') && property_variables.map_service == 'google-map') {
            var mapOptions = {
                center: new google.maps.LatLng(16.076305, 108.221548),
                zoom: parseInt(property_variables.map_zoom),
            };
            var map = new google.maps.Map(document.getElementById('map'), mapOptions);
            var infoObj = [];
            var markers = [];
            var markerClusterOptions = {
                gridSize: 40,
                maxZoom: 15,
                styles: [{
                    width: 50,
                    height: 50,
                    url: 'data:image/svg+xml;base64,' + window.btoa('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path fill="#FFA920" stroke="#FFA920" stroke-width="10" stroke-opacity="0.25" d="M15,5c5.524,0,10,4.478,10,10s-4.478,10-10,10S5,20.522,5,15S9.478,5,15,5z"/></svg>'),
                    textColor: '#000',
                    textSize: 12
                }]
            };
        }

        attributesArray.forEach(function (attribute) {
            if (attribute['data-location']) {

                setTimeout(function () {
                    if (document.getElementById('map') && property_variables.map_service == 'map-box') {
                        $.ajax({
                            type: "GET",
                            url: "https://api.mapbox.com/geocoding/v5/mapbox.places/" + attribute['data-location'] + ".json?access_token=" + mapboxgl.accessToken,
                            success: function (res) {
                                geoData.features.push(getMarkers(res.features[0], attribute));
                            }
                        });
                    }
                    if (document.getElementById('map') && property_variables.map_service == 'google-map') {
                        geocoder.geocode({ 'address': attribute['data-location'] }, function (results, status) {
                            if (status === google.maps.GeocoderStatus.OK) {
                                map.setCenter(results[0].geometry.location);
                                map.setOptions({ draggable: true });

                                // Create a marker with custom content, image, and title
                                var marker = new google.maps.Marker({
                                    position: results[0].geometry.location,
                                    map: map,
                                    title: attribute['title'],
                                });
                                markers.push(marker);

                                // Create a custom info window
                                var infoWindow = new google.maps.InfoWindow({
                                    maxWidth: 240,
                                    pixelOffset: new google.maps.Size(0, -10),
                                    content: '<div class="pop-up-map">'
                                        + '<div class = "popup-content"> '
                                        + '<div class="popup-thumb"><img src="' + attribute['data-image'] + '" alt="' + attribute['title'] + '"></div>'
                                        + '<div class="pop-main-content">'
                                        + '<div class="popup-title">' + attribute['title'] + '</div>'
                                        + '<div class="popup-address">' + attribute['data-location'] + '</div>'
                                        + '<div class="popup-price">' + attribute['data-price-prefix'] + attribute['data-price'] + attribute['data-price-postfix'] + '</div>'
                                        + '</div>'
                                        + '</div>'
                                        + '</div>'
                                });
                                clickMarkerEvent(map, infoWindow, marker, infoObj);
                                mouseoverPropertyGoogleMap(map, infoWindow, marker, infoObj, attribute['data-id']);
                            } else {
                                console.log('Geocode was not successful for the following reason: ' + status);
                            }
                        });
                    }
                }, delay)
            }
        });
        if (document.getElementById('map') && property_variables.map_service == 'google-map') {
            setTimeout(() => {
                new MarkerClusterer(map, markers, markerClusterOptions);
            }, 1500);
        }

        if (document.getElementById('map') && property_variables.map_service == 'map-box') {
            var map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/' + property_variables.map_box_style,
                center: [0, 0], // [lng, lat]
                zoom: property_variables.map_zoom,
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

            map.on('load', () => {
                if (geoData.features.length == 0) return;
                jumpToProperty(map, geoData.features[0]);

                map.loadImage(
                    property_variables.default_marker_image ? property_variables.default_marker_image :
                        property_variables.plugin_url + 'public/assets/image/map/map-marker.png',
                    (error, image) => {
                        if (error) throw error;
                        map.addImage('custom-marker', image);
                    });

                map.addSource('properties', {
                    type: 'geojson',
                    data: geoData,
                    cluster: true,
                    clusterMaxZoom: 6, // Max zoom to cluster points on
                    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
                });

                map.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'properties',
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': [
                            'step',
                            ['get', 'point_count'],
                            '#ffa920',
                            100,
                            '#f1f075',
                            750,
                            '#f28cb1'
                        ],
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            20,
                            100,
                            30,
                            750,
                            40
                        ]
                    }
                });

                map.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'properties',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': ['get', 'point_count_abbreviated'],
                        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                        'text-size': 12
                    }
                });

                map.addLayer({
                    id: 'unclustered-point',
                    type: 'symbol',
                    source: 'properties',
                    filter: ['!', ['has', 'point_count']],
                    layout: {
                        'icon-image': 'custom-marker',
                        'icon-size': 0.55
                    }
                });

                // inspect a cluster on click
                map.on('click', 'clusters', (e) => {
                    const features = map.queryRenderedFeatures(e.point, {
                        layers: ['clusters']
                    });
                    const clusterId = features[0].properties.cluster_id;
                    map.getSource('properties').getClusterExpansionZoom(
                        clusterId,
                        (err, zoom) => {
                            if (err) return;

                            map.easeTo({
                                center: features[0].geometry.coordinates,
                                zoom: zoom
                            });
                        }
                    );
                });

                map.on('click', 'unclustered-point', (e) => {
                    createPopupMap(map, e.features[0])
                });

                map.on('mouseenter', 'clusters', () => {
                    map.getCanvas().style.cursor = 'pointer';
                });

                map.on('mouseleave', 'clusters', () => {
                    map.getCanvas().style.cursor = '';
                });
                map.scrollZoom.disable();
            });
            mouseoverPropertyMapBox(map, geoData);

        }
    }

    var onLoadFixedMap = function () {
        if ($('#map').hasClass('no-fixed')) return;
        if (document.getElementById('map')) {
            $('#map').addClass('fixed').removeAttr('style').css({
                width: $('.map-container').innerWidth() + 'px',
            });
            window.scrollBy(0, 1);

            var top = $('#map').offset().top - parseFloat($('#map').css('marginTop').replace(/auto/, 0));
            var footTop = $('.fixed-map-stopper').offset().top - parseFloat($('.fixed-map-stopper').css('marginTop').replace(/auto/, 0));
            var maxY = footTop - $('#map').innerHeight();

            var windowTop = $(window).scrollTop();

            if (windowTop >= top) {
                if (windowTop <= maxY) {
                    $('#map').addClass('fixed').removeAttr('style').css({
                        width: $('.map-container').innerWidth() + 'px',
                        top: $('.map-container').offset().top
                    });
                } else {
                    $('#map').removeClass('fixed').css({
                        position: 'absolute',
                        top: 'auto',
                        bottom: '0',
                        width: $('.map-container').innerWidth() + 'px',
                        height: '100vh'
                    });
                }
            } else {
                $('#map').removeClass('fixed');
            }
        }
    }

    var onScrollFixedMap = function () {
        if ($('#map').hasClass('no-fixed')) return;
        if (document.getElementById('map')) {
            onLoadFixedMap();

            var top = $('#map').offset().top - parseFloat($('#map').css('marginTop').replace(/auto/, 0));
            var footTop = $('.fixed-map-stopper').offset().top - parseFloat($('.fixed-map-stopper').css('marginTop').replace(/auto/, 0));
            var maxY = footTop - $('#map').innerHeight();

            $(window).scroll(function (evt) {
                var y = $(this).scrollTop();
                if (y >= top) {
                    if (y <= maxY) {
                        $('#map').addClass('fixed').removeAttr('style').css({
                            width: $('.map-container').innerWidth() + 'px',
                            top: '0px',
                        });
                    } else {
                        $('#map').removeClass('fixed').css({
                            position: 'absolute',
                            top: 'auto',
                            bottom: '0',
                            width: $('.map-container').innerWidth() + 'px',
                            height: '100vh'
                        });
                    }
                } else {
                    $('#map').removeClass('fixed');
                }
            });
        }
    }

    var initMapSingleProperty = function () {
        var latlng, marker, mapSingle,
            mapContainer = $('.map-container'),
            latlngSearching = mapContainer.find('.latlng_searching');

        if (!document.getElementById('map-single')) return;

        if (latlngSearching.length && latlngSearching.val() != '') {
            latlng = latlngSearching.val();
            latlng = latlng.split(',');
        }
        else {
            if (property_variables.map_service == 'google-map') {
                latlng = [108.221548, 16.076305];
            }
            else {
                latlng = [0, 0];
            }
        }

        if (document.getElementById('map-single') && property_variables.map_service == 'google-map') {
            var currentLocation = new google.maps.LatLng(latlng[0], latlng[1]);

            var mapOptions = {
                center: currentLocation,
                zoom: parseInt(property_variables.map_zoom)
            };

            mapSingle = new google.maps.Map(document.getElementById('map-single'), mapOptions);

            marker = new google.maps.Marker({
                position: currentLocation,
                map: mapSingle,
            });

            mapSingle.setCenter(currentLocation);
            mapSingle.setOptions({ draggable: false });

            var request = {
                location: currentLocation,
                radius: '1500',
            };

            var service = new google.maps.places.PlacesService(mapSingle);

            service.nearbySearch(request, function (results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    var result = [];
                    var html = '';
                    // Handle the registration success response
                    if (results.length <= 0) {
                        $('.nearby-place-wrapper').append('<p>No nearby places</p>');
                    } else {
                        result = results.reduce((newObj, data) => {
                            var array = newObj[data.types[0]] = newObj[data.types[0]] || [];
                            array[array.length] = data;
                            return newObj;
                        }, {});

                        Object.keys(result).forEach(function (key) {
                            html += '<div class="place"><div class="place-icon"><i class="far fa-map-marker-alt"></i></div><div class="place-info"><h4 class="place-title">' + key.split('_').join(' ') + '</h4><ul class="place-list">';
                            result[key].forEach(function (elem) {
                                var markerLatLng = new google.maps.LatLng(elem.geometry.location.lat(), elem.geometry.location.lng());
                                var distance_from_current_location = (google.maps.geometry.spherical.computeDistanceBetween(currentLocation, markerLatLng) / 1609.344).toFixed(3);
                                html += '<li>' + (elem.name) + '<span class="place-distance"> ' + distance_from_current_location + ' miles</span></li>';
                            })
                            html += '</ul></div></div>';
                        });

                        $('.nearby-place-wrapper').append(html);
                    }
                }
                else {
                    $('.nearby-place-wrapper').append('<p>No nearby places</p>');
                }
            });
        }

        if (document.getElementById('map-single') && property_variables.map_service == 'map-box') {
            mapboxgl.accessToken = property_variables.api_key_map_box ? property_variables.api_key_map_box : 'pk.eyJ1IjoidGhlbWVzZmxhdCIsImEiOiJjbGt3NGxtYncwa2F2M21saHM3M21uM3h2In0.9NbzjykXil1nELxQ1V8rkA';

            mapSingle = new mapboxgl.Map({
                container: 'map-single',
                style: 'mapbox://styles/mapbox/' + property_variables.map_box_style,
                center: [0, 0], // [lng, lat]
                zoom: property_variables.map_zoom,
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
            mapSingle.addControl(new mapboxgl.NavigationControl());
            // Create custom marker
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = `url(${property_variables.default_marker_image ? property_variables.default_marker_image :
                property_variables.plugin_url + 'public/assets/image/map/map-marker.png'})`;
            el.style.width = property_variables.marker_image_width;
            el.style.height = property_variables.marker_image_height;
            el.style.backgroundSize = '100%';
            el.style.backgroundRepeat = 'no-repeat';

            // Initialize the marker
            marker = new mapboxgl.Marker({ element: el, draggable: false });

            if (latlng) {
                mapSingle.flyTo({
                    center: [latlng[1], latlng[0]],
                    zoom: property_variables.map_zoom,
                    pitch: 45,
                    bearing: 0,
                    essential: true,
                    duration: 3000,
                    speed: 1,
                });
                marker.setLngLat([latlng[1], latlng[0]]).addTo(mapSingle);
            }
        }
    }

    var initMapHeaderSingleProperty = function () {
        var latlng, marker, mapHeaderSingle,
            mapContainer = $('.map-container'),
            latlngSearching = mapContainer.find('.latlng_searching');

        if (!document.getElementById('map-header')) return;

        if (latlngSearching.length && latlngSearching.val() !== '') {
            latlng = latlngSearching.val();
            latlng = latlng.split(',');
        }
        else {
            if (property_variables.map_service == 'google-map') {
                latlng = [108.221548, 16.076305];
            }
            else {
                latlng = [0, 0];
            }
        }

        if (document.getElementById('map-header') && property_variables.map_service == 'google-map') {
            var currentLocation = new google.maps.LatLng(latlng[0], latlng[1]);
            var mapOptions = {
                center: currentLocation,
                zoom: parseInt(property_variables.map_zoom)
            };

            mapHeaderSingle = new google.maps.Map(document.getElementById('map-header'), mapOptions);

            marker = new google.maps.Marker({
                position: currentLocation,
                map: mapHeaderSingle,
            });
            mapHeaderSingle.setCenter(currentLocation);
            mapHeaderSingle.setOptions({ draggable: false });
        }

        if (document.getElementById('map-header') && property_variables.map_service == 'map-box') {
            mapboxgl.accessToken = property_variables.api_key_map_box ? property_variables.api_key_map_box : 'pk.eyJ1IjoidGhlbWVzZmxhdCIsImEiOiJjbGt3NGxtYncwa2F2M21saHM3M21uM3h2In0.9NbzjykXil1nELxQ1V8rkA';
            mapHeaderSingle = new mapboxgl.Map({
                container: 'map-header',
                style: 'mapbox://styles/mapbox/' + property_variables.map_box_style,
                center: [0, 0], // [lng, lat]
                zoom: property_variables.map_zoom,
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
            mapHeaderSingle.addControl(new mapboxgl.NavigationControl());

            // Create custom marker
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = `url(${property_variables.default_marker_image ? property_variables.default_marker_image :
                property_variables.plugin_url + 'public/assets/image/map/map-marker.png'})`;
            el.style.width = property_variables.marker_image_width;
            el.style.height = property_variables.marker_image_height;
            el.style.backgroundSize = '100%';
            el.style.backgroundRepeat = 'no-repeat';

            // Initialize the marker
            marker = new mapboxgl.Marker({ element: el, draggable: false });

            if (latlng) {
                mapHeaderSingle.flyTo({
                    center: [latlng[1], latlng[0]],
                    zoom: property_variables.map_zoom,
                    pitch: 45,
                    bearing: 0,
                    essential: true,
                    duration: 3000,
                    speed: 1,
                });
                marker.setLngLat([latlng[1], latlng[0]]).addTo(mapHeaderSingle);
            }
        }
    }

    var onClickMapHeaderSingleProperty = function () {
        $('#tabs-header-single-property #tab-map').one('click', function () {
            if (document.getElementById('map-header')) {
                setTimeout(() => {
                    initMapHeaderSingleProperty();
                });
            }
        })
    }

    var checkFieldRequired = function (field_required) {
        return (field_required == true);
    }

    var validateSavePropertyForm = function () {
        var formParent = $(".tfre-property-form");
        var property_title = property_variables.required_property_fields.property_title,
            property_full_address = property_variables.required_property_fields.property_full_address,
            property_zip_code = property_variables.required_property_fields.property_zip_code,
            property_country = property_variables.required_property_fields.property_country,
            property_province_state = property_variables.required_property_fields.property_province_state,
            property_neighborhood = property_variables.required_property_fields.property_neighborhood,

            property_price_value = property_variables.required_property_fields.property_price_value,
            property_price_unit = property_price_value ? property_variables.required_property_fields.property_price_unit : false,
            property_price_to_call = property_price_value ? false : property_variables.required_property_fields.property_price_to_call,

            property_type = property_variables.required_property_fields.property_type,
            property_status = property_variables.required_property_fields.property_status,
            property_label = property_variables.required_property_fields.property_label,
            property_size = property_variables.required_property_fields.property_size,
            property_land = property_variables.required_property_fields.property_land,
            property_year = property_variables.required_property_fields.property_year,
            property_rooms = property_variables.required_property_fields.property_rooms,
            property_bedrooms = property_variables.required_property_fields.property_bedrooms,
            property_bathrooms = property_variables.required_property_fields.property_bathrooms,
            property_garage = property_variables.required_property_fields.property_garage,
            property_garage_size = property_variables.required_property_fields.property_garage_size,
            property_feature = property_variables.required_property_fields.property_feature;

        formParent.validate({
            ignore: ":hidden", // any children of hidden desc are ignored
            errorElement: "div", // wrap error elements in span not label
            invalidHandler: function (event, validator) { // add aria-invalid to el with error
                $.each(validator.errorList, function (idx, item) {
                    if (idx === 0) {
                        $(item.element).focus(); // send focus to first el with error
                    }
                    $(item.element).attr("aria-invalid", true); // add invalid aria
                    $(item.element).addClass('is-invalid');
                    if ($("[name='property-feature[]']:checked").length == 0) {
                        $(item.element).closest('.property-feature').addClass('is-invalid');
                    } else {
                        $(item.element).closest('.property-feature').removeClass('is-invalid');
                    }
                })

            },
            highlight: function (element, errorClass, validClass) {
                var elem = $(element);
                if (elem.hasClass("select2-hidden-accessible")) {
                    elem.parent().find('.select2-container').addClass(errorClass).removeClass(validClass);
                } else {
                    elem.addClass(errorClass).removeClass(validClass);
                    elem.addClass('is-invalid').removeClass('is-valid');
                }
                if ($("[name='property-feature[]']:checked").length == 0) {
                    $(elem).closest('.property-feature').addClass('is-invalid');
                }
            },
            unhighlight: function (element, errorClass, validClass) {
                var elem = $(element);
                if (elem.hasClass("select2-hidden-accessible")) {
                    elem.parent().find('.select2-container').removeClass(errorClass).addClass(validClass);
                } else {
                    elem.removeClass(errorClass).addClass(validClass);
                    elem.removeClass('is-invalid').addClass('is-valid');
                }
                if ($("[name='property-feature[]']:checked").length != 0) {
                    elem.closest('.property-feature').removeClass('is-invalid');
                }

            },
            rules: {
                property_title: {
                    required: checkFieldRequired(property_title),
                },
                property_full_address: {
                    required: checkFieldRequired(property_full_address)
                },
                property_country: {
                    required: checkFieldRequired(property_country)
                },
                property_province_state: {
                    required: checkFieldRequired(property_province_state)
                },
                property_neighborhood: {
                    required: checkFieldRequired(property_neighborhood)
                },
                property_zip_code: {
                    required: checkFieldRequired(property_zip_code)
                },
                property_price_value: {
                    required: checkFieldRequired(property_price_value),
                    number: true,
                },
                property_price_unit: {
                    required: checkFieldRequired(property_price_unit),
                },
                property_price_to_call: {
                    required: checkFieldRequired(property_price_to_call),
                },
                'property-type[]': {
                    required: checkFieldRequired(property_type)
                },
                'property-status[]': {
                    required: checkFieldRequired(property_status)
                },
                'property-label[]': {
                    required: checkFieldRequired(property_label)
                },
                property_size: {
                    required: checkFieldRequired(property_size),
                    number: true
                },
                property_land: {
                    required: checkFieldRequired(property_land),
                    number: true
                },
                property_rooms: {
                    required: checkFieldRequired(property_rooms),
                    number: true
                },
                property_bedrooms: {
                    required: checkFieldRequired(property_bedrooms),
                    number: true
                },
                property_bathrooms: {
                    required: checkFieldRequired(property_bathrooms),
                    number: true
                },
                property_garage: {
                    required: checkFieldRequired(property_garage),
                    number: true
                },
                property_garage_size: {
                    required: checkFieldRequired(property_garage_size),
                    number: true
                },
                property_year: {
                    required: checkFieldRequired(property_year),
                    number: true
                },
                'property-feature[]': checkFieldRequired(property_feature) ? { at_least_one: true } : {},
                property_other_agent_email: {
                    email: true
                }
            },
            messages: {
                property_title: "",
                property_full_address: "",
                property_country: '',
                property_province_state: '',
                property_neighborhood: '',
                property_zip_code: '',
                property_price_value: "",
                property_price_to_call: "",
                'property-type[]': "",
                'property-status[]': "",
                'property-label[]': "",
                property_size: "",
                property_land: "",
                property_rooms: "",
                property_bedrooms: "",
                property_bathrooms: "",
                property_garage: "",
                property_garage_size: "",
                property_year: "",
                'property-feature[]': "",
                property_other_agent_email: ""
            },
            submitHandler: function (form) {
                form.submit();
            }
        });
        $.validator.addMethod("at_least_one", function () {
            return $("input[name='property-feature[]']:checked").length;
        }, '');

        $(document).on('select2:select select2:unselect', '#property_type,#property_status,#property_label', function (arg) {
            var elem = $(arg.target);
            if (typeof (elem.val()) == 'object') {
                if (elem.val().length == 0) {
                    elem.parent().find('.select2-container').addClass('error');
                } else {
                    elem.parent().find('.select2-container').removeClass('error');
                }
            }
        });
    }

    var light_gallery = function () {
        var adminbar = $("#wpadminbar").height();
        $("[data-rel='tfre_light_gallery']").each(function () {
            var $this = $(this),
                galleryId = $this.data('gallery-id');
            $this.on('click', function (event) {
                event.preventDefault();
                var _data = [];
                var $index = 0;
                var $current_src = $(this).attr('href');
                var $current_thumb_src = $(this).data('thumb-src');
                if ($("#wpadminbar").length) {
                    $(this).delay(500).queue(function () {
                        $(".lg-toolbar").css({ top: adminbar });
                        $(this).dequeue();
                    });
                }
                if (typeof galleryId != 'undefined') {
                    $('[data-gallery-id="' + galleryId + '"]').each(function (index) {
                        var src = $(this).attr('href'),
                            thumb = $(this).data('thumb-src'),
                            subHtml = $(this).attr('title');
                        if (src == $current_src && thumb == $current_thumb_src) {
                            $index = index;
                        }
                        if (typeof (subHtml) == 'undefined')
                            subHtml = '';
                        _data.push({
                            'src': src,
                            'downloadUrl': src,
                            'thumb': thumb,
                            'subHtml': subHtml
                        });
                    });

                    $this.lightGallery({
                        hash: false,
                        galleryId: galleryId,
                        dynamic: true,
                        dynamicEl: _data,
                        thumbWidth: 80,
                        index: $index
                    });
                }
            });
        });
        $('a.tfre-view-video').on('click', function (event) {
            event.preventDefault();
            var $src = $(this).attr('data-src');
            $(this).lightGallery({
                dynamic: true,
                dynamicEl: [{
                    'src': $src,
                    'thumb': '',
                    'subHtml': ''
                }]
            });
        });
    }

    var gallery_carousel = function () {
        if ($('.single-property-image-main').length > 0) {

            var thumb1 = $(".single-property-image-main");
            var thumb2 = $(".single-property-image-thumb");
            var dataItem = thumb2.data("item");
            var slidesPerPage = 3;
            var syncedSecondary = true;
            var rtl = false;
            if ($('.single-property-image-main').data("rtl") == 'yes') {
                rtl = true;
            }

            thumb1.owlCarousel({
                items: 1,
                slideSpeed: 5000,
                nav: false,
                autoplay: false,
                dots: false,
                rtl: rtl,
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
                    nav: true,
                    touchDrag: false,
                    mouseDrag: false,
                    rtl: rtl,
                    smartSpeed: 200,
                    slideSpeed: 500,
                    slideBy: slidesPerPage,
                    responsiveRefreshRate: 100,
                    navText: ['<i class="icon-dreamhome-angle-left">', '<i class="icon-dreamhome-angle-right">'],
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
    };

    var onClickTypePropertiesView = function (buttonClass, viewType) {
        $(buttonClass).click(function (event) {
            event.preventDefault();
            localStorage.setItem('TYPE_PROPERTIES_VIEW', viewType);
            var $this = $(this);
            var styleLayout = $this.data('style-layout');
            var styleLayoutColumn = $this.data('style-layout-column');
            $(".properties-list-wrap .tf-properties-wrap").removeClass(function (index, className) {
                return (className.match(/\bstyle\S+/g) || []).join(' ');
            });
            $(".properties-list-wrap .wrap-properties-post").removeClass(function (index, className) {
                return (className.match(/\bcolumn-\S+/g) || []).join(' ');
            });
            checkTypePropertiesView(styleLayout, styleLayoutColumn);
        });
    };

    var checkTypePropertiesView = function (styleLayout, styleLayoutColumn) {
        var type = localStorage.getItem('TYPE_PROPERTIES_VIEW');
        if (!type) {
            type = property_variables.layout_archive_property;
        }
        
        switch (type) {
            case 'grid':
                if(!styleLayout && !styleLayoutColumn){
                    styleLayout = $('.properties-list-wrap .tfre-my-property-search a.btn-display-properties-grid').data('style-layout');
                    styleLayoutColumn = $('.properties-list-wrap .tfre-my-property-search a.btn-display-properties-grid').data('style-layout-column');
                    $(".properties-list-wrap .tf-properties-wrap").removeClass(function (index, className) {
                        return (className.match(/\bstyle\S+/g) || []).join(' ');
                    });
                    $(".properties-list-wrap .wrap-properties-post").removeClass(function (index, className) {
                        return (className.match(/\bcolumn-\S+/g) || []).join(' ');
                    });
                }
                $('.properties-list-wrap .tf-properties-wrap').addClass(styleLayout);
                $('.properties-list-wrap .wrap-properties-post').addClass(styleLayoutColumn);
                $('.properties-list-wrap .tfre-my-property-search a.btn-display-properties-grid').addClass('active');
                $('.properties-list-wrap .tfre-my-property-search a.btn-display-properties-list').removeClass('active');
                break;
            case 'list':
                if(!styleLayout && !styleLayoutColumn){
                    styleLayout = $('.properties-list-wrap .tfre-my-property-search a.btn-display-properties-list').data('style-layout');
                    styleLayoutColumn = $('.properties-list-wrap .tfre-my-property-search a.btn-display-properties-list').data('style-layout-column');
                    $(".properties-list-wrap .tf-properties-wrap").removeClass(function (index, className) {
                        return (className.match(/\bstyle\S+/g) || []).join(' ');
                    });
                    $(".properties-list-wrap .wrap-properties-post").removeClass(function (index, className) {
                        return (className.match(/\bcolumn-\S+/g) || []).join(' ');
                    });
                }
                $('.properties-list-wrap .tf-properties-wrap').addClass(styleLayout);
                $('.properties-list-wrap .wrap-properties-post').addClass(styleLayoutColumn);
                $('.properties-list-wrap .tfre-my-property-search a.btn-display-properties-list').addClass('active');
                $('.properties-list-wrap .tfre-my-property-search a.btn-display-properties-grid').removeClass('active');
                break;
            default:
                break;
        }
    };

    var sortableGalleryImages = function () {
        $('#tfre_property_gallery_container').sortable({
            flow: 'horizontal',
            wrapPadding: [10, 10, 0, 0],
            elMargin: [0, 0, 10, 10],
            elHeight: 'auto',
            filter: function (index) { return index !== 2; },
            timeout: 1000
        }).disableSelection();
    }

    var singlePropertyShortDescription = function () {
        var textShow = $('.tfre-property-info.show-hide').data('show');
        $('.tfre-property-info').children('p').each(function (index, element) {
            if (index >= 1) {
                var $this = $(this);
                if (!$this.is(':first-child')) {
                    $this.hide();
                }

                if ($this.is(':last-child')) {
                    $this.after('<p class="more-property-description">' + textShow + '</p>');
                }
            }

        });
    }

    var onClickShowMoreSinglePropertyShortDescription = function () {
        var textShow = $('.tfre-property-info.show-hide').data('show');
        var textHide = $('.tfre-property-info.show-hide').data('hide');
        $('.more-property-description').click(function () {
            $(this).parent('.tfre-property-info').children('p').not(':first').not('p.more-property-description').each(function () {
                $(this).toggle();
            });
            $(this).text() == textHide ? $(this).text(textShow) : $(this).text(textHide);
        })
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

    var propertyQuickView = function () {
        $('#property_quick_view_modal').find('.modal-body').children().remove();
        $('#property_quick_view_modal').off().on('shown.bs.modal', function (event) {
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
                        modal.find('.modal-body').html(response)
                        var swiperThumb = new Swiper(".thumb-swiper", {
                            spaceBetween: 10,
                            slidesPerView: 4,
                            freeMode: true,
                            watchSlidesProgress: true,
                        });
                        var swiperMain = new Swiper(".main-swiper", {
                            spaceBetween: 10,
                            navigation: {
                                nextEl: ".swiper-button-next",
                                prevEl: ".swiper-button-prev",
                            },
                            thumbs: {
                                swiper: swiperThumb,
                            },
                        });

                    },
                    error: function () {
                        modal.children('i').removeClass('fa-spinner fa-spin');
                    }
                });
            }, 200);
        })

    }

    var onClickQuickView = function () {
        $('a.property-quick-view').on('click', function (e) {
            propertyQuickView();
        })
    }

    var onClickPrint = function () {
        $('a.tfre-property-print').on('click', function (e) {
            window.print();
        });
    }

    var updateIndexAdditionalDetail = function () {
        $('tr', '#tfre_additional_details').each(function (idx, elm) {
            var inputAdditionalDetailTitle = $('input[id*="additional_detail_title"]', $(this)),
                inputAdditionalDetailValue = $('input[id*="additional_detail_value"]', $(this));
            inputAdditionalDetailTitle.attr('name', 'property_additional_detail[' + idx + '][additional_detail_title]');
            inputAdditionalDetailTitle.attr('id', 'additional_detail_title_' + idx);
            inputAdditionalDetailValue.attr('name', 'property_additional_detail[' + idx + '][additional_detail_value]');
            inputAdditionalDetailValue.attr('id', 'additional_detail_value_' + idx);
        });
    }

    var removeAdditionalDetail = function () {
        $('.remove-additional-detail').on('click', function (event) {
            event.preventDefault();
            var parent = $(this).closest('.additional-block'),
                buttonAdd = parent.find('.add-additional-detail'),
                increment = parseFloat(buttonAdd.attr('data-increment')) - 1;
            $(this).parent('td').parent('tr').remove();
            buttonAdd.attr('data-increment', increment);
            updateIndexAdditionalDetail();
        });
    }

    var addNewAdditionalDetail = function () {
        $('.add-additional-detail').on('click', function (e) {
            e.preventDefault();
            var rowNum = parseFloat($(this).attr("data-increment")) + 1;
            $(this).attr('data-increment', rowNum);
            var newAdditionalDetail = '<tr>' +
                '<td>' +
                '<input class="form-control" type="text" name="property_additional_detail[' + rowNum + '][additional_detail_title]" id="additional_detail_title_' + rowNum + '" value="">' +
                '</td>' +
                '<td>' +
                '<input class="form-control" type="text" name="property_additional_detail[' + rowNum + '][additional_detail_value]" id="additional_detail_value_' + rowNum + '" value="">' +
                '</td>' +
                '<td>' +
                '<span class="remove-additional-detail"><i class="fa fa-times"></i></span>' +
                '</td>' +
                '</tr>';
            $('#tfre_additional_details').append(newAdditionalDetail);
            removeAdditionalDetail();
        });
    }

    var navigationSingleScroll = function () {

        if ($('.property-navigation').length) {
            var sectionSticky = $('.property-navigation').offset().top;

            $(window).on("load scroll resize", function () {
                var adminbar = $('#wpadminbar').length ? $("#wpadminbar").height() : 0;
                var header = $('.header_sticky').length ? $("#header").height() : 0;
                $('.property-navigation').css({ top: adminbar + header });

                if ($(window).scrollTop() >= sectionSticky) {
                    $('.property-navigation').addClass("is-fixed");
                } else {
                    $('.property-navigation').removeClass("is-fixed");
                }
                if (matchMedia("only screen and (max-width: 767px)").matches) {
                    $('.property-navigation').css({ top: header });
                }
            });

            $(window).on('scroll', function () {
                var scrollbarLocation = $(this).scrollTop();
                $('.item-nav').each(function () {
                    var sectionOffset = $(this.hash);
                    if (sectionOffset.length > 0) {
                        sectionOffset = $(this.hash).offset().top - 120;
                        if (sectionOffset <= scrollbarLocation) {
                            $(this).parent().addClass('active');
                            $(this).parent().siblings().removeClass('active');
                        }
                    } else {
                        $(this).parent().remove();
                    }
                });
            });

            $('a.item-nav[href*="#"]:not([href="#"])').on('click', function () {
                if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                    if (target.length) {
                        $('html, body').animate({
                            scrollTop: (target.offset().top - 110)
                        }, 800, "easeInOutExpo");
                        return false;
                    }
                }
            });
        }
    }

    $(document).ready(function () {

        // price
        checkPriceToCallOnChange();
        removeFavorite();

        // upload image
        propertyGalleryImages();
        propertyGalleryImagesEvent();

        // handle sortable gallery images 
        sortableGalleryImages();

        // upload file attachments
        propertyFileAttachments();
        propertyFileAttachmentsEvent();

        // upload image 360
        propertyVirtual360();
        propertyVirtual360Event();
        checkVirtual360Option();

        // floors plan
        addNewFloorsPlan();
        removeFloorPlan();
        uploadFloorImages(0);
        floorImageEvent(0);
        toggleEnableFloorsPlan();

        // additional detail
        addNewAdditionalDetail();
        removeAdditionalDetail();

        // agent information
        checkEnableAgentInformationOption();

        // handle add and update property
        handleSavePropertyAjax();
        validateSavePropertyForm();
        $('#property_type, #property_status, #property_label, #property_country,.tfre-property-neighborhood-ajax.search-field,.tfre-province-state-ajax.search-field').select2();
        // favorite
        favorite();

        light_gallery();
        gallery_carousel();

        // Temporary close request show list property in map due to google api key issue
        // Single Property
        initMapSingleProperty();
        onClickMapHeaderSingleProperty();
        $("#tabs-header-single-property").tabs({ active: 0 });
        $("#tabs-header-single-property, #tabs-header-single-property *").removeClass('ui-widget ui-widget-content ui-widget-header ui-tabs-panel');
        if (document.getElementById('map') && property_variables.map_service == 'google-map') {
            mouseoverPropertyGoogleMap();
        }

        // Menu Navigation Single Scroll
        navigationSingleScroll();

        onClickTypePropertiesView('.properties-list-wrap .tfre-my-property-search a.btn-display-properties-grid', 'grid');
        onClickTypePropertiesView('.properties-list-wrap .tfre-my-property-search a.btn-display-properties-list', 'list');
        checkTypePropertiesView();
        singlePropertyShortDescription();
        onClickShowMoreSinglePropertyShortDescription();
        onClickQuickView();
        onClickPrint();
    })

    $(window).load(function () {
        setTimeout(function () {
            listingPropertiesInMap();
            onScrollFixedMap();
            viewGalleryMagnificPopup();
        }, 100)
    })
})(jQuery);
