$(document).ready(function() {
    comprobar_login();
    $("#nombre_familia").html("Familia: " + localStorage.getItem("familia"));
    //--- --- ---
    $.ajax({
        url: 'php/notificaciones.php',
        type: 'POST',
        data: {
            accion: 1
        }
    }).done(function(json) {
        json = $.parseJSON(json);
        if (json != "") {
            if (json[0].resultado == "correcto") {
                //--- --- ----
                var datos = '';
                for (var i = 0; i < json.length; i++) {
                    datos += '<tr><td>' + json[i].fecha_publicacion + '</td><td>' + json[i].area_notificacion + '</td><td><blockquote class="blockquote">' + json[i].notificacion + '</blockquote></td></tr>';
                }
                //--- --- ----
                $("#tabla_notificaciones tbody").html(datos);
                $("#tabla_notificaciones tbody").trigger("create");
                //--- --- ----
            } else if (json[0].resultado == "vacio") {
                Swal.fire("Atención", "No hay notificaciones para mostrar", "info");
            } else if (json[0].resultado == "iniciar_sesion") {
                CerrarSesion();
            }
        } else {
            Swal.fire("Error", "Ocurrio un error, intentelo nuevamente", "warning");
        }
    }).fail(function() {
        Swal.fire("Error", "Error al intentar conectarse con la Base de Datos :/", "error");
    });
    //--- --- ---
});