
/* global Swal */
$(function () {
    
    var parametros = {
        columns: [
            {data: "nome", sortable: true},
            {data: "uf", sortable: false}
        ]
    };
    setDefaultsDataTable(parametros);

    var url = localStorage.getItem("currentUri");

    $("#tbestados").DataTable({
        ajax: {
            url: url +"/estados/todos/",
            method: "get",
            data: {
                nomeEstado: function () {
                    return $("#nome").val();
                }
            }
        }
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
                    url: url + "/estados/excluir/" + $(this).data("excluir"),
                    success: function () {
                        $('#tbestados').DataTable().ajax.reload();
                        Swal.fire('Excluído! ', ' Seu registro foi excluído.', 'success');
                    }
                });
            }
        });

    });
    
    $("table").on("click", "#btn-editar", function () {
        loadPageHtml("pages/estado/Editar.html");
        localStorage.setItem("estadoId", $(this).data("editar"));
    });
    
    $.validator.setDefaults({
        submitHandler: function () {
            $("#tbestados").DataTable().ajax.url(url+"/estados/todos/").load();
        }
    });
    
    vaidation();
    irParaPageNovo();
});

function vaidation() {
    
    $("#form-pesquisa").validate({
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
    $("#btnNovo").click(function () {
        loadPageHtml("pages/estado/Novo.html");
    });
}
