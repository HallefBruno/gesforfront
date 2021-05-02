/* global Message */

$(document).ready(function() {
    
    var url = localStorage.getItem("currentUri");
    
    var cidade;
    var estados = [];
    
    $.get(url+"/estados/todos", function(data) {
        var estado;
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
            placeholder:"Selecione o estado",
            allowClear: true,
            language: "pt-BR",
            templateResult: styleEstado,
            data: estados
        });

    });
    
    $("#estados").on("select2:select", function (e) {
        var data = e.params.data;
        if(data.uf !== undefined || data.uf !== null) {
            cidade = {
                estado: {
                    id:data.id,
                    nome:data.text,
                    uf:data.uf
                }
            };
        }
    });

    
    $.validator.setDefaults({
        submitHandler: function () {
            
            var message = new Message.Success();

            Object.assign(cidade, {nome: $("#nome").val()});

            
            $.ajax({
                method: "POST",
                url: url + "/cidades/salvar",
                data: JSON.stringify(cidade),
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
    irParaPagePesquisar();
});

function validar() {
    $("#form-cidade").validate({
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
    var html = $("<span>"+estado.text+"</span><span class='text-right badge badge-primary'>"+estado.uf+"</span>");
    return html;
};

function irParaPagePesquisar() {
    $("#btnPagePesquisar").click(function () {
        loadPageHtml("pages/cidade/Pesquisar.html");
    });
}

//async function getData(url) {
//   var jqXHR = await $.get(url);
//   return jqXHR;
//}
