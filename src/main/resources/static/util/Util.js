function removeCaracterEspecial(value) {
    return value = value.replace(/[^\w\s]/gi, '');
}

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
    window.localStorage.clear();
}