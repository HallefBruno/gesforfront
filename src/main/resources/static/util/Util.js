/* global Message */

function criaAtualizaStorage64(key,value) {
    var encoded = btoa(JSON.stringify(value));
    localStorage.setItem(key,encoded);
}

function getStorage(key) {
    localStorage.getItem(key);
}

function getStorage64(key) {
    var atual = localStorage.getItem(key);
    var stringJson = JSON.stringify(atob(atual));
    var objectJson = JSON.parse(stringJson);
    return objectJson;
}

function removeItemStorage(key) {
    localStorage.removeItem(key);
}

function removeAllLocalStorage() {
    localStorage.clear();
    storageURL();
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
    //const url = new URL(window.location);
    //url.searchParams.set('foo', 'bar');
    //window.history.pushState({}, '', url);
    //history.pushState(null, "Página", pathPage);    
    //console.log("State "+window.history);
}