/**
 * funciones.js - Cerebro del Portfolio
 * Estructura organizada para facilitar el mantenimiento y la lectura.
 */

// Espera a que todo el HTML esté cargado antes de ejecutar las funciones
document.addEventListener('DOMContentLoaded', () => {
    inicializarModoOscuro();
    inicializarLightbox();
    inicializarCarrusel();
    inicializarScrollTop();
});

// --- 1. MODO OSCURO ---
function inicializarModoOscuro() {
    const html = document.documentElement; // Referencia a la etiqueta <html>
    // Busca el botón por cualquiera de los dos IDs que sueles usar
    const btnModo = document.getElementById('boton-modo-oscuro') || document.getElementById('boton-modo');
    const modoGuardado = localStorage.getItem('modo'); // Revisa si el usuario ya eligió un modo antes

    // Si en la visita anterior eligió oscuro, se lo aplicamos de entrada
    if (modoGuardado === 'oscuro') {
        html.classList.add('modo-oscuro');
    }

    // Si el botón existe en la página actual, le asignamos el evento click
    if (btnModo) {
        btnModo.onclick = () => {
            html.classList.toggle('modo-oscuro'); // Quita o pone la clase 'modo-oscuro'
            const esOscuro = html.classList.contains('modo-oscuro');
            // Guardamos la preferencia para la próxima vez que cargue la página
            localStorage.setItem('modo', esOscuro ? 'oscuro' : 'claro');
        };
    }
}

// --- 2. LIGHTBOX (Visor de imágenes a pantalla completa) ---
function inicializarLightbox() {
    let lightbox = document.getElementById('lightbox');
    
    // Si el HTML del lightbox no está en el index, lo creamos dinámicamente
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        // Estructura interna: Botón cerrar, flecha izq, imagen central, flecha der
        lightbox.innerHTML = `
            <span class="close-lightbox">&times;</span>
            <button class="lb-prev" id="lb-prev" aria-label="Anterior">&#10094;</button>
            <img class="lightbox-content" id="img-ampliada" alt="Vista ampliada">
            <button class="lb-next" id="lb-next" aria-label="Siguiente">&#10095;</button>`;
        document.body.appendChild(lightbox);
    }

    const imgAmpliada = document.getElementById('img-ampliada');
    let imagenesArray = []; // Lista de rutas de imágenes para navegar
    let indiceActual = 0;   // Qué imagen estamos viendo ahora
    let xInicial = null;    // Para detectar el inicio del deslizamiento táctil

    // Delegación de eventos: Escucha clicks en TODO el documento
    document.addEventListener('click', (e) => {
        // Selector que identifica qué imágenes pueden abrirse en el lightbox
        const selector = '.carousel-slide img, .img-card img, .proyecto-principal img, .evidence-grid img';
        
        // Si el usuario hizo clic en una de esas imágenes
        if (e.target.matches(selector)) {
            const todas = Array.from(document.querySelectorAll(selector));
            imagenesArray = todas.map(img => img.src); // Crea lista de URLs de todas las imágenes
            indiceActual = imagenesArray.indexOf(e.target.src); // Encuentra la posición de la clicada
            
            imgAmpliada.src = imagenesArray[indiceActual]; // Muestra la imagen en el visor
            lightbox.style.display = 'flex'; // Muestra el lightbox
            document.body.style.overflow = 'hidden'; // Evita que la página se mueva de fondo
        }
        
        // Si hace clic en el fondo negro o en la X, cerramos el visor
        if (e.target.id === 'lightbox' || e.target.classList.contains('close-lightbox')) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Devuelve el scroll a la página
        }
    });

    // Función para cambiar de imagen (dir 1 es siguiente, -1 es anterior)
    const navegar = (dir) => {
        if (imagenesArray.length === 0) return;
        // El cálculo matemático asegura que al llegar al final vuelva al principio
        indiceActual = (indiceActual + dir + imagenesArray.length) % imagenesArray.length;
        imgAmpliada.src = imagenesArray[indiceActual];
    };

    // Asignamos las funciones a las flechas del lightbox
    document.getElementById('lb-prev').onclick = (e) => { e.stopPropagation(); navegar(-1); };
    document.getElementById('lb-next').onclick = (e) => { e.stopPropagation(); navegar(1); };

    // --- Soporte para deslizar con el dedo (Swipe) en el visor ---
    lightbox.addEventListener('touchstart', e => xInicial = e.touches[0].clientX, {passive: true});
    lightbox.addEventListener('touchmove', e => {
        if (!xInicial) return;
        let diferencia = xInicial - e.touches[0].clientX;
        if (Math.abs(diferencia) > 50) { // Si el movimiento es mayor a 50px
            navegar(diferencia > 0 ? 1 : -1); // Derecha a izq = siguiente, viceversa
            xInicial = null; // Resetea el punto de inicio
        }
    }, {passive: true});
}

// --- 3. CARRUSEL (Slider de proyectos) ---
function inicializarCarrusel() {
    const slide = document.getElementById('slider');
    const container = document.querySelector('.carousel-container');
    
    // Si no hay slider en esta página, no ejecutamos nada (evita errores en consola)
    if (!slide || !container) return;

    let indice = 0;
    const fotos = slide.querySelectorAll('img');
    let intervalo;
    let xDown = null;

    // Mueve el slider horizontalmente según el índice actual
    const actualizarSlide = () => {
        slide.style.transform = `translateX(${-indice * 100}%)`;
    };

    // Función global para que funcionen los botones onclick="moverSlide(1)"
    window.moverSlide = (dir) => {
        indice = (indice + dir + fotos.length) % fotos.length;
        actualizarSlide();
    };

    // Cambia la imagen automáticamente cada 5 segundos
    const iniciarAutoplay = () => {
        clearInterval(intervalo);
        intervalo = setInterval(() => window.moverSlide(1), 5000);
    };

    // Pausa el autoplay si el mouse está encima
    container.onmouseenter = () => clearInterval(intervalo);
    container.onmouseleave = iniciarAutoplay;

    // --- Soporte táctil para el Carrusel ---
    container.addEventListener('touchstart', e => {
        xDown = e.touches[0].clientX;
        clearInterval(intervalo); // Pausa el auto-movimiento al tocar
    }, {passive: true});

    container.addEventListener('touchmove', e => {
        if (!xDown) return;
        let xDiff = xDown - e.touches[0].clientX;
        if (Math.abs(xDiff) > 50) {
            window.moverSlide(xDiff > 0 ? 1 : -1);
            xDown = null;
        }
    }, {passive: true});

    container.addEventListener('touchend', iniciarAutoplay); // Reanuda autoplay al soltar
    iniciarAutoplay();
}

// --- 4. UTILIDADES (Botón flotante Volver Arriba) ---
function inicializarScrollTop() {
    // Si ya existe el botón (por ejemplo en un cambio de página), no lo duplica
    if (document.getElementById('btn-scroll-top')) return;

    const btn = document.createElement("button");
    btn.id = "btn-scroll-top";
    btn.innerHTML = '↑'; 
    btn.title = "Volver arriba";
    document.body.appendChild(btn);

    // Al hacer clic, sube al principio con efecto suave
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // Solo muestra el botón si el usuario bajó más de 300px
    window.addEventListener("scroll", () => {
        btn.style.display = window.scrollY > 300 ? "block" : "none";
    });
}