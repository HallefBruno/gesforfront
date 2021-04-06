/* global Message */

$(document).ready(function () {
    var message = new Message.Warning();
    events(message);
    mascaras();
    poluarSelectCadastro();
    populaSelectAutomoveis();
    camposObrigatorioAutomovel();
});

function storage() {
    getStorage64("telefones");
}

function events(message) {
    addAutomovelGrid(message);
}


function poluarSelectCadastro() {
    
    var url = localStorage.getItem("currentUri");
    
    $(".select-telefones").select2({
        theme: "bootstrap4",
        placeholder: "Telefone",
        allowClear: true,
        language: "pt-BR"
    });
    
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
            $("#automoveis").val(null).trigger("change");
            $("#automoveis").prop("disabled",false);
        });
        
        $("#fabricante").on("select2:unselecting", function () {
            $("#automoveis").prop("disabled",true);
        });
        
    });
}

function mascaras() {
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
        var mask = 'AAA0A00';
        var mercosul = /([A-Za-z]{3}[0-9]{1}[A-Za-z]{1})/;
        var normal = /([A-Za-z]{3}[0-9]{2})/;
        var replaced = val.replace(/[^\w]/g, '');
        if (normal.exec(replaced)) {
            mask = 'AAA-0000';
        } else if (mercosul.exec(replaced)) {
            mask = 'AAA-0A00';
        }
        return mask;
    },
    mercoSulOptions = {
        onKeyPress: function (val, e, field, options) {
            field.mask(mercoSulMaskBehavior.apply({}, arguments), options);
        }
    };
    
    $("#telefone").mask(maskPhone, novoDigito);
    $("#dataNascimento").mask("00/00/0000");
    $("#placa").mask(mercoSulMaskBehavior, mercoSulOptions);
}

function addAutomovelGrid(message) {
    
    var tblAutomovels = $(".tbl-add-automovel").DataTable({
        
        "paginate": false,
        "lengthChange": false,
        "info": false,
        "autoWidth": false,
        "filter": false,
        language: {
            url: "vendor/internationalisation/pt_br.json"
        },
        columnDefs: [
            {
                targets: [4, 5],
                className: 'text-center'
            }
        ]
    });

    var automovelGrid = {};
    var automoveisGrid = [];
    var htmltipo = "";

    $("#btn-add-novo-automovel").click(function () {
        if ($("#form-automoveis").valid()) {

            $("#tr-msg").css("display", "none");

            automovelGrid = {
                id: $("#automoveis option:selected").filter(':selected').val(),
                nome: $("#automoveis option:selected").filter(':selected').text(),
                fabricante: {
                    id: $("#fabricante option:selected").filter(':selected').val(),
                    nome: $("#fabricante option:selected").filter(':selected').text()
                },
                tipoAutomovel: $("#tipo").val(),
                cor: $("#cor option:selected").filter(':selected').val(),
                placa: $("#placa").val()
            };

            if(automovelExist(automoveisGrid, automovelGrid.placa)) {
                message.show("Esse automovel já foi adicionado","N");
                return;
            }
            
            automoveisGrid.push(automovelGrid);
            if (automovelGrid.tipoAutomovel === "Carro") {
                htmltipo = "<span class='text-center badge badge-primary'>" + automovelGrid.tipoAutomovel + "</span>";
            } else if (automovelGrid.tipoAutomovel === "Moto") {
                htmltipo = "<span class='text-center badge badge-success'>" + automovelGrid.tipoAutomovel + "</span>";
            }

            tblAutomovels.row.add([
                automovelGrid.fabricante.nome,
                automovelGrid.nome,
                automovelGrid.placa,
                automovelGrid.cor,
                htmltipo,
                "<button id='btn-remover' data-key='" + automovelGrid.placa + "' type='button' title='Remover' class='text-center btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button>"
            ]).draw(false);

        }
    });
    
    tblAutomovels.on("click","#btn-remover", function () {
        tblAutomovels.row($(this).parents("tr")).remove().draw();
        var placa = $(this).data("key");
        
        console.log(placa);
        console.log(automoveisGrid,"antes");
        
        for(var i=0; i<automoveisGrid.length; i++) {
            if(automoveisGrid[i].placa === placa) {
                automoveisGrid.splice(i,1);
            }
        }
        
        //automoveisGrid = automoveisGrid.filter(automovel => Number(automovel.id) !== id);
        console.log(automoveisGrid,"depois");
    });
}

function automovelExist(array, placa) {
    return array.some(function (p) {
        return p.placa === placa;
    });
}

function camposObrigatorioAutomovel() {
    $("#form-automoveis").validate({
        rules: {
            fabricante: {
                required: true
            },
            
            automoveis: {
                required: true
            },
            
            cor: {
                required: true
            },
            
            placa: {
                required: true,
                minlength: 8
            }
        },
        messages: {
            fabricante: {
                required: ""
            },
            automoveis: {
                required: ""
            },
            cor: {
                required: ""
            },
            placa: {
                required: "",
                minlength: "Mínimo oito caracter"
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {

            error.addClass("invalid-feedback");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.next("label"));
            } else if(element.prop("type") === "select-one") {
                error.insertBefore(element);
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element) {
            $(element).removeClass("is-invalid");
        }
    });
}


function populaSelectAutomoveis() {
    var url = localStorage.getItem("currentUri");
    $("#automoveis").prop("disabled",true);
    
    $("#automoveis").select2({
        theme: "bootstrap4",
        placeholder: "Automóveis",
        allowClear: true,
        language: "pt-BR",
        multiple: false,
        closeOnSelect: true,
        minimumInputLength: 1,
        ajax: {
            url: url+"/morador/automoveis",
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
            return markup;
        },
        templateSelection: function (automovel) {
            var tipo = automovel.tipo;
            var html = "";
            if (tipo === "C") {
                tipo = "Carro";
                html = $("<span>" + automovel.text + "</span><span style='margin-top:11px;' class='text-right badge badge-primary'>" + tipo + "</span>");
            } else if(tipo === "M") {
                tipo = "Moto";
                html = $("<span>" + automovel.text + "</span><span style='margin-top:11px;' class='text-right badge badge-success'>" + tipo + "</span>");
            } else {
                html = $("<span>" + automovel.text + "</span>");
            }
            $("#tipo").val(tipo);
            return html;
        }
    });
}

function styleSelectAutomoveis(automovel) {
    var tipo = automovel.tipo;
    var html = "";
    if (tipo === "C") {
        tipo = "Carro";
        html = $("<span>" + automovel.text + "</span><span class='text-right badge badge-primary'>" + tipo + "</span>");
    } else if(tipo === "M") {
        tipo = "Moto";
        html = $("<span>" + automovel.text + "</span><span class='text-right badge badge-success'>" + tipo + "</span>");
    } else {
        html = $("<span>" + automovel.text + "</span>");
    }
    return html;
}





//$('.money').mask('#.##0,00', {reverse: true});