/* global Message */

$(function () {
    $.validator.setDefaults({
        submitHandler: function () {

            var message = new Message.Success();
            var retrievedObject = localStorage.getItem('currentUri');

            let estado = {
                nome: $("#nome").val(),
                uf: $("#uf").val()
            };

            $.ajax({
                method: "POST",
                url: retrievedObject + "/estados/salvar",
                data: JSON.stringify(estado),
                contentType: "application/json",
                dataType: "json",
                statusCode: {
                    201: function (data) {
                        message.show("Registro salvo com sucesso!");
                    }
                }
            });
        }
    });
    validar();
    pagePesquisar();

});

function salvar() {
    
    $.validator.setDefaults({
        submitHandler: function () {
            
            var message = new Message.Success();
            var retrievedObject = localStorage.getItem('targetUrl');
            
            let estado = {
                nome: $("#nome").val(),
                uf: $("#uf").val()
            };
            
            $.ajax({
                method: "POST",
                url: retrievedObject+"/estados/salvar",
                data: JSON.stringify(estado),
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    message.show("Registro salvo com sucesso!");
                }
            });
        }
    });    
}

function validar() {
    $("#form-estado").validate({
        rules: {
            nome: {
                required: true,
                minlength: 2,
                maxlength: 100
            },
            uf: {
                required: true,
                minlength: 2,
                maxlength: 2
            }
        },
        messages: {
            nome: {
                required: "Nome obrigatório",
                minlength: "Tamanho mínimo para o nome é 3 caracter",
                maxlength: "Tamanho máximo para no nome é 100 caracter"
            },
            uf: {
                required: "UF obrigatório",
                minlength: "Tamanho mínimo para o nome é 2 caracter",
                maxlength: "Tamanho máximo para no nome é 2 caracter"
            }
        },
        errorElement: "em",
        errorPlacement: function (error, element) {

            error.addClass("invalid-feedback");
            if (element.prop("type") === "checkbox") {
                error.insertAfter(element.next("label"));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass("is-invalid");
            //$(element).addClass("is-valid").removeClass("is-invalid");
        }
    });
}

function pagePesquisar() {
    $("#btnPesquisar").on("click", function () {
        $(".loading").addClass("show");
        $("#pages").find("div").empty();
        $("#pages").find("div").load("pages/estado/Pesquisar.html");
        $(".loading").removeClass("show");
    });
}

//    $.validator.setDefaults({
//        submitHandler: function () {
//            alert("submitted!");
//        }
//    });
//
//    $(document).ready(function () {
//        rules: {
//                firstname: "required",
//                lastname: "required",
//                nome: {
//                    required: true,
//                    minlength: 2,
//                    maxlength: 25
//                },
//                password: {
//                    required: true,
//                    minlength: 5
//                },
//                confirm_password: {
//                    required: true,
//                    minlength: 5,
//                    equalTo: "#password"
//                },
//                email: {
//                    required: true,
//                    email: true
//                },
//                agree: "required"
//            },
//            messages: {
//                firstname: "Please enter your firstname",
//                lastname: "Please enter your lastname",
//                username: {
//                    required: "Please enter a username",
//                    minlength: "Your username must consist of at least 2 characters"
//                },
//                password: {
//                    required: "Please provide a password",
//                    minlength: "Your password must be at least 5 characters long"
//                },
//                confirm_password: {
//                    required: "Please provide a password",
//                    minlength: "Your password must be at least 5 characters long",
//                    equalTo: "Please enter the same password as above"
//                },
//                email: "Please enter a valid email address",
//                agree: "Please accept our policy"
//            },
//            errorElement: "em",
//            errorPlacement: function (error, element) {
//                // Add the `invalid-feedback` class to the error element
//                error.addClass("invalid-feedback");
//
//                if (element.prop("type") === "checkbox") {
//                    error.insertAfter(element.next("label"));
//                } else {
//                    error.insertAfter(element);
//                }
//            },
//            highlight: function (element, errorClass, validClass) {
//                $(element).addClass("is-invalid").removeClass("is-valid");
//            },
//            unhighlight: function (element, errorClass, validClass) {
//                $(element).addClass("is-valid").removeClass("is-invalid");
//            }
//        });
//    });





//    $("#form-estado").validate({
//        rules: {
//            nome: {
//                required: true,
//                minlength: 6,
//                maxlength: 25
//            }
//        }
//    });
//    
//    jQuery.validator.setDefaults({
//        errorElement: 'span',
//        errorPlacement: function (error, element) {
//            error.addClass('invalid-feedback');
//            element.closest('.form-group').append(error);
//        },
//        highlight: function (element, errorClass, validClass) {
//            $(element).addClass('is-invalid');
//        },
//        unhighlight: function (element, errorClass, validClass) {
//            $(element).removeClass('is-invalid');
//        }
//    });


//    $("#form-estado").validate({
//        rules: {
//            nome: {
//                required: true,
//                minlength: 2,
//                maxlength: 25
//            },
//            messages: {
//                nome: {
//                    required: "Nome obrigatório",
//                    minlength: "Tamanho mínimo para o nome é 2 caracter",
//                    maxlength: "Tamanho máximo para no nome é 50 caracter"
//                }
//            },
//
//            errorElement: "span",
//            errorPlacement: function (error, element) {
//                error.addClass("invalid-feedback");
//            },
//            highlight: function (element, errorClass, validClass) {
//                $(element).addClass("is-invalid").removeClass("is-valid");
//            },
//            unhighlight: function (element, errorClass, validClass) {
//                $(element).addClass("is-valid").removeClass("is-invalid");
//            }
//        }
//    });
    