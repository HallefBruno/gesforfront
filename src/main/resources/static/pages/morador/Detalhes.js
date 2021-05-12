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
            window.console.log(morador);
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
                    text: values.numero
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
            
            $(".tbl-add-automovel").DataTable({
                "paginate": false,
                "lengthChange": false,
                "info": false,
                "autoWidth": false,
                "filter": false,
                language: {
                    url: "vendor/internationalisation/pt_br.json"
                },
                 "columns": [
                    {"data": morador.automoveisMoradores.automovel.fabricante.nome},
                    {"data": morador.automoveisMoradores.automovel.nome},
                    {"data": morador.automoveisMoradores.placa},
                    {"data": morador.automoveisMoradores.cor},
                    {"data": morador.automoveisMoradores.automovel.tipoAutomovel}
                ]
            });
            
        });
        
        $("#modalDetalheMorador").on("hidden.bs.modal", function () {
            $("#modalDetalheMorador").modal("dispose");
        });
        
    });
    
});