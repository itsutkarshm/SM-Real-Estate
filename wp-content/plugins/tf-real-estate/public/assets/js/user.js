(function ($) {
    'use strict';
    var handleLogin = function () {
        $('#tfre_custom-login-form').on('submit', function (e) {
            e.preventDefault();
            $('.tfre_login-form').validate({
                errorElement: "span",
                rules: {
                    username: {
                        required: true,
                        minlength: 3
                    },
                    password: {
                        required: true
                    },
                },
                messages: {
                    username: "",
                    password: "",
                }
            });
            var form = $(this);
            var formData = form.serialize();
            var $messages = $(this).parents('.tfre_login-form').find('.tfre_message');

            if (form.valid()) {
                $.ajax({
                    type: 'POST',
                    url: ajax_object.ajaxUrl,
                    data: formData + '&action=custom_login&security=' + ajax_object.nonce,
                    beforeSend: function () {
                        $messages.empty().append('<span class="success text-success"> Loading </span>');
                    },
                    success: function (response) {
                        // Handle the registration success response
                        if (response.status) {
                            window.location.href = response.redirect_url;
                        } else {
                            $messages.empty().append('<span class="error text-danger"><i class="fa fa-close"></i> ' + response.message + '</span>');
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
    var handleRegister = function () {
        $('#tfre_custom-register-form').on('submit', function (e) {
            e.preventDefault();
            $('.tfre_registration-form').validate({
                errorElement: "span",
                rules: {
                    username: {
                        required: true,
                        minlength: 3
                    },
                    email: {
                        required: true,
                        pattern: /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,10}$/
                    },
                    password: {
                        required: true
                    },
                    confirm_password: {
                        required: true
                    }
                },
                messages: {
                    username: "",
                    email: "",
                    password: "",
                    confirm_password: ""
                }
            });
            var form = $(this);
            var formData = form.serialize();
            var $messages = $(this).parents('.tfre_registration-form').find('.tfre_message');
            if (form.valid()) {
                $.ajax({
                    type: 'POST',
                    url: ajax_object.ajaxUrl,
                    data: formData + '&action=custom_register&security=' + ajax_object.nonce,
                    beforeSend: function () {
                        $messages.empty().append('<span class="success text-success"> Loading </span>');
                    },
                    success: function (response) {
                        // Handle the registration success response
                        if (response.status) {
                            $messages.empty().append('<span class="success text-success"><i class="fa fa-check"></i> ' + response.message + '</span>');

                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);

                        } else {
                            $messages.empty().append('<span class="error text-danger"><i class="fa fa-close"></i> ' + response.message + '</span>');
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
    var handleUpdateProfile = function () {
        $('#tfre_profile_submit').on('click', function (e) {
            e.preventDefault();
            var form = $('#tfre_profile-form');
            var formData = form.serialize();
            var $messages = form.find('.tfre_message');
            if (form.valid()) {
                $.ajax({
                    type: 'POST',
                    url: ajax_object.ajaxUrl,
                    data: formData + '&action=profile_update&security=' + ajax_object.nonce,
                    beforeSend: function () {
                        $messages.empty().append('<span class="success text-success"> Loading </span>');
                    },
                    success: function (response) {
                        // Handle the registration success response
                        if (response.status) {
                            $messages.empty().append('<div class="tfre-message alert alert-success" role="alert"><span class="success text-success"><i class="fa fa-check"></i> ' + response.message + '</span></div>');
                        } else {
                            $messages.empty().append('<div class="tfre-message alert alert-danger" role="alert"><span class="error text-danger"><i class="fa fa-close"></i> ' + response.message + '</span></div>');
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
    var handleUploadImage = function () {
        $('#tfre_avatar').on('change', function () {
            var formData = new FormData();
            formData.append('tfre_avatar', this.files[0]);
            formData.append('action', 'avatar_upload');
            $.ajax({
                url: ajax_object.ajaxUrl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        $('img#tfre_avatar_thumbnail').each(function () {
                            $(this).attr('src', response.avatar_url);
                        })
                    } else {
                        $('img#tfre_avatar_thumbnail').each(function () {
                            $(this).attr('src', '');
                        })
                    }
                }
            });
        });
    }
    var handleUploadAgentPoster = function () {
        $('#tfre_agent_poster').on('change', function () {
            var formData = new FormData();
            formData.append('tfre_agent_poster', this.files[0]);
            formData.append('action', 'agent_poster_upload');
            $.ajax({
                url: ajax_object.ajaxUrl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        $('img#tfre_agent_poster_thumb').each(function () {
                            $(this).attr('src', response.agent_poster_url);
                        })
                    } else {
                        $('img#tfre_agent_poster_thumb').each(function () {
                            $(this).attr('src', '');
                        })
                    }
                }
            });
        });
    }
    var handleBecomeAgent = function () {
        $('#tfre_become_agent').on('click', function () {
            var confirmed = confirm(ajax_object.confirm_become_agent_text);
            var $messages = $(this).parents('.tfre_profile-form').find('.tfre_agent_message');
            if (confirmed) {
                $.ajax({
                    type: 'post',
                    url: ajax_object.ajaxUrl,
                    dataType: 'json',
                    data: {
                        'action': 'become_agent',
                        'security': ajax_object.nonce
                    },
                    success: function (response) {
                        if (response.status) {
                            $messages.empty().append('<span class="success text-success"><i class="fa fa-check"></i> ' + response.message + '</span>');
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        } else {
                            $messages.empty().append('<span class="error text-danger"><i class="fa fa-close"></i> ' + response.message + '</span>');
                        }
                    },
                    error: function () {
                        // Handle the registration error response
                        console.log(error);
                    }
                });
            }
        });
    }
    var handleLeaveAgent = function () {
        $('#tfre_leave_agent').on('click', function () {
            var confirmed = confirm(ajax_object.confirm_leave_agent_text);
            var $messages = $(this).parents('.tfre_profile-form').find('.tfre_agent_message');
            if (confirmed) {
                $.ajax({
                    type: 'post',
                    url: ajax_object.ajaxUrl,
                    dataType: 'json',
                    data: {
                        'action': 'leave_agent',
                        'security': ajax_object.nonce
                    },
                    success: function (response) {
                        if (response.status) {
                            $messages.empty().append('<span class="success text-success"><i class="fa fa-check"></i> ' + response.message + '</span>');
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        } else {
                            $messages.empty().append('<span class="error text-danger"><i class="fa fa-close"></i> ' + response.message + '</span>');
                        }
                    },
                    error: function () {
                        // Handle the registration error response
                        console.log(error);
                    }
                });
            }
        });
    }
    var showRegisterLoginModal = function () {
        // class display-pop-login is custom class in Appearance menu
        $('.display-pop-login').on('click', function () {
            if (ajax_object.enable_login_popup == 'y') {
                $("#tfre_login_register_modal").modal('show');
                tfre_reset_login_modal();
            } else if (ajax_object.login_page) {
                window.location.href = ajax_object.login_page;
            } else {
                window.location.href = window.location.href;
            }

        });
    }
    var tfre_reset_login_modal = function () {
        var registerSection = document.getElementById('tfre_register_section');
        var loginSection = document.getElementById('tfre_login_section');
        var resetSection = document.getElementById('tfre-reset-password-section');
        loginSection.style.display = "block";
        registerSection.style.display = "none";
        resetSection.style.display = "none";
    }
    var redirectLogin = function () {
        var registerSection = document.getElementById('tfre_register_section');
        var loginSection = document.getElementById('tfre_login_section');
        var resetSection = document.getElementById('tfre-reset-password-section');

        $('.tfre_login_redirect, .display-pop-login.login').on('click', function () {
            loginSection.style.display = "block";
            registerSection.style.display = "none";
            resetSection.style.display = "none";
        });

        $('#tfre_register_redirect, .display-pop-login.register').on('click', function () {
            loginSection.style.display = "none";
            registerSection.style.display = "block";
            resetSection.style.display = "none";

        });

        $('#tfre-reset-password').on('click', function () {
            loginSection.style.display = "none";
            registerSection.style.display = "none";
            resetSection.style.display = "block";
        });
    }
    var handleResetPassword = function () {
        $('.tfre_forgetpass').on('click', function (e) {
            e.preventDefault();
            var $form = $(this).parents('form');
            $.ajax({
                type: 'post',
                url: ajax_object.ajaxUrl,
                dataType: 'json',
                data: $form.serialize(),
                beforeSend: function () {
                    $('.tfre_messages_reset_password').empty().append('<span class="success text-success"> Loading </span>');
                },
                success: function (response) {
                    if (response.success) {
                        $('.tfre_messages_reset_password').empty().append('<span class="success text-success"><i class="fa fa-check"></i> ' + response.message + '</span>');
                    } else {
                        $('.tfre_messages_reset_password').empty().append('<span class="error text-danger"><i class="fa fa-close"></i> ' + response.message + '</span>');
                    }
                }
            });
        });
    }
    var checkFieldRequired = function (field_required) {
        return (field_required == true);
    }
    var validateProfileForm = function () {
        var formParent = $(".tfre_profile");
        var full_name = ajax_object.required_profile_fields.full_name,
            user_description = ajax_object.required_profile_fields.user_description,
            user_company = ajax_object.required_profile_fields.user_company,
            user_position = ajax_object.required_profile_fields.user_position,
            user_office_number = ajax_object.required_profile_fields.user_office_number,
            user_office_address = ajax_object.required_profile_fields.user_office_address,
            user_licenses = ajax_object.required_profile_fields.user_licenses,
            user_job = ajax_object.required_profile_fields.user_job,
            user_email = ajax_object.required_profile_fields.user_email,
            user_phone = ajax_object.required_profile_fields.user_phone,
            user_location = ajax_object.required_profile_fields.user_location,
            user_socials = ajax_object.required_profile_fields.user_socials;

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
                })

            },
            highlight: function (element, errorClass, validClass) {
                var elem = $(element);
                elem.addClass(errorClass).removeClass(validClass);
                elem.addClass('is-invalid').removeClass('is-valid');
            },
            unhighlight: function (element, errorClass, validClass) {
                var elem = $(element);
                elem.removeClass(errorClass).addClass(validClass);
                elem.removeClass('is-invalid').addClass('is-valid');

            },
            rules: {
                full_name: {
                    required: checkFieldRequired(full_name),
                },
                user_description: {
                    required: checkFieldRequired(user_description)
                },
                user_company: {
                    required: checkFieldRequired(user_company)
                },
                user_position: {
                    required: checkFieldRequired(user_position)
                },
                user_office_number: {
                    required: checkFieldRequired(user_office_number)
                },
                user_office_address: {
                    required: checkFieldRequired(user_office_address)
                },
                user_licenses: {
                    required: checkFieldRequired(user_licenses),
                },
                user_job: {
                    required: checkFieldRequired(user_job),
                },
                user_email: {
                    required: checkFieldRequired(user_email)
                },
                user_phone: {
                    required: checkFieldRequired(user_phone)
                },
                user_location: {
                    required: checkFieldRequired(user_location),
                },
                user_facebook: {
                    required: checkFieldRequired(user_socials),
                },
                user_twitter: {
                    required: checkFieldRequired(user_socials),
                },
                user_linkedin: {
                    required: checkFieldRequired(user_socials),
                },
            },
            messages: {
                full_name: "",
                user_description: "",
                user_company: "",
                user_position: "",
                user_office_number: "",
                user_office_address: "",
                user_licenses: "",
                user_job: "",
                user_email: "",
                user_phone: "",
                user_location: "",
                user_socials: "",
                user_phone: "",
            },
            submitHandler: function (form) {
                var formData = $(form).serialize();
                var $messages = $(this).parents('.tfre_profile-form').find('.tfre_message');

                $.ajax({
                    type: 'POST',
                    url: ajax_object.ajaxUrl,
                    data: formData + '&action=profile_update&security=' + ajax_object.nonce,
                    beforeSend: function () {
                        $messages.empty().append('<span class="success text-success"> Loading </span>');
                    },
                    success: function (response) {
                        if (response.status) {
                            $messages.empty().append('<span class="success text-success"><i class="fa fa-check"></i> ' + response.message + '</span>');

                        } else {
                            $messages.empty().append('<span class="error text-danger"><i class="fa fa-close"></i> ' + response.message + '</span>');
                        }
                    },
                    error: function (xhr, status, error) {
                        console.log(error);
                    }
                });
            }
        });
    }
    var handleChangePassword = function () {
        $("#tfre_change_pass").on('click', function () {
            var security_password, old_pass, new_pass, confirm_pass;

            var $this = $(this);
            var $form = $this.parents('form');
            old_pass = $("#old_pass").val();
            new_pass = $("#new_pass").val();
            confirm_pass = $("#confirm_pass").val();
            security_password = $("#tfre_security_change_password").val();
            var $messages = $(this).parents('.tfre-change-password').find('.tfre_message');
            if ($form.valid()) {
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: ajax_object.ajaxUrl,
                    data: {
                        'action': 'tfre_change_password_ajax',
                        'old_pass': old_pass,
                        'new_pass': new_pass,
                        'confirm_pass': confirm_pass,
                        'tfre_security_change_password': security_password
                    },
                    beforeSend: function () {
                        $messages.empty().append('<span class="success text-success"> Loading </span>');
                    },
                    success: function (response) {
                        if (response.success) {
                            $messages.empty().append('<span class="success text-success"><i class="fa fa-check"></i> ' + response.message + '</span>');

                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        } else {
                            $messages.empty().append('<span class="error text-danger"><i class="fa fa-close"></i> ' + response.message + '</span>');
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
    var togglePassword = function () {
        $('.togglepassword.login, .togglepassword.register').click(function (e) {
            e.preventDefault();
            if ($(this).closest('.show_hide_password').find('.password').attr("type") == "text") {
                $(this).closest('.show_hide_password').find('.password').attr('type', 'password');
                $(this).addClass("fa-eye-slash");
                $(this).removeClass("fa-eye");
            } else if ($(this).closest('.show_hide_password').find('.password').attr("type") == "password") {
                $(this).closest('.show_hide_password').find('.password').attr('type', 'text');
                $(this).removeClass("fa-eye-slash");
                $(this).addClass("fa-eye");
            }
        })
    }
    var toggleConfirmPassword = function () {
        $('#toggleConfirmPassword').click(function (e) {
            e.preventDefault();
            if ($(this).closest('#show_hide_confirm_password').find('#confirm_password, #confirm_pass').attr("type") == "text") {
                $(this).closest('#show_hide_confirm_password').find('#confirm_password, #confirm_pass').attr('type', 'password');
                $(this).addClass("fa-eye-slash");
                $(this).removeClass("fa-eye");
            } else if ($(this).closest('#show_hide_confirm_password').find('#confirm_password, #confirm_pass').attr("type") == "password") {
                $(this).closest('#show_hide_confirm_password').find('#confirm_password, #confirm_pass').attr('type', 'text');
                $(this).removeClass("fa-eye-slash");
                $(this).addClass("fa-eye");
            }
        })
    }
    var toggleNewPassword = function () {
        $('#toggleNewPass').click(function () {
            if ($(this).closest('#show_hide_new_pass').find('#new_pass').attr("type") == "text") {
                $(this).closest('#show_hide_new_pass').find('#new_pass').attr('type', 'password');
                $(this).addClass("fa-eye-slash");
                $(this).removeClass("fa-eye");
            } else if ($(this).closest('#show_hide_new_pass').find('#new_pass').attr("type") == "password") {
                $(this).closest('#show_hide_new_pass').find('#new_pass').attr('type', 'text');
                $(this).removeClass("fa-eye-slash");
                $(this).addClass("fa-eye");
            }
        })
    }
    var toggleOldPassword = function () {
        $('#toggleOldPass').click(function () {
            if ($(this).closest('#show_hide_old_pass').find('#old_pass').attr("type") == "text") {
                $(this).closest('#show_hide_old_pass').find('#old_pass').attr('type', 'password');
                $(this).addClass("fa-eye-slash");
                $(this).removeClass("fa-eye");
            } else if ($(this).closest('#show_hide_old_pass').find('#old_pass').attr("type") == "password") {
                $(this).closest('#show_hide_old_pass').find('#old_pass').attr('type', 'text');
                $(this).removeClass("fa-eye-slash");
                $(this).addClass("fa-eye");
            }
        })
    }
    var setAccessTokenGoogle = function () {
        var urlParams = new URLSearchParams(window.location.search);
        var code = urlParams.get('code');
        if (code) {
            $.ajax({
                type: 'post',
                url: ajax_object.ajaxUrl,
                dataType: 'json',
                data: {
                    'action': 'set_access_token_google',
                    'security': ajax_object.nonce,
                    'code': code
                },
                success: function (res) {
                    if (res.status) {
                        handleLoginGoogle();
                    }
                },
                error: function (error) {
                    console.log(error);
                }
            })
        }
    }
    var handleLoginGoogle = function () {
        $.ajax({
            type: 'post',
            url: ajax_object.ajaxUrl,
            dataType: 'json',
            data: {
                'action': 'handle_google_login',
                'security': ajax_object.nonce,
            },
            success: function (res) {
                if (res.status) {
                    window.location.href = res.redirect_url;
                }
            },
            error: function (error) {
                console.log(error);
            }
        })
    }

    jQuery(document).ready(function ($) {
        handleLogin();
        setAccessTokenGoogle();
        handleRegister();
        validateProfileForm();
        handleUpdateProfile();
        handleUploadImage();
        handleUploadAgentPoster();
        handleBecomeAgent();
        handleLeaveAgent();
        showRegisterLoginModal();
        redirectLogin();
        handleResetPassword();
        handleChangePassword();
        togglePassword();
        toggleConfirmPassword();
        toggleNewPassword();
        toggleOldPassword();
    });
})(jQuery);