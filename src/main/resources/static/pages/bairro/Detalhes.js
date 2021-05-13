$(function () {
    
    $("form").after("<div id='detalheBairro'></div>");
    $("#detalheBairro").load("pages/bairro/Detalhes.html");
    
    $("table").on("click","#btn-detalhe", function () {
        var id = $(this).data("detalhe");
        
        var url = localStorage.getItem('currentUri')+"/bairros/buscar/"+id;
        
        $.get(url, function(data) {
            var bairro = {};
            bairro = data;
            $('#modalDetalheBairro').modal("show");

            $("#modalDetalheBairro").on("shown.bs.modal", function () {
                var modal = $(this);
                modal.find("#estado").val(bairro.cidade.estado.nome);
                modal.find("#cidade").val(bairro.cidade.nome);
                modal.find("#bairro").val(bairro.nome);
            });

            $("#modalDetalheBairro").on("hidden.bs.modal", function () {
                $("#modalDetalheBairro").modal("dispose");
            });
        });
        
    });
    
});