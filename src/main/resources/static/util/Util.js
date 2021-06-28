/* global Message, CONSTANTES */

function setStorage64(key, value) {
    if((key !== undefined && key !== null && key !== "") && (value !== undefined && value !== null && value !== "")) {
        const encoded = btoa(JSON.stringify(value));
        localStorage.setItem(key, encoded);
        return;
    }
    alert("Chave ou valor inválido!");
    return null;
}

function getStorage(key) {
    if (key === null || key === undefined || key === "") {
        alert("Cahve não encontrada ", key);
        return null;
    }
    return localStorage.getItem(key);
}

function getStorage64(key) {
    if (key !== undefined && key !== null && key !== "") {
        var objectJson = null;
        if (getStorage(key) !== null) {
            const atual = localStorage.getItem(key);
            const stringJson = JSON.stringify(atob(atual));
            objectJson = JSON.parse(stringJson);
        }
        return objectJson;
    }
    alert("A chave precisa ter um nome!");
    return null;
}

function setStorage(key, value) {
    if (key === null || key === "" || value === null) {
        alert("Chave ou valor inválido!");
        return null;
    }
    localStorage.setItem(key, value);
}

function removeItemStorage(key) {
    if (key === null || key === undefined || key === "") {
        return null;
        alert("Cahve não encontrada ", key);
    }
    localStorage.removeItem(key);
}

function removeAllLocalStorage() {
    localStorage.clear();
}

function converterFormInObject(form) {
    var object = {};
    $.each($(form).serializeArray(), function (_, field) {
        object[field.name] = field.value;
    });
    return object;
}

function converterFormInArray(form) {
    var array = [];
    $.each($(form).serializeArray(), function (_, field) {
        array.push(field.value);
    });
    return array;
}

function cleanForm(form, object) {
    $(form)[0].reset();
    if (object.length > 0) {
        for (var i = 0; i < object.length; i++) {
            if (object[i].disabled) {
                $(object[i].id).val(null).trigger("change");
                $(object[i].id).prop("disabled", true);
            } else {
                $(object[i].id).val(null).trigger("change");
            }
        }
    } else {
        $(object[i].id).val(null).trigger("change");
    }
}

function setValueInputInForm(form,obj) {
    const selector = form+" input[type=text]";
    const selectorDate = form+" input[type=date]";
    const selectorNumber = form+" input[type=number]";
    
    $(selector).each(function () {
        if($(this).attr("name") === "cpf") {
            $(this).val(mascaraStringCpf(obj[$(this).attr("name")]));
        } else if($(this).attr("name") === "cnpj") {
            $(this).val(mascaraStringCpf(obj[$(this).attr("name")]));
        } else if($(this).attr("name") === "telefone") {
            $(this).val(mascaraStringTel(obj[$(this).attr("name")]));
        } else {
            $(this).val(obj[$(this).attr("name")]);
        }
    });
    
    $(selectorDate).each(function () {
        $(this).val(obj[$(this).attr("name")]);
    });
    
    $(selectorNumber).each(function () {
        $(this).val(obj[$(this).attr("name")]);
    });
}

function loadPageHtml(pathPage, obj) {
    if (pathPage !== 'undefined' && pathPage !== null) {
        $(".dashboard-myChart").find("div").empty();
        const divLoadPage = $("#pages").children().first();
        var params = "";
        divLoadPage.empty();
        divLoadPage.load(pathPage);
        if (obj !== undefined && obj !== null && obj !== "") {
            const encoded = btoa(JSON.stringify(obj));
            params = "?" + encoded;
        }
        window.history.pushState("data", pathPage, "#/" + pathPage + params);
    } else {
        var message = new Message.Error();
        message.show("Não foi possivel carregar a página!");
    }
}

function getParam () {
    try {
        var url = $(location).attr("href");
        var urlFinal = url.substring(url.toString().indexOf(".html") + 1, url.length);
        urlFinal = urlFinal.replace("html?", "");
        const decod = atob(urlFinal);
        return JSON.parse(decod);
    } catch (ex) {
        alert(ex.message+"\n"+"Parametro inválido!");
    }
}

function mascaraTelefone(element) {
    var maskPhone = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
    novoDigito = {
        onKeyPress: function (val, e, field, options) {
            field.mask(maskPhone.apply({}, arguments), options);
        }
    };
    $(element).mask(maskPhone, novoDigito);
}

function mascaraPlacaMercoSul(element) {
    
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
    
    $(element).mask(mercoSulMaskBehavior, mercoSulOptions);
}

function mascaraCpf(element) {
    $(element).mask('000.000.000-00', {reverse: true});
}

function mascaraStringTel(numero) {
    if (numero.length === 10) {
        return numero.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        return numero.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
}

function mascaraStringCnpj(cnpj) {
    var numeroFormatado;
    numeroFormatado = cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    return numeroFormatado;
}

function mascaraStringCpf(cpf) {
    var placa = cpf.substring(0, 3) + "." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-" + cpf.substring(9, cpf.length);
    return placa;
}

function mascaraStringPlaca(placa) {
    if(!placa.includes("-")) {
        var placaFormatado = placa.substring(0, 3) + "-" + placa.substring(3, placa.length);
        return placaFormatado;
    }
    return placa;
}

function removeAllCaracterString(string) {
    var desired = string.replace(/[^\w\s]/gi, '').replace(/\s/g, '');
    return desired;
}

function validarCPF(strCPF) {
    var soma;
    var resto;
    soma = 0;
    if (strCPF === "00000000000")
        return false;

    for (i = 1; i <= 9; i++)
        soma = soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11))
        resto = 0;
    if (resto !== parseInt(strCPF.substring(9, 10)))
        return false;

    soma = 0;
    for (i = 1; i <= 10; i++)
        soma = soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11))
        resto = 0;
    if (resto !== parseInt(strCPF.substring(10, 11)))
        return false;
    return true;

    var strCPF = "12345678909";
    alert(TestaCPF(strCPF));
}

//const urlParams = new URLSearchParams(window.location.search);
//const myParam = urlParams.get('myParam');
//var recursiveEncoded1 = $.param(obj);
//var recursiveDecoded2 = decodeURIComponent($.param(obj));
//window.console.log(recursiveEncoded1,recursiveDecoded2);

//$.urlParam = function (name) {
//        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.search);
//        window.console.log(results);
//        return (results !== null) ? results[1] || 0 : false;
//    };
//
//    console.log($.urlParam('action')); //edit
//function removeAllLocalStorage() {
//    var key = null;
//    for (var i = 0; i < localStorage.length; i++) {
//        key = localStorage.key(i);
//        if (key !== "currentUri" && key !== "urlPagina") {
//            removeItemStorage(key);
//            i = -1;
//        }
//    }
//}