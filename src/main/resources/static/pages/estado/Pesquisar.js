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
    
    var parametros = {
        url: "/estados/todos",
        paginaAtual: 0,
        nomeObject: "nome",
        filters: {
            "nome": $("#nome").val()
        },
        action: true
    };

    var dataTb = new DataTable.AssembleDataTable2();
    dataTb.init(parametros);

}

function assemblyDatatable() {
    $(".teste").show();
    $("#tbestado").find("div").empty();
    $("#tbestado").find("div").load("pages/estado/Table.html");
    $(".teste").hide();
}