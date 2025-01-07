const slctBillingTypes = document.querySelector("#slct-billing-types");
const slctStates = document.querySelector("#slct-state");
const slctMunicipality = document.querySelector("#slct-municipality");
const slctCFDIUse = document.querySelector("#cfdi_use");
const currentAddress = document.getElementById("switchCurrentAddress");

let formFields = document.querySelectorAll(
  "#rfc, #bussiness_name, #street, #between_streets, #ext_num, #int_num, #colony, #slct-municipality, #slct-state, #zip_code, #tax_reg, #cfdi_use, #tax_object"
);

slctBillingTypes.addEventListener("change", getFamilyBillingData);
slctStates.addEventListener("change", getMunicipalitiesByState);
document
  .querySelector("#save-billing-data")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Evitar que la página se recargue

    // Llamar a la función saveBillingData
    saveBillingData();
  });

// Función para mostrar un mensaje de carga
function showLoading(message = "Cargando...") {
  Swal.fire({
    title: message,
    html: '<img src="images/loading_pen.gif" width="300" height="175">',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showCloseButton: false,
    showCancelButton: false,
    showConfirmButton: false,
  });
}

// Función para activar/desactivar campos del formulario
function toggleFormFields(isEnabled) {
  formFields.forEach((field) => {
    field.disabled = !isEnabled;
  });
}

// Función para actualizar los campos del formulario con datos
function updateFormFields(data = {}) {
  console.log(data);
  document.querySelector("#rfc").value = data.rfc || "";
  document.querySelector("#bussiness_name").value = data.business_name || "";
  document.querySelector("#street").value = data.street || "";
  document.querySelector("#between_streets").value = data.between_streets || "";
  document.querySelector("#ext_num").value = data.ext_number || "";
  document.querySelector("#int_num").value = data.int_number || "";
  document.querySelector("#colony").value = data.colony || "";
  document.querySelector("#zip_code").value = data.postal_code || "";
  document.querySelector("#tax_reg").value = data.id_tax_regimes || "";
  document.querySelector("#mail").value = data.mail || "";
  slctCFDIUse.value = data.id_cfdi_uses || "";
}

// Función para cargar los tipos de facturación
async function getBillingTypes() {
  try {
    showLoading("Cargando tipos de facturación...");
    const data = new FormData();
    data.append("func", "getBillingTypes");

    const response = await fetch("php/controllers.php", {
      method: "POST",
      body: data,
    });

    if (!response.ok)
      throw new Error("Error al obtener los tipos de facturación");

    const result = await response.json();
    if (Array.isArray(result) && result.length > 0) {
      const fragment = document.createDocumentFragment();
      result.forEach(({ id_billing_types, billing_type_description }) => {
        const opt = document.createElement("option");
        opt.value = id_billing_types;
        opt.textContent = billing_type_description.toUpperCase();
        fragment.appendChild(opt);
      });
      slctBillingTypes.appendChild(fragment);
      await getCurrentBillingType();
    } else {
      Swal.fire("Atención!", "No se encontraron tipos de facturación.", "info");
    }
  } catch (err) {
    Swal.fire(
      "Error",
      "Ocurrió un problema al cargar los tipos de facturación.",
      "error"
    );
    console.error(err);
  } finally {
    Swal.close();
  }
}

// Función para obtener el tipo de facturación actual
async function getCurrentBillingType() {
  try {
    showLoading("Cargando tipo de facturación actual...");
    const data = new FormData();
    data.append("func", "getCurrentBillingType");

    const response = await fetch("php/controllers.php", {
      method: "POST",
      body: data,
    });

    if (!response.ok)
      throw new Error("Error al obtener el tipo de facturación actual");

    const result = await response.json();
    const id_billing_types = result.length > 0 ? result[0].id_billing_types : 1;
    result.length > 0
      ? (currentAddress.checked = false)
      : (currentAddress.checked = true);
    slctBillingTypes.value = id_billing_types;
    slctBillingTypes.dispatchEvent(new Event("change"));
  } catch (err) {
    Swal.fire(
      "Error",
      "Ocurrió un problema al cargar el tipo de facturación actual.",
      "error"
    );
    console.error(err);
  } finally {
    Swal.close();
  }
}

// Función para cargar los datos de facturación
async function getFamilyBillingData() {
  const idBillingType = slctBillingTypes.value;

  if (idBillingType == 1) {
    toggleFormFields(false);
    updateFormFields({
      rfc: "XAXX010101000",
      business_name: "PUBLICO GENERAL",
      street: "LAFONTAINE",
      colony: "Polanco",
      postal_code: "11550",
      id_tax_regimes: 13,
      cfdi_use: 3,
    });
    slctStates.value = 9;
    slctCFDIUse.value = 3;
    await getMunicipalitiesByState();
    slctMunicipality.value = "Miguel Hidalgo";
    slctMunicipality.disabled = true;

    try {
      showLoading("Cargando datos de facturación...");
      const data = new FormData();
      data.append("func", "getFamilyBillingData");
      data.append("id_billing_type", idBillingType);

      const response = await fetch("php/controllers.php", {
        method: "POST",
        body: data,
      });

      if (!response.ok)
        throw new Error("Error al obtener los datos de facturación");

      const result = await response.json();

      if (Array.isArray(result) && result.length > 0) {
        console.log(result);
        result[0].current_address == 1
          ? (currentAddress.checked = true)
          : (currentAddress.checked = false);
        updateFormFields(result[0]);
        slctStates.value = 9;
        await getMunicipalitiesByState();
        slctMunicipality.value = result[0].delegation || "";
        toggleFormFields(false);
      } else {
        toggleFormFields(false);
        updateFormFields(); // Vaciar campos
      }
    } catch (err) {
    } finally {
      Swal.close();
    }
  } else {
    try {
      showLoading("Cargando datos de facturación...");
      const data = new FormData();
      data.append("func", "getFamilyBillingData");
      data.append("id_billing_type", idBillingType);

      const response = await fetch("php/controllers.php", {
        method: "POST",
        body: data,
      });

      if (!response.ok)
        throw new Error("Error al obtener los datos de facturación");

      const result = await response.json();

      if (Array.isArray(result) && result.length > 0) {
        console.log(result);
        result[0].current_address == 1
          ? (currentAddress.checked = true)
          : (currentAddress.checked = false);
        updateFormFields(result[0]);
        slctStates.value = 9;
        await getMunicipalitiesByState();
        slctMunicipality.value = result[0].delegation || "";
        toggleFormFields(true);
      } else {
        toggleFormFields(true);
        updateFormFields(); // Vaciar campos
      }
    } catch (err) {
      Swal.fire(
        "Error",
        "Ocurrió un problema al cargar los datos de facturación.",
        "error"
      );
      console.error(err);
    } finally {
      Swal.close();
    }
  }
}

