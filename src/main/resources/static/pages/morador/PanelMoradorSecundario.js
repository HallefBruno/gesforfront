/* global Message */

var automoveisMoradorsecundario = [];
var automoveisMoradorSecundarioGrid = [];
var moradorSecundarioList = [];

$(function () {
    automoveisMoradorsecundario = [];
    automoveisMoradorSecundarioGrid = [];
    moradorSecundarioList = [];
    init();
    popularSelects();
    populaSelectAutomoveis();
    addAutomovelGrid();
    addRemoveMoradorSecundario();
    camposObrigatorioAutomovel();
    camposObrigatorioMoradorSecundario();
});


function addAutomovelGrid() {
    
    var message = new Message.Warning();
    var toast = new Message.SuccessToast();
    var htmltipo = "";
    
    $(".tbl-add-automovel-morador-secundario").DataTable({

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

    $("#btnAddNovoAutomovelSecundario").click(function () {
        if ($("#formAutomoveisMoradorSecundario").valid()) {

            var automovelutomovelSecundarioGrid = {
                id: $("#automoveisMoradorSecundario option:selected").filter(':selected').val(),
                nome: $("#automoveisMoradorSecundario option:selected").filter(':selected').text(),
                fabricante: {
                    id: $("#fabricanteMoradorSecundario option:selected").filter(':selected').val(),
                    nome: $("#fabricanteMoradorSecundario option:selected").filter(':selected').text()
                },
                tipoAutomovel: $("#tipoAutomovel").val(),
                cor: $("#corMoradorSecundario option:selected").filter(':selected').val(),
                placa: $("#placaMoradorSecundario").val()
            };

            var moradorAutomovelSecundario = {
                automovel:{
                   id:automovelutomovelSecundarioGrid.id
                },
                placa:automovelutomovelSecundarioGrid.placa,
                cor:automovelutomovelSecundarioGrid.cor
            };
            
            if(automovelExist(automoveisMoradorsecundario, moradorAutomovelSecundario.placa)) {
                message.show("Esse automovel já foi adicionado","N");
                return;
            }
            
            automoveisMoradorsecundario.push(moradorAutomovelSecundario);
            automoveisMoradorSecundarioGrid.push(automovelutomovelSecundarioGrid);
            
            if (automovelutomovelSecundarioGrid.tipoAutomovel === "Carro") {
                htmltipo = "<span class='text-center badge badge-primary'>" + automovelutomovelSecundarioGrid.tipoAutomovel + "</span>";
            } else if (automovelutomovelSecundarioGrid.tipoAutomovel === "Moto") {
                htmltipo = "<span class='text-center badge badge-success'>" + automovelutomovelSecundarioGrid.tipoAutomovel + "</span>";
            }

            $(".tbl-add-automovel-morador-secundario").DataTable().row.add([
                automovelutomovelSecundarioGrid.fabricante.nome,
                automovelutomovelSecundarioGrid.nome,
                automovelutomovelSecundarioGrid.placa,
                automovelutomovelSecundarioGrid.cor,
                htmltipo,
                "<button id='btnRemoverAutomovelMoradorSecundario' data-key='" + automovelutomovelSecundarioGrid.placa + "' type='button' title='Remover' class='text-center btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button>"
            ]).draw(false);
            
            selects = [{"id":"#automoveisMoradorSecundario",disabled:true},{"id":"#fabricanteMoradorSecundario"}];
            cleanForm("#formAutomoveisMoradorSecundario",selects);
            toast.show("Automovel adicionado!");
            console.log("Adicionado");
        }
    });
    
    $(".tbl-add-automovel-morador-secundario").DataTable().on("click","#btnRemoverAutomovelMoradorSecundario", function () {
        var placa = $(this).data("key");
        for(var i=0; i<automoveisMoradorSecundarioGrid.length; i++) {
            if(automoveisMoradorSecundarioGrid[i].placa === placa) {
                if(moradorSecundarioList.length > 0 && moradorSecundarioList[i].automoveis) {//typeof myVar !== 'undefined'
                    automoveisMoradorSecundarioGrid.splice(i,1);
                    automoveisMoradorsecundario.splice(i,1);
                    moradorSecundarioList[i].automoveis = automoveisMoradorsecundario;
                    $(".tbl-add-automovel-morador-secundario").DataTable().row($(this).parents("tr")).remove().draw();
                } else {
                    automoveisMoradorSecundarioGrid.splice(i,1);
                    automoveisMoradorsecundario.splice(i,1);
                    $(".tbl-add-automovel-morador-secundario").DataTable().row($(this).parents("tr")).remove().draw();
                }
            }
        }
    });
}

function addRemoveMoradorSecundario() {
    
    var message = new Message.Warning();
    var toast = new Message.SuccessToast();
    moradorSecundarioList = [];
    var htmlButtonMostrarCarros = "";
    
    $(".tbl-moradores-secundario").DataTable({

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
                targets: [4],
                className: 'text-center'
            }
        ]
    });
    
    $("#btnAdicionarmMoradorSecundario").click(function () {
        if ($("#formPrincipalMoradorSecundario").valid()) {
            
            var moradorSecundario = {
                nome: $("#nomeMoradorSecundario").val(),
                cpf: $("#cpfMoradorSecundario").val(),
                rg: $("#rgMoradorSecundario").val(),
                orgaoEmissor: $("#emissorMoradorSecundario").val(),
                dataNascimento: $("#dataNascimentoMoradorSecundario").val(),
                naturalidade: $("#nataralMoradorSecundario").val(),
                estadoCivil: $("#estadoCivilMoradorSecundario :selected").val(),
                sexo: $("#sexoMoradorSecundario").prop("checked") === true ? "Masculino" : "Feminino",
                grauParentesco: $("#grauParentesco :selected").val(),
                telefone: $("#telefoneMoradorSecundario").val(),
                automoveis: automoveisMoradorsecundario
            };
            
            if(moradorExist(moradorSecundarioList, moradorSecundario.cpf)) {
                message.show("Esse morador já foi adicionado","N");
                return;
            }
            
            htmlButtonMostrarCarros = "";
            if(moradorSecundario.automoveis) {
                htmlButtonMostrarCarros = "<button id='btnCarroVinculadoMoradorSecundario' data-key='" + moradorSecundario.cpf + "' type='button' title='Carros vinculados' class='text-center btn btn-outline-primary btn-sm'><i class='fa fa-archive'></i></button>";
            }
            
            moradorSecundarioList.push(moradorSecundario);
            
            $(".tbl-moradores-secundario").DataTable().row.add([
                moradorSecundario.nome,
                moradorSecundario.cpf,
                moradorSecundario.sexo,
                moradorSecundario.grauParentesco,
                "<button id='btnRemoverMoradorSecundario' data-key='" + moradorSecundario.cpf + "' type='button' title='Remover' class='text-center btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button> "+htmlButtonMostrarCarros
            ]).draw(false);
            
            $(".tbl-add-automovel-morador-secundario").DataTable().clear().draw();
            $("#sexoMoradorSecundario").prop("checked", true).change();
            selects = [{"id":"#estadoCivilMoradorSecundario"},{"id":"#grauParentesco"}];
            cleanForm("#formPrincipalMoradorSecundario",selects);
            toast.show("Morador secundário adicionado!");
        }
    });

    $(".tbl-moradores-secundario").DataTable().on("click","#btnRemoverMoradorSecundario", function () {
        var cpf = $(this).data("key");
        var atualizaGridCarro = false;
        console.log(cpf);
        for (var i = 0; i < moradorSecundarioList.length; i++) {
            if (moradorSecundarioList[i].cpf === cpf) {
                if (moradorSecundarioList[i].automoveis) {
                    for (var j = 0; j < automoveisMoradorSecundarioGrid.length; j++) {
                        for (var k = 0; k < moradorSecundarioList[i].automoveis.length; k++) {
                            if(automoveisMoradorSecundarioGrid[j].placa === moradorSecundarioList[i].automoveis[k].placa) {
                                automoveisMoradorSecundarioGrid.splice(j,1);
                                moradorSecundarioList[i].automoveis.splice(k,1);
                                k = j = -1;
                                atualizaGridCarro = true;
                                break;
                            }
                        }
                    }
                }
                moradorSecundarioList.splice(i, 1);
                $(".tbl-moradores-secundario").DataTable().row($(this).parents("tr")).remove().draw();
            }
        }
        if(atualizaGridCarro) {
            toast.show("Morador secundário removido!");
            $(".tbl-add-automovel-morador-secundario").DataTable().clear().draw();
        }
    });
    
    $(".tbl-moradores-secundario").DataTable().on("click","#btnCarroVinculadoMoradorSecundario", function () {
        $(".tbl-add-automovel-morador-secundario").DataTable().clear().draw();
        var cpf = $(this).data("key");
        console.log(cpf);
        for (var i = 0; i < moradorSecundarioList.length; i++) {
            if (moradorSecundarioList[i].cpf === cpf) {
                if (moradorSecundarioList[i].automoveis) {
                    for (var j = 0; j < automoveisMoradorSecundarioGrid.length; j++) {
                        for (var k = 0; k < moradorSecundarioList[i].automoveis.length; k++) {
                            if(automoveisMoradorSecundarioGrid[j].placa === moradorSecundarioList[i].automoveis[k].placa) {
                                $(".tbl-add-automovel-morador-secundario").DataTable().row.add([
                                    automoveisMoradorSecundarioGrid[j].fabricante.nome,
                                    automoveisMoradorSecundarioGrid[j].nome,
                                    automoveisMoradorSecundarioGrid[j].placa,
                                    automoveisMoradorSecundarioGrid[j].cor,
                                    automoveisMoradorSecundarioGrid[j].tipoAutomovel === "Carro" ? "<span class='text-center badge badge-primary'>" + automoveisMoradorSecundarioGrid[j].tipoAutomovel + "</span>":"<span class='text-center badge badge-success'>" + automoveisMoradorSecundarioGrid[j].tipoAutomovel + "</span>",
                                    "<button id='btnRemoverAutomovelMoradorSecundario' data-key='" + automoveisMoradorSecundarioGrid[j].placa + "' type='button' title='Remover' class='text-center btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button>"
                                ]).draw(false);
                                break;
                            }
                        }
                    }
                }
            }
        }
    });
}


