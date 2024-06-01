//Variables
const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

//UI
const formulario = document.querySelector("#nueva-cita");
const contenedorCitas = document.querySelector("#citas");

let editando;

class Citas {
  constructor() {
    this.citas = [];
  }

  agregarCitas(cita) {
    this.citas = [...this.citas, cita];
  }

  eliminarCita(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
  }

  editarCita(citaActualizada) {
    this.citas = this.citas.map((cita) =>
      cita.id == citaActualizada.id ? citaActualizada : cita
    );
  }
}

class UI {
  imprimirAlerta(mensaje, tipo) {
    //crear el div
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

    //Agregar clase en base al tipo de error
    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    //mensaje de error
    divMensaje.textContent = mensaje;

    //agregar al Doom
    document
      .querySelector("#contenido")
      .insertBefore(divMensaje, document.querySelector(".agregar-cita"));

    //Quitar alerta luego de 5 segundos
    setTimeout(() => {
      divMensaje.remove();
    }, 5000);
  }

  imprimirCitas({ citas }) {
    this.limpiarHTML();

    citas.forEach((cita) => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } =
        cita;

      const divCita = document.createElement("div");
      divCita.classList.add("cita", "p-3");
      divCita.dataset.id = id;

      //Scripting de los elementos de la cita

      const mascotaParrafo = document.createElement("h2");
      mascotaParrafo.classList.add("card-title", "font-weight-bolder");
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement("p");
      propietarioParrafo.innerHTML = `
                <span class= 'font-weight-bolder'>Propietario: </span> ${propietario}
            `;

      const telefonoParrafo = document.createElement("p");
      telefonoParrafo.innerHTML = `
                <span class= 'font-weight-bolder'>Telefono: </span> ${telefono}
            `;

      const fechaParrafo = document.createElement("p");
      fechaParrafo.innerHTML = `
                <span class= 'font-weight-bolder'>Fecha: </span> ${fecha}
            `;

      const horaParrafo = document.createElement("p");
      horaParrafo.innerHTML = `
                <span class= 'font-weight-bolder'>Hora: </span> ${hora}
            `;

      const sintomasParrafo = document.createElement("p");
      sintomasParrafo.innerHTML = `
                <span class= 'font-weight-bolder'>Sintomas: </span> ${sintomas}
            `;

      //Boton para eliminar citas
      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("btn", "btn-danger", "mr-2");
      btnEliminar.innerHTML =
        'Eliminar Cita <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>';

      btnEliminar.onclick = () => eliminarCita(id);

      //boton para editar la cita
      const btnEditar = document.createElement("button");
      btnEditar.classList.add("btn", "btn-info");
      btnEditar.innerHTML =
        'Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>';

      btnEditar.onclick = () => cargarEdicion(cita);

      //Agregar los parrafos
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      //agregar las citas al Html
      contenedorCitas.appendChild(divCita);
    });
  }

  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}

const ui = new UI();
const adminCitas = new Citas();

//Registrar Eventos
eventListener();
function eventListener() {
  mascotaInput.addEventListener("change", datosCita);
  propietarioInput.addEventListener("change", datosCita);
  telefonoInput.addEventListener("change", datosCita);
  fechaInput.addEventListener("change", datosCita);
  horaInput.addEventListener("change", datosCita);
  sintomasInput.addEventListener("change", datosCita);

  formulario.addEventListener("submit", nuevaCita);
}

//Objeto con informacion de la cita
const citaObj = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

//Agrega datos objetos de Citas
function datosCita(e) {
  citaObj[e.target.name] = e.target.value;
}

//Agrega y valida una nueva cita a la clase de Citas
function nuevaCita(e) {
  e.preventDefault();

  //extraer la informacion de el objeto de citas
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  //validar
  if (
    mascota === "" ||
    propietario === "" ||
    telefono === "" ||
    fecha === "" ||
    hora === "" ||
    sintomas === ""
  ) {
    ui.imprimirAlerta("Todos los campos son Obligatorios", "error");
    return;
  }

  if (editando) {
    ui.imprimirAlerta("Editado Correctamente");

    //pasar el objeto de la cita a edicion
    adminCitas.editarCita({ ...citaObj });

    // regresar el texto al boton
    formulario.querySelector("button[type=submit]").textContent = "Crear Cita";

    //Quitando  el modo edicion
    editando = false;
  } else {
    //generar un Id Unico
    citaObj.id = Date.now();

    //Creando una nueva Cita
    adminCitas.agregarCitas({ ...citaObj });

    //mensaje de agregado correctamente
    ui.imprimirAlerta("Se Agrego Correctamente");
  }

  //reiniciar el objeto para validarlo
  reiniciarObj();

  //reiniciamos el formulario
  formulario.reset();

  //mostrar el HTML
  ui.imprimirCitas(adminCitas);
}

function reiniciarObj() {
  citaObj.mascota = "";
  citaObj.propietario = "";
  citaObj.telefono = "";
  citaObj.fecha = "";
  citaObj.hora = "";
  citaObj.sintomas = "";
}

function eliminarCita(id) {
  //eliminar citas
  adminCitas.eliminarCita(id);

  //muestre un mensaje al eliminar
  ui.imprimirAlerta("La cita se elimino correctamente");

  //refresque la lista de citas
  ui.imprimirCitas(adminCitas);
}

//carga los datos y el modo edicion
function cargarEdicion(cita) {
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

  //llenar los inputs
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  //llenar el objeto
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  //cambiar texto del boton
  formulario.querySelector("button[type=submit]").textContent =
    "Guardar Cambios";

  editando = true;
}
