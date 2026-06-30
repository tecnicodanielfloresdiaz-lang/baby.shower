// Variables de estado global
let datosInvitado = {
    nombre: '',
    acompanantes: 0
};

const CONFIG_JUEGOS = {
    bebe1: { sexo: 'Niña', nombre: 'LUISA' },
    bebe2: { sexo: 'Niña', nombre: 'MARTA' }
};

// ==========================================
// PASO 1: REGISTRO (CON PREVENCIÓN DE RECARGA)
// ==========================================
document.getElementById('form-registro').addEventListener('submit', function(e) {
    // Detiene por completo la recarga nativa del formulario HTML
    e.preventDefault(); 
    e.stopPropagation();

    // ENCENDER LA MÚSICA DE FONDO EMOTIVA 🎵
    const musica = document.getElementById('safari-music');
    if (musica) {
        musica.volume = 0.4; // Volumen suave para no aturdir
        musica.play().catch(error => console.log("Interacción requerida para audio:", error));
    }
    
    // Captura los datos de los inputs
    const inputNombre = document.getElementById('guest-name').value.trim();
    const inputCantidad = document.getElementById('guest-count').value;

    if (inputNombre === "") {
        alert("Por favor, ingresa tu nombre de aventurero.");
        return;
    }

    datosInvitado.nombre = inputNombre;
    datosInvitado.acompanantes = parseInt(inputCantidad) || 0;

    // Cambia de pantalla sin recargar la pestaña
    cambiarPantalla('step-1', 'step-2');
    inicializarJuegoUno();
});

// ==========================================
// PASO 2: JUEGO 1 (LUISA)
// ==========================================
let clicsArbusto = 0;

function inicializarJuegoUno() {
    const bushImg = document.getElementById('bush-img');
    const revealSex1 = document.getElementById('reveal-sex-1');
    const nameGame1 = document.getElementById('name-game-1');

    bushImg.addEventListener('click', function manejarClic(e) {
        e.preventDefault();
        clicsArbusto++;
        
        bushImg.classList.add('shake-animation');
        setTimeout(() => bushImg.classList.remove('shake-animation'), 300);

        if (clicsArbusto === 4) {
            bushImg.style.display = 'none';
            revealSex1.classList.remove('hidden');
            bushImg.removeEventListener('click', manejarClic);

            setTimeout(() => {
                nameGame1.classList.remove('hidden');
                crearJuegoPalabra('word-display', 'keyboard', CONFIG_JUEGOS.bebe1.nombre, 'btn-to-twist');
            }, 1500);
        }
    });
}

// ==========================================
// PASO 3: GIRO DE TRAMA (MELLIZAS)
// ==========================================
document.getElementById('btn-to-twist').addEventListener('click', function(e) {
    e.preventDefault();
    cambiarPantalla('step-2', 'step-3');
    
    const twistContainer = document.getElementById('step-3');
    twistContainer.innerHTML = `
        <div class="card text-center text-alert animate-earthquake">
            <h2 class="alert-title">¡ESPERA UN MOMENTO! ⚠️</h2>
            <p class="alert-text">¿Escuchaste eso? Un fuerte rugido sacude las hojas de la selva...</p>
            <div style="font-size:2.5rem; margin: 15px 0;">🍃🦁🍃</div>
            <p class="alert-subtext">¡Hay otro movimiento entre los arbustos! Al parecer el nido no estaba vacío...</p>
            <button id="btn-to-baby2" class="btn-safari">Investigar el rugido 🔍</button>
        </div>
    `;

    document.getElementById('btn-to-baby2').addEventListener('click', function(e) {
        e.preventDefault();
        cambiarPantalla('step-3', 'step-4');
        inicializarJuegoDos();
    });
});

