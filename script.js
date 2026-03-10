// ====== ESTADO =======
let tareas = [];
let filtroActual = "todas";
let textoBusqueda = "";

// ====== SELECTORES =====
const input = document.getElementById("inputTarea");
const boton = document.getElementById("btnAgregar");
const lista = document.getElementById("lista");
const modoOscuroBtn = document.getElementById("modoOscuroBtn");
const buscador = document.getElementById("buscador");

// ====== FUNCIONES ======

// ---------- CREAR ----------
function crearTarea(tarea, index) {
    const li = document.createElement("li");
    li.classList.add(`prioridad-${tarea.prioridad}`);

    const izquierda = document.createElement("div");
    izquierda.classList.add("tarea-izquierda");

    const derecha = document.createElement("div");
    derecha.classList.add("tarea-derecha");

    //FECHA

    if (tarea.fecha) {

  const hoy = new Date();
  const fechaTarea = new Date(tarea.fecha);

  if (fechaTarea < hoy) {
    li.classList.add("tarea-vencida");
  }

}

    // TEXTO
    const span = document.createElement("span");
    span.textContent = tarea.texto;

    if (tarea.completada) {
        span.classList.add("completada");
    }

    span.addEventListener("dblclick", () => {
        const nuevoTexto = prompt("Editar tarea:", tarea.texto);

        if (nuevoTexto !== null && nuevoTexto.trim() !== "") {
            tarea.texto = nuevoTexto.trim();
            guardarTareas();
            renderizar();
        }
    });

    span.addEventListener("click", () => {
        tarea.completada = !tarea.completada;
        guardarTareas();
        renderizar();
        actualizarContador();
    });

    izquierda.appendChild(span);

    // FECHA
    if (tarea.fecha) {
        const fecha = document.createElement("small");
        fecha.textContent = "📅 " + tarea.fecha;
        fecha.classList.add("fecha-tarea");
        izquierda.appendChild(fecha);
    }

    // PRIORIDADES
    const prioridades = document.createElement("div");
    prioridades.classList.add("prioridades");

    const alta = document.createElement("button");
    alta.textContent = "🔴";

    const media = document.createElement("button");
    media.textContent = "🟡";

    const baja = document.createElement("button");
    baja.textContent = "🟢";

    alta.addEventListener("click", () => {
        tarea.prioridad = "alta";
        guardarTareas();
        renderizar();
    });

    media.addEventListener("click", () => {
        tarea.prioridad = "media";
        guardarTareas();
        renderizar();
    });

    baja.addEventListener("click", () => {
        tarea.prioridad = "baja";
        guardarTareas();
        renderizar();
    });

    prioridades.appendChild(alta);
    prioridades.appendChild(media);
    prioridades.appendChild(baja);

    // PAPELERA
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "🗑";

    btnEliminar.addEventListener("click", () => {
        li.classList.add("eliminando");

        setTimeout(() => {
            tareas.splice(index, 1);
            guardarTareas();
            renderizar();
            actualizarContador();
        }, 300);
    });

    // DERECHA
    derecha.appendChild(prioridades);
    derecha.appendChild(btnEliminar);

    // MONTAR TODO
    li.appendChild(izquierda);
    li.appendChild(derecha);

    lista.appendChild(li);
}


// ----------CREAR FUNCIÓN -------
function renderizar() {
    lista.innerHTML = "";

    let tareasFiltradas;

    if (filtroActual === "pendientes") {
        tareasFiltradas = tareas.filter(t => !t.completada);
    } else if (filtroActual === "completadas") {
        tareasFiltradas = tareas.filter(t => t.completada);
    } else {
        tareasFiltradas = tareas;
    }
    if (textoBusqueda !== "") {
     tareasFiltradas = tareasFiltradas.filter(t =>
        t.texto.toLowerCase().includes(textoBusqueda)
    );
}
    tareasFiltradas.forEach((tarea, index) => crearTarea(tarea, index));

    actualizarContador();
    actualizarVencidas();
    actualizarEstadisticas();
    actualizarVencenHoy();
}

