/* global Message */

$(document).ready(function() {
    
    var url = localStorage.getItem("currentUri");
    
    var filipeta = {};
    var portarias = [];
    
    $.get(url+"/portarias/todos", function(data) {
        var portaria;
        $.each(data, function (i, values) {
            portaria = {
                id: values.id,
                text: values.nome
            };
            portarias.push(portaria);
        });
        
        $("#portarias").select2({
            theme: "bootstrap4",
            placeholder:"Selecione a portaria",
            allowClear: true,
            language: "pt-BR",
            templateResult: stylePortaria,
            data: portarias
        });

    });
    
    $("#portarias").on("select2:select", function (e) {
        var data = e.params.data;
        if(data.nome !== undefined || data.nome !== null) {
            filipeta = {
                portaria: {
                    id:data.id
                }
            };
        }
    });

    
    $.validator.setDefaults({
        submitHandler: function () {
            
            var message = new Message.Success();

            filipeta["numero"] = $("#numero").val();

            $.ajax({
                method: "POST",
                url: url + "/filipetas/salvar",
                data: JSON.stringify(filipeta),
                contentType: "application/json",
                dataType: "json",
                statusCode: {
                    201: function (data) {
                        message.show("Registro salvo com sucesso!");
                    }
                }
            });
            
        }
    });
    
    validar();
    pagePesquisar();
});

function pagePesquisar() {
    $("#btnPagePesquisar").click(function () {
        loadPageHtml("pages/filipeta/Pesquisar.html");
    });
}

function validar() {
    $("#form-novo-filipeta").validate({
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
    var html = $("<span class='badge badge-primary'>"+portaria.text+"</span>");
    return html;
};