getStudents();
getScheduledDays();

const slctStudents = document.querySelector("#slct-students");
slctStudents.addEventListener("change", getSchedules);

const slctSchedules = document.querySelector("#slct-schedules");

const btnBookAppointment = document.querySelector("#btn-book-appointment");
btnBookAppointment.addEventListener("click", preScheduleAppointment);

//const btnConfirmPendingAppointments = document.getElementById('btn-confirmPendingAppointments');
//btnConfirmPendingAppointments.addEventListener('click', confirmPendingAppointments);

let cost_center_id = 0;
let id_group = 0;
let id_student = 0;

let appointmentsListConfirm = [];

function getStudents() {
  const data = new FormData();
  data.append("func", "getStudents");
  fetch("php/controllers.php", {
    method: "POST",
    body: data,
  })
    .then(function (response) {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        console.log(response);
        Swal.fire(
          "Error",
          "Ocurrió un error al intentar conectarse a la base de datos :[",
          "error"
        );
        throw new "Error en la llamada Ajax"();
      }
    })
    .then(function (data) {
      if (data.length > 0) {
        data.forEach(function (student, index) {
          var opt = document.createElement("option");
          opt.value = student.id_student;
          opt.text =
            student.student_name.toUpperCase() + " / " + student.group_code;
          slctStudents.appendChild(opt);
        });
      } else {
        Swal.fire(
          "Atención!",
          "Ocurrió un error al intentar obtener a los alumno, inténtelo nuevemnte",
          "info"
        );
      }
    });
  /*.catch(function(err) {
            Swal.fire('Atención!', 'Ocurrió un error al intentar guardar su comentario, intento nuevamente porfavor', 'info');
            console.log(err);
        })*/
}

function getSchedules() {
    loading();
  cost_center_id = 0;
  id_student = 0;
  slctSchedules.innerHTML = "";
  slctSchedules.disabled = false;
  btnBookAppointment.disabled = false;
  document.getElementById("div-alert").innerHTML = "";

  const data = new FormData();
  data.append("func", "getSchedules");
  data.append("id_student", slctStudents.value);

  fetch("php/controllers.php", {
    method: "POST",
    body: data,
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        console.log(response);
        Swal.fire(
          "Error",
          "Ocurrió un error al intentar conectarse a la base de datos :[",
          "error"
        );
        throw new "Error en la llamada Ajax"();
      }
    })
    .then(function (data) {
      console.log(data);
      document.getElementById("txt-cost-center").value =
        data.group.centro_costos;
      document.getElementById("date-appointment").value = data.appointment_date;

      id_group = data.group.id_group;
      id_student = slctStudents.value;

      if (data.student_have_appointment.alreadyAppointment) {
        slctSchedules.disabled = true;
        btnBookAppointment.disabled = true;
        document.getElementById("div-alert").innerHTML =
          '<div class="alert alert-danger text-center" role="alert"> Este alumno ya cuenta con una reservación </div>';
      }

      var opt = document.createElement("option");
      opt.value = "";
      opt.text = "Elija una opción";
      opt.disabled = true;
      opt.selected = true;
      slctSchedules.appendChild(opt);

      if (data.schedules.length > 0) {
        data.schedules.forEach(function (schedule, index) {
          var opt = document.createElement("option");

          if (!schedule.available_schedule) {
            opt.value = schedule.schedule;
            opt.text = schedule.schedule + " - " + schedule.observation;
            opt.disabled = true;
            opt.style.backgroundColor = "#E8E8E8";
          } else {
            opt.value = schedule.schedule;
            opt.text = schedule.schedule;
          }

          if (data.student_have_appointment.schedule == schedule.schedule) {
            opt.selected = true;
          }

          slctSchedules.appendChild(opt);
        });
        Swal.close();
      } else {
        if (data.additional_mssg != "") {
          Swal.fire("Atención!", data.additional_mssg, "info");
        } else {
          Swal.fire(
            "Atención!",
            "No hay horarios asignados a esta sección académica",
            "info"
          );
        }
      }
    });
  /*.catch(function(err) {
            Swal.fire('Atención!', 'Ocurrió un error al intentar guardar su comentario, intento nuevamente porfavor', 'info');
            console.log(err);
        })*/
}

