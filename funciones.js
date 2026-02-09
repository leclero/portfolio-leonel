/**
 * funciones.js - Cerebro del Portfolio
 * Categorías: 1. Modo Oscuro | 2. Lightbox | 3. Carrusel (Touch + Mouse)
 */

document.addEventListener('DOMContentLoaded', () => {
    inicializarModoOscuro();
    inicializarLightbox();
    inicializarCarrusel();
});

// --- 1. LÓGICA DE MODO OSCURO (UNIVERSAL PARA TODAS LAS PÁGINAS) ---
function inicializarModoOscuro() {
    const html = document.documentElement;
    // Buscamos cualquiera de los dos IDs que podrías estar usando
    const btnModo = document.getElementById('boton-modo-oscuro') || document.getElementById('boton-modo');
    const modoGuardado = localStorage.getItem('modo');

    // Aplicar el modo guardado al cargar
    if (modoGuardado === 'oscuro') {
        html.classList.add('modo-oscuro');
    }

    // Si encuentra cualquiera de los dos botones, le asigna la función
    if (btnModo) {
        btnModo.onclick = () => {
            html.classList.toggle('modo-oscuro');
            const esOscuro = html.classList.contains('modo-oscuro');
            localStorage.setItem('modo', esOscuro ? 'oscuro' : 'claro');
        };
    }
}
// --- 2. LÓGICA DE LIGHTBOX (INDIVIDUAL POR PROYECTO) ---
function inicializarLightbox() {
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="close-lightbox">&times;</span>
            <button class="lb-prev" id="lb-prev">&#10094;</button>
            <img class="lightbox-content" id="img-ampliada">
            <button class="lb-next" id="lb-next">&#10095;</button>`;
        document.body.appendChild(lightbox);
    }

    const imgAmpliada = document.getElementById('img-ampliada');
    let imagenesArray = [];
    let indiceActual = 0;
    
    // Variables para el gesto de deslizar (swipe)
    let xInicial = null;

    document.addEventListener('click', (e) => {
        // Detecta imágenes en carrusel o grids de evidencia
        if (e.target.matches('.carousel-slide img, .img-card img, .proyecto-principal img')) {
            const selector = '.carousel-slide img, .img-card img, .proyecto-principal img';
            const todas = Array.from(document.querySelectorAll(selector));
            imagenesArray = todas.map(img => img.src);
            indiceActual = imagenesArray.indexOf(e.target.src);
            
            imgAmpliada.src = imagenesArray[indiceActual];
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Bloquea scroll del fondo
        }
        
        if (e.target.id === 'lightbox' || e.target.classList.contains('close-lightbox')) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    const navegar = (dir) => {
        indiceActual = (indiceActual + dir + imagenesArray.length) % imagenesArray.length;
        imgAmpliada.src = imagenesArray[indiceActual];
    };

    document.getElementById('lb-prev').onclick = (e) => { e.stopPropagation(); navegar(-1); };
    document.getElementById('lb-next').onclick = (e) => { e.stopPropagation(); navegar(1); };

    // --- LÓGICA TÁCTIL (SWIPE) ---
    lightbox.addEventListener('touchstart', (e) => {
        xInicial = e.touches[0].clientX;
    }, false);

    lightbox.addEventListener('touchmove', (e) => {
        if (!xInicial) return;
        let xFinal = e.touches[0].clientX;
        let diferencia = xInicial - xFinal;

        if (Math.abs(diferencia) > 50) { // Umbral de sensibilidad
            if (diferencia > 0) navegar(1);  // Deslizar a la izquierda -> Siguiente
            else navegar(-1);               // Deslizar a la derecha -> Anterior
            xInicial = null; // Reiniciar
        }
    }, false);
}

// --- 3. LÓGICA DEL CARRUSEL (AUTOMÁTICO + MOUSE + TOUCH) ---
function inicializarCarrusel() {
    const slide = document.getElementById('slider');
    const container = document.querySelector('.carousel-container');
    
    if (slide && container) {
        let indice = 0;
        const fotos = slide.querySelectorAll('img');
        let intervalo;
        let xDown = null;

        const actualizarSlide = () => {
            slide.style.transform = `translateX(${-indice * 100}%)`;
        };

        window.moverSlide = (dir) => {
            indice = (indice + dir + fotos.length) % fotos.length;
            actualizarSlide();
        };

        // Autoplay con protección
        const iniciarAutoplay = () => {
            clearInterval(intervalo);
            intervalo = setInterval(() => window.moverSlide(1), 5000);
        };
        const detenerAutoplay = () => clearInterval(intervalo);

        // Eventos Mouse
        container.onmouseenter = detenerAutoplay;
        container.onmouseleave = iniciarAutoplay;

        // --- DETECCIÓN TÁCTIL SIMPLIFICADA ---
        container.addEventListener('touchstart', (e) => {
            xDown = e.touches[0].clientX;
            detenerAutoplay();
        }, {passive: true});

        container.addEventListener('touchmove', (e) => {
            if (!xDown) return;
            let xUp = e.touches[0].clientX;
            let xDiff = xDown - xUp;

            if (Math.abs(xDiff) > 50) { // Si desliza más de 50px
                window.moverSlide(xDiff > 0 ? 1 : -1);
                xDown = null; // Reseteamos para que no mueva mil veces
            }
        }, {passive: true});

        container.addEventListener('touchend', iniciarAutoplay);

        iniciarAutoplay();
    }
}