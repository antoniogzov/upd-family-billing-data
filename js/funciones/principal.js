comprobar_login();
//---- ---- ---//
//comprobarFormularioInscripciones();
//comprobarEncuestaClasesPresenciales();
//comprobarEncuestaVacunaCovid19();
//---- ---- ---//
$("#nombre_familia").html("Familia: " + localStorage.getItem("familia"));
//--- --- ---
$(".actualizacion_datos_medicos").click(function() {
    window.location.href = "areas/transportes/formularios/actualizacion_medica/act_datos_medicos.html";
});
//--- --- ---
$(".actualizacion_cambios_fijos").click(function() {
    window.location.href = "areas/transportes/formularios/planeacion_cambios_fijos/cambios_direccion.html";
});
//--- --- ---
$(".inscripciones_20_21").click(function() {
    window.location.href = "../externo/inscripciones/registro.php";
});
$(".qualifications").click(function() {
    window.location.href = "areas/academica/calificaciones/index.php";
});
//--- --- ---
$(".ventas_ykt").click(function() {
    window.location.href = "areas/coord_servicios/ventas/ventas_principal.html";
});
$(".horarios_transporte").click(function() {
    window.location.href = "areas/transportes/consultas/horarios.html";
});
//--- --- ---
$(".mis_clases").click(function() {
    //--- --- ---//
    var redireccion = "areas/academica/clases_grabadas";
    //verificarAcceso('mis_clases', redireccion);
    //--- --- ---//
    window.location.href = redireccion;
    //--- --- ---//
});
//--- --- ---
$(".pedagogia").click(function() {
    window.location.href = "areas/academica/clases_grabadas/psicologia.html";
});
//--- --- ---
$(".lista_utiles").click(function() {
    window.location.href = "lista_utiles.html";
});
//--- --- ---
$(document).on('click', '.realizar_encuesta', function() {
    window.location.href = "encuesta_clases_presenciales/lista_encuesta_clases_presenciales.html";
});
//--- --- ---
$(document).on('click', '.pidalo_lunes', function() {
    window.location.href = "https://sites.google.com/ae.edu.mx/pideloloslunes/p%C3%A1gina-principal?authuser=0";
});
$(".contacto_ykt").click(function() {
    window.location.href = "ykt_linea/contacto.php";
});
$(".citas_academicas").click(function() {
    window.location.href = "areas/academica/citas-areas-academicas/";
});
//--- --- ---//
//--- --- ---//
//--- --- ---//
function comprobarEncuestaVacunaCovid19() {
    //--- --- ---//
    $.ajax({
        url: '/wykt/externo/formularios/encuesta_vacuna_COVID19/php/funciones.php',
        type: 'POST',
        data: {
            accion: 1
        }
    }).done(function(json) {
        console.log(json);
        json = $.parseJSON(json);
        if (json != "") {
            if (json[0].resultado != "llena") {
                //--- --- ---//
                Snackbar.show({
                    actionTextColor: '#FFEB00',
                    backgroundColor: '#7B2D93',
                    duration: '200000',
                    text: 'Le pedimos que llene la siguiente encuesta COVID-19 por favor:',
                    actionText: '<b>Ir a encuesta</b>',
                    pos: 'bottom-left',
                    onActionClick: function(element) {      
                        //Set opacity of element to 0 to close Snackbar
                        $(element).css('opacity', 0);
                        window.location.href = '/wykt/externo/formularios/encuesta_vacuna_COVID19';
                    }
                });
                //--- --- ---//
            } else {
                //--- --- ---//
                Snackbar.show({
                    actionTextColor: '#FFFFFF',
                    backgroundColor: '#F04614',
                    duration: '10000',
                    text: 'Gracias por llenar la encuesta COVID-19, si desea volver a llenarla de click aquí ->',
                    actionText: '<b>Actualizar</b>',
                    pos: 'bottom-left',
                    onActionClick: function(element) {      
                        //Set opacity of element to 0 to close Snackbar
                        Swal.fire({
                            title: 'Atención!',
                            text: "Se eliminarán las respuestas anteriores, ¿desea continuar?",
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Sí'
                        }).then((result) => {
                            if (result.value) {
                                $(element).css('opacity', 0);
                                //window.location.href = '/wykt/externo/formularios/encuesta_vacuna_COVID19';
                            }
                        })
                    }
                });
                //--- --- ---//
            }
        }
    }).fail(function() {
        Swal.fire("Error", "Error al intentar conectarse con la Base de Datos :/", "error");
    });
}
//--- --- ---//
function verificarAcceso(nombre_columna_modulo, redireccion) {
    //--- --- ---//
    $.ajax({
        url: '/wykt/externo/php/funciones_login.php',
        type: 'POST',
        data: {
            accion: 4,
            nombre_columna_modulo: nombre_columna_modulo
        }
    }).done(function(json) {
        json = $.parseJSON(json);
        if (json != "") {
            if (json[0].resultado == "sin_permiso") {
                //--- --- ---//
                window.location.href = "/wykt/externo/mensaje_deuda/";
                //--- --- ---//
            } else if (json[0].resultado == "permiso") {
                //--- --- ---//
                window.location.href = redireccion;
                //--- --- ---//
            }
        }
    }).fail(function() {
        Swal.fire("Error", "Error al intentar conectarse con la Base de Datos :/", "error");
    });
}
//--- --- ---//
function comprobarFormularioInscripciones() {
    //--- Comprobamos si ya finalizó el formulario anteriormente ---//
    $.ajax({
        url: '/wykt/externo/areas/administracion/formularios/inscripciones_23_24/php/inscripciones_20_21.php',
        type: 'POST',
        data: {
            accion: 3
        }
    }).done(function(json) {
        json = $.parseJSON(json);
        if (json != "") {
            if (json[0].resultado == "sin_permiso") {
                $(".img_card_inscripciones").attr("src", "img/formulario_listo.png");
            } else if (json[0].resultado == "formulario_finalizado") {
                $(".img_card_inscripciones").attr("src", "img/formulario_listo.png");
            }
        }
    }).fail(function() {
        Swal.fire("Error", "Error al intentar conectarse con la Base de Datos :/", "error");
    });
}
//--- --- ---//
function comprobarEncuestaClasesPresenciales() {
    //--- Comprobamos si ya finalizó el formulario anteriormente ---//
    $.ajax({
        url: '/wykt/externo/encuesta_clases_presenciales/php/encuesta_alumnos_clases_presenciales.php',
        type: 'POST',
        data: {
            accion: 1
        }
    }).done(function(json) {
        json = $.parseJSON(json);
        if (json != "") {
            if (json[0].resultado != "vacio") {
                $(".card_encuesta_clases_presenciales").html('<div class="card realizar_encuesta" style="background-color: red"> <br/> <div class="card_image"> <img src="img/reporte_salud.png"/> </div> <div class="card_title title-white"> <p> CHECK LIST SALUD </p> </div> </div>');
            }
        }
    }).fail(function() {
        Swal.fire("Error", "Error al intentar conectarse con la Base de Datos :/", "error");
    });
}