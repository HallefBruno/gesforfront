/* global CONSTANTES */

$(function () {
    
    $("form").after("<div id='detalheEstado'></div>");
    $("#detalheEstado").load("pages/estado/Detalhes.html");
    
    $("table").on("click","#btn-detalhe", function () {
        
        const id = $(this).data("detalhe");
        const url = CONSTANTES.currentUri+"/estados/buscar/"+id;
        
        $.get(url, function(data) {
            var estado = {};
            estado = data;
            $('#modalDetalheEstado').modal("show");

            $("#modalDetalheEstado").on("shown.bs.modal", function () {
                var modal = $(this);
                modal.find("#nome").val(estado.nome);
                modal.find("#uf").val(estado.uf);
            });

            $("#modalDetalheEstado").on("hidden.bs.modal", function () {
                $("#modalDetalheEstado").modal("dispose");
            });
        });
        
    });

});