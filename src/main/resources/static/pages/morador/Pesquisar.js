$(function () {
    init();
    initDatatable();
    irParaPageNovo();
    pesquisar();
    validForm();
    irParaPageEditar();
});

function init() {
    mascaraCpf("#cpf");
    mascaraTelefone("#telefone");
    $("#isproprietario").bootstrapToggle("on", true);
}

function pesquisar() {
    var url = getStorage("currentUri");
    $.validator.setDefaults({
        submitHandler: function () {
            $("#tbMoradores").DataTable().ajax.url(url + "/morador/todos").load();
        }
    });
}

function irParaPageEditar() {
    $("#tbMoradores").on("click", "#btn-editar", function () {
        loadPageHtml("pages/morador/Editar.html");
        localStorage.setItem("moradorId", $(this).data("editar"));
    });
}

function validForm() {
    $("#formPesquisa").validate({
        rules: {
            nome: {rangelength:[3,100]} 
        },
        messages: {
            nome: {
                rangelength:"Insira um nome entre {0} e {1} caracteres!"
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {

            error.addClass("invalid-feedback");
            if(element.is("select")) {
                error.insertAfter(element.next("span"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element) {
            $(element).removeClass("is-invalid");
        }
    });
}

function initDatatable() {
    var url = getStorage("currentUri");
    var parametros = {
        columns: [
            {data: "nome", sortable: true,
                render: function (data,type, row, meta) {
                    if(row.isProprietario)
                        return data+"<span title='Proprietário' style='color: yellow; margin-left: 5px;' class='text-right fa fa-star'></span>";
                    return data;
                }
            },
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
            {data: "telefone", sortable: false, width: "200px", 
                render: function (data,type,row,meta) {
                    var telefones = data.split(",");
                    var telefoneFormatado="";
                    for(var i=0;i<telefones.length; i++) {
                        telefoneFormatado = telefoneFormatado + mascaraStringTel(telefones[i]);
                    }
                    return telefoneFormatado;
                    window.console.log(telefoneFormatado);
                }
            }
        ]
    };
    
    setDefaultsDataTable(parametros);

    $("#tbMoradores").DataTable({
        ajax: {
            url: url + "/morador/todos",
            method: "get",
            data: {
                filtrosMorador: function () {
                    var filtrosMorador = {
                        nome: $("#nome").val(),
                        cpf: $("#cpf").val(),
                        residencia: $("#residencia").val(),
                        telefone: $("#telefone").val(),
                        isProprietario: $("#isproprietario").prop("checked") === true ? true : false
                    };
                    return JSON.stringify(filtrosMorador);
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

function formatData(data) {
    if (!data.id) {
        return data.text;
    }
    var $result = $('<span><img src="/Ressources/Images/Locked.png"/> ' + data.text + '</span>');
    return $result;
};

$("#SelectPeriode").select2({
    templateResult: formatData,
    templateSelection: formatData
});