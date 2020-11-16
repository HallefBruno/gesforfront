$(function () {
    $("#btnPesquisar").on("click", pagePesquisar);
    $("button[name='btnVoltar']").on("click", voltar);
});

function voltar() {
    $(".loading").addClass("show");
    $("#pages").find("div").empty();
    $("#pages").find("div").load("pages/estado/Estado.html");
    $(".loading").removeClass("show");
}

function pagePesquisar() {
    $(".loading").addClass("show");
    $("#pages").find("div").empty();
    $("#pages").find("div").load("pages/estado/Pesquisar.html");
    $(".loading").removeClass("show");
}