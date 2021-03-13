/* global Message */

$(document).ready(function() {

    var form = $("#form-editar-bairro");
    var bairro = {};
    var cidade = {};
    
    var path = localStorage.getItem("currentUri");
    var bairroId = localStorage.getItem("bairroId");

    $.get(path + "/bairros/buscar/" + bairroId, function (data) {
        if (form.find("#nome").length) {

            form.find("#id").val(data.id);
            form.find("#nome").val(data.nome);

            form.find("#cidade-id").val(data.cidade.id);
            form.find("#cidade-nome").val(data.cidade.nome);
            form.find("#estado-uf").val(data.cidade.estado.uf);
            
            cidade = {
                id: $("#cidade-id").val()
            };
            
        } else {
            var warning = new Message.Warning();
            warning.show("houve um probleminha na renderização dos componentes da tela que você iria trabalhar, pesso que tente editar novamente!", "I");
            console.log("Ops! Elemento não existe no DOM");
        }
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

        form.find("#cidades").select2({
            theme: "bootstrap4",
            placeholder: "Selecione a cidade",
            allowClear: true,
            language: "pt-BR",
            templateResult: styleCidade,
            data: cidades
        });

        if (form.find("#cidades").find("option[value='" + form.find("#cidade-id").val() + "']").length) {
            form.find("#cidades").val(form.find("#cidade-id").val()).trigger("change");
        }

    });

    form.find("#cidades").on("select2:select", function (e) {
        var data = e.params.data;
        if (data.id !== undefined || data.id !== null) {
            cidade = {
                id: data.id
            };
        }
    });
    
    $.validator.setDefaults({
        submitHandler: function () {

            bairro["id"] = form.find("#id").val();
            bairro["nome"] = form.find("#nome").val();
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
                    }
                }
            });
        }
    });
    
    loadPageHtml(form.find("#btnPagePesquisar"),"pages/bairro/Pesquisar.html");

    vaidation();
    
});


function vaidation() {
    
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
                required: "Estado obrigatório"
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            window.console.warn(error);
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










//function initCombo() {
//    
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