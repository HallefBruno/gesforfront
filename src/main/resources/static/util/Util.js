/* global Message */

function criaAtualizaStorage64(key,value) {
    var encoded = btoa(JSON.stringify(value));
    localStorage.setItem(key,encoded);
}

function getStorage(key) {
    if(key === null || key === undefined || key === "") {
        return alert("Key não encontrada ",key);
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

function removeItemStorage(key) {
    if(key === null || key === undefined || key === "") {
        alert("Key não encontrada ",key);
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