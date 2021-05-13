$(function () {
    
    $("form").after("<div id='detalheFilipeta'></div>");
    $("#detalheFilipeta").load("pages/filipeta/Detalhes.html");
    
    $("table").on("click","#btn-detalhe", function () {
        var id = $(this).data("detalhe");
        var url = localStorage.getItem("currentUri")+"/filipetas/buscar/"+id;
        
        $.get(url, function(data) {
            var filipeta = {};
            filipeta = data;
            $('#modalDetalheFilipeta').modal("show");

            $("#modalDetalheFilipeta").on("shown.bs.modal", function () {
                var modal = $(this);
                modal.find("#numero").val(filipeta.numero);
                modal.find("#portaria").val(filipeta.portaria.nome);
            });

            $("#modalDetalheFilipeta").on("hidden.bs.modal", function () {
                $("#modalDetalheFilipeta").modal("dispose");
            });
        });
        
    });
    

});