$(function () {
    
    $("form").after("<div id='detalheCidade'></div>");
    $("#detalheCidade").load("pages/cidade/Detalhes.html");
    
    $("table").on("click","#btn-detalhe", function () {
        var id = $(this).data("detalhe");
        
        var url = localStorage.getItem('currentUri')+"/cidades/buscar/"+id;
        
        var cidade = {};
        $.get(url, function(data) {
            cidade = data;
        });
        
        $('#modalDetalheCidade').modal("show");
        
        $("#modalDetalheCidade").on("shown.bs.modal", function () {
            var modal = $(this);
            modal.find("#estado").val(cidade.estado.nome);
            modal.find("#cidade").val(cidade.nome);
        });
        
        $("#modalDetalheCidade").on("hidden.bs.modal", function () {
            $("#modalDetalheCidade").modal("dispose");
        });
    });
    

});