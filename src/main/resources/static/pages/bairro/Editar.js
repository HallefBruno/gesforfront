/* global Message */

$(document).ready(function() {

    var bairro = {};
    var cidade = {};

    var path = localStorage.getItem("currentUri");
    var bairroId = localStorage.getItem("bairroId");
    
    $('[data-toggle="tooltip"]').tooltip();
    
    $.get(path + "/bairros/buscar/" + bairroId, function (data) {
        $("#id").val(data.id);
        $("#nome").val(data.nome);

        $("#cidade-id").val(data.cidade.id);
        $("#cidade-nome").val(data.cidade.nome);
        $("#estado-uf").val(data.cidade.estado.uf);

        cidade = {
            id: $("#cidade-id").val()
        };
    });

    $.get(path + "/cidades/todos", function (data) {
        var cidade;
        var cidades = [];
        $.each(data, function (i, values) {
            cidade = {
                id: values.id,
                text: values.nome,
                uf: values.estado.uf
            };
            cidades.push(cidade);
        });

        $("#cidades").select2({
            theme: "bootstrap4",
            placeholder: "Selecione a cidade",
            allowClear: true,
            language: "pt-BR",
            templateResult: styleCidade,
            data: cidades
        });
        
        if($("#cidade-id").val() === "") {
            $("#btnEstadoAtual").css("pointer-events","");
            $("#btnEstadoAtual").prop("disabled",false);
        }
        $("#cidades").val($("#cidade-id").val()).trigger("change");
        
    });

    $("#cidades").on("select2:select", function (e) {
        var data = e.params.data;
        if (data.id !== undefined || data.id !== null) {
            $("#cidade-id").val(data.id);
            cidade = {
                id: data.id
            };
        }
    });
    
    $.validator.setDefaults({
        submitHandler: function () {

            bairro["id"] = $("#id").val();
            bairro["nome"] = $("#nome").val();
            bairro["cidade"] = cidade;

            $.ajax({
                method: "PUT",
                url: path + "/bairros/alterar/" + bairro.id,
                data: JSON.stringify(bairro),
                contentType: "application/json",
                dataType: "json",
                statusCode: {
                    200: function (data) {
                        var success = new Message.Success();
                        success.show("Registro salvo com sucesso!");
                        removeAllLocalStorage();
                    }
                }
            });
        }
    });
    
    validation();
    setCidade();
    irParaPagePesquisar();
    
});


function validation() {
    
    $("#form-editar-bairro").validate({
        rules: {
            nome: {
                minlength: 2,
                maxlength: 25,
                required: true
            },
            cidades: {
                required: true
            }
        },
        messages: {
            bairro: {
                minlength: "Tamanho mínimo para o nome é 2 caracter",
                maxlength: "Tamanho máximo para no nome é 50 caracter",
                required: "Bairro obrigatório"
            },
            cidades: {
                required: "Cidade obrigatório"
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            if(element.is("select")) {
                error.insertAfter(element.next("span"));
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

function styleCidade(cidade) {
    if (!cidade.id) {
        return cidade.text;
    }
    var html = $("<span>"+cidade.text+"</span><span class='text-right badge badge-primary'>"+cidade.uf+"</span>");
    return html;
};

function setCidade() {
    $("#btnEstadoAtual").click(function () {
        $("#cidades").val($("#cidade-id").val()).trigger("change");
    });
}

function irParaPagePesquisar() {
    $("#btnPagePesquisar").click(function () {
        loadPageHtml("pages/bairro/Pesquisar.html");
    });
}






//function initCombo() {
//    if ($("#cidades").find("option[value='" + $("#cidade-id").val() + "']").length) {
//        }
//    var optionalCidade = {
//        text: $("#cidade-nome").val(),
//        id: $("#cidade-id").val(),
//        uf:$("#cidade-uf").val()
//    };
//
//    var option = new Option(optionalCidade.text, optionalCidade.id, true, true);
//    $("#cbcidades").append(option).trigger("change");
//
//    $("#cbcidades").trigger({
//        type: "select2:select",
//        params: {
//            data: optionalCidade
//        }
//    });
//    
//    return optionalCidade;
//}