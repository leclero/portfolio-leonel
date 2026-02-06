// 📩 FORMULARIO DE CONTACTO (CONECTADO A RENDER)
const form = document.getElementById("form-contacto");
const mensajeFeedback = document.getElementById("respuesta-form");

// Cambiá esta URL por la que te dio Render (fijate que termine en /api/mensajes)
const API_URL = "https://backend-leonel-pro.onrender.com/api/mensajes";

if (form) {
    form.addEventListener("submit", async (e) => { // Agregamos 'async' aquí
        e.preventDefault();
        
        const datos = new FormData(form);
        const nuevoMensaje = {
            nombre: datos.get("nombre"),
            email: datos.get("email"),
            mensaje: datos.get("mensaje")
        };

        if (mensajeFeedback) {
            mensajeFeedback.textContent = "⏳ Enviando al servidor...";
            mensajeFeedback.style.color = "var(--primary-color)";
        }

        try {
            // ENVIAR A RENDER
            const respuesta = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevoMensaje)
            });

            if (respuesta.ok) {
                if (mensajeFeedback) {
                    mensajeFeedback.textContent = "✅ ¡Mensaje enviado con éxito!";
                    mensajeFeedback.style.color = "green";
                }
                form.reset();
            } else {
                throw new Error("Error en el servidor");
            }

        } catch (error) {
            console.error("Error:", error);
            if (mensajeFeedback) {
                mensajeFeedback.textContent = "❌ Error al conectar con el servidor";
                mensajeFeedback.style.color = "red";
            }
        }
    });
}