function preScheduleAppointment() {
  let appointment_start_time = slctSchedules.value;
  let sendAppointment = true;

  if (id_student == 0) {
    Swal.fire("Atención!", "Elija un alumno por favor", "info");
    sendAppointment = false;
  } else if (
    appointment_start_time == "" ||
    appointment_start_time == "undefined"
  ) {
    Swal.fire("Atención!", "Elija un horario por favor", "info");
    sendAppointment = false;
  } else if (id_group == 0) {
    Swal.fire(
      "Atención!",
      "Ocurrió un error al obtener el área académica correspondiente, inténtelo nuevamente por favor",
      "info"
    );
    sendAppointment = false;
  }

  if (sendAppointment) {
    Swal.fire({
      title: "Atención!",
      text: `Se reservará el HORARIO: ${appointment_start_time} para este alumno(a) en su respectivo grupo de clase y no será elegible para otro de sus hijos o hijas en este día. ¿Desea continuar?`,
      type: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.value) {
        addScheduleAppointment(id_student, id_group, appointment_start_time);
      }
    });
  }
}

function addScheduleAppointment(id_student, id_group, appointment_start_time) {
    loading();
  const data = new FormData();
  data.append("func", "addScheduleAppointmentGroup");
  data.append("id_student", id_student);
  data.append("id_group", id_group);
  data.append("appointment_start_time", appointment_start_time);

  fetch("php/controllers.php", {
    method: "POST",
    body: data,
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        console.log(response);
        Swal.fire(
          "Error",
          "Ocurrió un error al intentar conectarse a la base de datos :[",
          "error"
        );
        throw new "Error en la llamada Ajax"();
      }
    })
    .then(function (data) {
        Swal.close();
      if (data.response) {
        const listScheduledAppointments = document.querySelector(
          "#accordionAppoinments"
        );
        const existClass =
          listScheduledAppointments.querySelector(".noAppointments");
        if (existClass) {
          listScheduledAppointments.innerHTML = "";
        }

        getScheduledDays();

        slctSchedules.disabled = true;
        btnBookAppointment.disabled = true;
        document.getElementById("div-alert").innerHTML =
          '<div class="alert alert-success text-center" role="alert"> Se reservó exitosamente </div>';

        appointmentsListConfirm.push(data.infoAppt.confirmed_appointment_id);
        //btnConfirmPendingAppointments.disabled = false;
        console.log(appointmentsListConfirm);
      } else {
        Swal.fire("Atención!", "No hay horarios disponibles :[", "info");
      }
    });
  /*.catch(function(err) {
            Swal.fire('Atención!', 'Ocurrió un error al intentar guardar su comentario, intento nuevamente porfavor', 'info');
            console.log(err);
        })*/
}

async function getScheduledAppointments() {
  const data = new FormData();
  data.append("func", "getScheduledAppointmentsByFamily");
  fetch("php/controllers.php", {
    method: "POST",
    body: data,
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        console.log(response);
        Swal.fire(
          "Error",
          "Ocurrió un error al intentar conectarse a la base de datos :[",
          "error"
        );
        throw new "Error en la llamada Ajax"();
      }
    })
    .then(function (data) {
      console.log(data);
      if (data.length > 0) {
        var html = "";
        data.forEach(function (appointment, index) {
          if (
            appointment.confirmed_appointment == "0" ||
            !appointment.confirmed_appointment
          ) {
            appointmentsListConfirm.push(appointment.confirmed_appointment_id);
          }
        });

        if (appointmentsListConfirm.length <= 0) {
          //btnConfirmPendingAppointments.disabled = true;
        }

        console.log(appointmentsListConfirm);
        createCardAppt(data);
        //let infoSchedule = createCardAppt(data);
        //document.getElementById('divScheduledAppointments').innerHTML = infoSchedule;
      } else {
        //btnConfirmPendingAppointments.disabled = true;
        document.getElementById("divScheduledAppointments").innerHTML =
          '<h3 class="noAppointments">Aún no tiene citas agendadas</h3>';
      }
    });
  /*.catch(function(err) {
            Swal.fire('Atención!', 'Ocurrió un error al intentar guardar su comentario, intento nuevamente porfavor', 'info');
            console.log(err);
        })*/
}

