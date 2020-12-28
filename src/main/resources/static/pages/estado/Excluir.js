/* global Message, DataTable */

var Estado = Estado || {};

Estado.Excluir = (function () {

    function Excluir() {}

    Excluir.prototype.execute = function () {
        $("table tbody").on('click', '#excluir', function (document) {

            let id = $(this).data("id");
            var retrievedObject = localStorage.getItem('currentUri');
            $.ajax({
                method: "DELETE",
                url: retrievedObject + "/estados/excluir/" + id,
                success: function (data) {

                    var parametros = {
                        url: "/estados/todos",
                        paginaAtual: 0,
                        nomeObject: "nome",
                        filters: {
                            "nome": ""
                        },
                        action: true
                    };

                    var message = new Message.Success();
                    message.show("Registro deletado com sucesso!");
                    var dataTb = new DataTable.AssembleDataTable2();
                    dataTb.init(parametros);
                }
            });
        }).bind(this);
    };

    return Excluir;

}());

$(function () {
    var estadoExcluir = new Estado.Excluir();
    estadoExcluir.execute();
});

