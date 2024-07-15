//  Primer Parcial Laboratorio 3.

const cadenaJSON = '[{"id":1,"apellido":"Serrano","nombre":"Horacio","fechaNacimiento":19840103,"dni":45876942},{"id":2,"apellido":"Casas","nombre":"Julian","fechaNacimiento":19990723,"dni":98536214},{"id":3,"apellido":"Galeano","nombre":"Julieta","fechaNacimiento":20081103,"dni":74859612},{"id":4,"apellido":"Molina","nombre":"Juana","fechaNacimiento":19681201,"paisOrigen":"Paraguay"},{"id":5,"apellido":"Barrichello","nombre":"Rubens","fechaNacimiento":19720523,"paisOrigen":"Brazil"},{"id":6,"apellido":"Hkkinen","nombre":"Mika","fechaNacimiento":19680928,"paisOrigen":"Finlandia"}]'

const datos = JSON.parse(cadenaJSON);

class Persona {
    constructor(id, nombre, apellido, fechaNacimiento) {
        if (id === null || nombre === null || apellido === null || fechaNacimiento === null) {
            throw new Error("Los campos no pueden ser nulos");
        }

        if (!this.validarFechaEntero(fechaNacimiento)) {
            throw new Error("La fecha de nacimiento no está en el rango válido (1900 - 2024)");
        }

        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
    }

    toString() {
        const formattedDate = this.formatFechaNacimiento();
        return `ID: ${this.id}, Nombre: ${this.nombre}, Apellido: ${this.apellido}, Fecha de Nacimiento: ${formattedDate}`;
    }

    formatFechaNacimiento() {
        const fechaStr = this.fechaNacimiento.toString();
        const año = fechaStr.substring(0, 4);
        const mes = fechaStr.substring(4, 6);
        const dia = fechaStr.substring(6, 8);
        return `${dia}/${mes}/${año}`;
    }

    validarFechaEntero(fecha) {
        const fechaStr = fecha.toString();
        if (fechaStr.length !== 8) {
            return false;
        }

        const añoStr = fechaStr.substring(0, 4);
        const año = parseInt(añoStr);

        return año >= 1900 && año <= 2024;
    }
}

class Ciudadano extends Persona {
    constructor(id, nombre, apellido, fechaNacimiento, dni) {
        super(id, nombre, apellido, fechaNacimiento);
        if (dni <= 0) {
            throw new Error("El DNI debe ser mayor a 0");
        }
        this.dni = dni;
    }

    toString() {
        return `${super.toString()}, DNI: ${this.dni}`;
    }
}

class Extranjero extends Persona {
    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen) {
        super(id, nombre, apellido, fechaNacimiento);
        if (paisOrigen === null) {
            throw new Error("Debe seleccionar un país de origen.");
        }
        this.paisOrigen = paisOrigen;
    }

    toString() {
        return `${super.toString()}, País de Origen: ${this.paisOrigen}`;
    }
}


function generarArrayObjetos(datos) {
    const arrayObjetos = [];
    datos.forEach(dato => {
        if ("dni" in dato) {
            arrayObjetos.push(new Ciudadano(dato.id, dato.nombre, dato.apellido, dato.fechaNacimiento, dato.dni));
        } else if ("paisOrigen" in dato) {
            arrayObjetos.push(new Extranjero(dato.id, dato.nombre, dato.apellido, dato.fechaNacimiento, dato.paisOrigen));
        } else {
            arrayObjetos.push(new Persona(dato.id, dato.nombre, dato.apellido, dato.fechaNacimiento));
        }
    });
    return arrayObjetos;
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const fechaNacimientoStr = fechaNacimiento.toString();
    const añoNacimiento = parseInt(fechaNacimientoStr.substring(0, 4));
    const edad = hoy.getFullYear() - añoNacimiento;
    return edad;
}

const arrayPersonas = generarArrayObjetos(datos);

