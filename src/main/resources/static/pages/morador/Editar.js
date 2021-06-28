/* global CONSTANTES, Message, getParam */
var message = new Message.Warning();
var toast = new Message.SuccessToast();
var listTelefoneEditarMoradorProprietario = [];
var morador = {};
var listAutomoveisMoradorProprietario = [];

$(function () {
    init();
    const moradorId = getParam().id;
    const urlMorador = CONSTANTES.currentUri+"/morador/buscar/"+moradorId;
    $.get(urlMorador, function (data) {
        window.console.log(data);
        morador = data;
        popularTabMoradorPrincipal(morador);
    });
});

function init() {
    $('[data-toggle="tooltip"]').tooltip();
    $("#animalDomentico").bootstrapToggle("off", true);
    $("#sexoMoradorSecundario").bootstrapToggle("off", true);
    $("#sexo").bootstrapToggle("off", true);
    $("#btnTerminar").prop("disabled", true);
    mascaraCpf("#cpf");
    mascaraCpf("#cpfMoradorSecundario");
    mascaraPlacaMercoSul("#placa");
    mascaraPlacaMercoSul("#placaMoradorSecundario");
    mascaraTelefone("#telefoneMoradorSecundario");
    camposObrigatorioAutomovel();
    
    $(".tbl-add-automovel").DataTable({

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
    
    
    camposObrigatoriosMorador();
}

function popularTabMoradorPrincipal() {
    setValueInputInForm("#formMoradorProprietario", morador);
    popularSelectEstadoCivil("#estadoCivil", morador.estadoCivil);
    popularSelectTelefone(morador.telefones);
    popularSelectFabricantes("#fabricante", "#automoveis", "#fabricante-id");
    popularSelectTipoResidencia(morador);
    populaSelectAutomoveis("#automoveis", "#fabricante-id");
    gridCarroMoradorPrincipal(morador.automoveisMoradores);
    listAutomoveisMoradorProprietario = morador.automoveisMoradores;
    listTelefoneEditarMoradorProprietario = morador.telefones;
    addNovoAutomovelMoradorPrinciapal();
    removerAutomovelMoradorProprietario();
    salvarMorador();
}

function getInputsMoradorProprietario() {
    morador.nome = $("#nome").val();
    morador.cpf = $("#cpf").val();
    morador.rg = $("#rg").val();
    morador.orgaoEmissor = $("#orgaoEmissor").val();
    morador.dataNascimento = $("#dataNascimento").val();
    morador.naturalidade = $("#naturalidade").val();
    morador.estadoCivil = $("#estadoCivil :selected").val();
    morador.sexo = $("#sexo").prop("checked") === true ? "Masculino" : "Feminino";
    morador.residencia = $("#residencia").val();
    morador.qtdMoradores = $("#qtdMoradores").val();
    morador.tipoMoradia = $("#tiposResidencia :selected").val();
    morador.animalDomestico = $("#animalDomentico").prop("checked");
    morador.automoveisMoradores = listAutomoveisMoradorProprietario;
}

function gridCarroMoradorPrincipal(automoveisMoradores) {
    $(".tbl-add-automovel").DataTable().clear().draw();
    var htmltipo = "";
    var tipoAutomovel = "";
    for (var i = 0; i < automoveisMoradores.length; i++) {
        tipoAutomovel = automoveisMoradores[i].automovel.tipoAutomovel;
        if (tipoAutomovel === "C") {
            htmltipo = "<span class='text-center badge badge-primary'>" + "Carro" + "</span>";
        } else if (tipoAutomovel === "M") {
            htmltipo = "<span class='text-center badge badge-success'>" + "Moto" + "</span>";
        }
        $(".tbl-add-automovel").DataTable().row.add([
            automoveisMoradores[i].automovel.fabricante.nome,
            automoveisMoradores[i].automovel.nome,
            mascaraStringPlaca(automoveisMoradores[i].placa),
            automoveisMoradores[i].cor,
            htmltipo,
            "<button id='btnRemoverAutomovelMoradorPrincipal' data-key='" + automoveisMoradores[i].placa + "' type='button' title='Remover' class='text-center btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button>"
        ]).draw(false);
    }
}

function addNovoAutomovelMoradorPrinciapal() {
    $("#btnAddNovoAutomovel").click(function () {
        if ($("#formAutomoveis").valid()) {
            const automovel = {
                cor: $("#cor option:selected").filter(':selected').val(),
                placa: $("#placa").val(),
                automovel: {
                    nome: $("#automoveis option:selected").filter(':selected').text(),
                    fabricante: {
                        id: $("#fabricante option:selected").filter(':selected').val(),
                        nome: $("#fabricante option:selected").filter(':selected').text()
                    },
                    id: $("#automoveis option:selected").filter(':selected').val(),
                    tipoAutomovel: $("#tipo").val()
                }
            };
            window.console.log("Addcarro");
            if (automovelExist(listAutomoveisMoradorProprietario, removeAllCaracterString(automovel.placa))) {
                message.show("Esse automovel já foi adicionado", "N");
                return;
            }
            listAutomoveisMoradorProprietario.push(automovel);
            gridCarroMoradorPrincipal(listAutomoveisMoradorProprietario);
            const selects = [{"id":"#fabricante"},{"id":"#automoveis",disabled:true}];
            cleanForm("#formAutomoveis",selects);
            toast.show("Automóvel adicionado!");
        }
    });
}

function salvarMorador() {
    $("#btnSalvar").click(function () {
        if ($("#formMoradorProprietario").valid()) {
            var url = CONSTANTES.currentUri;
            getInputsMoradorProprietario();
            $.ajax({
                method: "PUT",
                url: url + "/morador/alterar/" + morador.id,
                data: JSON.stringify(morador),
                contentType: "application/json",
                dataType: "json",
                statusCode: {
                    200: function (data) {
                        var message = new Message.Success();
                        automoveis = [];
                        listTelefoneEditarMoradorProprietario = [];
                        message.show("Registro alterado com sucesso!");
                        loadPageHtml("pages/morador/Pesquisar.html");
                    }
                }
            });
        }
    });
}

function removerAutomovelMoradorProprietario() {
    $(".tbl-add-automovel").on("click","#btnRemoverAutomovelMoradorPrincipal", function () {
        var placa = $(this).data("key");
        for (var i = 0; i < listAutomoveisMoradorProprietario.length; i++) {
            if(removeAllCaracterString(listAutomoveisMoradorProprietario[i].placa) === removeAllCaracterString(placa)) {
                listAutomoveisMoradorProprietario.splice(i, 1);
                $(".tbl-add-automovel").DataTable().row($(this).parents("tr")).remove().draw();
                toast.show("Automóvel removido!");
            }
        }
    });
}

function popularSelectEstadoCivil(element, selecionar) {
    const url = CONSTANTES.currentUri;
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
        $(element).select2({
            theme: "bootstrap4",
            placeholder: "Selecione o estado civil",
            allowClear: true,
            language: "pt-BR",
            data: estadosCivil
        });
        if (selecionar) {
            $(element).val(selecionar);
            $(element).trigger("change");
        }

    });
}

