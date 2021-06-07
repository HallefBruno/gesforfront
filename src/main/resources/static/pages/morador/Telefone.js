
/* global listTelefoneEditarMoradorProprietario */
var listTelefoneModal = [];

$(function () {
    $("form").after("<div id='addTelefone'></div>");
    $("#addTelefone").load("pages/morador/ModalTelefone.html");
    var listaTelefones = [];
    var telefone = {};

    $("form").on("click", "#btn-open-modal-telefone", function () {
        $("#modalTelefone").modal("show");
        $("#modalTelefone").on("shown.bs.modal", function () {
            $("#numeroTelefone").trigger("focus");
            $("#numeroTelefone").val("");
        });
        mascaraTelefone("#numeroTelefone");
        $(".alert-modal-telefone").hide();
        try {
            if (listTelefoneEditarMoradorProprietario !== undefined && listTelefoneEditarMoradorProprietario !== null && listTelefoneEditarMoradorProprietario.length > 0) {
                listaTelefones = listTelefoneEditarMoradorProprietario;
                listTelefoneEditarMoradorProprietario = [];
                popularTabelaTelefone(listaTelefones);
            }
        } catch (ex) {
            ex.message;
        }

    });

    $("#addTelefone").on("click", "#btnSalvarNumero", function () {
        if ($("#numeroTelefone").val() !== undefined && $("#numeroTelefone").val().length !== 0 && $("#numeroTelefone").val() !== null) {
            telefone = {
                numero: mascaraStringTel($("#numeroTelefone").val())
            };
            if (containsObject(telefone, listaTelefones)) {
                $("#strong-modal-alert").html("");
                $("#strong-modal-alert").html("Este número de telefone já foi incluido!");
                $(".alert-modal-telefone").show();
                $("#numeroTelefone").trigger("focus");
                return;
            }

            listaTelefones.push(telefone);
            popularTabelaTelefone(listaTelefones);
            popularSelectTelefone(listaTelefones);
            listTelefoneModal = listaTelefones;
            $(".alert-modal-telefone").hide();
            return;
        }
        $("#strong-modal-alert").html("");
        $("#strong-modal-alert").html("Número de telefone é obrigatório!");
        $(".alert-modal-telefone").show();
        $("#numeroTelefone").trigger("focus");
    });

    $("#addTelefone").on("click", "#btnRemove", function () {
        const tel = $(this).data("numero").toString();
        for (var i = 0; i < listaTelefones.length; i++) {
            if (removelAllCaracterSpacialString(listaTelefones[i].numero) === tel) {
                listaTelefones.splice(i, 1);
            }
        }
        popularTabelaTelefone(listaTelefones);
        $("#telefones").html("");
        $("#telefones").append("<option value=''>Telefone</option>");
        popularSelectTelefone(listaTelefones);
        listTelefoneModal = listaTelefones;
    });
    $("#modalTelefone").on("hidden.bs.modal ", function () {
        $(".alert-modal-telefone").hide();
        $("#modalTelefone").find("#numeroTelefone").val("");
        $("#modalTelefone").modal("dispose");
    });

});

function popularTabelaTelefone(data) {

    var table = $("#tblNumeroTelefone");
    table.find("tbody").find("tr").remove();
    var body = "";

    if (data.length !== "undefined" && data.length !== null && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            body += "<tr><td>" + mascaraStringTel(data[i].numero) + "</td>" + "<td class='text-center'>" + "<button id='btnRemove' data-numero='" + removelAllCaracterSpacialString(data[i].numero) + "' type='button' title='Remover da lista' class='btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button>" + "</td>" + "</tr>";
        }
    } else {
        body += "<tr><td colspan='2'><span class='badge badge-dark'>Nenhum telefone adicionado</span></td></tr>";
    }

    table.find("tbody").append(body);
}

function popularSelectTelefone(listaTelefones) {

    var numero = {};
    var telefones = [];
    $.each(listaTelefones, function (i, values) {
        numero = {
            id: values.numero,
            text: mascaraStringTel(values.numero)
        };
        telefones.push(numero);
    });

    $("#telefones").select2({
        theme: "bootstrap4",
        placeholder: "Telefone",
        allowClear: true,
        language: "pt-BR",
        data: telefones
    });

    //$("#telefones").trigger("change");
}

function validation() {

    $("#modalTelefone").find("#form-modal-telefone").validate({
        rules: {
            numeroTelefone: {
                minlength: 12,
                maxlength: 12,
                required: true
            }
        },
        messages: {
            numeroTelefone: {
                minlength: "Tamanho mínimo para o telefone é 12caracter",
                maxlength: "Tamanho máximo para o telefone é 12 caracter",
                required: "Telefone obrigatório"
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            if (element.is("select")) {
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

function containsObject(obj, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].numero === obj.numero) {
            return true;
        }
    }
    return false;
}