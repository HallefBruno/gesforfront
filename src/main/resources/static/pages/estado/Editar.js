/* global Message */

$(function () {

    var url = getStorage("currentUri");
    var id = getStorage("estadoId");
    
    $.get(url+"/estados/buscar/"+id, function(data) {
        if ($("#nome").length) {
            $("#id").val(data.id);
            $("#nome").val(data.nome);
            $("#uf").val(data.uf);
        } else {
            var warning = new Message.Warning();
            warning.show("houve um probleminha na renderização dos componentes da tela que você iria trabalhar, pesso que tente editar novamente!","I");
            console.log("Ops! Elemento não existe no DOM");
        }
    });

    $.validator.setDefaults({
        submitHandler: function () {
            var estado = {
                id: $("#id").val(),
                nome: $("#nome").val(),
                uf: $("#uf").val()
            };

            $.ajax({
                method: "PUT",
                url: url + "/estados/alterar/"+estado.id,
                data: JSON.stringify(estado),
                contentType: "application/json",
                dataType: "json",
                statusCode: {
                    200: function (data) {
                        removeAllLocalStorage();
                        var success = new Message.Success();
                        success.show("Registro salvo com sucesso!");
                    }
                }
            });
        }
    });
    
    irParaPagePesquisar();
    validar();
    
});

function validar() {
    $("#form-estado").validate({
        rules: {
            nome: {
                required: true,
                minlength: 2,
                maxlength: 100
            },
            uf: {
                required: true,
                minlength: 2,
                maxlength: 2
            }
        },
        messages: {
            nome: {
                required: "Nome obrigatório",
                minlength: "Tamanho mínimo para o nome é 3 caracter",
                maxlength: "Tamanho máximo para no nome é 100 caracter"
            },
            uf: {
                required: "UF obrigatório",
                minlength: "Tamanho mínimo para o nome é 2 caracter",
                maxlength: "Tamanho máximo para no nome é 2 caracter"
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
        loadPageHtml("pages/estado/Pesquisar.html");
    });
}