// ==========================================
// PASO 4: JUEGO 2 (MARTA EN LA MITAD DE LA MATRIZ)
// ==========================================
function inicializarJuegoDos() {
    const step4 = document.getElementById('step-4');
    step4.innerHTML = `
        <div class="card text-center">
            <h2>¡EL SEGUNDO MILAGRO! 🌸</h2>
            <p class="highlight-girl">¡SÍ, SON MELLIZAS! ¡OTRA HERMOSA NIÑA! 🦒</p>
            <p>Encuentra su nombre oculto en la sopa de letras safari:</p>
            
            <div class="word-search-grid" style="display: grid !important; grid-template-columns: repeat(5, 1fr) !important; gap: 8px !important; max-width: 280px !important; margin: 25px auto !important;">
                <span class="letter-box">J</span><span class="letter-box">I</span><span class="letter-box">R</span><span class="letter-box">A</span><span class="letter-box">F</span>
                <span class="letter-box">S</span><span class="letter-box">A</span><span class="letter-box">F</span><span class="letter-box">A</span><span class="letter-box">R</span>
                <span class="letter-box select-target" data-char="M">M</span>
                <span class="letter-box select-target" data-char="A">A</span>
                <span class="letter-box select-target" data-char="R">R</span>
                <span class="letter-box select-target" data-char="T">T</span>
                <span class="letter-box select-target" data-char="A">A</span>
                <span class="letter-box">L</span><span class="letter-box">E</span><span class="letter-box">O</span><span class="letter-box">N</span><span class="letter-box">E</span>
                <span class="letter-box">S</span><span class="letter-box">E</span><span class="letter-box">L</span><span class="letter-box">V</span><span class="letter-box">A</span>
            </div>
            
            <div id="found-message" class="hidden font-bold text-girl" style="margin: 15px 0; font-weight: bold;">¡Felicidades! Encontraste el nombre: MARTA 🐾</div>
            <button id="btn-to-final" class="btn-safari hidden">Ver invitación final 🗺️</button>
        </div>
    `;

    let letrasEncontradas = 0;
    const targets = document.querySelectorAll('.select-target');
    
    targets.forEach(letra => {
        letra.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!this.classList.contains('active-pink')) { 
                this.classList.add('active-pink'); 
                letrasEncontradas++;
                
                if (letrasEncontradas === CONFIG_JUEGOS.bebe2.nombre.length) {
                    document.getElementById('found-message').classList.remove('hidden');
                    document.getElementById('btn-to-final').classList.remove('hidden');
                    
                    // Lanza el confeti rosa
                    lanzarConfetiRosa();
                }
            }
        });
    });

    document.getElementById('btn-to-final').addEventListener('click', function(e) {
        e.preventDefault();
        cambiarPantalla('step-4', 'step-5');
        inicializarPantallaFinal();
    });
}