// ---------- GUARDAR ----------
function guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

//----------- ACTUALIZAR CONTADOR -------
function actualizarContador() {
    const pendientes = tareas.filter(tarea => !tarea.completada).length;

    const contador = document.getElementById("contador");
    contador.textContent = `Tareas pedientes: ${pendientes}`;
    }

// ======== ACTUALIZAR VENCIDAS ======
function actualizarVencidas() {
    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    const vencidas = tareas.filter(t => {
        if (!t.fecha) return false;

        const fechaTarea = new Date(t.fecha);
        return fechaTarea < hoy;

    });

    const contador = document.getElementById("contadorVencidas");
    contador.textContent = `⚠ Tareas vencidas: ${vencidas.length}`;

}

//========ACTULIZAR VENCEN HOY =======
function actualizarVencenHoy() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    const hoyStr = `${año}-${mes}-${dia}`;

    const hoyTareas = tareas.filter(tarea => tarea.fecha === hoyStr).length;

    const elemento = document.getElementById("vencenHoy");
    elemento.textContent = `📅 ${hoyTareas} tareas vencen hoy`;
}

// ---------- AGREGAR ----------
boton.addEventListener("click", () => {

    const texto = input.value.trim();
    const fechaInput = document.getElementById("inputFecha").value;
    
    if (texto.length < 3) return;

    const nuevaTarea = {
        texto: texto,
        completada: false,
        prioridad: "media",
        fecha: fechaInput
    };


    tareas.push(nuevaTarea);

    renderizar();

    guardarTareas();
    actualizarContador ();

    input.value = "";
});


// ENTER = AGREGAR
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        boton.click();
    }
});


// ---------- CARGAR AL INICIO ----------
window.addEventListener("DOMContentLoaded", () => {

    const datos = localStorage.getItem("tareas");

    if (datos) {
        tareas = JSON.parse(datos);

        renderizar();
        actualizarContador();
    }
});

// ---------- CARGAR MODO OSCURO -------
const modoGuardado = localStorage.getItem("modoOscuro");

if (modoGuardado === "activado") {
    document.body.classList.add("dark");
    modoOscuroBtn.textContent = "☀️ Modo claro";
} else {
    modoOscuroBtn.textContent = "🌙 Modo oscuro";
}
//------ACTIVAR BOTONES ---------
document.querySelectorAll(".filtros button").forEach(boton => {

    boton.addEventListener("click", () => {
        filtroActual = boton.dataset.filtro;
        renderizar();
    });

});

// ===== MODO OSCURO =====

modoOscuroBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("modoOscuro", "activado");
        modoOscuroBtn.textContent = "☀️ Modo claro";
    } else {
        localStorage.setItem("modoOscuro", "desactivado");
        modoOscuroBtn.textContent = "🌙 Modo oscuro";
    }

});

// ======= BUSCADOR ========
buscador.addEventListener("input", () => {

    textoBusqueda = buscador.value.toLowerCase();

    renderizar();

});

// ======= ACTUALIZAR ESTADISTICAS =====
function actualizarEstadisticas() {

    const completadas = tareas.filter(t => t.completada).length;
    const pendientes = tareas.filter(t => !t.completada).length;

    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    const vencidas = tareas.filter(t => {
        if (!t.fecha) return false;

        const fecha = new Date(t.fecha);
        fecha.setHours(0,0,0,0);

        return fecha < hoy;
    }).length;

    const stats = document.getElementById("estadisticas");

    stats.textContent =`✔ ${completadas} Completadas|🕓${pendientes} Pendientes| ⚠ ${vencidas} Vencidas`;
}

// =======EXPORTAR TAREAS ======
document.getElementById("exportar").addEventListener("click", () => {

    const datos = JSON.stringify(tareas, null, 2);

    const blob = new Blob([datos], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "tareas.json";

    a.click();

});


// ======== LIMPIAR TODO =========
document.getElementById("limpiarTodo").addEventListener("click", () => {

    if (!confirm("¿Seguro que quieres borrar todas las tareas?")) return;

    tareas = [];
    guardarTareas();
    renderizar();

});
