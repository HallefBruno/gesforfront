/* global Swal */

$(document).ready(function() {
    
    var parametros = {
        columns: [
            {data: "nome", sortable: true}
        ]
    };
    setDefaultsDataTable(parametros);

    var url = getStorage("currentUri");

    $("#tbportarias").DataTable({
        ajax: {
            url: url +"/portarias/todos/",
            method: "get",
            data: {
                nomePortaria: function () {
                    return $("#nome").val();
                }
            }
        }
    });
    
    $("#tbportarias").on("click", "#btn-excluir", function () {

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
                    url: url + "/portarias/excluir/" + $(this).data("excluir"),
                    success: function () {
                        $("#tbportarias").DataTable().ajax.reload();
                        Swal.fire('Excluído! ', ' Seu registro foi excluído.', 'success');
                    }
                });
            }
        });

    });
    
    $("#tbportarias").on("click", "#btn-editar", function () {
        loadPageHtml("pages/portaria/Editar.html");
        localStorage.setItem("portariaId", $(this).data("editar"));
    });
    
    $.validator.setDefaults({
        submitHandler: function () {
            $("#tbportarias").DataTable().ajax.url(url + "/portarias/todos/").load();
        }
    });
    
    vaidation();
    irParaPageNovo();
});

function vaidation() {
    
    $("#form-pesquisa-portaria").validate({
        rules: {
            nome: {
                minlength: 2,
                maxlength: 25
            }
        },
        messages: {
            nome: {
                minlength: "Tamanho mínimo para o nome é 2 caracter",
                maxlength: "Tamanho máximo para no nome é 50 caracter"
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

function irParaPageNovo() {
    $("#pages").on("click","#linkNovo", function() {
        loadPageHtml("pages/portaria/Novo.html");
    });
    $("#btnNovo").click(function () {
       loadPageHtml("pages/portaria/Novo.html"); 
    });
}