// ==========================================
// PASO 5: PANTALLA INVITACIÓN FINAL Y CUENTA REGRESIVA
// ==========================================
function inicializarPantallaFinal() {
    const step5 = document.getElementById('step-5');
    const infoEvento = {
        fechaTexto: "Sábado 25 de Julio", // Esto ya no lo usaremos directamente en texto plano
        horaTexto: "16:00 PM",
        fechaContador: "2026-06-29T16:30:00", // Actualizado a la fecha de la imagen para el motor del reloj
        lugar: "Jardín Los Girasoles, Calle Selva #123",
        mapaLink: "https://google.com", 
        whatsappNum: "521234567890" 
    };

    step5.innerHTML = `
        <div class="card text-center">
            <span class="badge">¡Estás Invitado!</span>
            <h1>Baby Shower</h1>
            <div class="girl-name-style">Luisa & Marta</div>

            <p class="welcome-msg">¡La aventura está completa! Te esperamos para celebrar la llegada de nuestras mellizas.</p>
            
            <!-- SECCIÓN: FECHA Y HORA (DISEÑO EDITORIAL) -->
            <div class="calendar-display">
                <div class="calendar-month">JUNIO</div>
                <div class="calendar-row">
                    <div class="calendar-side-box">SÁBADO</div>
                    <div class="calendar-day-number">29</div>
                    <div class="calendar-side-box">4:30 P.M.</div>
                </div>
                <div class="calendar-year">2026</div>
            </div>

            <!-- NUEVA FRASE INTRODUCTORIA -->
            <p class="countdown-label">Falta...</p>

            <!-- CONTENEDOR DE LA CUENTA REGRESIVA (MOVIDO AQUÍ) -->
            <div class="countdown-container">
                <div class="countdown-box"><span id="cd-days">00</span><small>Días</small></div>
                <div class="countdown-box"><span id="cd-hours">00</span><small>Horas</small></div>
                <div class="countdown-box"><span id="cd-minutes">00</span><small>Min</small></div>
                <div class="countdown-box"><span id="cd-seconds">00</span><small>Seg</small></div>
            </div>

            <!-- DETALLES DE UBICACIÓN -->
            <div class="location-details" style="margin-top: 15px;">
                <p>📍 <strong>Lugar:</strong> ${infoEvento.lugar}</p>
            </div>

            <a href="${infoEvento.mapaLink}" target="_blank" class="btn-secondary">📍 Ver Ubicación en Maps</a>
            
            <hr class="divider">

            <div class="rsvp-box">
                <h3>Tu Registro de Asistencia</h3>
                <p><strong>Explorador:</strong> ${datosInvitado.nombre}</p>
                <p><strong>Acompañantes:</strong> ${datosInvitado.acompanantes}</p>
                <button id="btn-whatsapp" class="btn-whatsapp">Confirmar Asistencia por WhatsApp 💬</button>
            </div>
        </div>
    `;


        // Motor del contador de tiempo
    const targetDate = new Date(infoEvento.fechaContador).getTime();
    const interval = setInterval(function() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            clearInterval(interval);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Validamos que los elementos existan en el DOM antes de asignarles texto
        const elDays = document.getElementById('cd-days');
        const elHours = document.getElementById('cd-hours');
        const elMin = document.getElementById('cd-minutes');
        const elSec = document.getElementById('cd-seconds');

        if (elDays && elHours && elMin && elSec) {
            elDays.innerText = String(days).padStart(2, '0');
            elHours.innerText = String(hours).padStart(2, '0');
            elMin.innerText = String(minutes).padStart(2, '0');
            elSec.innerText = String(seconds).padStart(2, '0');
        }
    }, 1000);

    // Botón de WhatsApp con formato de texto corregido
    document.getElementById('btn-whatsapp').addEventListener('click', function(e) {
        e.preventDefault();
        
        const mensajePlano = `¡Hola! Confirmo mi asistencia al Baby Shower de Luisa y Marta. 🍼🌸\n\n` +
                             `👤 Nombre: ${datosInvitado.nombre}\n` +
                             `👥 Acompañantes: ${datosInvitado.acompanantes}\n\n` +
                             `¡Nos vemos pronto en la aventura! 🦁`;
                             
        const textoMsg = encodeURIComponent(mensajePlano);
        window.open(`https://wa.me{infoEvento.whatsappNum}?text=${textoMsg}`, '_blank');
    });
}

// Función para cambiar de sección
function cambiarPantalla(actualId, siguienteId) {
    document.getElementById(actualId).classList.remove('active');
    document.getElementById(siguienteId).classList.add('active');
}

// Función del juego de deletreo (Ahorcado LUISA)
function crearJuegoPalabra(displayId, keyboardId, palabra, btnId) {
    const display = document.getElementById(displayId);
    const keyboard = document.getElementById(keyboardId);
    let progreso = Array(palabra.length).fill('_');

    display.innerText = progreso.join(' ');
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    keyboard.innerHTML = '';
    
    letras.forEach(letra => {
        const btn = document.createElement('button');
        btn.innerText = letra;
        btn.classList.add('btn-key');
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            btn.disabled = true;
            btn.classList.add('used');

            if (palabra.includes(letra)) {
                for (let i = 0; i < palabra.length; i++) {
                    if (palabra[i] === letra) progreso[i] = letra;
                }
                display.innerText = progreso.join(' ');
                
                if (!progreso.includes('_')) {
                    keyboard.innerHTML = `<p class="success-text">¡Nombre Descubierto: ${palabra}! 🐯</p>`;
                    document.getElementById(btnId).classList.remove('hidden');
                    
                    // Dispara confeti al completar el primer juego
                    lanzarConfetiRosa();
                }
            }
        });
        keyboard.appendChild(btn);
    });
}

// ==========================================
// FUNCIÓN MATRIZ DE CONFETI EN LA PANTALLA
// ==========================================
function lanzarConfetiRosa() {
    if (typeof confetti === 'function') {
        // Disparo desde la izquierda
        confetti({
            particleCount: 80,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.6 },
            colors: ['#f1c0cb', '#d4a5b8', '#ffffff', '#ff9ebb']
        });
        // Disparo desde la derecha
        confetti({
            particleCount: 80,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.6 },
            colors: ['#f1c0cb', '#d4a5b8', '#ffffff', '#ff9ebb']
        });
    } else {
        console.log("La librería confetti no se cargó correctamente en el HTML.");
    }
}

