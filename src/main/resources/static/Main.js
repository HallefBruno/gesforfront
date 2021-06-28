/* global CONSTANTES */

var conteudoDivMenu = "";
var htmlButtonsSubmenu = "";
var CONSTANTES = {};

$(function () {
    constructionMenu();
    storageURL();
    setUrlInBar();
    clickBtnIndex();
});

function constructionMenu() {
    
    let listMenus = structureMenu();
    let htmlButtonsCadastro = "";
    
    $(".li-pages").on("click", function (target) {
        htmlButtonsCadastro = "";
        htmlButtonsSubmenu = "";
        if ($("#pages").find("div").length <= 1 || conteudoDivMenu !== target.handleObj.selector) {
            $("#pages").find("div").empty();
            clearCanvasMyChart();
            conteudoDivMenu = target.handleObj.selector;
            $.each(listMenus, function (index) {
                let menus = listMenus[index];
                if (menus.length) {
                    htmlButtonsCadastro += "<div style='margin-top: 40px;' class='container h-100'>";
                    htmlButtonsCadastro += "<div class='row'>";

                    for (let i = 0; i < menus.length; i++) {

                        htmlButtonsCadastro += "<div style='margin: 0 0 1em 0;' class='col-sm-3'>";
                            htmlButtonsCadastro += "<div class='card'>";
                                htmlButtonsCadastro += "<div class='card-body'>";
                                    htmlButtonsCadastro += "<h5 class='card-title'>" + menus[i].title + "</h5>";
                                    htmlButtonsCadastro += "<p class='card-text'><blockquote class='blockquote mb-0 blockquote-footer'>" + menus[i].type + "</blockquote></p>";
                                    
                                    if (menus[i].submenu && menus[i].submenu.length > 0) {

                                        let submenu = menus[i].submenu;
                                        
                                        htmlButtonsSubmenu += "<div style='margin-top: 40px;' class='container h-100'>";
                                        htmlButtonsSubmenu += "<div class='row'>";

                                        for (let sub = 0; sub < submenu.length; sub++) {

                                            htmlButtonsSubmenu += "<div style='margin: 0 0 1em 0;' class='col-sm-3'>";
                                                htmlButtonsSubmenu += "<div class='card'>";
                                                    htmlButtonsSubmenu += "<div class='card-body'>";
                                                        htmlButtonsSubmenu += "<h5 class='card-title'>"+submenu[sub].title+"</h5>";
                                                        htmlButtonsSubmenu += "<p class='card-text'><blockquote class='blockquote mb-0 blockquote-footer'>" + submenu[sub].type + "</blockquote></p>";
                                                        htmlButtonsSubmenu += "<button data-url='"+submenu[sub].url+"' onclick='"+submenu[sub].event+"' title='"+submenu[sub].title+"' class='"+submenu[sub].class+"'>"+submenu[sub].icon+" "+submenu[sub].name+"</button>";
                                                    htmlButtonsSubmenu += "</div>";
                                                htmlButtonsSubmenu += "</div>";
                                            htmlButtonsSubmenu += "</div>";
                                        }
                                        
                                        htmlButtonsSubmenu += "</div>";
                                        htmlButtonsSubmenu += "</div>";
                                    }
                                    
                                    htmlButtonsCadastro += "<button data-url='"+menus[i].url+"' onclick='"+menus[i].event+"' title='"+menus[i].title+ "'class='"+menus[i].class+"'>"+menus[i].icon+" "+menus[i].name+"</button>";
                                htmlButtonsCadastro += "</div>";
                            htmlButtonsCadastro += "</div>";
                        htmlButtonsCadastro += "</div>";
                    }
                    htmlButtonsCadastro += "</div>";
                    htmlButtonsCadastro += "</div>";
                }
            });
            $("#pages").find("div").html(htmlButtonsCadastro);
        }
        removeAllLocalStorage();
    });
}

function eventContructionPage(target) {
    const url = target.dataset.url;
    $("#pages").find("div").empty();
    $("#pages").find("div").load(url);
    window.history.pushState("data",url,"#/"+url);
    conteudoDivMenu = "";
}

