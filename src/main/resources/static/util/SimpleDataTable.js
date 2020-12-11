var DataTable = DataTable || {};

DataTable.AssembleDataTable = (function () {
    
    function AssembleDataTable() {
        
    }
    
    /**
     * @param {String} messageIsEmpty
     * @param {JSON} jsonData
     * @param {Boolean} action -> edit && delete
     * @returns {void}
     */
    AssembleDataTable.prototype.enable = function (messageIsEmpty,jsonData,action) {
        assembleDataTable(messageIsEmpty,jsonData,action);
    };
    
    /**
     * @param {String} messageIsEmpty
     * @param {JSON} jsonData
     * @param {Boolean} action -> edit && delete
     * @returns {undefined}
     */
    function assembleDataTable(messageIsEmpty, jsonData, action) {

        var table = $("table");
        table.find("tr").remove();
        var body;
        var cabecalho = "<tr>";
        var footer;
        var keyColumnName;
        
        if(jsonData !== null && jsonData.length > 0) {
            
            keyColumnName = Object.keys(jsonData[0]);
            
            for(var i in keyColumnName) {
                if(keyColumnName[i].toUpperCase() !== "ID") {
                    cabecalho+="<th class='' style=''>"+keyColumnName[i].toUpperCase()+"</th>";
                }
            };
            
            if(action) {
                cabecalho+="<th class='text-center' style='width: 230px;'>Ação</th>";
            }
            
            footer = "<tr><th colspan='"+keyColumnName.length+1+"' >"+"Total: "+jsonData.length+"</th></tr>";
            table.find("tfoot").append(footer);
            
        } else {
            cabecalho+="<th class=''>formiga</th>";
        }

        cabecalho+="</tr>";

        table.find("thead").append(cabecalho);

        if (typeof jsonData === "undefined" || jsonData === undefined || jsonData.length === 0) {
            var listaVazia = "<tr class='lista-vazia'>" +"<td colspan='5' style='color:green'>" +"<b>"+messageIsEmpty+"</b>" + "</td>" + "</tr>";
            table.find("tbody").append(listaVazia);
        }
        
        var array = [];
        jsonData.forEach(obj => {
            
            body += "<tr style='background-color: white'>";

            Object.entries(obj).forEach(([key, value]) => {
                
                if(key.toUpperCase() !== "ID") {
                    body+="<td class='' >" + value + "</td>";
                }
                
                if(key.toUpperCase() === "ID") {
                    array.push("data-"+key+"='"+value+"'");
                }
            });

            body+=  "<td class='text-center'>"+
                        "<button id='btnEditar' "+array[0]+" style='color: #007bff; margin-right: 5px;' title='Editar' class='btn btn-light btn-md'>"+
                            "<i class='fa fa-pencil-square-o' aria-hidden='true'></i>"+
                        "</button>"+
                        "<button id='btnExcluir' "+array[0]+" style='color: #dc3545' title='Excluir' class='btn btn-light btn-md'>"+
                            "<i class='fa fa-trash-o' aria-hidden='true'></i>"+
                        "</button>"+
                    "</td>";
            
            body+="</tr>";
            
            array = [];
        });
        
        table.find("tbody").append(body);
    }
    
    return AssembleDataTable;

}());