let tipoFiltroSeleccionado = document.getElementById("filtroTipo").value;
filtrarPorTipo(document.getElementById("filtroTipo").value);

function generarTabla(arrayPersonas) {
    const cuerpoTabla = document.getElementById("cuerpoTabla");
    cuerpoTabla.innerHTML = "";

    const chkId = document.getElementById("chkId");
    const chkNombre = document.getElementById("chkNombre");
    const chkApellido = document.getElementById("chkApellido");
    const chkEdad = document.getElementById("chkEdad");
    const chkDni = document.getElementById("chkDNI");
    const chkPaisOrigen = document.getElementById("chkPaisOrigen");
    chkId.disabled = true;

    arrayPersonas.forEach(persona => {
        const row = document.createElement("tr");

        agregarCelda(chkId, persona.id, row, "thId");
        agregarCelda(chkNombre, persona.nombre, row, "thNombre");
        agregarCelda(chkApellido, persona.apellido, row, "thApellido");
        agregarCelda(chkEdad, calcularEdad(persona.fechaNacimiento), row, "thEdad");

        if (persona instanceof Ciudadano) {
            agregarCelda(chkDni, persona.dni, row, "thDNI");
            agregarCelda(chkPaisOrigen, '---', row, "thPaisOrigen");
        } else if (persona instanceof Extranjero) {
            agregarCelda(chkDni, '---', row, "thDNI");
            agregarCelda(chkPaisOrigen, persona.paisOrigen, row, "thPaisOrigen");
        } else {
            agregarCelda(chkDni, '---', row, "thDNI");
            agregarCelda(chkPaisOrigen, '---', row, "thPaisOrigen");
        }

        cuerpoTabla.appendChild(row);

        row.addEventListener("click", function () {
            const filasTabla = document.querySelectorAll("#tablaDatos tbody tr");
            filasTabla.forEach(f => {
                f.classList.remove("selected-row");
            });
            this.classList.add("selected-row");
        });
    });

    ocultarMostrarColumna(chkId, "thId");
    ocultarMostrarColumna(chkNombre, "thNombre");
    ocultarMostrarColumna(chkApellido, "thApellido");
    ocultarMostrarColumna(chkEdad, "thEdad");
    ocultarMostrarColumna(chkDni, "thDNI");
    ocultarMostrarColumna(chkPaisOrigen, "thPaisOrigen");
}

function agregarCelda(checkbox, contenido, row, columnIndex) {
    if (checkbox.checked) {
        const cell = document.createElement("th");
        cell.textContent = contenido !== undefined ? contenido : '---';
        cell.setAttribute("data-index", columnIndex);
        row.appendChild(cell);
    }
}

document.getElementById("filtroTipo").addEventListener("change", function () {
    tipoFiltroSeleccionado = this.value;
    filtrarPorTipo(tipoFiltroSeleccionado);
});

function ocultarMostrarColumna(checkbox, thId) {
    const th = document.getElementById(thId);
    if (!checkbox.checked) {
        th.style.display = "none";
    } else {
        th.style.display = "table-cell";
    }
}

const checkboxes = ["chkId", "chkNombre", "chkApellido", "chkEdad", "chkDNI", "chkPaisOrigen"];

var visibleColumnIndexes = [0, 1, 2, 3, 4, 5];

function manejarCambiosCheckboxes() {

    visibleColumnIndexes = [];

    checkboxes.forEach((id, index) => {
        const checkbox = document.getElementById(id);
        if (checkbox.checked) {
            visibleColumnIndexes.push(index);
        }
    });

    let arrayFiltrado = [];
    if (tipoFiltroSeleccionado === "Persona") {
        arrayFiltrado = arrayPersonas;
    } else if (tipoFiltroSeleccionado === "Ciudadano") {
        arrayFiltrado = arrayPersonas.filter(persona => persona instanceof Ciudadano);
    } else if (tipoFiltroSeleccionado === "Extranjero") {
        arrayFiltrado = arrayPersonas.filter(persona => persona instanceof Extranjero);
    }

    generarTabla(arrayFiltrado);
}