async function getScheduledDays() {
  const data = new FormData();
  data.append("func", "getScheduledDaysByFamily");
  var schDys = await fetch("php/controllers.php", {
    method: "POST",
    body: data,
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        console.log(response);
        Swal.fire(
          "Error",
          "Ocurrió un error al intentar conectarse a la base de datos :[",
          "error"
        );
        throw new "Error en la llamada Ajax"();
      }
    })
    .then(function (data) {
      console.log(data);
      if (data.length > 0) {
        var html = "";
        data.forEach(function (appointment, index) {
          console.log(appointment);
          const dateArray = appointment.appointment_date.split("-");
          var date = dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];

          html += ' <div class="card">';
          html +=
            '<div class="card-header" id="headingAppt' +
            appointment.appointment_date +
            '">';
          html += '    <h2 class="mb-0">';
          html +=
            '        <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseAppt' +
            appointment.appointment_date +
            '" aria-expanded="true" aria-controls="collapseAppt' +
            appointment.appointment_date +
            '">';
          html +=
            '        <h3 class="h4 card-title" style="color:black !important"><i class="fa fa-caret-down"></i>  Citas agendadas: ' +
            date +
            "</h3>";
          html += "        </button>";
          html += "    </h2>";
          html += "</div>";
          html +=
            '<div id="collapseAppt' +
            appointment.appointment_date +
            '" class="collapse" aria-labelledby="headingAppt' +
            appointment.appointment_date +
            '" data-parent="#accordionAppoinments">';
          html += '    <div class="card-body">';
          html += "    </div>";
          html += "</div>";
          html += "</div>";
        });
        $("#accordionAppoinments").html(html);
        getScheduledAppointments();
        //getScheduledAppointments();
      } else {
        //btnConfirmPendingAppointments.disabled = true;
        $('#accordionAppoinments').append('<div class="card"><div class="card-body"><h3 class="noAppointments">Aún no tiene citas agendadas</h3></div></div>');
      }
    });
  /*.catch(function(err) {
            Swal.fire('Atención!', 'Ocurrió un error al intentar guardar su comentario, intento nuevamente porfavor', 'info');
            console.log(err);
        })*/
  
}

function removeReservation(confirmed_appointment_id, student) {
  Swal.fire({
    title: "Atención!",
    text: `Cancelará la reservación del alumno ${student}, ¿desea continuar?`,
    type: "info",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.value) {
      removeReservationDB(confirmed_appointment_id);
    }
  });
}

function removeReservationDB(confirmed_appointment_id) {
  const data = new FormData();
  data.append("func", "removeReservationGroup");
  data.append("confirmed_appointment_id", confirmed_appointment_id);

  fetch("php/controllers.php", {
    method: "POST",
    body: data,
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        console.log(response);
        Swal.fire(
          "Error",
          "Ocurrió un error al intentar conectarse a la base de datos :[",
          "error"
        );
        throw new "Error en la llamada Ajax"();
      }
    })
    .then(function (data) {
      if (data.response) {
        let indexA = appointmentsListConfirm.indexOf(confirmed_appointment_id);
        appointmentsListConfirm.splice(indexA, 1);
        Swal.fire(
          "Listo!",
          "Se ha cancelado su reservación con éxito!",
          "success"
        ).then((result) => {
          loading();
          location.reload();
        });

       /*  let divAppt = document.querySelector(
          `.cardAppt${confirmed_appointment_id}`
        );
        divAppt.style.opacity = 1;
        (function fade() {
          if ((divAppt.style.opacity -= 0.05) < 0) {
            divAppt.parentNode.removeChild(divAppt);

            console.log(appointmentsListConfirm);
            
            const cardsPendingAppointments = $(".unconfirmedAppt");
              console.log(cardsPendingAppointments);
              if (cardsPendingAppointments.length == 0) {
                $('#accordionAppoinments').html('<div class="card"><div class="card-body"><h3 class="noAppointments">Aún no tiene citas agendadas</h3></div></div>');
              }else{
                getScheduledDays();
              }
            
          } else {
            requestAnimationFrame(fade);
          }
        })(); */
       
      } else {
        Swal.fire(
          "Atención!",
          "Ocurrió un error al intentar cancelar su reservación, inténtelo nuevamente por favor",
          "info"
        );
      }
    });
  /*.catch(function(err) {
            Swal.fire('Atención!', 'Ocurrió un error al intentar guardar su comentario, intento nuevamente porfavor', 'info');
            console.log(err);
        })*/
}

