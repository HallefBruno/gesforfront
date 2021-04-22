/* global Message */

$(document).ready(function () {

    var url = localStorage.getItem("currentUri");
    var id = localStorage.getItem("portariaId");
    
    $.get(url + "/portarias/buscar/" + id, function (data) {
        $("#id").val(data.id);
        $("#nome").val(data.nome);
    });

    $.validator.setDefaults({
        submitHandler: function () {
            var portaria = {
                id: $("#id").val(),
                nome: $("#nome").val()
            };

            $.ajax({
                method: "PUT",
                url: url + "/portarias/alterar/"+portaria.id,
                data: JSON.stringify(portaria),
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
    
    validar();
    irParaPagePesquisar();
});

function validar() {
    $("#form-editar-portaria").validate({
        rules: {
            nome: {
                required: true,
                minlength: 2,
                maxlength: 100
            }
        },
        messages: {
            nome: {
                required: "Nome obrigatório",
                minlength: "Tamanho mínimo para o nome é 3 caracter",
                maxlength: "Tamanho máximo para no nome é 100 caracter"
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

function irParaPagePesquisar() {
    $("#btnPagePesquisar").click(function () {
        loadPageHtml("pages/portaria/Pesquisar.html");
    });
}