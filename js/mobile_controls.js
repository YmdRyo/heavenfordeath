// Desactivar el control táctil nativo del mapa en RPG Maker MZ
if (typeof TouchInput !== 'undefined') {
    TouchInput._onTrigger = function() {};
    TouchInput._onMouseDown = function() {};
    TouchInput._onTouchStart = function() {};
}

let isTouchInitialized = false;

document.addEventListener("DOMContentLoaded", () => {
    // Escucha permanente de toques para activar/mostrar los controles
    window.addEventListener('touchstart', showTouchControls, { passive: true });
    
    // Escucha permanente de teclado para ocultar los controles
    window.addEventListener('keydown', hideTouchControls, { passive: true });
});

function showTouchControls() {
    const touchContainer = document.getElementById('touch-controls-container');
    if (touchContainer && touchContainer.style.display !== 'block') {
        touchContainer.style.display = 'block';
    }

    // Inicializamos listeners del layout solo la primera vez que se toca la pantalla
    if (!isTouchInitialized) {
        isTouchInitialized = true;

        if (typeof TouchInput !== 'undefined') {
            TouchInput._onTrigger = function() {};
            TouchInput._onMouseDown = function() {};
            TouchInput._onTouchStart = function() {};
        }

        initTouchEvents();
        saveDefaultPositions();
        loadLayout();
    }
}

function hideTouchControls(event) {
    // Evitamos ocultar los controles si el usuario está editando textos o valores
    if (isEditMode) return;

    const touchContainer = document.getElementById('touch-controls-container');
    if (touchContainer && touchContainer.style.display !== 'none') {
        touchContainer.style.display = 'none';
    }
}

let isEditMode = false;
let activeElement = null;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let defaultLayout = {};

// Mapeo de teclas a nombres internos de RPG Maker MZ
const KEY_MAP = {
    '38': 'up',
    '40': 'down',
    '37': 'left',
    '39': 'right',
    '90': 'ok',     // Botón Z / Aceptar
    '88': 'escape' // Botón X / Cancelar / Menú
};

document.addEventListener("DOMContentLoaded", () => {
    if (typeof TouchInput !== 'undefined') {
        TouchInput._onTrigger = function() {};
        TouchInput._onMouseDown = function() {};
        TouchInput._onTouchStart = function() {};
    }
    
    initTouchEvents();
    saveDefaultPositions();
    loadLayout();
});

function saveDefaultPositions() {
    const buttons = document.querySelectorAll('.touch-btn');
    buttons.forEach(btn => {
        defaultLayout[btn.id] = {
            left: btn.offsetLeft + 'px',
            top: btn.offsetTop + 'px',
            scale: 1,
            alpha: 1
        };
    });
}

// Envío de eventos directamente al motor de RPG Maker MZ (Input._currentState)
function pressEngineKey(keyCode) {
    const keyName = KEY_MAP[keyCode];
    if (typeof Input !== 'undefined' && keyName) {
        Input._currentState[keyName] = true;
    }
}

function releaseEngineKey(keyCode) {
    const keyName = KEY_MAP[keyCode];
    if (typeof Input !== 'undefined' && keyName) {
        Input._currentState[keyName] = false;
    }
}

function initTouchEvents() {
    const buttons = document.querySelectorAll('.touch-btn');

    buttons.forEach(btn => {
        const key = btn.getAttribute('data-key');

        // Touch (Móviles)
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isEditMode) {
                startDrag(btn, e);
                return;
            }

            btn.classList.add('btn-pressed');
            pressEngineKey(key);
        }, { passive: false });

        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isEditMode) {
                stopDrag();
                return;
            }

            btn.classList.remove('btn-pressed');
            releaseEngineKey(key);
        }, { passive: false });

        btn.addEventListener('touchcancel', (e) => {
            btn.classList.remove('btn-pressed');
            releaseEngineKey(key);
            stopDrag();
        });

        // Mouse (PC / Pruebas)
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isEditMode) {
                startDrag(btn, e);
                return;
            }

            btn.classList.add('btn-pressed');
            pressEngineKey(key);
        });

        btn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (isEditMode) {
                stopDrag();
                return;
            }

            btn.classList.remove('btn-pressed');
            releaseEngineKey(key);
        });

        btn.addEventListener('mouseleave', () => {
            if (!isEditMode) {
                btn.classList.remove('btn-pressed');
                releaseEngineKey(key);
            }
        });
    });

    // Control de arrastre global
    window.addEventListener('touchmove', handleDrag, { passive: false });
    window.addEventListener('mousemove', handleDrag);
    
    // Detención forzada de arrastre al soltar fuera del elemento
    window.addEventListener('touchend', stopDrag, { passive: false });
    window.addEventListener('mouseup', stopDrag);
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    const container = document.getElementById('touch-controls-container');
    const panel = document.getElementById('editControlsLayout');
    const overlay = document.getElementById('editOverlay');

    if (isEditMode) {
        container.classList.add('edit-mode-active');
        panel.style.display = 'flex';
        overlay.style.display = 'block';
    } else {
        cancelEditMode();
    }
}

