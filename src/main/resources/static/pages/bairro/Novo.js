/* global Message */

$(document).ready(function() {
    
    var url = localStorage.getItem('currentUri');
    
    var bairro;
    var cidades = [];
    
    $.get(url+"/cidades/todos", function(data) {
        var cidade;
        $.each(data, function (i, values) {
            cidade = {
                id: values.id,
                text: values.nome,
                uf:values.estado.uf
            };
            cidades.push(cidade);
        });
        
        $("#cidades").select2({
            theme: "bootstrap4",
            placeholder:"Selecione a cidade",
            allowClear: true,
            language: "pt-BR",
            templateResult: styleCidade,
            data: cidades
        });

    });
    
    $("#cidades").on("select2:select", function (e) {
        var data = e.params.data;
        if(data.uf !== undefined || data.uf !== null) {
            bairro = {
                cidade: {
                    id:data.id
                }
            };
        }
    });

    
    $.validator.setDefaults({
        submitHandler: function () {
            var message = new Message.Success();
            bairro["nome"] = $("#nome").val();
            
            $.ajax({
                method: "POST",
                url: url + "/bairros/salvar",
                data: JSON.stringify(bairro),
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
    $("#form-bairro").validate({
        rules: {
            nome: {
                required: true,
                minlength: 3,
                maxlength: 100
            },
            cidades: {
                required: true
            }
        },
        messages: {
            nome: {
                required: "Nome obrigatório",
                minlength: "Tamanho mínimo para o nome é 3 caracter",
                maxlength: "Tamanho máximo para no nome é 100 caracter"
            },
            cidades: {
                required: "Cidade obrigatória"
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

function styleCidade(cidade) {
    if (!cidade.id) {
        return cidade.text;
    }
    var html = $("<span>"+cidade.text+"</span><span class='text-right badge badge-primary'>"+cidade.uf+"</span>");
    return html;
};

function irParaPagePesquisar() {
    $("#btnPagePesquisar").click(function () {
        loadPageHtml("pages/bairro/Pesquisar.html");
    });
}
