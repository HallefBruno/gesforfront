$(function () {

    var url = getStorage("currentUri");
    
    var parametros = {
        columns: [
            {data: "nome", sortable: false},
            {data: "cpf", sortable: false,
                render: function (data) {//, type, row, meta
                    window.console.log(data);
                    data = data.substring(0,3)+"."+data.substring(3,6)+"."+data.substring(6,9)+"-"+data.substring(9,11);
                    return data;
                }
            },
            {data: "sexo", sortable: false},
            {data: "estadoCivil", sortable: false},
            {data: "residencia", sortable: false},
            {data: "qtdMoradores", sortable: false}
        ]
    };

    setDefaultsDataTable(parametros);
    
    $("#tbMoradores").DataTable({
        ajax: {
            url: url + "/morador/todos",
            method: "get",
            data: {
                filtrosMorador: function () {
                    return filtrosMorador = {
                        nome: $("#nome").val(),
                        cpf: $("#cpf").val(),
                        residencia: $("#residencia").val(),
                        telefone: $("#telefone").val()
                    };
                }
            }
        }
    });
    
    irParaPageNovo();
    
});

function irParaPageNovo() {
    $("#btnNovo").click(function() {
        loadPageHtml("pages/morador/Novo.html");
    });
}