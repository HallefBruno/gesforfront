

$(function () {

    var estado;
    var estados = [];
    var url = localStorage.getItem('currentUri');
    
    var parametros = {
        columns: [
            {data: "nome", sortable: false},
            {data: "estado.nome", sortable: false}
        ]
    };
    

    setDefaultsDataTable(parametros);
    
    
    $("#estados").on("select2:select", function (e) {
        var data = e.params.data;
        if(data.uf !== undefined || data.uf !== null) {
            estado = data.text;
        }
    });
    
    var table = $('#tbcidades').DataTable({
        ajax: {
            url: url+"/cidades/todos/",
            method: "get",
            data: {
                nomeEstado: function() { 
                    return estado; 
                },
                nomeCidade: function() { return $('#cidade').val(); }
            }
        }
    });
    
    getData(url+"/estados/todos").then(function(data) {
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

    $.validator.setDefaults({
        submitHandler: function () {
            table.ajax.url(localStorage.getItem('currentUri')+"/cidades/todos").load();
        }
    });
    
    vaidation();
});

function vaidation() {
    
    $("#form-pesquisa").validate({
        rules: {
            cidade: {
                minlength: 2,
                maxlength: 25
            },
            estados: {
                required: true
            }
        },
        messages: {
            cidade: {
                minlength: "Tamanho mínimo para o nome é 2 caracter",
                maxlength: "Tamanho máximo para no nome é 50 caracter"
            },
            estados: {
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

function styleEstado(estado) {
    if (!estado.id) {
        return estado.text;
    }
    var html = $("<span>"+estado.text+"</span><span class='text-right badge badge-primary'>"+estado.uf+"</span>");
    return html;
};

async function getData(url) {
   var jqXHR = await $.get(url);
   return jqXHR;
}