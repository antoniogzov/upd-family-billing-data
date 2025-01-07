$(document).ready(function() {
    //--- obtenemos todas las clases públicas ---//
    obtenerLeccionesPublicas();
    //---- --- ---//
    //---- --- ---//
    function obtenerLeccionesPublicas() {
        $.ajax({
            url: 'php/lecciones_publicas.php',
            type: 'POST',
            data: {
                accion: 1
            }
        }).done(function(json) {
            console.log(json);
            json = $.parseJSON(json);
            if (json != "") {
                var lecciones_publicas = '';
                if (json[0].resultado == "correcto") {
                    //--- --- ----
                    for (var i = 0; i < json.length; i++) {
                        lecciones_publicas += '<tr><td>' + json[i].fecha_publicacion + '</td><td>' + json[i].titulo_leccion + '</td><td>' + json[i].nombre_colaborador_leccion + '</td><td><a href="' + json[i].url_video + '" target="_blank"><i class="fa fa-play-circle fa-2x" aria-hidden="true"></i></a></td></tr>';
                    }
                } else if (json[0].resultado == "vacio") {
                    lecciones_publicas = '<tr><td colspan="4" class="text-center">No hay lecciones públicas :(</td></tr>';
                }
                //--- --- ----
                $("#tabla_lecciones_publicas tbody").html(lecciones_publicas);
                $("#tabla_lecciones_publicas tbody").trigger("create");
                //--- --- ----
            } else {
                Swal.fire("Error", "Ocurrio un error, intentelo nuevamente", "warning");
            }
        }).fail(function() {
            Swal.fire("Error", "Error al intentar conectarse con la Base de Datos :/", "error");
        });
    }
    //--- --- ---
});