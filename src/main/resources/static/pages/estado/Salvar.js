/* global Swal */

$(function () {

    $.validator.setDefaults({
        submitHandler: function () {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 4000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });

            Toast.fire({
                icon: 'success',
                title: 'Signed in successfully'
            });
        }
    });

    $("#form-estado").validate({
        rules: {
            nome: {
                required: true,
                minlength: 2,
                maxlength: 25
            }
        },
        messages: {
            nome: {
                required: "Nome obrigatório",
                minlength: "Tamanho mínimo para o nome é 2 caracter",
                maxlength: "Tamanho máximo para no nome é 50 caracter"
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


});

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
    