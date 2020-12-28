/* global Message */

var DataTable = DataTable || {};


DataTable.AssembleDataTable2 = (function () {
    
    let sizePages = 0;
    let atualPageLink = null;
    
    function AssembleDataTable2() {
        this.table = $("table");
        this.navPag = $("#navPagination");
        this.nav = $("nav");
    }

    AssembleDataTable2.prototype.init = function (parametros) {

        var uri = localStorage.getItem("currentUri");
        if(uri===null) {
            var message = new Message.Warning();
            message.show("Algo ocasionou um mal funcionamento, regarregue a página!", "I");
            let nativeSkeleton =
                "<div class='ph-item'>"+
                    "<div class='ph-col-12'>"+
                        "<div class='ph-row'>"+
                            "<div class='ph-col-6 big'></div>"+
                            "<div class='ph-col-4 empty big'></div>"+
                            "<div class='ph-col-2 big'></div>"+
                            "<div class='ph-col-4 big'></div>"+
                            "<div class='ph-col-8 empty big'></div>"+
                            "<div class='ph-col-6 big'></div>"+
                            "<div class='ph-col-4 empty big'></div>"+
                            "<div class='ph-col-12 big'></div>"+
                        "</div>"+
                        "<div class='ph-row'>"+
                            "<div class='ph-col-12 empty big'></div>"+
                            "<div class='ph-col-12 empty big'></div>"+
                            "<div class='ph-col-12 empty big'></div>"+
                            "<div class='ph-col-12 empty big'></div>"+
                        "</div>"+
                        "<div class='ph-picture2'></div>"+
                    "</div>"+
                "</div>";
            var form = $(event.target.forms);
            $(form).empty();
            $(form).append(nativeSkeleton);

            return;
        }
        
        localStorage.removeItem("parametros");
        localStorage.setItem("parametros", JSON.stringify(parametros));
        
        let requestParamPageable = {
            currentPage: parametros.paginaAtual,
            totalItems: 10,
            totalPages: null
        };

        var sizeParameters = Object.keys(parametros.filters).length;

        if (sizeParameters > 1) {
            
            $.ajax({
                method: "GET",
                url: uri + parametros.url,
                data: {
                    requestParamPageable: JSON.stringify(requestParamPageable),
                    [parametros.nomeObject]: JSON.stringify(`${parametros.filters}`)
                },
                contentType: "application/json",
                dataType: "json",

                success: function (data, textStatus, jqXHR) {
                    var tb = new DataTable.AssembleDataTable2();
                    tb.createTable(data,parametros);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    window.console.warn(jqXHR);
                }
            });
            
        } else {

            var key = Object.keys(parametros.filters)[0];
            var value = parametros.filters[key];

            let parameter = {
                "requestParamPageable": JSON.stringify(requestParamPageable),
                [key]: `${value}`
            };
            
            $.ajax({
                method: "GET",
                url: uri + parametros.url,
                data: parameter,
                contentType: "application/json",
                dataType: "json",

                success: function (data, textStatus, jqXHR) {
                    var tb = new DataTable.AssembleDataTable2();
                    tb.createTable(data,parametros);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    window.console.warn(jqXHR);
                }
            });
        }
    };
    
    AssembleDataTable2.prototype.createTable = function (data,parametros) {

        this.table.find("tr").remove();
        var body;
        var cabecalho = "<tr>";
        var columnName;

        if (data !== undefined && data !== null) {
            
            if (data.content !== undefined && data.content !== null && data.content.length > 0) {

                columnName = Object.keys(data.content[0]);

                for (var i in columnName) {
                    if (columnName[i].toUpperCase() !== "ID") {
                        let primeiraLetra = columnName[i].charAt(0);
                        let nomePermanente = primeiraLetra.toUpperCase()+columnName[i].substring(1,columnName[i].length);
                        cabecalho += "<th>" + nomePermanente + "</th>";
                    }
                }

                if (parametros.action) {
                    cabecalho += "<th class='text-center' style='width: 230px; font-size: 1.5em;'><span class='fa fa-cogs'></span></th>";
                }

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
                                "<a style='margin-right: 5px;' title='Editar' href='#' id='editar' "+ array[0] +" class='badge badge-edit-flash'>Editar</a>"+
                                "<a title='Excluir' class='badge badge-danger'  href='#' id='excluir' "+ array[0] +" >Excluir</a>" +
                            "</td>";

                    body += "</tr>";

                    array = [];
                });

                this.table.find("tbody").append(body);
                
            } else {
                cabecalho += "<th>flash</th>";
            }
            
            cabecalho+="</tr>";
            this.table.find("thead").append(cabecalho);
            
        } else {
            var listaVazia = "<tr class='tb-vazia'>" + "<td colspan='5'>" + "<span class='badge badge-dark'>Nenhum registro encontrado!</span>" + "</td>" + "</tr>";
            this.table.find("tbody").append(listaVazia);
        }
        
        let pageAnterior = sizePages;
        sizePages = data.totalElements;

        if(pageAnterior === 0 || pageAnterior > sizePages) {
            console.log(data.totalPages);
            var tb = new DataTable.AssembleDataTable2();
            tb.createPagination(data,parametros);
        }

    };
    
    AssembleDataTable2.prototype.createPagination = function (data) {
        let item = "";
        
        this.navPag.empty();
        
        item+="<ul class='pagination-flash pagination-sm'>";
                    for(let i=0; i<data.totalPages; i++) {
                        if(i===0) {
                            item+="<li class='page-item-flash'><a class='page-link-flash' href='#'>"+(i+1)+"</a></li>";
                        } else {
                            item+="<li class='page-item-flash'><a class='page-link-flash' href='#'>"+(i+1)+"</a></li>";
                        }
                    }
        item+="</ul>";
        this.navPag.append(item);
    };

    AssembleDataTable2.prototype.eventPagination = function () {
        
        this.nav.on("click",".page-item-flash", function () {
            
            let anterior = atualPageLink;
            atualPageLink = $(this);
            
            if(!atualPageLink.hasClass("active")) {
                atualPageLink.addClass("active");
                if(anterior !== null) {
                    anterior.removeClass("active");
                }
            }

            var parametros = JSON.parse(localStorage.getItem('parametros'));
            parametros.paginaAtual = (Number.parseInt(atualPageLink.find(".page-link-flash").text())-1);

            if(parametros !== undefined && parametros !== null) {
                var dataTb = new DataTable.AssembleDataTable2();
                dataTb.init(parametros);
            } else {
                var message = new Message.Warning();
                message.show("Algo ocasionou um mal funcionamento, regarregue a página!", "I");
            }
        });
    };

    return AssembleDataTable2;

}());

$(function () {
    var eventPag = new DataTable.AssembleDataTable2();
    eventPag.eventPagination();
});