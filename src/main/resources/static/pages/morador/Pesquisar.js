$(function () {
    init();
    initDatatable();
    irParaPageNovo();
    
});

function init() {
    mascaraCpf("#cpf");
    mascaraTelefone("#telefone");
}

function initDatatable() {
    var url = getStorage("currentUri");
    
    var parametros = {
        columns: [
            {data: "nome", sortable: true},
            {data: "cpf", sortable: false,
                render: function (data,type, row, meta) {
                    //console.log(type);
                    //console.log(row);
                    //console.log(meta);
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
}

function irParaPageNovo() {
    $("#btnNovo").click(function() {
        loadPageHtml("pages/morador/Novo.html");
    });
}