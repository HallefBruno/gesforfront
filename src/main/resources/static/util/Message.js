/* global Swal, DataTable */

var Message = Message || {};

Message.SuccessToast = (function () {
    
    function SuccessToast() {}
    
    SuccessToast.prototype.show = function (message) {
        
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        Toast.fire({
            icon: 'success',
            title: `${message}`
        });
    };
    
    return SuccessToast;
    
}());

/**
 * @type Message.Success
 * @since 2020
 * @author Hallef
 * @description Lança mensagem de sucesso no topo a direita
 */
Message.Success = (function () {
    
    function Success() {}
    
    /**
     * Descrição. Lança mensagem de sucesso no topo a direita
     * @param {String} message
     * @returns {undefined}
     */
    Success.prototype.show = function (message) {
        Swal.fire({
            icon: 'success',
            title: 'Atenção',
            showConfirmButton: false,
            text: `${message}`,
            timer: 3000
        });
    };
    
    return Success;
    
}());

/**
 * @type Message.Warning
 * @since 2020
 * @author Hallef
 * @description Lança mensagem de atenção no centro da tela duração de 5 segundos
 */
Message.Warning = (function () {
    
    function Warning() {}
    
    /**
     * Descrição. Lança mensagem de atenção no centro da tela duração de 5 segundos.
     * @param {String} message
     * @param {String} type
     * @returns {undefined}
     */
    Warning.prototype.show = function (message, type) {
        
        if (type === "N") {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                showConfirmButton: false,
                text: `${message}`,
                timer: 5000
            });
        }
        
        if(type === "I") {
            Swal.fire({
                title: 'Atenção!',
                text: `${message}`,
                imageUrl: 'img/mascote.png',
                imageWidth: 40,
                imageHeight: 40,
                imageAlt: 'Custom image',
                timer: 5000
            });
        }
    };
    
    return Warning;
    
}());



/**
 * @type MessageError.Error
 * @since 2020
 * @author Hallef
 * @description Lança mensagem de erro no centro da tela
 */
Message.Error = (function () {
    
    function Error() {}
    
    /**
     * Descrição. Lança mensagem de erro no centro da tela.
     * @param {type} message 
     * @returns {undefined}
     */
    Error.prototype.show = function (message) {
        
        Swal.fire({
            title: 'Oops...',
            imageUrl: 'img/mascote.png',
            text: `${message}`,
            imageWidth: 40,
            imageHeight: 40,
            imageAlt: 'Custom image',
            footer: "<a href='#' onclick=window.open('http://127.0.0.1:8081/flash/help')>Por que estou com esse problema?</a>"
        });

    };

    return Error;
    
}());
    




//Message.Delete1 = (function () {
//    
//    function Delete() {}
//    
//    Delete.prototype.show = function () {
//        Swal.fire({
//            title: 'Você tem certeza?',
//            text: "Você não poderá reverter isso!",
//            icon: 'warning',
//            showCancelButton: true,
//            confirmButtonColor: '#3085d6',
//            cancelButtonColor: '#d33',
//            confirmButtonText: 'Sim, delete isso!'
//        }).then((result) => {
//            if (result.isConfirmed) {
//                Swal.fire('Excluído! ',' Seu registro foi excluído.','success');
//            }
//        });
//    };
//    
//    return Delete;
//}());
