/* global Swal */

$(document).ready(function() {
    
    var atualPage = $(this);
    var cidade;
    var cidades = [];
    var url = localStorage.getItem("currentUri");
    
    var parametros = {
        columns: [
            {data: "cidade.estado.nome", sortable: false},
            {data: "cidade.nome", sortable: false},
            {data: "nome", sortable: false}
        ]
    };

    setDefaultsDataTable(parametros);

    $("#cidades").on("select2:select", function (e) {
        var data = e.params.data;
        if(data.uf !== undefined || data.uf !== null) {
            cidade = data.text;
        }
    });

    atualPage.find("#form-pesquisa").find("#tbbairros").DataTable({
        ajax: {
            url: url + "/bairros/todos/",
            method: "get",
            data: {
                nomeBairro: function () {
                    return $('#bairro').val();
                },
                nomeCidade: function () {
                    return cidade;
                }
            }
        }
    });
    

    $.get(url+"/cidades/todos",function(data) {
        var cidade;
        $.each(data, function (i, values) {
            cidade = {
                id: values.id,
                text: values.nome,
                uf: values.estado.uf
            };
            cidades.push(cidade);
        });
        
        $("#cidades").select2({
            theme: "bootstrap4",
            placeholder:"Selecione a cidade",
            allowClear: true,
            language: "pt-BR",
            templateResult: styleEstado,
            data: cidades
        });
    });
    
    $("table").on("click", "#btn-excluir", function () {

        Swal.fire({
            title: 'Você tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, delete isso!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    method: "DELETE",
                    url: localStorage.getItem('currentUri') + "/bairros/excluir/" + $(this).data("excluir"),
                    success: function () {
                        $("#tbbairros").DataTable().ajax.reload();
                        Swal.fire('Excluído! ', ' Seu registro foi excluído.', 'success');
                    }
                });
            }
        });

    });
    
    $("table").on("click", "#btn-editar", function () {
        loadPageHtml(null,"pages/bairro/Editar.html");
        localStorage.setItem("bairroId", $(this).data("editar"));
    });

    $.validator.setDefaults({
        submitHandler: function () {
            $("#tbbairros").DataTable().ajax.url(localStorage.getItem('currentUri')+"/bairros/todos").load();
        }
    });
    
    vaidation();
    novo();
});

function vaidation() {
    
    $("#form-pesquisa").validate({
        rules: {
            bairro: {
                minlength: 2,
                maxlength: 25
            },
            cidades: {
                required: false
            }
        },
        messages: {
            bairro: {
                minlength: "Tamanho mínimo para o nome é 2 caracter",
                maxlength: "Tamanho máximo para no nome é 50 caracter"
            },
            cidades: {
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


function novo() {
    $("body").on("click","#linkNovo", function() {
        loadPageHtml(null,"pages/bairro/Novo.html");
    });
    loadPageHtml("#btnNovo","pages/bairro/Novo.html");
}

function styleEstado(cidade) {
    if (!cidade.id) {
        return cidade.text;
    }
    var html = $("<span>"+cidade.text+"</span><span class='text-right badge badge-primary'>"+cidade.uf+"</span>");
    return html;
}
    