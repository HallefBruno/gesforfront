$(document).ready(function () {
    init();
});

function init() {
    
    $("#animalDomentico").bootstrapToggle("off", true);
    $("#cpf").mask('000.000.000-00', {reverse: true});
    var maskPhone = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
    spOptions = {
        onKeyPress: function (val, e, field, options) {
            field.mask(maskPhone.apply({}, arguments), options);
        }
    };
    $("#telefone").mask(maskPhone, spOptions);
}
//$('.money').mask('#.##0,00', {reverse: true});