checkboxes.forEach(id => {
    document.getElementById(id).addEventListener("change", manejarCambiosCheckboxes);
});

function filtrarPorTipo(tipo) {
    const cuerpoTabla = document.getElementById("cuerpoTabla");
    cuerpoTabla.innerHTML = "";

    let arrayFiltrado = [];
    if (tipo === "Persona") {
        arrayFiltrado = arrayPersonas;
    } else if (tipo === "Ciudadano") {
        arrayFiltrado = arrayPersonas.filter(persona => persona instanceof Ciudadano);
    } else if (tipo === "Extranjero") {
        arrayFiltrado = arrayPersonas.filter(persona => persona instanceof Extranjero);
    }

    generarTabla(arrayFiltrado);
}

function calcularEdadPromedio() {
    const resultadoEdadPromedio = document.getElementById("calcularEdadPromedio");
    const personasFiltradas = arrayPersonas.filter(persona => {

        if (tipoFiltroSeleccionado === "Persona") {
            return true;
        } else if (tipoFiltroSeleccionado === "Ciudadano") {
            return persona instanceof Ciudadano;
        } else if (tipoFiltroSeleccionado === "Extranjero") {
            return persona instanceof Extranjero;
        }
    });

    const edades = personasFiltradas.map(persona => calcularEdad(persona.fechaNacimiento));
    if (edades.length > 0 && !edades.includes(NaN)) {
        const promedio = edades.reduce((acc, curr) => acc + curr, 0) / edades.length;
        resultadoEdadPromedio.textContent = `${promedio.toFixed(2)}`;
    } else {
        resultadoEdadPromedio.textContent = "No hay personas con fecha de nacimiento válida para calcular el promedio de edad.";
    }
}

function mostrarFormularioAgregar() {

    const camposExtras = document.getElementById("camposExtras");
    camposExtras.style.display = "none";
    document.getElementById("formAgregar").style.display = "block";
    document.querySelector(".recuadro").style.display = "none";

    limpiarCamposFormulario();
}

document.getElementById("nuevoTipo").addEventListener("change", function () {

    const tipoSeleccionado = this.value;
    const camposExtras = document.getElementById("camposExtras");
    camposExtras.innerHTML = "";

    if (tipoSeleccionado === "Ciudadano") {
        camposExtras.innerHTML = `
        <label for="nuevoDNI" id="labelDNI">DNI:</label>
        <input type="number" id="nuevoDNI"><br>
        `;
    } else if (tipoSeleccionado === "Extranjero") {
        camposExtras.innerHTML = `
        <label for="nuevoPaisOrigen" id="labelPaisOrigen">Pais de Origen:</label>
        <input type="text" id="nuevoPaisOrigen"><br>
        `;
    }

    camposExtras.style.display = "block";
});

const filasTabla = document.querySelectorAll("#tablaDatos tbody tr");

filasTabla.forEach(fila => {
    fila.addEventListener("click", function () {
        filasTabla.forEach(f => {
            f.classList.remove("selected-row");
        });
        this.classList.add("selected-row");
    });
});

