if (typeof AudioManager !== 'undefined') {
    AudioManager._bgmBuffer = null;
    
    AudioManager.audioFileExt = function() {
        return ".ogg";
    };
}

if (typeof WebAudio !== 'undefined') {
    WebAudio._canPlayOgg = function() {
        return true;
    };
}

if (typeof TouchInput !== 'undefined') {
    TouchInput._onTrigger = function() {};
    TouchInput._onMouseDown = function() {};
    TouchInput._onTouchStart = function() {};
}

let isTouchInitialized = false;

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener('touchstart', showTouchControls, { passive: true });
    
    window.addEventListener('keydown', hideTouchControls, { passive: true });
});

function showTouchControls() {
    const touchContainer = document.getElementById('touch-controls-container');
    if (touchContainer && touchContainer.style.display !== 'block') {
        touchContainer.style.display = 'block';
    }

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

const KEY_MAP = {
    '38': 'up',
    '40': 'down',
    '37': 'left',
    '39': 'right',
    '90': 'ok',
    '88': 'escape'
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

    window.addEventListener('touchmove', handleDrag, { passive: false });
    window.addEventListener('mousemove', handleDrag);
    
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
    localStorage.removeItem('mobile_touch_layout');
    
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

const touchTranslations = {
    'en': { size: 'Size', opacity: 'Opacity', reset: 'Reset', cancel: 'Cancel', apply: 'Apply' },
    'es': { size: 'Tamaño', opacity: 'Opacidad', reset: 'Restablecer', cancel: 'Cancelar', apply: 'Aplicar' },
    'cn': { size: '大小', opacity: '不透明度', reset: '重置', cancel: '取消', apply: '应用' },
    'jp': { size: 'サイズ', opacity: '不透明度', reset: 'リセット', cancel: 'キャンセル', apply: '適用' },
    'ru': { size: 'Размер', opacity: 'Прозрачность', reset: 'Сброс', cancel: 'Отмена', apply: 'Применить' },
    'pt': { size: 'Tamanho', opacity: 'Opacidade', reset: 'Redefinir', cancel: 'Cancelar', apply: 'Aplicar' }
};

function updateTouchControlsLanguage(lang) {
    const t = touchTranslations[lang] || touchTranslations['en'];
    
    const lblSize = document.getElementById('lblSize');
    const lblAlpha = document.getElementById('lblAlpha');
    const btnReset = document.getElementById('btnReset');
    const btnCancel = document.getElementById('btnCancel');
    const btnApply = document.getElementById('btnApply');

    if (lblSize) lblSize.textContent = t.size;
    if (lblAlpha) lblAlpha.textContent = t.opacity;
    if (btnReset) btnReset.textContent = t.reset;
    if (btnCancel) btnCancel.textContent = t.cancel;
    if (btnApply) btnApply.textContent = t.apply;
}