function popularSelects() {
    
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

        $("#estadoCivilMoradorSecundario").select2({
            theme: "bootstrap4",
            placeholder: "Selecione o estado civil",
            allowClear: true,
            language: "pt-BR",
            data: estadosCivil
        });

    });
    
    $.get(url+"/morador/grau-parentesco", function (data) {
        var grauParentesco = {};
        var grauParentescos = [];
        $.each(data, function (i, values) {
            grauParentesco = {
                id: values.id,
                text: values.text
            };
            grauParentescos.push(grauParentesco);
        });
        
        $("#grauParentesco").select2({
            theme: "bootstrap4",
            placeholder: "Selecione o grau de parentesco",
            allowClear: true,
            language: "pt-BR",
            data: grauParentescos,
            templateResult: styleSelectGrauParentesco
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

        $("#fabricanteMoradorSecundario").select2({
            theme: "bootstrap4",
            placeholder: "Selecione o fabricante",
            allowClear: true,
            language: "pt-BR",
            data: fabricantes
        });
        
        $("#fabricanteMoradorSecundario").on("select2:selecting",function (e) {
            var fabricanteId = e.params.args.data.id;
            $("#fabricanteMoradorSecundario-id").val(fabricanteId);
            $("#automoveisMoradorSecundario").val(null).trigger("change");
            $("#automoveisMoradorSecundario").prop("disabled",false);
        });
        
        $("#fabricanteMoradorSecundario").on("select2:unselecting", function () {
            $("#automoveisMoradorSecundario").val(null).trigger("change");
            $("#automoveisMoradorSecundario").prop("disabled",true);
        });
        
    });
}

function init() {

    $("#sexoMoradorSecundario").bootstrapToggle("on", true);

    $("#cpfMoradorSecundario").mask('000.000.000-00', {reverse: true});
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

    $("#telefoneMoradorSecundario").mask(maskPhone, novoDigito);
    $("#placaMoradorSecundario").mask(mercoSulMaskBehavior, mercoSulOptions);

}

function camposObrigatorioMoradorSecundario() {
    
    $("#formPrincipalMoradorSecundario").validate({
        rules: {
            nomeMoradorSecundario: {
                required: true,
                rangelength: [3, 200]
            },
            cpfMoradorSecundario: {
                required: true,
                minlength:14
            },
            rgMoradorSecundario: {
                required: true,
                rangelength: [5, 11]
            },
            emissorMoradorSecundario: {
                required: true,
                rangelength: [4, 11]
            },
            dataNascimentoMoradorSecundario: {
                required: true,
                rangelength: [10,10]
            },
            nataralMoradorSecundario: {
                required: true,
                rangelength: [3, 50]
            },
            estadoCivilMoradorSecundario: {
                required: true
            },
            grauParentesco: {
                required: true
            },
            telefoneMoradorSecundario: {
                required: true
            }
        },
        messages: {
            nomeMoradorSecundario: {
                required: "Nome obrigatório!",
                rangelength:"Insira um nome entre {0} e {1} caracteres!" //jQuery.validator.format("Please enter a value between {0} and {1} characters long.")
            },
            cpfMoradorSecundario: {
                required: "CPF obrigatório!",
                minlength: "CPF inválido!"
            },
            rgMoradorSecundario: {
                required: "RG obrigatório!",
                rangelength: "Insira um rg entre {0} e {1} caracteres!"
            },
            emissorMoradorSecundario: {
                required: "Orgão emissor obrigatório!",
                rangelength: "Insira um orgão emissor entre {0} e {1} caracteres!"
            },
            dataNascimentoMoradorSecundario: {
                required: "Data nascimento obrigatória!",
                rangelength: "Insira uma data entre {0} e {1} caracteres!"
            },
            nataralMoradorSecundario: {
                required: "Naturalidade obrigatório!",
                rangelength: "Insira um valor entre {0} e {1} caracteres!"
            },
            estadoCivilMoradorSecundario: {
                required: "Estado civil obrigatório!"
            },
            grauParentesco: {
                required: "Grau parentesco obrigatório!"
            },
            telefoneMoradorSecundario: {
                required: "Telefone obrigatório!"
            }
        },
        errorContainer: ".alert-erro-morador-secundario",
        errorLabelContainer: ".alert-erro-morador-secundario ul",
        wrapper: "li"
    });
}

function camposObrigatorioAutomovel() {
    $("#formAutomoveisMoradorSecundario").validate({
        rules: {
            fabricanteMoradorSecundario: {
                required: true
            },
            
            automoveisMoradorSecundario: {
                required: true
            },
            
            corMoradorSecundario: {
                required: true
            },
            
            placaMoradorSecundario: {
                required: true,
                minlength: 8
            }
        },
        messages: {
            fabricanteMoradorSecundario: {
                required: ""
            },
            automoveisMoradorSecundario: {
                required: ""
            },
            corMoradorSecundario: {
                required: ""
            },
            placaMoradorSecundario: {
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
    
    $("#automoveisMoradorSecundario").prop("disabled",true);
    
    $("#automoveisMoradorSecundario").select2({
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
                    fabricanteId:$("#fabricanteMoradorSecundario-id").val(),
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
            $("#tipoAutomovel").val(tipo);
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


function styleSelectGrauParentesco(grauParentesco) {
    var html = "";
    var grau = grauParentesco.text;
    if (grau.toUpperCase() === ("ESPOSO") || 
        grau.toUpperCase() === ("ESPOSA") || 
        grau.toUpperCase() === ("FILHO")  || 
        grau.toUpperCase() === ("FILHA")  ||
        grau.toUpperCase() === ("PAI")    ||
        grau.toUpperCase() === ("MÃE")    ||
        grau.toUpperCase() === ("AVÔ")    ||
        grau.toUpperCase() === ("AVÓ")) {
        html = $("<span>" + grauParentesco.text + "</span><span class='text-right badge badge-primary'>" + "1° grau" + "</span>");
    } else {
        html = $("<span>" + grauParentesco.text + "</span>");
    }
    return html;
}

function moradorExist(array, cpf) {
    return array.some(function (p) {
        return p.cpf === cpf;
    });
}