function agregarPersona() {

    const tipoSeleccionado = document.getElementById("nuevoTipo").value;
    const nuevoId = arrayPersonas.length > 0 ? arrayPersonas[arrayPersonas.length - 1].id + 1 : 1;
    const nuevoNombre = document.getElementById("nuevoNombre").value;
    const nuevoApellido = document.getElementById("nuevoApellido").value;
    const nuevaFechaDeNacimiento = document.getElementById("nuevaFechaDeNacimiento").value;

    if (nuevoNombre && nuevoApellido && nuevaFechaDeNacimiento) {
        if (parseInt(nuevaFechaDeNacimiento) > 19000101) {

            let nuevaPersona;
            if (tipoSeleccionado === "Ciudadano") {
                const nuevoDNI = document.getElementById("nuevoDNI").value;
                if (!nuevoDNI || nuevoDNI <= 0) {
                    alert("el DNI debe ser mayor a 0.");
                    return;
                }
                nuevaPersona = new Ciudadano(nuevoId, nuevoNombre, nuevoApellido, parseInt(nuevaFechaDeNacimiento), parseInt(nuevoDNI));
            } else if (tipoSeleccionado === "Extranjero") {
                const nuevoPaisOrigen = document.getElementById("nuevoPaisOrigen").value;
                if (!nuevoPaisOrigen) {
                    alert("Por favor, complete todos los campos.");
                    return;
                }
                nuevaPersona = new Extranjero(nuevoId, nuevoNombre, nuevoApellido, parseInt(nuevaFechaDeNacimiento), nuevoPaisOrigen);
            }

            arrayPersonas.push(nuevaPersona);
            filtrarPorTipo(tipoFiltroSeleccionado);
            document.getElementById("formAgregar").style.display = "none";
            document.querySelector(".recuadro").style.display = "block";
        } else {
            alert("La fecha de nacimiento tiene que ser superior a 1900-01-01.");
        }
    } else {
        alert("Por favor, complete todos los campos.");
    }
}

function ocultarFormularioAgregar() {
    document.getElementById("formAgregar").style.display = "none";
    document.querySelector(".recuadro").style.display = "block";
}

const buttons = document.querySelectorAll(".orden-btn");
buttons.forEach(button => {
    button.addEventListener("click", function () {
        const columnIndex = parseInt(this.getAttribute('data-column'));
        const order = this.getAttribute('data-order');
        ordenarFilasPorColumna(columnIndex, order);
    });
});

function ordenarFilasPorColumna(columnIndex, order) {
    const tbody = document.getElementById("cuerpoTabla");
    const rows = Array.from(tbody.getElementsByTagName("tr"));
    const mappedRows = rows.map(row => {
        const visibleCells = Array.from(row.cells);
        const cellValue = visibleCells[columnIndex].textContent.trim() || "0";
        return {
            value: cellValue,
            row: row
        };
    });

    const sortedRows = mappedRows.sort((a, b) => {
        if (isNaN(a.value) || isNaN(b.value)) {
            return order === 'asc' ? a.value.localeCompare(b.value) : b.value.localeCompare(a.value);
        } else {
            return order === 'asc' ? parseInt(a.value) - parseInt(b.value) : parseInt(b.value) - parseInt(a.value);
        }
    });

    const sortedRowElements = sortedRows.map(item => item.row);

    tbody.innerHTML = '';
    sortedRowElements.forEach(row => tbody.appendChild(row));
}


function limpiarCamposFormulario() {
    document.getElementById("nuevoTipo").value = "Seleccione";
    document.getElementById("nuevoNombre").value = "";
    document.getElementById("nuevoApellido").value = "";
    document.getElementById("nuevaFechaDeNacimiento").value = "";
    document.getElementById("nuevoDNI").value = "";
    document.getElementById("nuevoPaisOrigen").value = "";
}

document.querySelector(".darDeBaja").addEventListener("click", function () {

    const filaSeleccionada = document.querySelector(".selected-row");

    if (filaSeleccionada) {

        const confirmacion = confirm("¿Estás seguro de que quieres dar de baja esta persona?");

        if (confirmacion) {

            const index = arrayPersonas.findIndex(persona => persona.id === parseInt(filaSeleccionada.cells[0].textContent));
            if (index !== -1) {
                arrayPersonas.splice(index, 1);
            } else {
                console.error("No se encontró la persona en el arrayPersonas.");
            }
            filaSeleccionada.remove();
            alert("La persona ha sido dada de baja.");
        }
    } else {
        alert("Por favor, selecciona una persona para dar de baja.");
    }

    filasTabla.forEach(fila => {
        fila.addEventListener("click", function () {
            filasTabla.forEach(f => {
                f.classList.remove("selected-row");
            });
            this.classList.add("selected-row");
        });
    });
});

