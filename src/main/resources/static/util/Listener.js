/* global Message, TYPE */

var Listener = Listener || {};

Listener.Handler = (function () {

    function Handler() {}

    Handler.prototype.execute = function () {

        $(document).ajaxSend(function (event, jqXHR, settings) {
            if(settings.isLocal === false && !settings.url.includes(".html") && !settings.url.includes(".js")) {
                console.log("ajaxSend");
            }
        }.bind(this));

        $(document).ajaxComplete(function (event, jqXHR, settings) {
            if(settings.isLocal === false && !settings.url.includes(".html") && !settings.url.includes(".js")) {
                console.log("ajaxComplete");
            }
        }.bind(this));

        $(document).ajaxError(function (event, jqXHR, settings) {
            if (jqXHR.status === 0) {
                var message = new Message.Error();
                message.show("Erro de comicação com o serviço!");
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

            } else if (jqXHR.status === 500) {
                if(jqXHR.responseJSON !== null) {
                    var message = new Message.Warning();
                    message.show(jqXHR.responseJSON.errors[0],"I");
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