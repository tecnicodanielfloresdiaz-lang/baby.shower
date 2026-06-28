// =========================================================================
// 1. ESTADO GLOBAL Y CONFIGURACIÓN DEL SAFARI
// =========================================================================
let datosInvitado = { nombre: '', acompanantes: 0 };
const CONFIG_JUEGOS = {
    bebe1: { sexo: 'Niña', nombre: 'LUISA' },
    bebe2: { sexo: 'Niña', nombre: 'MARTA' }
};

let clicsArbusto = 0;

// CONTROL ACCIÓN: Transiciona de pantalla ocultando el paso actual y mostrando el siguiente
function cambiarPantalla(actualId, siguienteId) {
    const actual = document.getElementById(actualId);
    const siguiente = document.getElementById(siguienteId);
    if (actual && siguiente) {
        actual.classList.remove('active');
        siguiente.classList.add('active');
        const container = document.querySelector('.safari-container');
        if (container) container.scrollTop = 0;
    }
}

// =========================================================================
// 2. PASO 1: REGISTRO DE EXPLORADORES
// =========================================================================
document.getElementById('form-registro').addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    const musica = document.getElementById('safari-music');
    if (musica) {
        musica.volume = 0.4;
        musica.play().catch(() => {});
    }
    
    const inputNombre = document.getElementById('guest-name').value.trim();
    const inputCantidad = document.getElementById('guest-count').value;

    if (inputNombre === "") {
        alert("Por favor, ingresa tu nombre de aventurero.");
        return;
    }

    datosInvitado.nombre = inputNombre;
    datosInvitado.acompanantes = parseInt(inputCantidad) || 0;

    cambiarPantalla('step-1', 'step-2');
    inicializarJuegoUno();
});

// =========================================================================
// 3. PASO 2: MINIJUEGO 1 - EL ARBUSTO Y TECLADO (LUISA)
// =========================================================================
function inicializarJuegoUno() {
    const bushImg = document.getElementById('bush-img');
    const revealSex1 = document.getElementById('reveal-sex-1');
    const nameGame1 = document.getElementById('name-game-1');
    const instruccionStep2 = document.querySelector('#step-2 .bush-instruction');
    const bushContainer = document.getElementById('bush-game');

    if (!bushImg) return;

    bushImg.addEventListener('click', function manejarClic(e) {
        e.preventDefault();
        clicsArbusto++;
        
        bushImg.classList.add('shake-animation');
        setTimeout(() => bushImg.classList.remove('shake-animation'), 300);

        if (clicsArbusto === 4) {
            // SOLUCIÓN: Limpieza de la palabra corrupta. Uso de clases estándar compatible con file://
            if (bushImg) bushImg.classList.add('hidden');
            if (instruccionStep2) instruccionStep2.classList.add('hidden');
            
            if (revealSex1) revealSex1.classList.remove('hidden');
            bushImg.removeEventListener('click', manejarClic);

            setTimeout(() => {
                if (nameGame1) nameGame1.classList.remove('hidden');
                configurarAdivinanzaNombre();
            }, 400); 
        }
    });
}

