const CORRECT_PIN = "8190";
let noteAudio = null;
let fadeInterval = null;
let noteKeyBlocker = null;

const IMG_BASE = "img/note/";
const IMAGE_MAP = {
    '1': IMG_BASE + "note_1.png",
    '2': IMG_BASE + "note_2.png",
    '3': IMG_BASE + "note_3.png",
    'NONE': IMG_BASE + "black.png"
};

let currentDisplayedImg = null;
let observer = null;

window.openPinModal = function() {
    disableGameInput();

    const pinInput = document.getElementById('pinInput');
    if (pinInput) {
        pinInput.value = '';
        pinInput.focus();
        pinInput.onkeydown = function(e) {
            e.stopPropagation();
        };
    }
    document.getElementById('pinError').style.display = 'none';
    document.getElementById('pinModal').style.display = 'flex';
};

window.closePinModal = function() {
    document.getElementById('pinModal').style.display = 'none';
    enableGameInput();
};

window.validatePin = function() {
    const inputPin = document.getElementById('pinInput').value;
    if (inputPin === CORRECT_PIN) {
        document.getElementById('pinModal').style.display = 'none';
        startNoteViewer();
    } else {
        document.getElementById('pinError').style.display = 'block';
    }
};

function getCurrentLang() {
    let lang = null;

    if (window.currentLanguage) {
        lang = window.currentLanguage;
    }

    if (!lang && typeof localStorage !== 'undefined') {
        lang = localStorage.getItem('app_lang') || localStorage.getItem('language');
    }

    if (lang) {
        lang = lang.toLowerCase().substring(0, 2);
    }

    const supportedLangs = ['es', 'en', 'pt', 'jp', 'ru', 'cn'];
    if (!lang || !supportedLangs.includes(lang)) {
        lang = 'en';
    }

    return lang;
}

function preloadNoteImages() {
    return Promise.all(
        Object.values(IMAGE_MAP).map((src) => {
            if (!src || src.endsWith('black.png')) return Promise.resolve();
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve;
                img.src = src;
            });
        })
    );
}

async function startNoteViewer() {
    disableGameInput();

    if (typeof AudioManager !== 'undefined') {
        AudioManager.stopBgm();
    }

    await preloadNoteImages();

    document.getElementById('noteViewerModal').style.display = 'flex';

    if (!noteAudio) {
        noteAudio = new Audio('audio/bgm/The truth that you leave.ogg');
        noteAudio.loop = true;
        fadeInAudio(noteAudio, 1.0, 2000);
    }

    const lang = getCurrentLang();
    const txtPath = `data/note/${lang}.txt`;

    try {
        const response = await fetch(txtPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const textData = await response.text();
        parseAndRenderNote(textData);
    } catch (e) {
        console.error("Error al cargar el archivo de texto de la nota:", e);
        if (lang !== 'en') {
            try {
                const fallbackRes = await fetch(`data/note/en.txt`);
                const fallbackText = await fallbackRes.text();
                parseAndRenderNote(fallbackText);
            } catch (err) {
                console.error("Error cargando nota en fallback:", err);
            }
        }
    }
}

function setupScrollProgress() {
    const scrollArea = document.getElementById('noteScrollArea');
    const progressBar = document.getElementById('noteScrollProgress');

    if (scrollArea && progressBar) {
        scrollArea.onscroll = function() {
            const scrollTop = scrollArea.scrollTop;
            const scrollHeight = scrollArea.scrollHeight - scrollArea.clientHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
        };
    }
}

function parseAndRenderNote(rawText) {
    const textContainer = document.getElementById('noteTextContent');
    const scrollArea = document.getElementById('noteScrollArea');
    textContainer.innerHTML = '';
    scrollArea.scrollTop = 0;

    currentDisplayedImg = null;
    const imgElem = document.getElementById('noteImage');
    imgElem.style.opacity = '0';
    imgElem.src = '';

    const tagRegex = /\[IMG:(1|2|3|NONE)\]/g;

    let lastIndex = 0;
    let match;

    while ((match = tagRegex.exec(rawText)) !== null) {
        const textBefore = rawText.substring(lastIndex, match.index).trim();
        
        if (textBefore.length > 0) {
            const p = document.createElement('p');
            p.textContent = textBefore;
            textContainer.appendChild(p);
        }

        const imgKey = match[1];
        const trigger = document.createElement('div');
        trigger.className = 'note-img-trigger';
        trigger.dataset.imgKey = imgKey;
        textContainer.appendChild(trigger);

        lastIndex = tagRegex.lastIndex;
    }

    const remainingText = rawText.substring(lastIndex).trim();
    if (remainingText.length > 0) {
        const p = document.createElement('p');
        p.textContent = remainingText;
        textContainer.appendChild(p);
    }

    setupIntersectionObserver();
    setupScrollProgress();
}

function setupIntersectionObserver() {
    if (observer) {
        observer.disconnect();
    }

    const scrollArea = document.getElementById('noteScrollArea');
    
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const imgKey = entry.target.dataset.imgKey;
                changeImageWithFade(IMAGE_MAP[imgKey]);
            }
        });
    }, {
        root: scrollArea,
        threshold: 0.1,
        rootMargin: "0px 0px -50% 0px"
    });

    const triggers = document.querySelectorAll('.note-img-trigger');
    triggers.forEach(trigger => observer.observe(trigger));
}

