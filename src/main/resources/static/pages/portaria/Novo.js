/* global Message, CONSTANTES */

$(document).ready(function () {
    $.validator.setDefaults({
        submitHandler: function () {

            var message = new Message.Success();
            var url = CONSTANTES.currentUri;

            var portaria = {
                nome: $("#nome").val()
            };

            $.ajax({
                method: "POST",
                url: url + "/portarias/salvar",
                data: JSON.stringify(portaria),
                contentType: "application/json",
                dataType: "json",
                statusCode: {
                    201: function (data) {
                        removeAllLocalStorage();
                        message.show("Registro salvo com sucesso!");
                    }
                }
            });
        }
    });
    validar();
    pagePesquisar();

});

function validar() {
    $("#form-portaria").validate({
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

function pagePesquisar() {
    $("#btnPagePesquisar").on("click", function() {
        loadPageHtml("pages/portaria/Pesquisar.html");
    });
}