function configurarAdivinanzaNombre() {
    const nombreObjetivo = CONFIG_JUEGOS.bebe1.nombre;
    const wordDisplay = document.getElementById('word-display');
    const keyboardContainer = document.getElementById('keyboard');
    
    if (!wordDisplay || !keyboardContainer) return;
    
    let letrasAdivinadas = Array(nombreObjetivo.length).fill('_');
    wordDisplay.textContent = letrasAdivinadas.join(' ');

    const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    keyboardContainer.innerHTML = '';

    alfabeto.forEach(letra => {
        const btnKey = document.createElement('button');
        btnKey.type = 'button';
        btnKey.className = 'btn-key';
        btnKey.textContent = letra;

        btnKey.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.classList.contains('used')) return;

            this.classList.add('used');

            if (nombreObjetivo.includes(letra)) {
                for (let i = 0; i < nombreObjetivo.length; i++) {
                    if (nombreObjetivo[i] === letra) {
                        letrasAdivinadas[i] = letra;
                    }
                }
                wordDisplay.textContent = letrasAdivinadas.join(' ');

                if (!letrasAdivinadas.includes('_')) {
                    keyboardContainer.innerHTML = `<div class="success-text">¡Nombre Descubierto: LUISA! 🌸</div>`;
                    const btnTwist = document.getElementById('btn-to-twist');
                    if (btnTwist) btnTwist.classList.remove('hidden');
                }
            }
        });
        keyboardContainer.appendChild(btnKey);
    });
}
// =========================================================================
// 4. MOTOR DE NAVEGACIÓN ESTÁTICA PURA (COMPATIBLE CON CUALQUIER ORIGEN)
// =========================================================================
document.addEventListener('click', function(e) {
    if (!e.target || !e.target.id) return;

    // A. AVANCE DE LA PÁGINA 2 A LA PÁGINA 3 (MOMENTO DEL RUGIDO)
    if (e.target.id === 'btn-to-twist') {
        e.preventDefault();
        e.stopPropagation();
        cambiarPantalla('step-2', 'step-3');
    }

    // B. AVANCE DE LA PÁGINA 3 A LA PÁGINA 4 (SOPA DE LETRAS)
    if (e.target.id === 'btn-to-baby2') {
        e.preventDefault();
        e.stopPropagation();
        cambiarPantalla('step-3', 'step-4');
        inicializarJuegoDos();
    }

    // C. AVANCE DE LA PÁGINA 4 A LA PÁGINA 5 (INVITACIÓN FINAL)
    if (e.target.id === 'btn-to-final') {
        e.preventDefault();
        e.stopPropagation();
        cambiarPantalla('step-4', 'step-5');
        inicializarPantallaFinal();
    }
});

// =========================================================================
// 5. PASO 4: CONTROL DE SELECCIÓN DE LA SOPA DE LETRAS 5X5 
// =========================================================================
function inicializarJuegoDos() {
    const soupContainer = document.getElementById('soup-container');
    if (!soupContainer) return;
    
    let letrasEncontradas = 0;
    const targets = soupContainer.querySelectorAll('.select-target');
    
    // Resetea oyentes duplicados clonando los nodos de letras de forma limpia
    targets.forEach(letra => {
        letra.replaceWith(letra.cloneNode(true));
    });
    
    const nuevosTargets = soupContainer.querySelectorAll('.select-target');
    
    nuevosTargets.forEach(letra => {
        letra.addEventListener('click', function(e) {
            e.preventDefault();
            if (!this.classList.contains('active-pink')) { 
                this.classList.add('active-pink'); 
                letrasEncontradas++;
                
                // Validación del largo del nombre (MARTA = 5)
                if (letrasEncontradas === CONFIG_JUEGOS.bebe2.nombre.length) {
                    const btnFinal = document.getElementById('btn-to-final');
                    if (btnFinal) btnFinal.classList.remove('hidden');
                }
            }
        });
    });
}

// =========================================================================
// 6. PASO 5: INYECCIÓN DE VARIABLES SOBRE LA INVITACIÓN FINAL ESTÁTICA
// =========================================================================
function inicializarPantallaFinal() {
    const finalContainer = document.getElementById('final-container');
    if (!finalContainer) return;
    
    const CONFIG_EVENTO = {
        telefonoWhatsApp: "521234567890", // Cambia el teléfono de tu cliente aquí
        lugarTexto: "Jardín Los Girasoles, Calle Selva #123" // Cambia la dirección aquí
    };

    // Mapeo seguro a los campos vacíos estáticos preconfigurados en tu index.html
    const labelNombre = document.getElementById('final-guest-name');
    const labelCantidad = document.getElementById('final-guest-count');
    const btnWhatsApp = document.getElementById('final-whatsapp-link');

    if (labelNombre) labelNombre.textContent = datosInvitado.nombre;
    if (labelCantidad) labelCantidad.textContent = datosInvitado.acompanantes;

    const mensajeWhatsApp = `¡Hola! Confirmo mi asistencia al Baby Shower. Mi nombre es ${datosInvitado.nombre} e iremos ${datosInvitado.acompanantes} exploradores en total. ¡Nos vemos en la aventura! 🐾`;
    const textoCodificado = encodeURIComponent(mensajeWhatsApp);

    if (btnWhatsApp) {
        btnWhatsApp.href = `https://wa.me{CONFIG_EVENTO.telefonoWhatsApp}?text=${textoCodificado}`;
    }
}
