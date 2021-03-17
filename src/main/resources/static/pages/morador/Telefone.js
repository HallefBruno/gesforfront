$(function () {
    
    $("form").after("<div id='addTelefone'></div>");
    $("#addTelefone").load("pages/morador/ModalTelefone.html");
    var listaTelefones = [];
    var telefone = {};
    var data = [];
    var row = {};
    var index = 0;
    
    $("form").on("click","#btn-open-modal-telefone", function () {
        $("#modalTelefone").modal("show");
        $("#modalTelefone").on("shown.bs.modal", function () {
            $("#numeroTelefone").trigger("focus");
        });
    });
    
    
    $("#addTelefone").on("click","#btnSalvarNumero", function () {
        
        if($("#numeroTelefone").val() !== "" || $("#numeroTelefone").val() !== null) {
            row = {
                id:index,
                numero:$("#numeroTelefone").val() 
            };
            telefone = {
                numero: $("#numeroTelefone").val()
            };
            
            listaTelefones.push(telefone);
            data.push(row);
            index++;
            popularTabela(data);
        }
        popularSelectTelefone(data);
    });
    
    $("#addTelefone").on("click","#btnRemove", function () {
        var value = $(this).data("numero");
        
        data = data.filter(item => item.numero !== value);
        listaTelefones = listaTelefones.filter(item => item.numero !== value);

        popularTabela(data);
        $(".select-telefones").html("");
        $(".select-telefones").append("<option value=''>Telefone</option>");
        popularSelectTelefone(data);

    });


    $("#modalTelefone").on("hidden.bs.modal", function () {
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
    
    $(".select-telefones").select2({
        theme: "bootstrap4",
        placeholder: "Telefone",
        allowClear: true,
        language: "pt-BR",
        data: telefones
    });
    
    //$(".select-telefones").trigger("change");
}