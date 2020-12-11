/* global Swal, Message, DataTable */

$(function () {
    pesquisar();
    getList();
    novo();
    //assemblyDatatable();
});

function pesquisar() {
    
    $.validator.setDefaults({
        submitHandler: function () {
            getList();
        }
    });

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
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass("is-invalid");
            //$(element).addClass("is-valid").removeClass("is-invalid");
        }
    });
}

function novo() {
    $("button[name='btnNovo']").on("click", function() {
        $(".loading").addClass("show");
        $("#pages").find("div").empty();
        $("#pages").find("div").load("pages/estado/Salvar.html");
        $(".loading").removeClass("show");
    });
}


function getList() {
    
    //var message = new Message.Success();
    var retrievedObject = localStorage.getItem('targetUrl');
    var nome = $("#nome").val();
    
    let requestParamPageable = {
        currentPage: 0,
        totalItems : 10,
        totalPages: null
    };

    $.ajax({
        method: "GET",
        url: retrievedObject + "/estados/todos",
        data: {
            "requestParamPageable":JSON.stringify(requestParamPageable),
            "nome":nome
        },
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            if(data !== undefined) {
                var datatb = new DataTable.AssembleDataTable();
                datatb.enable("Nenhum registro encontrado", data.content,true);
            //message.show("Registro salvo com sucesso!");
            }
        }
    });
}

function assemblyDatatable() {
    $(".teste").show();
    $("#tbestado").find("div").empty();
    $("#tbestado").find("div").load("pages/estado/Table.html");
    $(".teste").hide();
}