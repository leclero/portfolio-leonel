// --- LÓGICA MODO OSCURO ---
const btnModo = document.getElementById('boton-modo-oscuro');

if (btnModo) {
    btnModo.addEventListener('click', () => {
        document.documentElement.classList.toggle('modo-oscuro');
        
        const esOscuro = document.documentElement.classList.contains('modo-oscuro');
        localStorage.setItem('modo', esOscuro ? 'oscuro' : 'claro');
        
        // Cambiar el texto/icono del botón
        btnModo.textContent = esOscuro ? '☀️ Modo Claro' : '🌙 Cambiar Modo';
    });
}

// --- LÓGICA DEL FORMULARIO DE CONTACTO ---
const formContacto = document.getElementById('form-contacto');
const respuestaForm = document.getElementById('respuesta-form');

if (formContacto) {
    formContacto.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        
        const btnSubmit = formContacto.querySelector('button');
        btnSubmit.disabled = true;
        btnSubmit.textContent = "Enviando...";

        // Simulamos envío (aquí conectarías con tu backend en Render/Node.js)
        setTimeout(() => {
            respuestaForm.textContent = "¡Mensaje enviado con éxito, Leonel!";
            respuestaForm.style.color = "var(--success-color)";
            formContacto.reset();
            btnSubmit.disabled = false;
            btnSubmit.textContent = "Enviar Mensaje";
        }, 1500);
    });
}

// --- LÓGICA PARA EL LIGHTBOX (Zoom de imágenes) ---
// Esto permite que las imágenes con la clase 'foto-zoom' se amplíen
document.querySelectorAll('.proyecto-v1 img, .proyecto-principal img').forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener('click', () => {
        const lightbox = document.getElementById('lightbox');
        const imgAmpliada = document.getElementById('img-ampliada');
        if (lightbox && imgAmpliada) {
            imgAmpliada.src = img.src;
            lightbox.style.display = 'flex';
        }
    });
});