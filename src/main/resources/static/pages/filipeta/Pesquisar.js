/* global Swal */

$(function () {

    var filipeta;
    var portarias = [];
    var url = getStorage("currentUri");
    
    var parametros = {
        columns: [
            {data: "portaria.nome", sortable: false},
            {data: "numero", sortable: false}
        ]
    };

    setDefaultsDataTable(parametros);

    $("#portarias").on("select2:select", function (e) {
        var data = e.params.data;
        if(data.nome !== undefined || data.nome !== null) {
            filipeta = data.text;
        }
    });

    $("#tbfilipetas").DataTable({
        ajax: {
            url: url + "/filipetas/todos/",
            method: "get",
            data: {
                numero: function () {
                    return $("#numero").val();
                },
                nomePortaria: function () {
                    return filipeta;
                }
            }
        }
    });
    

    $.get(url+"/portarias/todos",function(data) {
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
                    url: url+"/filipetas/excluir/" + $(this).data("excluir"),
                    success: function () {
                        $("#tbfilipetas").DataTable().ajax.reload();
                        Swal.fire('Excluído! ', ' Seu registro foi excluído.', 'success');
                    }
                });
            }
        });
    });
    
    $("table").on("click", "#btn-editar", function () {
        const filipetaId = {id:$(this).data("editar")};
        loadPageHtml("pages/filipeta/Editar.html",filipetaId);
    });

    $.validator.setDefaults({
        submitHandler: function () {
            $("#tbfilipetas").DataTable().ajax.url(url+"/filipetas/todos").load();
        }
    });
    
    vaidation();
    irParaPageNovo();
});

function vaidation() {
    
    $("#form-pesquisa-filipeta").validate({
        rules: {
            numero: {
                minlength: 3,
                maxlength: 100,
                required: false
            },
            portarias: {
                required: false
            }
        },
        messages: {
            numero: {
                minlength: "Tamanho mínimo para o número é 3 caracter",
                maxlength: "Tamanho máximo para no número é 100 caracter"
            },
            portarias: {
                required: "Portaria obrigatória"
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {

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

function irParaPageNovo() {
    $("#pages").on("click","#linkNovo", function() {
        loadPageHtml("pages/filipeta/Novo.html");
    });
    $("#btnNovo").click(function () {
       loadPageHtml("pages/filipeta/Novo.html"); 
    });
}

function stylePortaria(portaria) {
    if (!portaria.id) {
        return portaria.text;
    }
    var html = $("<span class='badge badge-primary'>"+portaria.text+"</span>");
    return html;
}
