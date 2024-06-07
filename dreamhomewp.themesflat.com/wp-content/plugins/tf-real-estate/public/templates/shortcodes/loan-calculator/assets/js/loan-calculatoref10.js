(function ($) {
    var loanCalculator = function () {
        $('.loan-calculator-form :input').change(function () {
            var totalAmount = parseFloat($('#total_amount').val().replace(/,/g, ''), 10);
            var downPayment = parseFloat($('#down_payment').val().replace(/,/g, ''), 10);
            var amortizationPeriod = parseFloat($('#amortization_period').val().replace(/,/g, ''), 10);
            var interestRate = parseFloat($('#interest_rate').val().replace(/,/g, ''), 10);
            totalAmount = downPayment ? totalAmount - downPayment : totalAmount;
            var monthlyPayment = '';
            if (totalAmount && amortizationPeriod && interestRate) {
                monthlyPayment = totalAmount * ((interestRate / 100) / 12) / (1 - (Math.pow((1 + (((interestRate / 100) / 12))), -amortizationPeriod)));
                $('.loan-calculator-form #monthly-payment-value').text(Math.round(monthlyPayment * 100) / 100);
            }
        });
    }

    var addCommaInputNumber = function () {
        $(".loan-calculator-form input[type='text']").keyup(function (event) {
            // skip for arrow keys
            if (event.which >= 37 && event.which <= 40) {
                event.preventDefault();
            }
            $(this).val(function (index, value) {
                return value
                    .replace(/\D/g, "")
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            });
        });
    }

    $(document).ready(function () {
        loanCalculator();
        addCommaInputNumber();
    })
})(jQuery);