function confirmPendingAppointments() {
  Swal.fire({
    title: "Atención!",
    text: `Se confirmarán todas las reservaciones pendientes, una vez realizado esto ya no podrá editar ninguna, ¿desea continuar?`,
    type: "info",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.value) {
      confirmPendingAppointmentsDB();
      btnConfirmPendingAppointments.disabled = true;
    }
  });
}

function confirmPendingAppointmentsDB() {
  const data = new FormData();
  data.append("func", "confirmPendingAppointments");
  data.append(
    "appointmentsListConfirm",
    JSON.stringify(appointmentsListConfirm)
  );

  fetch("php/controllers.php", {
    method: "POST",
    body: data,
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        console.log(response);
        Swal.fire(
          "Error",
          "Ocurrió un error al intentar conectarse a la base de datos :[",
          "error"
        );
        throw new "Error en la llamada Ajax"();
      }
    })
    .then(function (data) {
      if (data.response) {
        Swal.fire(
          "Listo!",
          "Se han confirmado todas las reservaciones pendientes",
          "success"
        );
        const cardsPendingAppointments =
          document.querySelectorAll(".unconfirmedAppt");
        cardsPendingAppointments.forEach(function (card, index) {
          card.querySelector(".container-fluid").classList.add("bg-success");
          card.querySelector(".divBtnTrash").innerHTML = "";
          card.classList.remove("unconfirmedAppt");
        });
        btnConfirmPendingAppointments.disabled = true;
      } else {
        Swal.fire(
          "Atención!",
          "Ocurrió un error al intentar confirmar sus reservaciones, inténtelo nuevamente por favor",
          "info"
        );
      }
    });
  /*.catch(function(err) {
            Swal.fire('Atención!', 'Ocurrió un error al intentar guardar su comentario, intento nuevamente porfavor', 'info');
            console.log(err);
        })*/
}

function createCardAppt(arrAppt) {
  arrAppt.forEach(function (appointment, index) {
    let infoSchedule = "";

    let btnTrash = "";
    let classHeader = "bg-success";

    if (
      appointment.confirmed_appointment == "0" ||
      !appointment.confirmed_appointment
    ) {
      btnTrash = `<button class="btn btn-danger" onclick="removeReservation(${appointment.confirmed_appointment_id}, '${appointment.student_name}')"><i class="fa fa-trash"></i></button>`;
      classHeader = "";
    }
    btnTrash = `<button class="btn btn-danger" title="Cancelar cita" onclick="removeReservation(${appointment.confirmed_appointment_id}, '${appointment.student_name}')"><i class="fa fa-ban"></i></button>`;

    infoSchedule += `<div class="card bg-success cardAppt${appointment.confirmed_appointment_id} unconfirmedAppt">`;
    infoSchedule += `<div class="card-header container-fluid ${classHeader}">`;
    infoSchedule += '<div class="row">';
    infoSchedule += '<div class="col-md-8">';
    infoSchedule += `${appointment.student_name} / ${appointment.student_code}`;
    infoSchedule += "</div>";
    infoSchedule += '<div class="col-md-4 float-right divBtnTrash">';
    infoSchedule += btnTrash;
    infoSchedule += "</div>";
    infoSchedule += "</div>";
    infoSchedule += "</div>";
    //--- --- ---//
    infoSchedule += '<div class="card-body p-0">';
    infoSchedule += '<ul class="list-group">';
    infoSchedule += `<li class="list-group-item"><b><u>${appointment.appointment_start_time}</u></b> / ${appointment.group_code}</li>`;
    infoSchedule += `<li class="list-group-item">${appointment.centro_costos}</li>`;
    infoSchedule += "</ul>";
    infoSchedule += "</div>";
    infoSchedule += "</div> <br><br>";
    console.log(appointment.appointment_date);
    
    $("#collapseAppt" + appointment.appointment_date).children('.card-body').append(infoSchedule);
    
  });
}

function loading() {
    Swal.fire({
      title: "Cargando...",
      html: '<img src="images/loading_pen.gif" width="300" height="175">',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
    });
  }