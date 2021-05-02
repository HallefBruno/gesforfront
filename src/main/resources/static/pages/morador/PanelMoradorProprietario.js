/* global Message */

var automoveis = [];
$(document).ready(function () {
    automoveis = [];
    
    events();
    init();
    poluarSelectCadastro();
    populaSelectAutomoveis();
    camposObrigatorioAutomovel();
    camposObrigatoriosMorador();
});

function events() {
    addAutomovelGrid();
    salvarMorador();
}

function salvarMorador() {
    
    var url = localStorage.getItem("currentUri");
    var listaMoradoresSecundarios = [];
    
    $("#btnSalvar").click(function () {
        if ($("#formMoradorProprietario").valid()) {

            var telefones = JSON.parse(getStorage64("telefones"));
            
            if(JSON.parse(getStorage64("listMoradorSecundario")) !== null) {
                listaMoradoresSecundarios = JSON.parse(getStorage64("listMoradorSecundario"));
            }

            console.log(telefones, listaMoradoresSecundarios);
            
            var morador = {
                nome: $("#nome").val(),
                cpf: $("#cpf").val(),
                rg: $("#rg").val(),
                orgaoEmissor: $("#emissor").val(),
                dataNascimento: $("#dataNascimento").val(),
                naturalidade: $("#natural").val(),
                estadoCivil: $("#estadoCivil :selected").val(),
                sexo: $("#sexo").prop("checked") === true ? "Masculino" : "Feminino",
                residencia: $("#residencia").val(),
                qdtMoradores: $("#qtdMorador").val(),
                tipoMoradia: $("#tiposResidencia :selected").val(),
                animalDomestico: $("#animalDomentico").prop("checked"),
                telefones: telefones,
                automoveisMoradores: automoveis,
                moradorSecundarios:listaMoradoresSecundarios
            };
            
            console.log(morador);
            
            $.ajax({
                method: "POST",
                url: url + "/morador/salvar",
                data: JSON.stringify(morador),
                contentType: "application/json",
                dataType: "json",
                statusCode: {
                    201: function (data) {
                        var message = new Message.Success();
                        automoveis = [];
                        removeItemStorage("telefones");
                        removeItemStorage("listMoradorSecundario");
                        message.show("Registro salvo com sucesso!");
                        loadPageHtml("pages/morador/Novo.html");
                    }
                }
            });
        }
    });
    
}

function addAutomovelGrid() {
    
    var message = new Message.Warning();
    var htmltipo = "";
    var automoveisGrid = [];
    
    $(".tbl-add-automovel").DataTable({

        "paginate": false,
        "lengthChange": false,
        "info": false,
        "autoWidth": false,
        "filter": false,
        language: {
            url: "vendor/internationalisation/pt_br.json"
        },
        columnDefs: [
            {
                targets: [4, 5],
                className: 'text-center'
            }
        ]
    });

    $("#btn-add-novo-automovel").click(function () {
        if ($("#form-automoveis").valid()) {

            var automovelGrid = {
                id: $("#automoveis option:selected").filter(':selected').val(),
                nome: $("#automoveis option:selected").filter(':selected').text(),
                fabricante: {
                    id: $("#fabricante option:selected").filter(':selected').val(),
                    nome: $("#fabricante option:selected").filter(':selected').text()
                },
                tipoAutomovel: $("#tipo").val(),
                cor: $("#cor option:selected").filter(':selected').val(),
                placa: $("#placa").val()
            };

            var moradorAutomovel = {
                automovel:{
                   id:automovelGrid.id
                },
                placa:automovelGrid.placa,
                cor:automovelGrid.cor
            };
            
            if(automovelExist(automoveisGrid, automovelGrid.placa)) {
                message.show("Esse automovel já foi adicionado","N");
                return;
            }
            
            automoveis.push(moradorAutomovel);
            automoveisGrid.push(automovelGrid);
            
            if (automovelGrid.tipoAutomovel === "Carro") {
                htmltipo = "<span class='text-center badge badge-primary'>" + automovelGrid.tipoAutomovel + "</span>";
            } else if (automovelGrid.tipoAutomovel === "Moto") {
                htmltipo = "<span class='text-center badge badge-success'>" + automovelGrid.tipoAutomovel + "</span>";
            }

            $(".tbl-add-automovel").DataTable().row.add([
                automovelGrid.fabricante.nome,
                automovelGrid.nome,
                automovelGrid.placa,
                automovelGrid.cor,
                htmltipo,
                "<button id='btn-remover' data-key='" + automovelGrid.placa + "' type='button' title='Remover' class='text-center btn btn-outline-danger btn-sm'><i class='fa fa-trash-o'></i></button>"
            ]).draw(false);

        }
    });
    
    $(".tbl-add-automovel").DataTable().on("click","#btn-remover", function () {
        $(".tbl-add-automovel").DataTable().row($(this).parents("tr")).remove().draw();
        var placa = $(this).data("key");
        for(var i=0; i<automoveisGrid.length; i++) {
            if(automoveisGrid[i].placa === placa) {
                automoveisGrid.splice(i,1);
                automoveis.splice(i,1);
            }
        }
    });
}


