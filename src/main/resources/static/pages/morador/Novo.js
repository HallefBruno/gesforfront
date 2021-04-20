/* global Message */

$(function () {
    $("#divMoradorProprietario").empty();
    $("#divMoradorProprietario").load("pages/morador/PanelMoradorProprietario.html");

    $("#tabMoradorProprietario").on("click", function (e) {
        e.preventDefault();
        if ($("#nome").val() === "") {
            $("#divMoradorProprietario").empty();
            $("#divMoradorProprietario").load("pages/morador/PanelMoradorProprietario.html");
        }
        $(this).tab("show");
    });

    $("#tabMoradorSecundario").on("click", function (e) {
        e.preventDefault();
        $("#divMoradorSegundario").empty();
        $("#divMoradorSegundario").load("pages/morador/PanelMoradorSecundario.html");
        $(this).tab("show");
    });
});