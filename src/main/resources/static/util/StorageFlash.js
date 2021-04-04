function criaAtualizaStorage64(key,value) {
    var encoded = btoa(JSON.stringify(value));
    localStorage.setItem(key,encoded);
}

function getStorage(key) {
    localStorage.getItem(key);
}

function getStorage64(key) {
    var atual = localStorage.getItem(key);
    console.log(atual+" atual ");
    var stringJson = JSON.stringify(atob(atual));
    var objectJson = JSON.parse(stringJson);
    console.log(objectJson+" json ");
    return objectJson;
}

function removeItemStorage(key) {
    localStorage.removeItem(key);
}

function removeAllLocalStorage() {
    window.localStorage.clear();
}