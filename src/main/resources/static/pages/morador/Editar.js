/* global CONSTANTES */

$(function () {

    init();
    popularMoradorProprietario();
    populaSelectAutomoveis();
    
    $("#tabMoradorProprietario").on("click", function (e) {
        e.preventDefault();
        $(this).tab("show");
    });

    $("#tabMoradorSecundario").on("click", function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

function init() {
    $('[data-toggle="tooltip"]').tooltip();
    $("#animalDomentico").bootstrapToggle("off", true);
    $("#sexoMoradorSecundario").bootstrapToggle("off", true);
    $("#sexo").bootstrapToggle("off", true);
    mascaraCpf("#cpf");
    mascaraCpf("#cpfMoradorSecundario");
    mascaraPlacaMercoSul("#placa");
    mascaraPlacaMercoSul("#placaMoradorSecundario");
}

function popularMoradorProprietario() {
    const moradorId = params();
    $.get(CONSTANTES.currentUri + "/morador/buscar/" + moradorId.id, function (data) {
        window.console.log(data);
        popularTela(data);
    });
}

function popularTela(morador) {

    var listaMoradoresSecundario = [];
    var listaAutomoveisMoradorSecudario = [];

    var listaTelefones = [];
    var listaAutomoveisMoradorProprietario = [];

    listaMoradoresSecundario = morador.moradorSecundarios;
    listaAutomoveisMoradorProprietario = morador.automoveisMoradores;

    setValueInputInForm("#formMoradorProprietario", morador);
    $("#dataNascimento").val(morador.dataNascimento);
    morador.sexo === "Masculino" ? $("#sexo").bootstrapToggle("on") : $("#sexo").bootstrapToggle("off");
    morador.animalDomestico === true ? $("#animalDomentico").bootstrapToggle("on") : $("#animalDomentico").bootstrapToggle("off");

    popularTabelaVeiculoMoradorProprietario(listaAutomoveisMoradorProprietario);
    popularSelects(morador);

}

function popularSelects(morador) {

    var url = CONSTANTES.currentUri;

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

        $("#estadoCivil").select2({
            theme: "bootstrap4",
            placeholder: "Selecione o estado civil",
            allowClear: true,
            language: "pt-BR",
            data: estadosCivil
        });

        $("#estadoCivil").val(morador.estadoCivil);
        $("#estadoCivil").trigger("change");

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

    var telefone;
    var telefones = [];
    $.each(morador.telefones, function (i, values) {
        telefone = {
            id: values.id,
            text: mascaraStringTel(values.numero)
        };
        telefones.push(telefone);
    });

    $("#telefones").select2({
        theme: "bootstrap4",
        placeholder: "Telefones",
        allowClear: true,
        language: "pt-BR",
        data: telefones
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
        
        $("#fabricante").on("select2:select",function (e) {
            var fabricanteId = e.params.data.id;
            $("#fabricante-id").val(fabricanteId);
            $("#automoveis").val(null).trigger("change");
            $("#automoveis").prop("disabled",false);
        });
        
        $("#fabricante").on("select2:unselecting", function () {
            $("#automoveis").val(null).trigger("change");
            $("#automoveis").prop("disabled",true);
        });
        
    });

}

function populaSelectAutomoveis() {
    var url = CONSTANTES.currentUri;
    
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

function popularTabelaVeiculoMoradorProprietario(automoveis) {

    var table = $(".tbl-add-automovel");
    table.find("tbody").find("tr").remove();
    var body = "";

    if (automoveis.length !== "undefined" && automoveis.length !== null && automoveis.length > 0) {
        for (var i = 0; i < automoveis.length; i++) {
            var htmlTipo = "";
            if (automoveis[i].automovel.tipoAutomovel === "C") {
                htmlTipo = "<span class='text-center badge badge-primary'>" + "Carro" + "</span>";
            } else {
                htmlTipo = "<span class='text-center badge badge-success'>" + "Moto" + "</span>";
            }
            body += "<tr>" +
                        "<td>" + automoveis[i].automovel.fabricante.nome + "</td>" +
                        "<td>" + automoveis[i].automovel.nome + "</td>" +
                        "<td>" + mascaraStringPlaca(automoveis[i].placa.toUpperCase()) + "</td>" +
                        "<td>" + automoveis[i].cor + "</td>" +
                        "<td>" + htmlTipo + "</td>" +
                        "<td><button id='btnRemover' data-key='" + automoveis[i].placa + "' type='button' title='Remover' class='text-center btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button></td>";
                    "</tr>";
        }
    } else {
        body += "<tr><td colspan='5' class='text-left badge badge-dark'>Nenhum automovel vinculado</td></tr>";
    }

    table.find("tbody").append(body);
}