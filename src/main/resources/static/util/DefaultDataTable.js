
var DefaultDataTable = DefaultDataTable || {};

let atualPageLink = null;
let criarPaginacao = -1;
let alterarPage = -1;
let atualPage = -1;
let count = 0;

DefaultDataTable.AssembleDataTable = (function () {

    function AssembleDataTable() {
    }
    
    AssembleDataTable.prototype.creator = function (parametros) {
        
        let uri = showSkeleton();
        
        if(uri !== null && uri !== false) {

            if(parametros !== undefined && parametros !== null) {
                
                let requestParamPageable = {
                    currentPage: parametros.paginaAtual,
                    totalItems: 10,
                    totalPages: null
                };

                $.ajax({
                    method: "GET",
                    url: uri + parametros.reload,
                    data: {
                        "requestParamPageable": JSON.stringify(requestParamPageable),
                        "filtros":parametros.filtros.toString()
                    },
                    contentType: "application/json",
                    dataType: "json",

                    success: function (data) {
                        
                        assembleTB(data,parametros);
                        
                        $("#navPageable").on("click",".teste", function () {
                            
                            console.log(count++);
                            
                            requestParamPageable.currentPage = (Number.parseInt($(this).text())-1);
                            
                            let anterior = atualPageLink;
                            atualPageLink = $(this);

                            if (!atualPageLink.hasClass("active")) {
                                atualPageLink.addClass("active");
                                if (anterior !== null) {
                                    anterior.removeClass("active");
                                }
                            }
                            
                            $.ajax({
                                method: "GET",
                                url: uri + parametros.reload,
                                data: {
                                    requestParamPageable: JSON.stringify(requestParamPageable)
                                },
                                contentType: "application/json",
                                dataType: "json",

                                success: function (data) {
                                    assembleTB(data,parametros);
                                },
                                error: function (jqXHR) {
                                    window.console.warn(jqXHR);
                                }
                            });
                            return false;
                        });
                        
                        $("table").on("click","#excluir", function () {
                            
                            if(alterarPage === 1) {
                                requestParamPageable.currentPage=(atualPage-1);
                            }
                            $.ajax({
                                method: "DELETE",
                                url: uri + parametros.action+$(this).data("id"),
                                success: function () {
                                    $.ajax({
                                        method: "GET",
                                        url: uri + parametros.reload,
                                        data: {
                                            requestParamPageable: JSON.stringify(requestParamPageable)
                                        },
                                        contentType: "application/json",
                                        dataType: "json",

                                        success: function (data) {
                                            if(data !== undefined && data !== null) {
                                                atualPage = data.pageable.pageNumber;
                                                alterarPage = data.content.length;
                                            }
                                            assembleTB(data,parametros);
                                        },
                                        error: function (jqXHR) {
                                            window.console.warn(jqXHR);
                                        }
                                    });
                                },
                                error: function (jqXHR) {
                                    window.console.warn(jqXHR);
                                }
                            });
                            return false;
                        });
                    },
                    error: function (jqXHR) {
                        window.console.error(jqXHR);
                    }
                });
            }
        }
    };

    return AssembleDataTable;
    
}());

function assembleTB(data) {
    
    var table = $("table");
    table.find("tr").remove();
    var cabecalho = "<tr>";
    var body = "";
    var columns = "";
    
    if (data !== undefined && data !== null) {
        if (data.content !== undefined && data.content !== null && data.content.length > 0) {
            columns = Object.keys(data.content[0]);
            for (var i in columns) {
                if (columns[i].toUpperCase() !== "ID") {
                    let primeiraLetra = columns[i].charAt(0);
                    let nomePermanente = primeiraLetra.toUpperCase() + columns[i].substring(1, columns[i].length);
                    cabecalho += "<th>" + nomePermanente + "</th>";
                }
            }
//            if (parametros.columnsAction) {
//                cabecalho += "<th class='text-center' style='width: 230px; font-size: 1.5em;'><span class='fa fa-cogs'></span></th>";
//            }
            var array = [];

            data.content.forEach(obj => {
                body += "<tr style='background-color: white'>";

                Object.entries(obj).forEach(([key, value]) => {

                    if (key.toUpperCase() !== "ID") {
                        body += "<td>" + value + "</td>";
                    }

                    if (key.toUpperCase() === "ID") {
                        array.push("data-" + key + "='" + value + "'");
                    }
                });

                body += "<td class='text-center'>" +
                            "<a style='margin-right: 5px;' title='Editar' href='#' id='editar' " + array[0] + " class='badge badge-edit-flash'>Editar</a>" +
                            "<a title='Excluir' class='badge badge-danger'  href='#' id='excluir' " + array[0] + " >Excluir</a>" +
                        "</td>";
                body += "</tr>";

                array = [];
            });

            cabecalho += "</tr>";
            table.find("thead").append(cabecalho);
            table.find("tbody").append(body);

            let ul = "";
            ul+="<ul class='pagination-flash pagination-sm'>";
                    for(let i=0; i<data.totalPages; i++) {
                        if(i===0) {
                            ul+="<li class='page-item-flash teste'><a class='page-link-flash' href='#'>"+(i+1)+"</a></li>";
                        } else {
                            ul+="<li class='page-item-flash'><a class='page-link-flash' href='#'>"+(i+1)+"</a></li>";
                        }
                    }
            ul+="</ul>";

            $("#navPageable").html("");
            $("#navPageable").append(ul);
            
        } else {
            var listaVazia = "<tr class='tb-vazia'>" + "<td colspan='5'>" + "<span class='badge badge-dark'>Nenhum registro encontrado!</span>" + "</td>" + "</tr>";
            table.find("tbody").append(listaVazia);
            $("#navPageable").html("");
        }
    } else {
        var listaVazia = "<tr class='tb-vazia'>" + "<td colspan='5'>" + "<span class='badge badge-dark'>Nenhum registro encontrado!</span>" + "</td>" + "</tr>";
        table.find("tbody").append(listaVazia);
        $("#navPageable").html("");
    }
}