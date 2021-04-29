/* global Message */

$(function () {

    window.console.log("Events panel");

    $("#divMoradorProprietario").empty();
    $("#divMoradorProprietario").load("pages/morador/PanelMoradorProprietario.html");

    $("#tabMoradorProprietario").on("click", function (e) {
        e.preventDefault();
        var criarPanel = true;
        var array = converterFormInArray("#formMoradorProprietario");
        for (var i = 0; i < array.length; i++) {
            if (array[i] !== "") {
                criarPanel = false;
                break;
            }
        }
        if (criarPanel) {
            $("#divMoradorProprietario").empty();
            $("#divMoradorProprietario").load("pages/morador/PanelMoradorProprietario.html");
        }
        $(this).tab("show");
    });

    $("#tabMoradorSecundario").on("click", function (e) {
        e.preventDefault();
        var criarPanel = true;
        var listaVazia = $("#listaVazia").val();

        if (listaVazia === undefined || listaVazia === "") {
            listaVazia = true;
        } else if (listaVazia === "true") {
            listaVazia = true;
        } else if (listaVazia === "false") {
            listaVazia = false;
        }

        var array = converterFormInArray("#formPrincipalMoradorSecundario");
        for (var i = 0; i < array.length; i++) {
            if (array[i] !== "") {
                criarPanel = false;
                break;
            }
        }
        if (criarPanel && listaVazia) {
            $("#divMoradorSegundario").empty();
            $("#divMoradorSegundario").load("pages/morador/PanelMoradorSecundario.html");
        }
        $(this).tab("show");
    });
});