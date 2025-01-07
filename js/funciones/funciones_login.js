$(document).ready(function() {
    $("#btn_ingresar_portal").click(function(e) {
        e.preventDefault();
        var codigo_familia = $("#codigo_familia_login").val();
        var contrasena = $("#contrasena_familia_login").val();
        //--- --- ---//
        codigo_familia = codigo_familia.toUpperCase();
        contrasena = contrasena.toUpperCase();
        if (codigo_familia == "" || contrasena == "") {
            Swal.fire('Atención!', 'Ingrese su código de familia y contraseña por favor', 'info');
        } else {
            //--- --- ---//
            var ip_publica = '';
            //--- --- ---//
            /*$.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
                //console.log(JSON.stringify(data, null, 2));
                ip_publica = data.geobytesremoteip;
                loguearse(ip_publica, codigo_familia, contrasena)
            });*/
            //--- --- ---//
            loguearse(ip_publica, codigo_familia, contrasena);
            //--- --- ---//
        }
    });
    //---- --- ---- ---
});
//--- --- ---//
function loguearse(ip_publica, codigo_familia, contrasena) {
    //--- --- ---//
    $.ajax({
        url: 'php/funciones_login.php',
        type: 'POST',
        data: {
            accion: 1,
            codigo_familia: codigo_familia,
            contrasena: contrasena,
            ip_publica: ip_publica
        }
    }).done(function(json) {
        console.log(json);
        json = $.parseJSON(json);
        if (json != "") {
            if (json[0].resultado == "correcto") {
                //--- --- --- ---//
                localStorage.setItem("codigo_familia", json[0].codigo_familia);
                localStorage.setItem("familia", json[0].familia);
                //--- --- --- ---//
                window.location.href = "principal.html";
                //--- --- --- ---//
            } else if (json[0].resultado == "deudora_no_acceso") {
                //--- --- ---//
                window.location.href = "mensaje_deuda/";
                //--- --- ---//
            } else if (json[0].resultado == "credenciales_incorrectas") {
                //--- --- ---//
                Swal.fire("Atención!", "Código de familia o contraseña incorrectos", "error");
                //--- --- ---//
            } else if (json[0].resultado == "deudora_acceso") {
                //--- --- --- ---//
                localStorage.setItem("codigo_familia", json[0].codigo_familia);
                localStorage.setItem("familia", json[0].familia);
                //--- --- --- ---//
                window.location.href = "principal.html";
                //--- --- --- ---//
            }
        } else {
            Swal.fire("Atención!", "Ocurrió un problema, intentelo nuevamente por favor", "error");
        }
    }).fail(function() {
        Swal.fire("Error", "Error al intentar conectarse con la Base de Datos :/", "error");
    });
    //--- --- ---//
}

function comprobar_login() {
    //--- --- --- --- ---
    $.ajax({
        url: 'php/funciones_login.php',
        type: 'POST',
        data: {
            accion: 2
        }
    }).done(function(json) {
        json = $.parseJSON(json);
        if (json != "") {
            if (json[0].sesion_iniciada != "true") {
                //--- --- --- ---
                localStorage.removeItem("codigo_familia");
                localStorage.removeItem("familia");
                //---- ---- --- ---- -----
                window.location.href = "index.html";
            } else {
                localStorage.setItem("codigo_familia", json[0].codigo_familia);
                localStorage.setItem("familia", json[0].familia);
                //--- --- --- ---
            }
        } else {
            localStorage.setItem("codigo_familia", json[0].codigo_familia);
            localStorage.setItem("familia", json[0].familia);
            //--- --- --- ---
            window.location.href = "index.html";
        }
    }).fail(function() {
        Swal.fire("Error", "Error al intentar conectarse con la Base de Datos :/", "error");
    });
    ///--- --- --- ---- -
}

function CerrarSesion() {
    $.ajax({
        url: 'php/funciones_login.php',
        type: 'POST',
        data: {
            accion: 3
        }
    }).done(function(json) {
        //--- --- --- ---
        localStorage.removeItem("codigo_familia");
        localStorage.removeItem("familia");
        //--- --- --- ---
        localStorage.removeItem("productos_agregados");
        localStorage.removeItem("proceder_pago_ykt");
        localStorage.removeItem("id_articulo_detalles");
        localStorage.removeItem("cod_alumno_activo_actualmente");
        localStorage.removeItem("__paypal_storage__");
        //---- ---- --- ---- -----
        window.location.href = "index.html";
    }).fail(function() {
        Swal.fire("Error", "Error al intentar conectarse con la Base de Datos :/", "error");
    });
    ///--- --- --- ---- -
}
//--- --- ----