function poluarSelectCadastro() {
    
    var url = localStorage.getItem("currentUri");
    
    $("#telefones").select2({
        theme: "bootstrap4",
        placeholder: "Telefone",
        allowClear: true,
        language: "pt-BR"
    });
    
    $.get(url + "/morador/estado-civil", function (data) {

        var estadoCivil;
        var estadosCivil = [];
        $.each(data, function (i, values) {
            estadoCivil = {
                id: values.id,
                text: values.text
            };
            estadosCivil.push(estadoCivil);
        });

        $("#estadoCivil").select2({
            theme: "bootstrap4",
            placeholder: "Selecione o estado civil",
            allowClear: true,
            language: "pt-BR",
            data: estadosCivil
        });

    });

    $.get(url + "/morador/tipo-residencia", function (data) {

        var tipoResidencia;
        var tiposResidencias = [];
        $.each(data, function (i, values) {
            tipoResidencia = {
                id: values.id,
                text: values.text
            };
            tiposResidencias.push(tipoResidencia);
        });

        $("#tiposResidencia").select2({
            theme: "bootstrap4",
            placeholder: "Selecione tipo residência",
            allowClear: true,
            language: "pt-BR",
            data: tiposResidencias
        });
        
        $("#tiposResidencia").on("select2:selecting", function (e) {
            $("#tipo-residencia").val(e.params.args.data.text);
        });
        
    });
    
    $.get(url + "/morador/fabricantes", function (data) {

        var fabricante;
        var fabricantes = [];
        $.each(data, function (i, values) {
            fabricante = {
                id: values.id,
                text: values.text
            };
            fabricantes.push(fabricante);
        });

        $("#fabricante").select2({
            theme: "bootstrap4",
            placeholder: "Selecione o fabricante",
            allowClear: true,
            language: "pt-BR",
            data: fabricantes
        });
        
        $("#fabricante").on("select2:selecting",function (e) {
            var fabricanteId = e.params.args.data.id;
            $("#fabricante-id").val(fabricanteId);
            $("#automoveis").val(null).trigger("change");
            $("#automoveis").prop("disabled",false);
        });
        
        $("#fabricante").on("select2:unselecting", function () {
            $("#automoveis").val(null).trigger("change");
            $("#automoveis").prop("disabled",true);
        });
        
    });
}

function init() {
    
    $('[data-toggle="tooltip"]').tooltip();
    
    $("#animalDomentico").bootstrapToggle("off", true);
    
    $("#sexo").bootstrapToggle("on", true);
    
    $("#cpf").mask('000.000.000-00', {reverse: true});
    var maskPhone = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
    novoDigito = {
        onKeyPress: function (val, e, field, options) {
            field.mask(maskPhone.apply({}, arguments), options);
        }
    };

    var mercoSulMaskBehavior = function (val) {
        var mask = 'AAA0A00';
        var mercosul = /([A-Za-z]{3}[0-9]{1}[A-Za-z]{1})/;
        var normal = /([A-Za-z]{3}[0-9]{2})/;
        var replaced = val.replace(/[^\w]/g, '');
        if (normal.exec(replaced)) {
            mask = 'AAA-0000';
        } else if (mercosul.exec(replaced)) {
            mask = 'AAA-0A00';
        }
        return mask;
    },
    mercoSulOptions = {
        onKeyPress: function (val, e, field, options) {
            field.mask(mercoSulMaskBehavior.apply({}, arguments), options);
        }
    };
    
    $("#telefone").mask(maskPhone, novoDigito);
    $("#placa").mask(mercoSulMaskBehavior, mercoSulOptions);
}

function automovelExist(array, placa) {
    return array.some(function (p) {
        return p.placa === placa;
    });
}

