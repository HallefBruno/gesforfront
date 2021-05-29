/* global CONSTANTES */

$(function () {
    
    init();
    popularMoradorProprietario();
    
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
    $("#sexo").bootstrapToggle("on", true);
    mascaraCpf("#cpf");
}

function popularMoradorProprietario() {
    const moradorId = params();
    window.console.log(CONSTANTES.currentUri);
    $.get(CONSTANTES.currentUri + "/morador/buscar/"+moradorId.id, function (data) {
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
    listaTelefones = morador.telefones;
    listaAutomoveisMoradorProprietario = morador.automoveisMoradores;

    setValueInputInForm("#formMoradorProprietario",morador);
    $("#dataNascimento").val(morador.dataNascimento);
    morador.sexo === "Masculino" ? $("#sexo").bootstrapToggle("on"):$("#sexo").bootstrapToggle("off");
    morador.animalDomestico === true ? $("#animalDomentico").bootstrapToggle("on"):$("#animalDomentico").bootstrapToggle("off");
    
    popularTabelaVeiculoMoradorProprietario(listaAutomoveisMoradorProprietario);
    popularSelectEstadoCivil(morador);
    
    
    
}

function popularSelectEstadoCivil(morador) {
    
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
    
}

function popularTabelaVeiculoMoradorProprietario(automoveis) {
    
    var table = $(".tbl-add-automovel");
    table.find("tbody").find("tr").remove();
    var body = "";

    if(automoveis.length !== "undefined" && automoveis.length !== null && automoveis.length > 0) {
        for(var i=0; i<automoveis.length; i++) {
            var htmlTipo = "";
            if(automoveis[i].automovel.tipoAutomovel === "C") {
                htmlTipo = "<span class='text-center badge badge-primary'>" + "Carro" + "</span>";
            } else {
                htmlTipo = "<span class='text-center badge badge-success'>" + "Moto" + "</span>";
            }
            body += "<tr>"+
                        "<td>" + automoveis[i].automovel.fabricante.nome + "</td>"+
                        "<td>" + automoveis[i].automovel.nome + "</td>"+
                        "<td>" + mascaraStringPlaca(automoveis[i].placa.toUpperCase()) +"</td>"+
                        "<td>" + automoveis[i].cor +"</td>"+
                        "<td>" + htmlTipo +"</td>"+
                        "<td><button id='btnRemover' data-key='" + automoveis[i].placa + "' type='button' title='Remover' class='text-center btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button></td>";
                    "</tr>";
        }
    } else {
        body += "<tr><td colspan='5' class=''>Nenhum automovel vinculado</td></tr>";
    }

    table.find("tbody").append(body);
}