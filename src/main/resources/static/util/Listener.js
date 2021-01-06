/* global Message, TYPE */
"use strict";

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

        $(document).ajaxSend(function (event, jqXHR, settings) {
            $(".table-responsive").block({message: null});
            $("button[type='submit']").prop('disabled',true);
            $("button[type='submit']").block({message: null});
        }.bind(this));
        
        $(document).ajaxComplete(function (event, jqXHR, settings) {
            console.log("ajaxComplete");
            $(".table-responsive").unblock();
            $("button[type='submit']").unblock();
            $("button[type='submit']").prop('disabled',false);
        }.bind(this));

        $(document).ajaxError(function (event, jqXHR, settings) {
            if (jqXHR.status === 0) {
                var message = new Message.Error();
                message.show("Falha de comicação com o serviço!");
                var form = $(event.target.forms);
                $(form).empty();
                $(form).append(nativeSkeleton);
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
                if (jqXHR.responseJSON !== null) {
                    var message = new Message.Warning();
                    message.show(jqXHR.responseJSON.errors[0]+"\nRecurso não encontrado!", "I");
                }
            } else if (jqXHR.status === 500) {
                if(jqXHR.responseJSON !== null) {
                    var message = new Message.Warning();
                    message.show(jqXHR.responseJSON.errors[0],"I");
                    var form = $(event.target.forms);
                    $(form).empty();
                    $(form).append(nativeSkeleton);
                }
            }
            
            $(".table-responsive").unblock();
            $("button[type='submit']").unblock();
            $("button[type='submit']").prop('disabled',false);
            
        }.bind(this));
    };

    return Handler;
    
}());

$(function () {
    var listener = new Listener.Handler();
    listener.execute();
});













//let nativeSkeleton =
//        "<div class='ph-item'>"+
//            "<div class='ph-col-12'>"+
//                "<div class='ph-row'>"+
//                    "<div class='ph-col-6 big'></div>"+
//                    "<div class='ph-col-4 empty big'></div>"+
//                    "<div class='ph-col-2 big'></div>"+
//                    "<div class='ph-col-4 big'></div>"+
//                    "<div class='ph-col-8 empty big'></div>"+
//                    "<div class='ph-col-6 big'></div>"+
//                    "<div class='ph-col-4 empty big'></div>"+
//                    "<div class='ph-col-12 big'></div>"+
//                "</div>"+
//                "<div class='ph-row'>"+
//                    "<div class='ph-col-12 empty big'></div>"+
//                    "<div class='ph-col-12 empty big'></div>"+
//                    "<div class='ph-col-12 empty big'></div>"+
//                    "<div class='ph-col-12 empty big'></div>"+
//                "</div>"+
//                "<div class='ph-picture2'></div>"+
//            "</div>"+
//        "</div>";
//        
//        var uri = localStorage.getItem("currentUri");
//        
//        if(uri===null) {
//            
//            var message = new Message.Warning();
//            message.show("Algo ocasionou um mal funcionamento, regarregue a página!", "I");
//
//            var form = $(event.target.forms);
//            $(form).empty();
//            $(form).append(nativeSkeleton);
//
//            return;
//        }