function changeImageWithFade(newSrc) {
    if (currentDisplayedImg === newSrc) return;
    currentDisplayedImg = newSrc;

    const imgElem = document.getElementById('noteImage');

    imgElem.style.opacity = '0';

    setTimeout(() => {
        if (newSrc && newSrc !== 'NONE') {
            imgElem.src = newSrc;
            imgElem.style.display = 'block';
            imgElem.style.opacity = '1';
        } else {
            imgElem.src = '';
            imgElem.style.display = 'none';
        }
    }, 500);
}

function closeNoteViewer() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }

    document.getElementById('noteViewerModal').style.display = 'none';

    fadeOutAudio(noteAudio, 1000, () => {
        noteAudio = null;
    });

    enableGameInput();

    if (typeof $gameSystem !== 'undefined' && typeof AudioManager !== 'undefined') {
        const bgm = $gameSystem.saveBgm();
        if (bgm && bgm.name) {
            AudioManager.playBgm(bgm);
        } else {
            AudioManager.stopBgm();
        }
    }
}

setInterval(() => {
    if (typeof $gameMap !== 'undefined' && $gameMap && typeof $gamePlayer !== 'undefined') {
        const btnContainer = document.getElementById('note-access-container');
        if (btnContainer) {
            const isMap27 = $gameMap.mapId() === 27;
            const isTransferring = $gamePlayer.isTransferring();

            if (isMap27 && !isTransferring) {
                localStorage.setItem('has_visited_map_27', 'true');
            }

            const hasVisited = localStorage.getItem('has_visited_map_27') === 'true';
            if (hasVisited) {
                btnContainer.style.display = 'block';
            } else {
                btnContainer.style.display = 'none';
            }
        }
    }
}, 250);

function disableGameInput() {
    if (typeof Input !== 'undefined' && Input._currentState) {
        Input.clear();
    }
    if (typeof TouchInput !== 'undefined') {
        TouchInput.clear();
    }

    if (!noteKeyBlocker) {
        noteKeyBlocker = function(event) {
            event.stopPropagation();
            if (event.key === 'Escape') {
                closeNoteViewer();
            }
        };

        window.addEventListener('keydown', noteKeyBlocker, true);
        window.addEventListener('keyup', noteKeyBlocker, true);
        window.addEventListener('keypress', noteKeyBlocker, true);
    }
}

function enableGameInput() {
    if (noteKeyBlocker) {
        window.removeEventListener('keydown', noteKeyBlocker, true);
        window.removeEventListener('keyup', noteKeyBlocker, true);
        window.removeEventListener('keypress', noteKeyBlocker, true);
        noteKeyBlocker = null;
    }

    if (typeof Input !== 'undefined') {
        Input.clear();
    }
    if (typeof TouchInput !== 'undefined') {
        TouchInput.clear();
    }
}

function fadeInAudio(audio, targetVolume = 1.0, duration = 1500) {
    if (!audio) return;
    audio.volume = 0;
    audio.play().catch(e => console.log("Audio play error:", e));
    
    const step = 50;
    const increment = targetVolume / (duration / step);
    
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (audio.volume + increment < targetVolume) {
            audio.volume += increment;
        } else {
            audio.volume = targetVolume;
            clearInterval(fadeInterval);
        }
    }, step);
}

function fadeOutAudio(audio, duration = 1000, callback = null) {
    if (!audio) {
        if (callback) callback();
        return;
    }
    const step = 50;
    const decrement = audio.volume / (duration / step);
    
    clearInterval(fadeInterval);
    fadeInterval = setInterval(() => {
        if (audio.volume - decrement > 0) {
            audio.volume -= decrement;
        } else {
            audio.volume = 0;
            audio.pause();
            clearInterval(fadeInterval);
            if (callback) callback();
        }
    }, step);
}

const pinTranslations = {
    'en': {
        title: "Type the 4-Digit Pin",
        cancel: "Cancel",
        accept: "Accept",
        error: "Wrong PIN, look around in chapter 5 to find it"
    },
    'es': {
        title: "Introduce el PIN de 4 dígitos",
        cancel: "Cancelar",
        accept: "Aceptar",
        error: "PIN incorrecto, busca en el capítulo 5 para encontrarlo"
    },
    'cn': {
        title: "请输入4位密码",
        cancel: "取消",
        accept: "确认",
        error: "密码错误，请在第5章附近寻找线索"
    },
    'jp': {
        title: "4桁の暗証番号を入力",
        cancel: "キャンセル",
        accept: "決定",
        error: "暗証番号が違います。第5章を探してみてください"
    },
    'ru': {
        title: "Введите 4-значный ПИН-код",
        cancel: "Отмена",
        accept: "Принять",
        error: "Неверный ПИН-код, поищите в главе 5"
    },
    'pt': {
        title: "Digite o PIN de 4 dígitos",
        cancel: "Cancelar",
        accept: "Aceitar",
        error: "PIN incorreto, procure pelo capítulo 5 para encontrá-lo"
    }
};

function updatePinModalLanguage(lang) {
    const t = pinTranslations[lang] || pinTranslations['en'];

    const pinTitle = document.getElementById('pinTitle');
    const btnPinCancel = document.getElementById('btnPinCancel');
    const btnPinAccept = document.getElementById('btnPinAccept');
    const pinError = document.getElementById('pinError');

    if (pinTitle) pinTitle.textContent = t.title;
    if (btnPinCancel) btnPinCancel.textContent = t.cancel;
    if (btnPinAccept) btnPinAccept.textContent = t.accept;
    if (pinError) pinError.textContent = t.error;
}