function eventSubmenu() {
    $("#pages").find("div").empty();
    $("#pages").find("div").html(htmlButtonsSubmenu);
    conteudoDivMenu = "";
}

function structureMenu() {

    const menus = {

        'cadastros': [

            {
                'name': 'Portaria',
                'title': 'Cadastro de portaria',
                'type': 'Página',
                'class':'btn btn-success',
                'icon': "<i class='fa fa-file'></i>",
                'event':'eventContructionPage(this)',
                'url': 'pages/portaria/Pesquisar.html'
            },
            
            {
                'name': 'Filipeta',
                'title': 'Cadastro de filipeta',
                'type': 'Página',
                'class':'btn btn-success',
                'icon': "<i class='fa fa-file'></i>",
                'event':'eventContructionPage(this)',
                'url': 'pages/filipeta/Pesquisar.html'
            },
            
            {
                'name': 'Cadastro de morador',
                'title': 'Cadastro de morador',
                'type': 'Página',
                'class':'btn btn-success',
                'icon': "<i class='fa fa-file'></i>",
                'event':'eventContructionPage(this)',
                'url': 'pages/morador/Pesquisar.html'
            },

            {
                'name': 'Cadastros básicos',
                'title': 'Cadastros básicos',
                'type': 'Menu',
                'class':'btn btn-info',
                'icon': "<i class='fa fa-bars' aria-hidden='true'></i>",
                'event':'eventSubmenu(this)',
                'url': 'pages/estado/MenuCadastro.html',
                'submenu': [
                    
                    {
                        'name': 'Estado',
                        'title': 'Cadastro de estado',
                        'type': 'Página',
                        'class': 'btn btn-success',
                        'icon': "<i class='fa fa-file'></i>",
                        'event': 'eventContructionPage(this)',
                        'url': 'pages/estado/Pesquisar.html'
                    },
                    {
                        'name': 'Cidade',
                        'title': 'Cadastro de cidade',
                        'type': 'Página',
                        'class': 'btn btn-success',
                        'icon': "<i class='fa fa-file'></i>",
                        'event': 'eventContructionPage(this)',
                        'url': 'pages/cidade/Pesquisar.html'
                    },
                    {
                        'name': 'Bairro',
                        'title': 'Cadastro de bairro',
                        'type': 'Página',
                        'class': 'btn btn-success',
                        'icon': "<i class='fa fa-file'></i>",
                        'event': 'eventContructionPage(this)',
                        'url': 'pages/bairro/Pesquisar.html'
                    }

                ]
            }
        ]
    };

    return menus;
}

function clearCanvasMyChart() {
    $(".dashboard-myChart").find("div").empty();
}

function storageURL() {
    $.getJSON("urls", function (data) {
        const local = $(location).attr("href");
        var targetUrl;
        if (local.includes("127") || local.includes("host")) {
            targetUrl = data.urlLocalBack;
        } else {
            targetUrl = data.urlExternalBack;
        }
        consts(targetUrl);
    });
}

function consts(url) {
    CONSTANTES = Object.freeze({"chart": ".dashboard-myChart", "currentUri": url});
}

function setUrlInBar() {
    let url = getStorage("urlPagina");
    if(url !== undefined && url !== null && url !== "") {
        url = url.substring(1, url.length);
        loadPageHtml(url);
        window.history.pushState("data", url, "#" + getStorage("urlPagina"));
    }
}

window.onabort = function () {
    alert("window.onabort");
};

window.onbeforeunload = function (event) {
    window.console.log(event,"onbeforeunload");
    var url = window.location.href;
    const urlPage = url.substring(url.lastIndexOf("#")+1,url.length);
    if(!urlPage.includes("Index") && !urlPage.includes("http") && !urlPage.includes("flash") && !urlPage.includes("https") && urlPage !== "") {
        removeAllLocalStorage();
        setStorage("urlPagina",urlPage);
    }
};

function clickBtnIndex() {
    $("#aIndex").on("click",function() {
        removeAllLocalStorage();
        window.history.pushState("data", "flash", "/flash");
        window.location.href="/flash";
    });
}

$(window).on("beforeunload", function(event) {
    event.preventDefault();
    event.returnValue = '';
});