function camposObrigatorioAutomovel() {
    $("#form-automoveis").validate({
        rules: {
            fabricante: {
                required: true
            },
            
            automoveis: {
                required: true
            },
            
            cor: {
                required: true
            },
            
            placa: {
                required: true,
                minlength: 8
            }
        },
        messages: {
            fabricante: {
                required: ""
            },
            automoveis: {
                required: ""
            },
            cor: {
                required: ""
            },
            placa: {
                required: "",
                minlength: "Mínimo oito caracter"
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {

            error.addClass("invalid-feedback");

            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.next("label"));
            } else if(element.prop("type") === "select-one") {
                error.insertBefore(element);
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


function camposObrigatoriosMorador() {
    $("#formMoradorProprietario").validate({
        rules: {
            nome: {
                required: true,
                rangelength: [3, 200]
            },
            cpf: {
                required: true,
                minlength:14
            },
            rg: {
                required: true,
                rangelength: [5, 11]
            },
            emissor: {
                required: true,
                rangelength: [4, 11]
            },
            dataNascimento: {
                required: true,
                rangelength: [10,10]
            },
            natural: {
                required: true,
                rangelength: [3, 50]
            },
            estadoCivil: {
                required: true
            },
            residencia: {
                required: true,
                rangelength: [3, 100]
            },
            tiposResidencia: {
                required: true
            },
            qtdMorador : {
                required: true
            },
            telefones: {
                required: true
            }
        },
        messages: {
           nome: {
                required: "Nome obrigatório!",
                rangelength:"Insira um nome entre {0} e {1} caracteres!" //jQuery.validator.format("Please enter a value between {0} and {1} characters long.")
            },
            cpf: {
                required: "CPF obrigatório!",
                minlength: "CPF inválido!"
            },
            rg: {
                required: "RG obrigatório!",
                rangelength: "Insira um rg entre {0} e {1} caracteres!"
            },
            emissor: {
                required: "Orgão emissor obrigatório!",
                rangelength: "Insira um orgão emissor entre {0} e {1} caracteres!"
            },
            dataNascimento: {
                required: "Data nascimento obrigatória!",
                rangelength: "Insira uma data entre {0} e {1} caracteres!"
            },
            natural: {
                required: "Naturalidade obrigatório!",
                rangelength: "Insira um valor entre {0} e {1} caracteres!"
            },
            estadoCivil: {
                required: "Estado civil obrigatório!"
            },
            residencia: {
                required: "Endereço da residência obrigatório!",
                rangelength: "Insira um valor entre {0} e {1} caracteres!"
            },
            tiposResidencia: {
                required: "Tipo de residência obrigatória!"
            },
            qtdMorador: {
                required: "Quantidade de morador obrigatório!"
            },
            telefones: {
                required: "Telefone pelo menos um obrigatório!"
            } 
        },
        errorContainer: ".alert-erro-novo-morador",
        errorLabelContainer: ".alert-erro-novo-morador ul",
        wrapper: "li"
    });
}


function populaSelectAutomoveis() {
    var url = localStorage.getItem("currentUri");
    $("#automoveis").prop("disabled",true);
    
    $("#automoveis").select2({
        theme: "bootstrap4",
        placeholder: "Automóveis",
        allowClear: true,
        language: "pt-BR",
        multiple: false,
        closeOnSelect: true,
        minimumInputLength: 1,
        ajax: {
            url: url+"/morador/automoveis",
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    q: params.term,
                    fabricanteId:$("#fabricante-id").val(),
                    page: params.page
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 0;
                return {
                    results: data.items,
                    pagination: {
                        more: (params.page * 10) < data.totalItens
                    }
                };
            },
            cache: true
        },
        
        templateResult:styleSelectAutomoveis,
        
        escapeMarkup: function (markup) {
            return markup;
        },
        templateSelection: function (automovel) {
            var tipo = automovel.tipo;
            var html = "";
            if (tipo === "C") {
                tipo = "Carro";
                html = $("<span>" + automovel.text + "</span><span style='margin-top:11px;' class='text-right badge badge-primary'>" + tipo + "</span>");
            } else if(tipo === "M") {
                tipo = "Moto";
                html = $("<span>" + automovel.text + "</span><span style='margin-top:11px;' class='text-right badge badge-success'>" + tipo + "</span>");
            } else {
                html = $("<span>" + automovel.text + "</span>");
            }
            $("#tipo").val(tipo);
            return html;
        }
    });
}

function styleSelectAutomoveis(automovel) {
    var tipo = automovel.tipo;
    var html = "";
    if (tipo === "C") {
        tipo = "Carro";
        html = $("<span>" + automovel.text + "</span><span class='text-right badge badge-primary'>" + tipo + "</span>");
    } else if(tipo === "M") {
        tipo = "Moto";
        html = $("<span>" + automovel.text + "</span><span class='text-right badge badge-success'>" + tipo + "</span>");
    } else {
        html = $("<span>" + automovel.text + "</span>");
    }
    return html;
}
