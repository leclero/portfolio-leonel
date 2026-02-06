// 🌙 MODO OSCURO UNIFICADO Y PERSISTENTE
function aplicarModo() {
    const modoActual = localStorage.getItem("modo");
    if (modoActual === "oscuro") {
        document.documentElement.classList.add("modo-oscuro");
    } else {
        document.documentElement.classList.remove("modo-oscuro");
    }
}

// Ejecución inmediata
aplicarModo();

const botonModo = document.getElementById("boton-modo-oscuro");
if (botonModo) {
    botonModo.addEventListener("click", () => {
        document.documentElement.classList.toggle("modo-oscuro");
        const nuevoModo = document.documentElement.classList.contains("modo-oscuro") ? "oscuro" : "claro";
        localStorage.setItem("modo", nuevoModo);
    });
}

// 🔐 FUNCIONALIDAD OCULTA ADMIN (Shift + A)
function mostrarAdmin() {
    const btn = document.getElementById("btn-admin");
    if (btn) {
        btn.style.display = "inline-block";
        btn.style.opacity = "0";
        setTimeout(() => (btn.style.opacity = "1"), 100);
        
        // El botón se oculta tras 5 segundos si no se usa
        setTimeout(() => {
            btn.style.opacity = "0";
            setTimeout(() => (btn.style.display = "none"), 600);
        }, 5000);
    }
}

document.addEventListener("keydown", (e) => {
    // Tecla Shift + A
    if (e.shiftKey && e.key.toLowerCase() === "a") {
        mostrarAdmin();
    }
});

// 📩 FORMULARIO DE CONTACTO (LOCALSTORAGE)
const form = document.getElementById("form-contacto");
const mensajeFeedback = document.getElementById("respuesta-form");

if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const datos = new FormData(form);
        const nuevoMensaje = {
            nombre: datos.get("nombre"),
            email: datos.get("email"),
            mensaje: datos.get("mensaje"),
            fecha: new Date().toLocaleString(),
            leido: false
        };

        if (mensajeFeedback) {
            mensajeFeedback.textContent = "⏳ Enviando...";
            mensajeFeedback.style.color = "var(--primary-color)";
        }

        try {
            // Guardar en LocalStorage
            const mensajesPrevios = JSON.parse(localStorage.getItem("mensajesContacto")) || [];
            mensajesPrevios.push(nuevoMensaje);
            localStorage.setItem("mensajesContacto", JSON.stringify(mensajesPrevios));

            // Simulación de envío
            setTimeout(() => {
                if (mensajeFeedback) {
                    mensajeFeedback.textContent = "✅ Mensaje guardado en el Panel Admin";
                    mensajeFeedback.style.color = "green";
                }
                form.reset();
            }, 800);

        } catch (error) {
            if (mensajeFeedback) {
                mensajeFeedback.textContent = "❌ Error al guardar el mensaje";
                mensajeFeedback.style.color = "red";
            }
        }
    });
}