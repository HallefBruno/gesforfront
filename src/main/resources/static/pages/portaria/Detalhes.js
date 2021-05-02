$(function () {
    
    $("form").after("<div id='detalhePortaria'></div>");
    $("#detalhePortaria").load("pages/portaria/Detalhes.html");
    
    $("table").on("click","#btn-detalhe", function () {
        var id = $(this).data("detalhe");
        
        var url = localStorage.getItem("currentUri")+"/portarias/buscar/"+id;
        
        var portaria = {};
        $.get(url, function(data) {
            portaria = data;
        });
        
        $("#modalDetalhePortaria").modal("show");
        
        $("#modalDetalhePortaria").on("shown.bs.modal", function () {
            var modal = $(this);
            modal.find("#nome").val(portaria.nome);
        });
        
        $("#modalDetalhePortaria").on("hidden.bs.modal", function () {
            $("#modalDetalhePortaria").modal("dispose");
        });
        
    });
    

});