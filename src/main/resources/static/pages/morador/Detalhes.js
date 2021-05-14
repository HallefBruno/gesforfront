$(function () {
    
    $("form").after("<div id='divDetalheMorador'></div>");
    $("#divDetalheMorador").empty();
    $("#divDetalheMorador").load("pages/morador/Detalhes.html");
    
    $("table").on("click", "#btn-detalhe", function () {
        const id = $(this).data("detalhe");
        const url = localStorage.getItem("currentUri") + "/morador/buscar/" + id;
        $.get(url, function (data) {
            $("#modalDetalheMorador").modal("show");
            var morador = data;
            $("#modalDetalheMorador").on("shown.bs.modal", function () {
                var modal = $(this);
                modal.find("#nome").val(morador.nome);
                modal.find("#cpf").val(morador.cpf);
                modal.find("#rg").val(morador.rg);
                modal.find("#emissor").val(morador.orgaoEmissor);
                modal.find("#dataNascimento").val(morador.dataNascimento);
                modal.find("#natural").val(morador.naturalidade);
                modal.find("#estadoCivil").val(morador.estadoCivil);
                modal.find("#sexo").val(morador.sexo);
                const sexo = modal.find("#animalDomentico").val(morador.sexo);
                sexo === true ? modal.find("#animalDomentico").val("Sim") : modal.find("#animalDomentico").val("Não");
                modal.find("#residencia").val(morador.residencia);
                modal.find("#qtdMorador").val(morador.qtdMoradores);

                var telefone;
                var telefones = [];
                $.each(morador.telefones, function (i, values) {
                    telefone = {
                        id: values.id,
                        text: mascaraStringTel(values.numero)
                    };
                    telefones.push(telefone);
                });

                $("#telefones").select2({
                    theme: "bootstrap4",
                    placeholder: "Telefones",
                    allowClear: true,
                    language: "pt-BR",
                    data: telefones
                });
                popularTabela(morador.automoveisMoradores);
            });
        });
        
        $("#modalDetalheMorador").on("hidden.bs.modal", function () {
            $("#modalDetalheMorador").modal("dispose");
        });
        
    });
    
});


function popularTabela(data) {
    
    var table = $(".tbl-add-automovel");
    table.find("tbody").find("tr").remove();
    var body = "";
    
    if(data.length !== "undefined" && data.length !== null && data.length > 0) {
        for(var i=0; i<data.length; i++) {
            var htmlTipo = "";
            if(data[i].automovel.tipoAutomovel === "C") {
                htmlTipo = "<span class='text-center badge badge-primary'>" + "Carro" + "</span>";
            } else {
                htmlTipo = "<span class='text-center badge badge-success'>" + "Moto" + "</span>";
            }
            body += "<tr>"+
                        "<td>" + data[i].automovel.fabricante.nome + "</td>"+
                        "<td>" + data[i].automovel.nome + "</td>"+
                        "<td>" + data[i].placa.toUpperCase() +"</td>"+
                        "<td>" + data[i].cor +"</td>"+
                        "<td>" + htmlTipo +"</td>"+
                    "</tr>";
        }
    } else {
        body += "<tr><td colspan='5' class=''>Nenhum automovel vinculado</td></tr>";
    }

    table.find("tbody").append(body);
}