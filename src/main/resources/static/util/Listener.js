/* global Message, TYPE, removeAllLocalStorage */
var Listener = Listener || {};

Listener.Handler = (function () {

    function Handler() {}

    Handler.prototype.execute = function () {
        
        var nativeSkeleton =
        "<div class='ph-item'>"+
            "<div class='ph-col-12'>"+
                "<div class='ph-row'>"+
                    "<div class='ph-col-6 big'></div>"+
                    "<div class='ph-col-4 empty big'></div>"+
                    "<div class='ph-col-2 big'></div>"+
                    "<div class='ph-col-4 big'></div>"+
                    "<div class='ph-col-8 empty big'></div>"+
                    "<div class='ph-col-6 big'></div>"+
                    "<div class='ph-col-4 empty big'></div>"+
                    "<div class='ph-col-12 big'></div>"+
                "</div>"+
                "<div class='ph-row'>"+
                    "<div class='ph-col-12 empty big'></div>"+
                    "<div class='ph-col-12 empty big'></div>"+
                    "<div class='ph-col-12 empty big'></div>"+
                    "<div class='ph-col-12 empty big'></div>"+
                "</div>"+
                "<div class='ph-picture2'></div>"+
            "</div>"+
        "</div>";
        
        switch (document.readyState) {
            case "loading":
                window.console.info("O documento esta carregando");
                // O documento esta carregando
                break;
            case "interactive":
                // O documento acabou de carregar. Nós podemos acessar os elementos do DOM.
                // mas sub-recursos, como imagens, folhas de estilo e quadros, ainda estão sendo carregados.
                window.console.info("A pagina carregada em partes");
                break;
            case "complete":
                // A pagina carregou por completo.
                window.console.info("A pagina carregou por completo");
                break;
        }
        
        $(document).ajaxSend(function (event, jqXHR, settings) {
            if (settings.isLocal === false && !settings.url.includes(".html") && !settings.url.includes(".js")) {
                $(".setblockUI").block({message:null});
                $(':button').prop('disabled', true);
                //$("div.loader").css("display","block");
            }
        }.bind(this));
        
        $(document).ajaxComplete(function (event, jqXHR, settings) {
            if (settings.isLocal === false && !settings.url.includes(".html") && !settings.url.includes(".js")) {
                $(".setblockUI").unblock();
                $(':button').prop('disabled', false);
                //$("div.loader").css("display","none");
            }
        }.bind(this));
        
        $(document).ajaxError(function (event, jqXHR, settings) {
            
            if (jqXHR.status === 0) {
                var message = new Message.Error();
                message.show("Falha de comicação com o serviço!");
                $("#pages").find("div").empty();
                $("#pages").find("div").append(nativeSkeleton);
                removeAllLocalStorage();
            } else if(jqXHR.status === 400) {
                if(jqXHR.responseJSON !== null && jqXHR.responseJSON.errors) {
                    var message = new Message.Warning();
                    message.show(jqXHR.responseJSON.errors[0],"N");
                } else if(jqXHR.responseJSON.errors === undefined) {
                    var array = jqXHR.responseJSON;
                    var field = "";
                    var arrayFields = [];
                    var flag = true;
                    var fieldMessage = "";
                    for (var i = 0; i < array.length; i++) {
                        if (field !== array[i].field || i === 0) {
                            field = array[i].field;
                            if (i > 0) {
                                for(var pos = 0; pos < arrayFields.length; pos++) {
                                    flag = true;
                                    if (field === arrayFields[pos]) {
                                        flag = false;
                                        break;
                                    }
                                }
                            }
                            if (flag) {
                                for (var j = 0; j < array.length; j++) {
                                    if(field === array[j].field) {
                                        if(j < array.length) {
                                            fieldMessage+=array[j].field + " - " +array[j].message+"\n";
                                        } else {
                                            fieldMessage+=array[j].field + " - " +array[j].message;
                                        }
                                    }
                                }
                                arrayFields.push(field);
                            }
                        }
                    }
                    
                    if (array.length > 0) {
                        var arrayElements = event.currentTarget.all;
                        $.each(arrayElements, function (index, val) {
                            var al = $(val);
                            if (al[0].id === "errosGerais") {
                                al[0].attributes[1].nodeValue = "font-size: 11px; display: block;";
                                al[0].innerText = fieldMessage;
                                $("#" + al[0].id).fadeOut(6000);
                                return false;
                            }
                        });
                    }
                }

            } else if (jqXHR.status === 302) {
                if(jqXHR.responseJSON !== null) {
                    var message = new Message.Warning();
                    message.show(jqXHR.responseJSON.errors[0],"N");
                }
            } else if (jqXHR.status === 404) {
                if (jqXHR.responseJSON !== undefined && jqXHR.responseJSON.errors !== undefined) {
                    var message = new Message.Warning();
                    message.show(jqXHR.responseJSON.errors[0] + "\nRecurso não encontrado!", "I");
                    removeAllLocalStorage();
                } else {
                    var message = new Message.Warning();
                    message.show("Recurso não encontrado: "+jqXHR.responseJSON.path,"I");
                }
            } else if (jqXHR.status === 500) {
                removeAllLocalStorage();
                if(jqXHR.responseJSON !== null) {
                    var message = new Message.Warning();
                    message.show(jqXHR.responseJSON.errors[0],"I");
                    message.show("Falha de comicação com o serviço!");
                    $("#pages").find("div").empty();
                    $("#pages").find("div").append(nativeSkeleton);
                }
            }
        }.bind(this));
    };

    return Handler;
    
}());

$(function () {
    var listener = new Listener.Handler();
    listener.execute();
});


















//$(".table-responsive").block({message: null});
//$("button[type='submit']").prop('disabled',true);
//$(':button').prop('disabled', true);
//$(':button').block({message: null});
//var form = $(event.target.forms); //$(event.target.forms);
//console.log(event.target.body);
//$(form).empty();
//$(form).append(nativeSkeleton);
//$("div.loading").addClass("show");
//$(".table-responsive").block({message: null});
//$("button[type='submit']").prop('disabled',true);
//$(':button').prop('disabled', true);
//$(':button').block({message: null});


//function getData() {
//$.post("/echo/json", {"json": JSON.stringify({"test": "test"})
//});
//}

//var oldJQueryEventTrigger = jQuery.event.trigger;
//jQuery.event.trigger = function (event, data, elem, onlyHandlers) {
//console.log(event, data, elem, onlyHandlers);
//oldJQueryEventTrigger(event, data, elem, onlyHandlers);
//};
//$("#myForm :input").prop('readonly', true);