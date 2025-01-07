$(document).ready(function() {
    comprobar_login();
    $("#nombre_familia").html("Familia: " + localStorage.getItem("familia"));
    //--- --- ---
    $.ajax({
        url: 'php/lista_utiles.php',
        type: 'POST',
        data: {
            accion: 1
        }
    }).done(function(json) {
        console.log(json);
        json = $.parseJSON(json);
        if (json != "") {
                var lista_utiles = '<div id="accordion">';
                for (var i = 0; i < json.length; i++) {
                    if(json[i].resultado == 'correcto'){
                        lista_utiles += '<div class="card border-primary mb-3"> <div class="card-header p-0 border-0" id="heading' + i + '"> <h4 class="mb-0"> <a aria-controls="collapse' + i + '" aria-expanded="false" class="btn btn-primary d-block text-left rounded-0" data-target="#collapse' + i + '" data-toggle="collapse" href="#"> ' + json[i].codigo_alumno + ' - ' + json[i].nombre_alumno + ' </a> </h4></div>';
                        lista_utiles += '<div aria-labelledby="heading' + i + '" class="collapse" data-parent="#accordion" id="collapse' + i + '"><div class="card-body">';
                        lista_utiles += '<ul>';
                        /*for (var e = 0; e < json[i].lista_utiles_escolares.length; e++) {
                            lista_utiles += '<li>PLANTEL: ' + json[i].lista_utiles_escolares[e].plantel + ' | Lista de: <a href="' + json[i].lista_utiles_escolares[e].lista_utiles + '" download target="_black">' + json[i].lista_utiles_escolares[e].nivel_academico + '</a></li><br/>';
                        }*/
                        lista_utiles += '<li>PLANTEL: ' + json[i].plantel + ' | Lista de: <a href="' + json[i].lista_utiles + '" download target="_black">' + json[i].nivel_academico + '</a></li><br/>';
                        lista_utiles += '<ul></div></div>';
                        lista_utiles += '</div>';
                    }
                    
                }
                $('.div_lista_utiles').html(lista_utiles);
                //--- --- ----
        } else {
            Swal.fire("Atención!", "Aún no hay lista de útiles disponible", "info");
        }
    }).fail(function() {
        Swal.fire("Error", "Error al intentar conectarse con la Base de Datos :/", "error");
    });
    //--- --- ---
});