function popularSelectFabricantes(element1, element2, idfabricante) {
    var url = CONSTANTES.currentUri;
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
        $(element1).select2({
            theme: "bootstrap4",
            placeholder: "Selecione o fabricante",
            allowClear: true,
            language: "pt-BR",
            data: fabricantes
        });
        $(element1).on("select2:select", function (e) {
            const fabricanteId = e.params.data.id;
            $(idfabricante).val(fabricanteId);
            $(element2).val(null).trigger("change");
            $(element2).prop("disabled", false);
        });
        $(element1).on("select2:unselecting", function () {
            $(element2).val(null).trigger("change");
            $(element2).prop("disabled", true);
        });

    });
}

function populaSelectAutomoveis(element, idfabrincante) {
    const url = CONSTANTES.currentUri;
    $(element).prop("disabled", true);
    $(element).select2({
        theme: "bootstrap4",
        placeholder: "Automóveis",
        allowClear: true,
        language: "pt-BR",
        multiple: false,
        closeOnSelect: true,
        minimumInputLength: 1,
        ajax: {
            url: url + "/morador/automoveis",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    q: params.term,
                    fabricanteId: $(idfabrincante).val(),
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

        templateResult: styleSelectAutomoveis,

        escapeMarkup: function (markup) {
            return markup;
        },
        templateSelection: function (automovel) {
            var tipo = automovel.tipo;
            var html = "";
            if (tipo === "C") {
                tipo = "Carro";
                html = $("<span>" + automovel.text + "</span><span style='margin-top:11px;' class='text-right badge badge-primary'>" + tipo + "</span>");
            } else if (tipo === "M") {
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
    } else if (tipo === "M") {
        tipo = "Moto";
        html = $("<span>" + automovel.text + "</span><span class='text-right badge badge-success'>" + tipo + "</span>");
    } else {
        html = $("<span>" + automovel.text + "</span>");
    }
    return html;
}

function popularSelectTipoResidencia(morador) {
    const url = CONSTANTES.currentUri;
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

        $("#tiposResidencia").select2({
            theme: "bootstrap4",
            placeholder: "Selecione tipo residência",
            allowClear: true,
            language: "pt-BR",
            data: tiposResidencias
        });

        $("#tiposResidencia").val(morador.tipoMoradia);
        $("#tiposResidencia").trigger("change");
    });
}

function styleSelectGrauParentesco(grauParentesco) {
    var html = "";
    var grau = grauParentesco.text;
    if (grau.toUpperCase() === ("ESPOSO") ||
            grau.toUpperCase() === ("ESPOSA") ||
            grau.toUpperCase() === ("FILHO") ||
            grau.toUpperCase() === ("FILHA") ||
            grau.toUpperCase() === ("PAI") ||
            grau.toUpperCase() === ("MÃE") ||
            grau.toUpperCase() === ("AVÔ") ||
            grau.toUpperCase() === ("AVÓ")) {
        html = $("<span>" + grauParentesco.text + "</span><span class='text-right badge badge-primary'>" + "1° grau" + "</span>");
    } else {
        html = $("<span>" + grauParentesco.text + "</span>");
    }
    return html;
}

function automovelExist(array, placa) {
    return array.some(function (p) {
        return p.placa === placa;
    });
}

function moradorExist(array, cpf) {
    return array.some(function (p) {
        return p.cpf === cpf;
    });
}

function camposObrigatoriosMorador() {
    $("#formMoradorProprietario").validate({
        rules: {
            nome: {
                required: true,
                rangelength: [3, 200]
            },
            cpf: {
                required: true,
                minlength: 14
            },
            rg: {
                required: true,
                rangelength: [5, 11]
            },
            emissor: {
                required: true,
                rangelength: [4, 11]
            },
            dataNascimento: {
                required: true,
                rangelength: [10, 10]
            },
            natural: {
                required: true,
                rangelength: [3, 50]
            },
            estadoCivil: {
                required: true
            },
            residencia: {
                required: true,
                rangelength: [3, 100]
            },
            tiposResidencia: {
                required: true
            },
            qtdMorador: {
                required: true
            },
            telefones: {
                required: true
            }
        },
        messages: {
            nome: {
                required: "Nome obrigatório!",
                rangelength: "Insira um nome entre {0} e {1} caracteres!" //jQuery.validator.format("Please enter a value between {0} and {1} characters long.")
            },
            cpf: {
                required: "CPF obrigatório!",
                minlength: "CPF inválido!"
            },
            rg: {
                required: "RG obrigatório!",
                rangelength: "Insira um rg entre {0} e {1} caracteres!"
            },
            emissor: {
                required: "Orgão emissor obrigatório!",
                rangelength: "Insira um orgão emissor entre {0} e {1} caracteres!"
            },
            dataNascimento: {
                required: "Data nascimento obrigatória!",
                rangelength: "Insira uma data entre {0} e {1} caracteres!"
            },
            natural: {
                required: "Naturalidade obrigatório!",
                rangelength: "Insira um valor entre {0} e {1} caracteres!"
            },
            estadoCivil: {
                required: "Estado civil obrigatório!"
            },
            residencia: {
                required: "Endereço da residência obrigatório!",
                rangelength: "Insira um valor entre {0} e {1} caracteres!"
            },
            tiposResidencia: {
                required: "Tipo de residência obrigatória!"
            },
            qtdMorador: {
                required: "Quantidade de morador obrigatório!"
            },
            telefones: {
                required: "Telefone pelo menos um obrigatório!"
            }
        },
        errorContainer: ".alert-erro-novo-morador",
        errorLabelContainer: ".alert-erro-novo-morador ul",
        wrapper: "li"
    });

    $("#formPrincipalMoradorSecundario").validate({
        rules: {
            nomeMoradorSecundario: {
                required: true,
                rangelength: [3, 200]
            },
            cpfMoradorSecundario: {
                required: true,
                minlength: 14
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
                rangelength: [10, 10]
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
                rangelength: "Insira um nome entre {0} e {1} caracteres!" //jQuery.validator.format("Please enter a value between {0} and {1} characters long.")
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
    $("#formAutomoveis").validate({
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
            } else if (element.prop("type") === "select-one") {
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
            } else if (element.prop("type") === "select-one") {
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