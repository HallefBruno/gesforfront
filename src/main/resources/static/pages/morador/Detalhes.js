$(function () {
    
    $("form").after("<div id='divDetalheMorador'></div>");
    $("#divDetalheMorador").empty();
    $("#divDetalheMorador").load("pages/morador/Detalhes.html");
    
    $("table").on("click","#btn-detalhe", function () {
        const id = $(this).data("detalhe");
        const url = localStorage.getItem("currentUri")+"/morador/buscar/"+id;
        
        var morador = {};
        $.get(url, function(data) {
            morador = data;
        });
        
        $("#modalDetalheMorador").modal("show");
        
        $("#modalDetalheMorador").on("shown.bs.modal", function () {
            var modal = $(this);
            modal.find("#numero").val(morador.nome);
            modal.find("#portaria").val(morador.moradorSecundario.nome);
        });
        
        $("#modalDetalheMorador").on("hidden.bs.modal", function () {
            $("#modalDetalheMorador").modal("dispose");
        });
        
    });
    
});