function mostrarFormularioModificacion() {

    const filaSeleccionada = document.querySelector(".selected-row");
    document.getElementById("camposExtrasModificar").style.display = "block";

    if (filaSeleccionada) {

        const id = parseInt(filaSeleccionada.cells[0].textContent);

        const persona = arrayPersonas.find(persona => persona.id === id);

        if (persona) {
            document.getElementById("modificarId").textContent = id;
            document.getElementById("modificarNombre").value = persona.nombre;
            document.getElementById("modificarApellido").value = persona.apellido;
            document.getElementById("modificarFechaDeNacimiento").value = persona.fechaNacimiento;


            if (persona instanceof Ciudadano) {

                document.getElementById("modificarDNI").value = persona.dni;

                document.getElementById("labelDNIModificar").style.display = "block";
                document.getElementById("modificarDNI").style.display = "block";
                document.getElementById("labelPaisOrigenModificar").style.display = "none";
                document.getElementById("modificarPaisOrigen").style.display = "none";

            } else if (persona instanceof Extranjero) {

                document.getElementById("modificarPaisOrigen").value = persona.paisOrigen;

                document.getElementById("labelPaisOrigen").style.display = "block";
                document.getElementById("labelPaisOrigenModificar").style.display = "block";
                document.getElementById("labelDNIModificar").style.display = "none";
                document.getElementById("modificarDNI").style.display = "none";
            }

            document.getElementById("formModificar").style.display = "block";
            document.querySelector(".recuadro").style.display = "none";
        } else {
            alert("No se encontró la persona con el ID seleccionado.");
        }
    } else {
        alert("Por favor, selecciona una persona para modificar.");
    }
}

function modificarPersona() {

    const id = parseInt(document.getElementById("modificarId").textContent);
    const nombre = document.getElementById("modificarNombre");
    const apellido = document.getElementById("modificarApellido");
    const fechaDeNacimiento = document.getElementById("modificarFechaDeNacimiento");

    if (id && nombre && apellido && fechaDeNacimiento) {

        const nombreValue = nombre.value;
        const apellidoValue = apellido.value;
        const fechaDeNacimientoValue = fechaDeNacimiento.value;
        const dni = document.getElementById("modificarDNI").value;
        const paisOrigen = document.getElementById("modificarPaisOrigen").value;

        if (dni) {
            const ciudadanoModificado = new Ciudadano(id, nombreValue, apellidoValue, parseInt(fechaDeNacimientoValue), parseInt(dni));
            modificarEnArray(id, ciudadanoModificado);
        } else if (paisOrigen) {
            const extranjeroModificado = new Extranjero(id, nombreValue, apellidoValue, parseInt(edadValue), paisOrigen);
            modificarEnArray(id, extranjeroModificado);
        }

    } else {
        console.error("Alguno de los elementos no existe.");
    }

    filasTabla.forEach(fila => {
        fila.addEventListener("click", function () {
            filasTabla.forEach(f => {
                f.classList.remove("selected-row");
            });
            this.classList.add("selected-row");
        });
    });
    generarTabla(arrayPersonas)
    ocultarFormularioModificacion();
}

function ocultarFormularioModificacion() {
    document.getElementById("formModificar").style.display = "none";
    document.querySelector(".recuadro").style.display = "block";
}

function modificarEnArray(id, personaModificada) {
    const index = arrayPersonas.findIndex(persona => persona.id === id);
    if (index !== -1) {
        arrayPersonas[index] = personaModificada;
        console.log("Persona modificada:", arrayPersonas[index]);
    } else {
        console.error("No se encontró la persona con el ID seleccionado en el array.");
    }
}