function setDefaultsDataTable(parametros) {
    
    var buttons = 
    {
        data: "id", title: "Ações", wrap: true,
        render: function (id) {
            var stringButtons ="<button id='btn-detalhe' data-detalhe='"+id+"' type='button' title='Detalhes' style='margin-right: 5px;' class='btn btn-outline-info btn-sm'><i class='fa fa-info-circle'></i></button>";
                stringButtons+="<button id='btn-excluir' data-excluir='"+id+"' type='button' title='Excluir' style='margin-right: 5px;' class='btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button>";
                stringButtons+="<button id='btn-editar' data-editar='"+id+"' type='button' title='Editar' class='btn btn-outline-edit btn-sm'><i class='fa fa-pencil'></i></button>";
            return stringButtons;
        }
    };
    parametros.columns.push(buttons);
    
    $.extend(true, $.fn.dataTable.defaults, {
        searching: false,
        scrollY: "400px",
        scrollCollapse: true,
        serverSide: true,
        processing: false,
        destroy: true,
        pageLength: 10,
        info: true,
        lengthChange: false,
        language: {
            url: "vendor/internationalisation/pt_br.json"
        },
        "columnDefs": [
            {width: "20%", "targets": parametros.columns.length - 1},
            {targets: parametros.columns.length - 1, className: 'text-center'},
            {targets: parametros.columns.length - 1, orderable: false},
            {targets: '_all',defaultContent: '-'}
            //{"targets": 0, "orderable": true}
        ],
        columns: parametros.columns
    });
}


//function getDataTable(parametros) {
//    
//    var table;
//    var uri = localStorage.getItem("currentUri");
//    var buttons = 
//    {
//        data: "id", title: "Ações", wrap: true,
//        render: function (id) {
//            var stringButtons ="<button id='btn-detalhe' data-detalhe='"+id+"' type='button' title='Detalhes' style='margin-right: 5px;' class='btn btn-outline-info btn-sm'><i class='fa fa-info-circle'></i></button>";
//                stringButtons+="<button id='btn-excluir' data-excluir='"+id+"' type='button' title='Excluir' style='margin-right: 5px;' class='btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button>";
//                stringButtons+="<button id='btn-editar' data-editar='"+id+"' type='button' title='Editar' class='btn btn-outline-edit btn-sm'><i class='fa fa-pencil'></i></button>";
//            return stringButtons;
//        }
//    };
//    parametros.columns.push(buttons);
//
//    table = $("#" + parametros.table).DataTable({
//        searching: false,
//        scrollY: "400px",
//        scrollCollapse: true,
//        serverSide: true,
//        processing: true,
//        destroy: true,
//        pageLength: 10,
//        info: true,
//        language: {
//            url: "vendor/internationalisation/pt_br.json"
//        },
//        ajax: {
//            url: uri + parametros.url,
//            method: "get",
//            data: {
//                filtros: parametros.filtros.toString()
//            }
//        },
//        "columnDefs": [
//            {width: "20%", "targets": parametros.columns.length - 1},
//            {targets: parametros.columns.length - 1, className: 'text-center'},
//            {targets: parametros.columns.length - 1, orderable: false},
//            {targets: '_all',defaultContent: '-'}
//        ],
//        columns: parametros.columns
//    });
//    
//    return table;
//}