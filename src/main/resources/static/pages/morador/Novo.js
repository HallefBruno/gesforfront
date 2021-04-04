$(document).ready(function () {
    init();
    var url = localStorage.getItem("currentUri");
    
    $.get(url + "/morador/estado-civil", function (data) {

        var estadoCivil;
        var estadosCivil = [];
        $.each(data, function (i, values) {
            estadoCivil = {
                id: values.id,
                text: values.text
            };
            estadosCivil.push(estadoCivil);
        });

        $("#select-estado-civil").select2({
            theme: "bootstrap4",
            placeholder: "Selecione o estado civil",
            allowClear: true,
            language: "pt-BR",
            data: estadosCivil
        });
        
    });

    $.get(url + "/morador/tipo-residencia", function (data) {

        var tipoResidencia;
        var tiposResidencias = [];
        $.each(data, function (i, values) {
            tipoResidencia = {
                id: values.id,
                text: values.text
            };
            tiposResidencias.push(tipoResidencia);
        });

        $("#select-tipo-residencia").select2({
            theme: "bootstrap4",
            placeholder: "Selecione tipo residência",
            allowClear: true,
            language: "pt-BR",
            data: tiposResidencias
        });
        
    });
    
    $.get(url + "/morador/fabricantes", function (data) {

        var fabricante;
        var fabricantes = [];
        $.each(data, function (i, values) {
            fabricante = {
                id: values.id,
                text: values.text
            };
            fabricantes.push(fabricante);
        });

        $("#fabricante").select2({
            theme: "bootstrap4",
            placeholder: "Selecione o fabricante",
            allowClear: true,
            language: "pt-BR",
            data: fabricantes
        });
        
        $("#fabricante").on("select2:selecting",function (e) {
            var fabricanteId = e.params.args.data.id;
            $("#fabricante-id").val(fabricanteId);
            $("#select-automoveis").val(null).trigger("change");
            $("#select-automoveis").prop("disabled",false);
        });
        
        $("#fabricante").on("select2:unselecting", function () {
            $("#select-automoveis").prop("disabled",true);
        });
        
    });
    
});

function init() {
    
    $(".select-telefones").select2({
        theme: "bootstrap4",
        placeholder: "Telefone",
        allowClear: true,
        language: "pt-BR"
    });
    
    $("#animalDomentico").bootstrapToggle("off", true);
    
    $("#sexo").bootstrapToggle("on", true);
    
    $("#cpf").mask('000.000.000-00', {reverse: true});
    var maskPhone = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
    novoDigito = {
        onKeyPress: function (val, e, field, options) {
            field.mask(maskPhone.apply({}, arguments), options);
        }
    };
    
    
    var mercoSulMaskBehavior = function (val) {
        var myMask = 'AAA0A00';
        var mercosul = /([A-Za-z]{3}[0-9]{1}[A-Za-z]{1})/;
        var normal = /([A-Za-z]{3}[0-9]{2})/;
        var replaced = val.replace(/[^\w]/g, '');
        if (normal.exec(replaced)) {
            myMask = 'AAA-0000';
        } else if (mercosul.exec(replaced)) {
            myMask = 'AAA-0A00';
        }
        return myMask;
    },
    mercoSulOptions = {
        onKeyPress: function (val, e, field, options) {
            field.mask(mercoSulMaskBehavior.apply({}, arguments), options);
        }
    };
    
    $("#telefone").mask(maskPhone, novoDigito);
    $("#dataNascimento").mask("00/00/0000");
    $("#placa-carro").mask(mercoSulMaskBehavior, mercoSulOptions);
    $("#placa-moto").mask(mercoSulMaskBehavior, mercoSulOptions);
    
    getStorage64("telefones");
    
    automoveis();
}


function automoveis() {
    
    $("#select-automoveis").prop("disabled",true);
    
    $("#select-automoveis").select2({
        theme: "bootstrap4",
        placeholder: "Automóveis",
        allowClear: true,
        language: "pt-BR",
        multiple: false,
        closeOnSelect: true,
        minimumInputLength: 1,
        ajax: {
            url: "http://127.0.0.1:8082/flashapi/morador/automoveis",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    q: params.term,
                    fabricanteId:$("#fabricante-id").val(),
                    page: params.page
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 0;
                return {
                    results: data.items,
                    pagination: {
                        more: (params.page * 10) < data.totalItens
                    }
                };
            },
            cache: true
        },
        
        templateResult:styleSelectAutomoveis,
        
        escapeMarkup: function (markup) {
            window.console.debug(markup);
            return markup;
        },
        templateSelection: function (automovel) {
            window.console.warn(automovel.loading);
            var tipo = automovel.tipo;
            var html = "";
            if (tipo === "C") {
                tipo = "Carro";
                html = $("<span>" + automovel.text + "</span><span style='margin-top:9px;' class='text-right badge badge-primary'>" + tipo + "</span>");
            } else {
                tipo = "Moto";
                html = $("<span>" + automovel.text + "</span><span style='margin-top:9px;' class='text-right badge badge-success'>" + tipo + "</span>");
            }
            
            return html;
        }
    });
}

function styleSelectAutomoveis(automovel) {
    window.console.warn(automovel.loading);
    var tipo = automovel.tipo;
    var html = "";
    if (tipo === "C") {
        tipo = "Carro";
        html = $("<span>" + automovel.text + "</span><span class='text-right badge badge-primary'>" + tipo + "</span>");
    } else {
        tipo = "Moto";
        html = $("<span>" + automovel.text + "</span><span class='text-right badge badge-success'>" + tipo + "</span>");
    }
    return html;
}






//$('.money').mask('#.##0,00', {reverse: true});