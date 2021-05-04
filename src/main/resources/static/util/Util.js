/* global Message */

function setStorage64(key,value) {
    var encoded = btoa(JSON.stringify(value));
    localStorage.setItem(key,encoded);
}

function getStorage(key) {
    if(key === null || key === undefined || key === "") {
        return alert("Cahve não encontrada ",key);
    }
    return localStorage.getItem(key);
}

function getStorage64(key) {
    var objectJson = null;
    if(getStorage(key) !== null) {
        var atual = localStorage.getItem(key);
        var stringJson = JSON.stringify(atob(atual));
        objectJson = JSON.parse(stringJson);
    }
    return objectJson;
}

function setStorage(key,value) {
    if(key === null || key === "" || value === null) {
        return alert("Chave ou valor inválido!");
    }
    localStorage.setItem(key, value);
}

function removeItemStorage(key) {
    if(key === null || key === undefined || key === "") {
        alert("Cahve não encontrada ",key);
    }
    localStorage.removeItem(key);
}

function removeAllLocalStorage() {
    var key = null;
    for (var i = 0; i < localStorage.length; i++) {
        key = localStorage.key(i);
        if(key !== "currentUri") {
            removeItemStorage(key);
            i=-1;
        }
    }
}

function converterFormInObject(form) {
    var object = {};
    $.each($(form).serializeArray(), function(_, field) {
        object[field.name] = field.value;
    });
    return object;
}

function converterFormInArray(form) {
    var array = [];
    $.each($(form).serializeArray(), function(_, field) {
        array.push(field.value);
    });
    return array;
}

function cleanForm(form,object) {
    $(form)[0].reset();
    if(object.length > 0) {
        for(var i=0; i<object.length; i++) {
            if(object[i].disabled) {
                $(object[i].id).val(null).trigger("change");
                $(object[i].id).prop("disabled",true);
            } else {
                $(object[i].id).val(null).trigger("change");
            }
        }
    } else {
        $(object[i].id).val(null).trigger("change");
    }
}

function loadPageHtml(pathPage) {
    if (pathPage !== 'undefined' && pathPage !== null) {
        var divLoadPage = $("#pages").children().first();
        divLoadPage.empty();
        divLoadPage.load(pathPage);
    } else {
        var message = new Message.Error();
        message.show("Não foi possivel carregar a página!");
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

function mascaraCpf(element) {
    $(element).mask('000.000.000-00', {reverse: true});
}