function startDrag(element, event) {
    if (activeElement) activeElement.classList.remove('selected-target');
    activeElement = element;
    activeElement.classList.add('selected-target');
    isDragging = true;

    const touch = event.touches ? event.touches[0] : event;
    dragOffsetX = touch.clientX - element.offsetLeft;
    dragOffsetY = touch.clientY - element.offsetTop;
}

function handleDrag(event) {
    if (!isEditMode || !isDragging || !activeElement) return;
    if (event.cancelable) event.preventDefault();

    const touch = event.touches ? event.touches[0] : event;
    
    let topPx = touch.clientY - dragOffsetY;
    let leftPx = touch.clientX - dragOffsetX;

    let bottomPx = window.innerHeight - (topPx + activeElement.offsetHeight);
    let bottomPercent = (bottomPx / window.innerHeight) * 100;
    let leftPercent = (leftPx / window.innerWidth) * 100;

    activeElement.style.top = 'auto';
    activeElement.style.bottom = bottomPercent + '%';
    activeElement.style.left = leftPercent + '%';
    activeElement.style.right = 'auto';
}

function stopDrag() {
    isDragging = false;
}

function updateActiveElementSize(val) {
    document.querySelectorAll('.touch-btn').forEach(btn => {
        btn.style.transform = `scale(${val})`;
        btn.dataset.scale = val;
    });
}

function updateActiveElementAlpha(val) {
    document.querySelectorAll('.touch-btn').forEach(btn => {
        btn.style.opacity = val;
        btn.dataset.alpha = val;
    });
}

function saveControlPositions() {
    const layout = {};
    document.querySelectorAll('.touch-btn').forEach(btn => {
        layout[btn.id] = {
            left: btn.style.left,
            bottom: btn.style.bottom,
            scale: btn.dataset.scale || 1,
            alpha: btn.dataset.alpha || 1
        };
    });

    localStorage.setItem('mobile_touch_layout', JSON.stringify(layout));
    exitEditView();
}

function loadLayout() {
    const saved = localStorage.getItem('mobile_touch_layout');
    if (!saved) return;

    const layout = JSON.parse(saved);
    Object.keys(layout).forEach(id => {
        const btn = document.getElementById(id);
        if (btn && layout[id]) {
            btn.style.top = 'auto';
            btn.style.right = 'auto';

            if (layout[id].left) btn.style.left = layout[id].left;
            if (layout[id].bottom) btn.style.bottom = layout[id].bottom;
            
            if (layout[id].scale) {
                btn.style.transform = `scale(${layout[id].scale})`;
                btn.dataset.scale = layout[id].scale;
            }
            if (layout[id].alpha) {
                btn.style.opacity = layout[id].alpha;
                btn.dataset.alpha = layout[id].alpha;
            }
        }
    });
}

function resetControlPositions() {
    // Borramos el layout personalizado de localStorage
    localStorage.removeItem('mobile_touch_layout');
    
    // Limpiamos los estilos inyectados por JavaScript en cada botón
    document.querySelectorAll('.touch-btn').forEach(btn => {
        btn.style.top = '';
        btn.style.bottom = '';
        btn.style.left = '';
        btn.style.right = '';
        btn.style.transform = '';
        btn.style.opacity = '';
        
        btn.dataset.scale = 1;
        btn.dataset.alpha = 1;
    });

    // Reseteamos los sliders del panel de edición a sus valores base
    const sizeSlider = document.getElementById('sizeSlider');
    const alphaSlider = document.getElementById('alphaSlider');
    
    if (sizeSlider) sizeSlider.value = 1;
    if (alphaSlider) alphaSlider.value = 1;
}

function cancelEditMode() {
    loadLayout();
    exitEditView();
}

function exitEditView() {
    isEditMode = false;
    isDragging = false;
    if (activeElement) activeElement.classList.remove('selected-target');
    activeElement = null;

    document.getElementById('touch-controls-container').classList.remove('edit-mode-active');
    document.getElementById('editControlsLayout').style.display = 'none';
    document.getElementById('editOverlay').style.display = 'none';
}
