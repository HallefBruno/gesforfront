/* global Message */

$(function () {

    $('[data-toggle="tooltip"]').tooltip();
    var path = localStorage.getItem("currentUri");
    var filipetaId = localStorage.getItem("filipetaId");
    var filipeta = {};
    
    $.get(path + "/filipetas/buscar/" + filipetaId, function (data) {
        $("#id").val(data.id);
        $("#numero").val(data.numero);

        $("#portaria-id").val(data.portaria.id);
        $("#portaria-nome").val(data.portaria.nome);

        filipeta = {
            id: data.id,
            portaria: {
                id: data.portaria.id
            }
        };

    });

    $.get(path + "/portarias/todos", function (data) {
        var portaria;
        var portarias = [];
        $.each(data, function (i, values) {
            portaria = {
                id: values.id,
                text: values.nome
            };
            portarias.push(portaria);
        });

        $("#portarias").select2({
            theme: "bootstrap4",
            placeholder: "Selecione a portaria",
            allowClear: true,
            language: "pt-BR",
            templateResult: stylePortaria,
            data: portarias
        });
        
        if ($("#portaria-id").val() === "") {
            $("#btnPortariaAtual").css("pointer-events","");
            $("#btnPortariaAtual").prop("disabled",false);
        }
        $("#portarias").val($("#portaria-id").val()).trigger("change");
        
    });

    $("#portarias").on("select2:select", function (e) {
        var data = e.params.data;
        if (data.uf !== undefined || data.uf !== null) {
            $("#portaria-id").val(data.id);
            filipeta = {
                id: $("#id").val(),
                portaria: {
                    id: data.id
                }
            };
        }
    });

    $.validator.setDefaults({
        submitHandler: function () {
            filipeta["numero"] = $("#numero").val();
            $.ajax({
                method: "PUT",
                url: path + "/filipetas/alterar/" + filipeta.id,
                data: JSON.stringify(filipeta),
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
    
    loadPageHtml("#btnPagePesquisar", "pages/filipeta/Pesquisar.html");
    validar();
    setPortaria();
});

function validar() {
    $("#form-editar-filipeta").validate({
        rules: {
            numero: {
                required: true,
                minlength: 3,
                maxlength: 100
            },
            portarias: {
                required: true
            }
        },
        messages: {
            numero: {
                required: "Nome obrigatório",
                minlength: "Tamanho mínimo para o nome é 3 caracter",
                maxlength: "Tamanho máximo para no nome é 100 caracter"
            },
            portarias: {
                required: "Portaria obrigatória"
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


function stylePortaria(portaria) {
    if (!portaria.id) {
        return portaria.text;
    }
    var html = $("<span class='badge badge-primary'> " + portaria.text + "</span>");
    return html;
}

function setPortaria() {
    $("#btnPortariaAtual").click(function () {
        $("#portarias").val($("#portaria-id").val()).trigger("change");
    });
}
