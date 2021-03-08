/* global Message */

$(function () {
    
    var page = $("#pages");
    var body = $("body");
    var comboEstado = $("#estados");
    var path = localStorage.getItem('currentUri');
    
    body.find("#btnPagePesquisar").on("click", function () {
        page.find("div").empty();
        page.find("div").load("pages/cidade/Pesquisar.html");
    });
    
    $("table").on("click", "#btn-editar", function () {
        
        page.find("div").empty();
        page.find("div").load("pages/cidade/Editar.html");

        var id = $(this).data("editar");

        $.get(path + "/cidades/buscar/" + id, function (data) {
            if (body.find("#nome").length) {
                
                body.find("#id").val(data.id);
                body.find("#nome").val(data.nome);
                
                body.find("#estado-id").val(data.estado.id);
                body.find("#estado-nome").val(data.estado.nome);
                body.find("#estado-uf").val(data.estado.uf);

            } else {
                var warning = new Message.Warning();
                warning.show("houve um probleminha na renderização dos componentes da tela que você iria trabalhar, pesso que tente editar novamente!", "I");
                console.log("Ops! Elemento não existe no DOM");
            }
        });
        
    });
    
    getData(path+"/estados/todos").then(function(data) {
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
        
        comboEstado.select2({
            theme: "bootstrap4",
            placeholder:"Selecione o estado",
            allowClear: true,
            language: "pt-BR",
            templateResult: styleEstado,
            data: estados
        });
        
    });
    
    var optionalEstado = {
        text: $("#estado-nome").val(),
        id: $("#estado-id").val(),
        uf:$("#estado-uf").val()
    };
    
    var estado = {};
    var cidade = {};
    
    var option = new Option(optionalEstado.text, optionalEstado.id, true, true);
    comboEstado.append(option).trigger("change");

    comboEstado.trigger({
        type: "select2:select",
        params: {
            data: optionalEstado
        }
    });
    
    estado = {
        id:optionalEstado.id,
        nome:optionalEstado.text,
        uf:optionalEstado.uf
    };
    
    cidade = {
        id:$("#id").val(),
        estado:estado,
        nome:$("#nome").val()
    };
    
    comboEstado.on("select2:select", function (e) {
        var data = e.params.data;
        if(data.uf !== undefined || data.uf !== null) {
            cidade = {
                id:$("#id").val(),
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

            var retrievedObject = localStorage.getItem('currentUri');
            Object.assign(cidade, {nome: $("#nome").val()});
            
            $.ajax({
                method: "PUT",
                url: retrievedObject + "/cidades/alterar/"+cidade.id,
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
    
    validar();
    
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

async function getData(url) {
   var jqXHR = await $.get(url);
   return jqXHR;
}
    
function styleEstado(estado) {
    if (!estado.id) {
        return estado.text;
    }
    var html = $("<span>"+estado.text+"</span><span class='text-right badge badge-primary'>"+estado.uf+"</span>");
    return html;
};