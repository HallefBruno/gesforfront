/* global CONSTANTES, Message */
var message = new Message.Warning();
var toast = new Message.SuccessToast();
var listAutomoveisMoradorProprietario = [];
var listAutomoveisMoradorSecundario = [];
var listaDeMoradorSecundario = [];
var moradorProprietario = {};
var listTelefoneEditarMoradorProprietario = [];

$(function () {
    
    init();
    popularMoradorProprietario();
    populaSelectAutomoveis("#automoveis","#fabricante-id");
    populaSelectAutomoveis("#automoveisMoradorSecundario","#fabricanteMoradorSecundario-id");
    
    salvarMorador();
    camposObrigatoriosMorador();
    camposObrigatorioAutomovel();
    
    $("#tabMoradorProprietario").on("click", function (e) {
        e.preventDefault();
        $(this).tab("show");
    });

    $("#tabMoradorSecundario").on("click", function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
    
    
    $("#btnPagePesquisar").click(function () {
        loadPageHtml("pages/morador/Pesquisar.html");
    });
    
});

function init() {
    $('[data-toggle="tooltip"]').tooltip();
    $("#animalDomentico").bootstrapToggle("off", true);
    $("#sexoMoradorSecundario").bootstrapToggle("off", true);
    $("#sexo").bootstrapToggle("off", true);
    $("#btnTerminar").prop("disabled",true);
    mascaraCpf("#cpf");
    mascaraCpf("#cpfMoradorSecundario");
    mascaraPlacaMercoSul("#placa");
    mascaraPlacaMercoSul("#placaMoradorSecundario");
    mascaraTelefone("#telefoneMoradorSecundario");
    btnTerminar();
}

function popularMoradorProprietario() {
    const moradorId = params();
    $.get(CONSTANTES.currentUri + "/morador/buscar/" + moradorId.id, function (data) {
        listTelefoneEditarMoradorProprietario = data.telefones;
        window.console.log(data);
        popularTela(data);
        popularTableMoradorSecundario(data.moradorSecundarios);
        eventAddNovoAutomovel(data.automoveisMoradores);
    });
}

function popularTela(morador) {

    setValueInputInForm("#formMoradorProprietario", morador);
    $("#dataNascimento").val(morador.dataNascimento);
    morador.sexo === "Masculino" ? $("#sexo").bootstrapToggle("on") : $("#sexo").bootstrapToggle("off");
    morador.animalDomestico === true ? $("#animalDomentico").bootstrapToggle("on") : $("#animalDomentico").bootstrapToggle("off");

    popularTabelaVeiculoMoradorProprietario(morador.automoveisMoradores);
    popularSelects(morador);
    moradorProprietario = morador;
}

function popularSelects(morador) {

    var url = CONSTANTES.currentUri;
    
    popularSelectEstadoCivil("#estadoCivil",morador.estadoCivil);
    popularSelectEstadoCivil("#estadoCivilMoradorSecundario",null);
    popularSelectFabricantes("#fabricante","#automoveis","#fabricante-id");
    popularSelectFabricantes("#fabricanteMoradorSecundario","#automoveisMoradorSecundario","#fabricanteMoradorSecundario-id");
    
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
    
    popularSelectTelefone(morador.telefones);
    popularTabelaTelefone(morador.telefones);
    
    $.get(url + "/morador/grau-parentesco", function (data) {

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

}

function popularSelectEstadoCivil(element,selecionar) {
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

        $(element).select2({
            theme: "bootstrap4",
            placeholder: "Selecione o estado civil",
            allowClear: true,
            language: "pt-BR",
            data: estadosCivil
        });
        
        if(selecionar) {
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
        
        $(element1).on("select2:select",function (e) {
            const fabricanteId = e.params.data.id;
            $(idfabricante).val(fabricanteId);
            $(element2).val(null).trigger("change");
            $(element2).prop("disabled",false);
        });
        
        $(element1).on("select2:unselecting", function () {
            $(element2).val(null).trigger("change");
            $(element2).prop("disabled",true);
        });
        
    });
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

function populaSelectAutomoveis(element,idfabrincante) {
    var url = CONSTANTES.currentUri;
    
    $(element).prop("disabled",true);
    $(element).select2({
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
                    fabricanteId:$(idfabrincante).val(),
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
    listAutomoveisMoradorProprietario = automoveis;
    
    if (automoveis.length !== "undefined" && automoveis.length !== null && automoveis.length > 0) {
        for (var i = 0; i < automoveis.length; i++) {
            var htmlTipo = "";
            if (automoveis[i].automovel.tipoAutomovel === "C" || automoveis[i].automovel.tipoAutomovel === "Carro") {
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
                        "<td><button id='btnRemoverAutomovelMoradorProrietario' data-key='" + automoveis[i].placa + "' type='button' title='Remover' class='text-center btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button></td>";
                    "</tr>";
        }
    } else {
        body += "<tr><td colspan='6' ><span class='badge badge-dark'>Nenhum registro encontrado</span></td></tr>";
    }

    table.find("tbody").append(body);
}

function popularTableMoradorSecundario(listMoradorSecundario) {
    
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
                targets: [4, 5],
                className: 'text-center'
            }
        ]
    });
    
    if(listMoradorSecundario !== undefined && listMoradorSecundario !== null && listMoradorSecundario.length > 0) {
        $(".tbl-moradores-secundario").DataTable().clear().draw();
        
        var htmlButtonMostrarCarros = "";
        
        for (var i = 0; i < listMoradorSecundario.length; i++) {
            if (listMoradorSecundario[i].automoveisMoradores.length > 0) {
                htmlButtonMostrarCarros = "<button id='btnCarroVinculadoMoradorSecundario' data-key='" + listMoradorSecundario[i].cpf + "' type='button' title='Carros vinculados' class='text-center btn btn-outline-primary btn-sm'><i class='fa fa-archive'></i></button>";
            }
            $(".tbl-moradores-secundario").DataTable().row.add([
                listMoradorSecundario[i].nome,
                mascaraStringCpf(listMoradorSecundario[i].cpf),
                mascaraStringTel(listMoradorSecundario[i].telefone),
                listMoradorSecundario[i].grauParentesco,
                listMoradorSecundario[i].sexo,
                "<button id='btnRemoverMoradorSecundario' data-key='" + listMoradorSecundario[i].cpf +"' type='button' title='Remover' class='text-center btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button> "+htmlButtonMostrarCarros
            ]).draw(false);
        }
    }
    
    popularTableVeiculosMoradorSecundario();
}

function eventAddNovoAutomovel(listAutomoveisMorador) {
    $("#btnAddNovoAutomovel").click(function () {
        if ($("#formAutomoveis").valid()) {
            var automovelGrid = {
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

            if(automovelExist(listAutomoveisMorador, automovelGrid.placa)) {
                message.show("Esse automovel já foi adicionado","N");
                return;
            }
            
            listAutomoveisMorador.push(automovelGrid);
            toast.show("Automóvel adicionado");
            popularTabelaVeiculoMoradorProprietario(listAutomoveisMorador);
        }
    });
    
    removerVeiculoMoradorProprietario();
}

function removerVeiculoMoradorProprietario() {
    $(".tbl-add-automovel > tbody").on("click", "#btnRemoverAutomovelMoradorProrietario", function () {
        var placa = $(this).data("key");
        for(var i = 0; i < listAutomoveisMoradorProprietario.length; i++) {
            if(listAutomoveisMoradorProprietario[i].placa === placa) {
                listAutomoveisMoradorProprietario.splice(i,1);
            }
        }
        toast.show("Automóvel removido");
        popularTabelaVeiculoMoradorProprietario(listAutomoveisMoradorProprietario);
    });
}


function salvarMorador() {
    $("#btnSalvar").click(function () {
        if ($("#formMoradorProprietario").valid()) {
            
            moradorProprietario.nome = $("#nome").val();
            moradorProprietario.cpf = $("#cpf").val();
            moradorProprietario.rg = $("#rg").val();
            moradorProprietario.orgaoEmissor = $("#orgaoEmissor").val();
            moradorProprietario.dataNascimento = $("#dataNascimento").val();
            moradorProprietario.naturalidade = $("#naturalidade").val();
            moradorProprietario.estadoCivil = $("#estadoCivil :selected").val();
            moradorProprietario.sexo =  $("#sexo").prop("checked") === true ? "Masculino" : "Feminino";
            moradorProprietario.residencia = $("#residencia").val();
            moradorProprietario.qtdMoradores = $("#qtdMoradores").val();
            moradorProprietario.tipoMoradia = $("#tiposResidencia :selected").val();
            moradorProprietario.animalDomestico = $("#animalDomentico").prop("checked");
            moradorProprietario.automoveisMoradores = listAutomoveisMoradorProprietario;

            var url = CONSTANTES.currentUri;
            
            $.ajax({
                method: "PUT",
                url: url + "/morador/alterar/"+moradorProprietario.id,
                data: JSON.stringify(moradorProprietario),
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
    addAutomovelMoradorSecundario();
    addMoradorSecundario();
}


function addAutomovelMoradorSecundario() {
    $("#btnAddNovoAutomovelSecundario").click(function () {
        if ($("#formAutomoveisMoradorSecundario").valid()) {
            var htmltipo = "";
            var automovelMoradorSecundario = {
                id: $("#automoveisMoradorSecundario option:selected").filter(':selected').val(),
                nome: $("#automoveisMoradorSecundario option:selected").filter(':selected').text(),
                fabricante: {
                    id: $("#fabricanteMoradorSecundario option:selected").filter(':selected').val(),
                    nome: $("#fabricanteMoradorSecundario option:selected").filter(':selected').text()
                },
                tipoAutomovel: $("#tipo").val(),
                cor: $("#corMoradorSecundario option:selected").filter(':selected').val(),
                placa: $("#placaMoradorSecundario").val()
            };
            
            if(automovelExist(listAutomoveisMoradorSecundario, automovelMoradorSecundario.placa)) {
                message.show("Esse automovel já foi adicionado","N");
                return;
            }
            
            listAutomoveisMoradorSecundario.push(automovelMoradorSecundario);
            
            $(".tbl-add-automovel-morador-secundario").DataTable().clear().draw();
            for (var i = 0; i < listAutomoveisMoradorSecundario.length; i++) {
                
                if (listAutomoveisMoradorSecundario[i].tipoAutomovel === "Carro") {
                    htmltipo = "<span class='text-center badge badge-primary'>" + listAutomoveisMoradorSecundario[i].tipoAutomovel + "</span>";
                } else if (listAutomoveisMoradorSecundario[i].tipoAutomovel === "Moto") {
                    htmltipo = "<span class='text-center badge badge-success'>" + listAutomoveisMoradorSecundario[i].tipoAutomovel + "</span>";
                }
                
                $(".tbl-add-automovel-morador-secundario").DataTable().row.add([
                    listAutomoveisMoradorSecundario[i].fabricante.nome,
                    listAutomoveisMoradorSecundario[i].nome,
                    listAutomoveisMoradorSecundario[i].placa,
                    listAutomoveisMoradorSecundario[i].cor,
                    htmltipo,
                    "<button id='btnRemoverAutomovelMoradorSecundario' data-key='" + listAutomoveisMoradorSecundario[i].placa + "' type='button' title='Remover' class='text-center btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button>"
                ]).draw(false);
            }
            const selects = [{"id":"#automoveisMoradorSecundario",disabled:true},{"id":"#fabricanteMoradorSecundario"}];            
            cleanForm("#formAutomoveisMoradorSecundario",selects);
            toast.show("Automóvel adicionado!");
        }
    });
}

function popularTableVeiculosMoradorSecundario() {
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
}

function addMoradorSecundario() {
    $("#btnAdicionarMoradorSecundario").click(function () {
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
                automoveisMoradores: listAutomoveisMoradorSecundario
            };
            if (moradorExist(listaDeMoradorSecundario, moradorSecundario.cpf)) {
                message.show("Esse morador já foi adicionado","N");
                return;
            }
            
            listaDeMoradorSecundario.push(moradorSecundario);
            popularTabelaMoradorSercundario(moradorSecundario);
        }
    });
}

function popularTabelaMoradorSercundario(moradorSecundario) {
    var htmlButtonMostrarCarros = "";
    if (moradorSecundario.automoveisMoradores.length > 0) {
        htmlButtonMostrarCarros = "<button id='btnCarroVinculadoMoradorSecundario' data-key='" + moradorSecundario.cpf + "' type='button' title='Carros vinculados' class='text-center btn btn-outline-primary btn-sm'><i class='fa fa-archive'></i></button>";
    }
    $(".tbl-moradores-secundario").DataTable().row.add([
        moradorSecundario.nome,
        moradorSecundario.cpf,
        moradorSecundario.telefone,
        moradorSecundario.sexo,
        moradorSecundario.grauParentesco,
        "<button id='btnRemoverMoradorSecundario' data-key='" + moradorSecundario.cpf + "' type='button' title='Remover' class='text-center btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button> " + htmlButtonMostrarCarros
    ]).draw(false);
    
    $(".tbl-add-automovel-morador-secundario").DataTable().clear().draw();
    const selects = [{"id":"#estadoCivilMoradorSecundario"},{"id":"#grauParentesco"}];
    cleanForm("#formPrincipalMoradorSecundario",selects);
    toast.show("Morador secundário adicionado!");
    listAutomoveisMoradorSecundario = [];
    toast.show("Morador adicionado!");
    
    btnCarrosVinculadosMoradorSecundario();
}

function btnCarrosVinculadosMoradorSecundario() {
    $(".tbl-moradores-secundario > tbody").on("click", "#btnCarroVinculadoMoradorSecundario", function () {
        var cpf = $(this).data("key");
        $(".tbl-add-automovel-morador-secundario").DataTable().clear().draw();
        for (var i = 0; i < listaDeMoradorSecundario.length; i++) {
            if (listaDeMoradorSecundario[i].cpf === cpf) {
                $("#btnTerminar").prop("disabled", false);
                for (var j = 0; j < listaDeMoradorSecundario[i].automoveisMoradores.length; j++) {
                    
                    if (listaDeMoradorSecundario[i].automoveisMoradores[j].tipoAutomovel === "Carro") {
                        htmltipo = "<span class='text-center badge badge-primary'>" + listaDeMoradorSecundario[i].automoveisMoradores[j].tipoAutomovel + "</span>";
                    } else if (listaDeMoradorSecundario[i].automoveisMoradores[j].tipoAutomovel === "Moto") {
                        htmltipo = "<span class='text-center badge badge-success'>" + listaDeMoradorSecundario[i].automoveisMoradores[j].tipoAutomovel + "</span>";
                    }

                    $(".tbl-add-automovel-morador-secundario").DataTable().row.add([
                        listaDeMoradorSecundario[i].automoveisMoradores[j].fabricante.nome,
                        listaDeMoradorSecundario[i].automoveisMoradores[j].nome,
                        listaDeMoradorSecundario[i].automoveisMoradores[j].placa,
                        listaDeMoradorSecundario[i].automoveisMoradores[j].cor,
                        htmltipo,
                        "<button id='btnRemoverAutomovelMoradorSecundario' data-key='" + listaDeMoradorSecundario[i].automoveisMoradores[j].placa + "' type='button' title='Remover' class='text-center btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button>"
                    ]).draw(false);
                    
                    window.console.log(listaDeMoradorSecundario[i].automoveisMoradores);

                }
            }
        }
    });
}


//if (listAutomoveisMoradorSecundario[i].tipoAutomovel === "Carro") {
//    htmltipo = "<span class='text-center badge badge-primary'>" + listAutomoveisMoradorSecundario[i].tipoAutomovel + "</span>";
//} else if (listAutomoveisMoradorSecundario[i].tipoAutomovel === "Moto") {
//    htmltipo = "<span class='text-center badge badge-success'>" + listAutomoveisMoradorSecundario[i].tipoAutomovel + "</span>";
//}
//
//$(".tbl-add-automovel-morador-secundario").DataTable().row.add([
//    listAutomoveisMoradorSecundario[i].fabricante.nome,
//    listAutomoveisMoradorSecundario[i].nome,
//    listAutomoveisMoradorSecundario[i].placa,
//    listAutomoveisMoradorSecundario[i].cor,
//    htmltipo,
//    "<button id='btnRemoverAutomovelMoradorSecundario' data-key='" + listAutomoveisMoradorSecundario[i].placa + "' type='button' title='Remover' class='text-center btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button>"
//]).draw(false);

//MoradorSecundario
function btnTerminar() {
    $("#btnTerminar").click(function () {
        $(".tbl-add-automovel-morador-secundario").DataTable().clear().draw();
        $("#btnAdicionarMoradorSecundario").prop("disabled", false);
        $(this).prop("disabled", true);
    });
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
                minlength:14
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
                rangelength: [10,10]
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
            qtdMorador : {
                required: true
            },
            telefones: {
                required: true
            }
        },
        messages: {
           nome: {
                required: "Nome obrigatório!",
                rangelength:"Insira um nome entre {0} e {1} caracteres!" //jQuery.validator.format("Please enter a value between {0} and {1} characters long.")
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