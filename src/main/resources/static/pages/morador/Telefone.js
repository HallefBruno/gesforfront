$(function () {
    $("form").after("<div id='addTelefone'></div>");
    $("#addTelefone").load("pages/morador/ModalTelefone.html");
    var listaTelefones = [];
    var telefone = {};
    var data = [];
    var row = {};

    $("form").on("click","#btn-open-modal-telefone", function () {
        $("#modalTelefone").modal("show");
        $("#modalTelefone").on("shown.bs.modal", function () {
            $("#numeroTelefone").trigger("focus");
            $("#numeroTelefone").val("");
        });
        mascaraTelefone("#numeroTelefone");
        $(".alert-modal-telefone").hide();
    });
    
    
    $("#addTelefone").on("click","#btnSalvarNumero", function () {

        if($("#numeroTelefone").val() !== undefined && $("#numeroTelefone").val().length !== 0 && $("#numeroTelefone").val() !== null) {
            row = {
                numero: $("#numeroTelefone").val()
            };
            telefone = {
                numero: $("#numeroTelefone").val()
            };
            
            if (containsObject(telefone, listaTelefones)) {
                $("#strong-modal-alert").html("");
                $("#strong-modal-alert").html("Este número de telefone já foi incluido!");
                $(".alert-modal-telefone").show();
                $("#numeroTelefone").trigger("focus");
                return;
            }
            
            listaTelefones.push(telefone);
            popularTabela(listaTelefones);
            popularSelectTelefone(listaTelefones);
            setStorage64("telefones",listaTelefones);
            $(".alert-modal-telefone").hide();
            return;
        } 
        $("#strong-modal-alert").html("");
        $("#strong-modal-alert").html("Número de telefone é obrigatório!");
        $(".alert-modal-telefone").show();
        $("#numeroTelefone").trigger("focus");
    });
    
    $("#addTelefone").on("click","#btnRemove", function () {
        var value = $(this).data("numero");
        listaTelefones = listaTelefones.filter(item => item.numero !== value);
        popularTabela(listaTelefones);
        $("#telefones").html("");
        $("#telefones").append("<option value=''>Telefone</option>");
        popularSelectTelefone(data);
        if(listaTelefones.length > 0) {
            setStorage64("telefones",listaTelefones);
        } else {
            removeItemStorage("telefones");
        }
    });
    //hide.bs.modal hidden.bs.modal
    $("#modalTelefone").on("hidden.bs.modal ", function () {
        $(".alert-modal-telefone").hide();
        $("#modalTelefone").find("#numeroTelefone").val("");
        $("#modalTelefone").modal("dispose");
    });

});

function popularTabela(data) {
    
    var table = $("#tblNumeroTelefone");
    table.find("tbody").find("tr").remove();
    var body = "";
    
    if(data.length !== "undefined" && data.length !== null && data.length > 0) {
        for(var i=0; i<data.length; i++) {
            body += "<tr><td>" + data[i].numero + "</td>"+"<td class='text-center'>"+"<button id='btnRemove' data-numero='"+data[i].numero+"' type='button' title='Remover da lista' class='btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button>"+"</td>"+"</tr>";
        }
    } else {
        body += "<tr><td colspan='2' class=''>Nenhum telefone adicionado</td></tr>";
    }

    table.find("tbody").append(body);
}

function popularSelectTelefone(listaTelefones) {
    
    var numero = {};
    var telefones = [];
    $.each(listaTelefones, function (i, values) {
        numero = {
            id: values.numero,
            text: values.numero
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

function containsObject(obj, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].numero === obj.numero) {
            return true;
        }
    }
    return false;
}