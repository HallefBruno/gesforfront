let contentDivMenu = "";
let htmlButtonsSubmenu = "";

$(function () {
    constructionMenu();
    getUrls();
});

function constructionMenu() {
    
    let listMenus = structureMenu();
    let htmlButtonsCadastro = "";
    
    $(".li-pages").on("click", function (target) {
        htmlButtonsCadastro = "";
        htmlButtonsSubmenu = "";
        if ($("#pages").find("div").length <= 1 || contentDivMenu !== target.handleObj.selector) {
            $(".loading").addClass("show");
            $("#pages").find("div").empty();
            clearCanvasMyChart();
            
            contentDivMenu = target.handleObj.selector;
            
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
                                                        htmlButtonsSubmenu += "<button data-url='"+submenu[sub].url+"' onclick='"+submenu[sub].event+"' title='"+submenu[sub].title+"' class='"+submenu[sub].class+"'>"+submenu[sub].name+"</button>";
                                                    htmlButtonsSubmenu += "</div>";
                                                htmlButtonsSubmenu += "</div>";
                                            htmlButtonsSubmenu += "</div>";
                                        }
                                        
                                        htmlButtonsSubmenu += "</div>";
                                        htmlButtonsSubmenu += "</div>";
                                    }
                                    
                                    htmlButtonsCadastro += "<button data-url='"+menus[i].url+"' onclick='"+menus[i].event+"' title='"+menus[i].title+ "'class='"+menus[i].class+"'>"+menus[i].name+"</button>";
                                htmlButtonsCadastro += "</div>";
                            htmlButtonsCadastro += "</div>";
                        htmlButtonsCadastro += "</div>";
                    }
                    htmlButtonsCadastro += "</div>";
                    htmlButtonsCadastro += "</div>";
                }
            });
            $(".loading").removeClass("show");
            $("#pages").find("div").html(htmlButtonsCadastro);
        }
    });
    
}

function eventContructionPage(target) {
    $(".loading").addClass("show");
    $("#pages").find("div").empty();
    $("#pages").find("div").load(target.dataset.url, function (target) {});
    $(".loading").removeClass("show");
    contentDivMenu = "";
}

function eventSubmenu(target) {    
    $(".loading").addClass("show");
    $("#pages").find("div").empty();
    $("#pages").find("div").html(htmlButtonsSubmenu);
    $(".loading").removeClass("show");
    contentDivMenu = "";
}

function structureMenu() {

    let menus = {

        'cadastros': [

            {
                'name': 'Estado',
                'title': 'Cadastro de estado',
                'type': 'Página',
                'class':'btn btn-success',
                'event':'eventContructionPage(this)',
                'url': 'pages/estado/Estado.html'
            },
            {
                'name': 'Cidade',
                'title': 'Cadastro de cidade',
                'type': 'Página',
                'class':'btn btn-success',
                'event':'eventContructionPage(this)',
                'url': 'pages/estado/MenuCadastro.html'
            },
            {
                'name': 'Bairro',
                'title': 'Cadastro de bairro',
                'type': 'Página',
                'class':'btn btn-success',
                'event':'eventContructionPage(this)',
                'url': 'pages/estado/MenuCadastro.html'
            },

            {
                'name': 'Portaria',
                'title': 'Cadastro de portaria',
                'type': 'Menu',
                'class':'btn btn-info',
                'event':'eventSubmenu(this)',
                'url': 'pages/estado/MenuCadastro.html',
                'submenu': [
                    {
                        'name':'Morador',
                        'title':'Cadastro de morador',
                        'type':'Página',
                        'class':'btn btn-success',
                        'event':'eventContructionPage(this)',
                        'url':'pages/estado/MenuCadastro.html'
                    },
                    {
                        'name':'Morador',
                        'title':'Cadastro de morador',
                        'type':'Página',
                        'class':'btn btn-success',
                        'event':'eventContructionPage(this)',
                        'url':'pages/estado/MenuCadastro.html'
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

function getUrls() {
    $.getJSON("flash/urls", function (data) {
        console.log(data);
    });
}