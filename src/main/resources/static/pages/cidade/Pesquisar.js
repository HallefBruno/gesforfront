/* global Swal */

$(function () {

    var estado;
    var estados = [];
    var url = localStorage.getItem("currentUri");
    
    var parametros = {
        columns: [
            {data: "estado.nome", sortable: false},
            {data: "nome", sortable: false}
        ]
    };

    setDefaultsDataTable(parametros);

    $("#estados").on("select2:select", function (e) {
        var data = e.params.data;
        if(data.uf !== undefined || data.uf !== null) {
            estado = data.text;
        }
    });

    $("#tbcidades").DataTable({
        ajax: {
            url: url + "/cidades/todos/",
            method: "get",
            data: {
                nomeEstado: function () {
                    return estado;
                },
                nomeCidade: function () {
                    return $('#cidade').val();
                }
            }
        }
    });
    

    $.get(url+"/estados/todos",function(data) {
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
                    url: url+"/cidades/excluir/" + $(this).data("excluir"),
                    success: function () {
                        $("#tbcidades").DataTable().ajax.reload();
                        Swal.fire('Excluído! ', ' Seu registro foi excluído.', 'success');
                    }
                });
            }
        });
    });
    
    $("table").on("click", "#btn-editar", function () {
        loadPageHtml("pages/cidade/Editar.html");
        localStorage.setItem("cidadeId", $(this).data("editar"));
    });

    $.validator.setDefaults({
        submitHandler: function () {
            $("#tbcidades").DataTable().ajax.url(url+"/cidades/todos").load();
        }
    });
    
    vaidation();
    irParaPageNovo();
});

function vaidation() {
    
    $("#form-pesquisa").validate({
        rules: {
            cidade: {
                minlength: 2,
                maxlength: 25
            },
            estados: {
                required: false
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

            error.addClass("invalid-feedback");
            if(element.is("select")) {
                element.append("<span></span>");
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

function irParaPageNovo() {
    $("#btnNovo").click(function() {
        loadPageHtml("pages/cidade/Novo.html");
    });
}

function styleEstado(estado) {
    if (!estado.id) {
        return estado.text;
    }
    var html = $("<span>"+estado.text+"</span><span class='text-right badge badge-primary'>"+estado.uf+"</span>");
    return html;
}
