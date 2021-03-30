/* global Message */

$(function () {

    var path = localStorage.getItem("currentUri");
    var cidadeId = localStorage.getItem("cidadeId");

    $.get(path + "/cidades/buscar/" + cidadeId, function (data) {
        $("#id").val(data.id);
        $("#nome").val(data.nome);

        $("#estado-id").val(data.estado.id);
        $("#estado-nome").val(data.estado.nome);
        $("#estado-uf").val(data.estado.uf);

        cidade = {
            id: data.id,
            estado: {
                id: data.estado.id
            }
        };

    });

    $.get(path + "/estados/todos", function (data) {
        var estado;
        var estados = [];
        $.each(data, function (i, values) {
            estado = {
                id: values.id,
                text: values.nome,
                uf: values.uf
            };
            estados.push(estado);
        });

        $("#estados").select2({
            theme: "bootstrap4",
            placeholder: "Selecione o estado",
            allowClear: true,
            language: "pt-BR",
            templateResult: styleEstado,
            data: estados
        });
        
        if ($("#estado-id").val() === "") {
            $("#btnEstadoAtual").css("pointer-events","");
            $("#btnEstadoAtual").prop("disabled",false);
        }
        $("#estados").val($("#estado-id").val()).trigger("change");
        
    });

    $("#estados").on("select2:select", function (e) {
        var data = e.params.data;
        if (data.uf !== undefined || data.uf !== null) {
            $("#estado-id").val(data.id);
            cidade = {
                id: $("#id").val(),
                estado: {
                    id: data.id
                }
            };
        }
    });

    $.validator.setDefaults({
        submitHandler: function () {
            Object.assign(cidade, {nome: $("#nome").val()});
            $.ajax({
                method: "PUT",
                url: path + "/cidades/alterar/" + cidade.id,
                data: JSON.stringify(cidade),
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
    
    loadPageHtml("#btnPagePesquisar", "pages/cidade/Pesquisar.html");
    validar();
    setEstado();
});

function validar() {
    $("#form-editar-cidade").validate({
        rules: {
            nome: {
                required: true,
                minlength: 3,
                maxlength: 100
            },
            estados: {
                required: true
            }
        },
        messages: {
            nome: {
                required: "Nome obrigatório",
                minlength: "Tamanho mínimo para o nome é 3 caracter",
                maxlength: "Tamanho máximo para no nome é 100 caracter"
            },
            estados: {
                required: "Estado obrigatório"
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {

            error.addClass("invalid-feedback");
            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.next("label"));
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


function styleEstado(estado) {
    if (!estado.id) {
        return estado.text;
    }
    var html = $("<span>" + estado.text + "</span><span class='text-right badge badge-primary'>" + estado.uf + "</span>");
    return html;
}

function setEstado() {
    $("#btnEstadoAtual").click(function () {
        $("#estados").val($("#estado-id").val()).trigger("change");
    });
}

//var optionalEstado = {
//        text: $("#estado-nome").val(),
//        id: $("#estado-id").val(),
//        uf: $("#estado-uf").val()
//    };
//
//    var estado = {};
//    var cidade = {};
//
//    var option = new Option(optionalEstado.text, optionalEstado.id, true, true);
//    $("#estados").append(option).trigger("change");
//
//    $("#estados").trigger({
//        type: "select2:select",
//        params: {
//            data: optionalEstado
//        }
//    });
//
//    estado = {
//        id: optionalEstado.id,
//        nome: optionalEstado.text,
//        uf: optionalEstado.uf
//    };
//
//    cidade = {
//        id: $("#id").val(),
//        estado: estado,
//        nome: $("#nome").val()
//    };