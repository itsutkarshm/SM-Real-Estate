jQuery(document).ready(function($) {
    $('.datetimepicker').datepicker({
        dateFormat: 'yy-mm-dd', // Set your desired date format
        minDate: new Date(0), // Optionally set a minimum date
        // Additional configuration options can be added here
    });
});