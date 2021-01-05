
/* global Swal */

"use strict";

var parametros = {
    columns: [
        {data: "nome"},
        {data: "uf"}
    ]
};

var filtros = [
    $("#nome").val()
];

$(function () {
    
    setDefaultsDataTable(parametros);

    var table = $('#tbestados').DataTable({
        
        ajax: {
            url: localStorage.getItem('currentUri')+"/estados/todos",
            method: "get",
            data: {
                filtros:filtros.toString()
            }
        }
        
    });
    
    $.validator.setDefaults({
        submitHandler: function () {
            $("#tbestados").empty();
            filtros[0] = $("#nome").val();
            $('#tbestados').DataTable({
                ajax: {
                    url: localStorage.getItem('currentUri')+"/estados/todos",
                    method: "get",
                    data: {
                        filtros: filtros.toString()
                    }
                }
            });
            var tbody = $("#tbestados > tbody");
            if (tbody.children().length === 0) {
                tbody.html("<tr><td colspan='2'>Nenhum registro encontrado</td></tr>");
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
                    url: localStorage.getItem('currentUri') + "/estados/excluir/" + $(this).data("excluir"),
                    success: function () {
                        table.ajax.reload();
                        Swal.fire('Excluído! ', ' Seu registro foi excluído.', 'success');
                    }
                });
            }
        });

    });

    vaidation();
    novo();
});

function vaidation() {
    
    $("#form-pesquisa").validate({
        rules: {
            nome: {
                required: true,
                minlength: 2,
                maxlength: 25
            }
        },
        messages: {
            nome: {
                required: "Nome obrigatório",
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

function novo() {
    $("button[name='btnNovo']").on("click", function() {
        $("#pages").find("div").empty();
        $("#pages").find("div").load("pages/estado/Novo.html");
    });
}
