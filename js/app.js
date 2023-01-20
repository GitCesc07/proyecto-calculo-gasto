// Variables y selectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");


// Eventos
eventListeners()

function eventListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);

  formulario.addEventListener("submit", agregarGasto);
}

// Clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter(gasto => gasto.id !== id);

    console.log(this.gastos);
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    // extrayendo los valores
    const { presupuesto, restante } = cantidad;

    // agregando al HTMl 
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");

    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    }
    else {
      divMensaje.classList.add("alert-success");
    }

    // Mensaje de error
    divMensaje.textContent = mensaje;

    // insertar en el HTML
    document.querySelector(".primario").insertBefore(divMensaje, formulario);

    // Quitar mensaje dl HTML
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  mostrarGastos(gastos) {

    // Elimina el HTML previo
    this.limpiarHTML();


    // Iterar sobre los gastos
    gastos.forEach(gasto => {
      const { cantidad, nombre, id } = gasto;

      // Crear un li, Lista donde estarán ordenadas
      const nuevoGasto = document.createElement("li");
      nuevoGasto.className = "list-group-item d-flex justify-content-between align-items-center";
      nuevoGasto.dataset.id = id;

      // Agregar el HTML del gasto
      nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$${cantidad}</span>`;

      // Boton para borar el gasto
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.innerHTML = "Borrar &times;";

      btnBorrar.onclick = () => {
        eliminarGasto(id);
      }
      nuevoGasto.appendChild(btnBorrar);

      // Agregar al HTML
      gastoListado.appendChild(nuevoGasto);
    });
  }

  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto(presupuestoObjt) {
    const { presupuesto, restante } = presupuestoObjt;

    const restanteDiv = document.querySelector(".restante")
    // Comprobar el 25%
    if ((presupuesto / 4) > restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning")
      restanteDiv.classList.add("alert-danger");
    }
    else if ((presupuesto / 2) > restante) {
      restanteDiv.classList.remove("alert-success")
      restanteDiv.classList.add("alert-warning");
    }


    // Si el total es menor a 0
    if (restante <= 0) {
      ui.imprimirAlerta("El presupesto se ha agotado", "error");
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

// Instanciar
const ui = new UI();

let presupuesto;

// Funciones
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("¿Cual es tu presupuesto?");

  // console.log(parseFloat(presupuestoUsuario));
  if (presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
    window.location.reload();
  }

  // Presupuesto valido
  presupuesto = new Presupuesto(presupuestoUsuario);
  console.log(presupuesto);

  ui.insertarPresupuesto(presupuesto);
}


// Añade el gasto
function agregarGasto(e) {
  e.preventDefault();

  // Leer los datos del formulario
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  // validar
  if (nombre === "" || cantidad === "") {
    ui.imprimirAlerta("Ambos campos son obligatorios", "error");
    return;
  }
  else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad no valida", "error");
    return;
  }


  // Generar un objeto con el gasto
  const gasto = { nombre, cantidad, id: Date.now() };

  // Añade un nuevo gasto
  presupuesto.nuevoGasto(gasto);

  // Mensaje para decir que todo esta correcto
  ui.imprimirAlerta("Gasto agregado correctamente");

  // imprimir los gastos
  const { gastos, restante } = presupuesto;
  ui.mostrarGastos(gastos);

  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);

  // Reiniciar el formulario
  formulario.reset();
}

function eliminarGasto(id) {
  // Elimina del objeto
  presupuesto.eliminarGasto(id);

  // Elimina los gastos del HTML
  const { gastos } = presupuesto;
  ui.mostrarGastos(gastos);
}