// Función para cargar los municipios por estado
async function getMunicipalitiesByState() {
  try {
    const idState = slctStates.value;
    const data = new FormData();
    data.append("func", "getMunicipalitiesByState");
    data.append("id_state", idState);

    slctMunicipality.innerHTML =
      '<option value="" selected disabled>Seleccione una opción</option>';

    const response = await fetch("php/controllers.php", {
      method: "POST",
      body: data,
    });

    if (!response.ok) throw new Error("Error al obtener los municipios");

    const result = await response.json();

    if (Array.isArray(result) && result.length > 0) {
      const fragment = document.createDocumentFragment();
      result.forEach(({ municipio }) => {
        const opt = document.createElement("option");
        opt.value = municipio;
        opt.textContent = municipio;
        fragment.appendChild(opt);
      });
      slctMunicipality.appendChild(fragment);
      slctMunicipality.disabled = false;
    } else {
      Swal.fire("Atención!", "No se encontraron municipios.", "info");
    }
  } catch (err) {
    Swal.fire(
      "Error",
      "Ocurrió un problema al cargar los municipios.",
      "error"
    );
    console.error(err);
  }
}

// Función para guardar los datos en la base de datos
async function saveBillingData() {
  formFields = document.querySelectorAll(
    "#rfc, #bussiness_name, #street, #between_streets, #ext_num, #int_num, #colony, #slct-municipality, #slct-state, #zip_code, #tax_reg, #cfdi_use, #tax_object", "#mail"
  );
  try {
    // Validar que los campos obligatorios estén llenos
    const invalidFields = [];
    formFields.forEach((field) => {
      if (
        !field.classList.contains("optional-input") && // No es opcional
        !field.value.trim() // Está vacío
      ) {
        invalidFields.push(field); // Agregar a la lista de campos inválidos
      }
    });

    if (invalidFields.length > 0) {
      invalidFields.forEach((field) => {
        field.classList.add("is-invalid"); // Marcar el error visualmente
      });

      Swal.fire(
        "Atención",
        "Todos los campos obligatorios deben ser llenados antes de continuar.",
        "warning"
      );
      return;
    }

    // Preparar los datos para guardar
    const billingData = {
      idBillingType: slctBillingTypes.value,
      rfc: document.querySelector("#rfc").value.trim(),
      business_name: document.querySelector("#bussiness_name").value.trim(),
      street: document.querySelector("#street").value.trim(),
      between_streets: document.querySelector("#between_streets").value.trim(),
      ext_number: document.querySelector("#ext_num").value.trim(),
      int_number: document.querySelector("#int_num").value.trim(),
      colony: document.querySelector("#colony").value.trim(),
      postal_code: document.querySelector("#zip_code").value.trim(),
      state: slctStates.options[slctStates.selectedIndex].text,
      municipality:
        slctMunicipality.options[slctMunicipality.selectedIndex].text,
      tax_regime: document.querySelector("#tax_reg").value,
      mail: document.querySelector("#mail").value.trim(),
      cfdi_use: slctCFDIUse.value, // Nuevo campo
      currentAddress: document.querySelector("#switchCurrentAddress").checked
        ? 1
        : 0, // Verificación del checkbox
    };
    console.log(billingData);

    showLoading("Guardando datos...");
    const data = new FormData();
    data.append("func", "saveBillingData");
    for (const key in billingData) {
      data.append(key, billingData[key]);
    }

    const response = await fetch("php/controllers.php", {
      method: "POST",
      body: data,
    });

    if (!response.ok) throw new Error("Error al guardar los datos");

    const result = await response.json();
    if (result.success) {
      Swal.fire(
        "Éxito",
        "Los datos de facturación se guardaron correctamente.",
        "success"
      );
      // Quitar clases de error si se guarda con éxito
      formFields.forEach((field) => field.classList.remove("is-invalid"));
    } else {
      Swal.fire(
        "Error",
        "No se pudieron guardar los datos. Intenta nuevamente.",
        "error"
      );
    }
  } catch (err) {
    Swal.fire("Error", "Ocurrió un problema al guardar los datos.", "error");
    console.error(err);
  } finally {
    /* Swal.close(); */
  }
}

// Inicialmente desactivar los campos del formulario
toggleFormFields(false);

// Cargar los tipos de facturación al cargar la página
getBillingTypes();
