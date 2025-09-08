// =============================
// CONFIGURACIÓN FORMULARIO
// =============================
// ⚠️ Endpoint real de Formspree:
const FORM_ENDPOINT = "https://formspree.io/f/mzzayovn";

// Mensajes UI para el botón de enviar
const UI_TEXT = {
  es: { sending: "Enviando...", sent_ok: "¡Mensaje enviado! Te responderé pronto.", sent_err: "No se pudo enviar el mensaje.", check_fields: "Por favor, revisa los campos marcados.", net_err: "Error de red. Inténtalo de nuevo." },
  en: { sending: "Sending...", sent_ok: "Message sent! I'll reply soon.", sent_err: "Message could not be sent.", check_fields: "Please check the highlighted fields.", net_err: "Network error. Try again." }
};

// =============================
// VARIABLES GLOBALES
// =============================
let activeWindows = [];
let windowCounter = 0;
let isDarkTheme = false;

const LANG_KEY = "portfolio_lang";
let currentLanguage = localStorage.getItem(LANG_KEY) || (navigator.language && navigator.language.toLowerCase().startsWith("es") ? "es" : "en");

let isMaximized = false;
let currentTheme = localStorage.getItem('theme') || 'light';
let openWindows = [];
let isMobile = window.innerWidth <= 768;

// Elementos DOM
const desktop = document.getElementById('desktop');
const startButton = document.getElementById('startButton');
const startMenu = document.getElementById('startMenu');
const themeToggle = document.getElementById('themeToggle');
const languageToggle = document.getElementById('languageToggle');
const languageMenu = document.getElementById('languageMenu');
const taskbarApps = document.getElementById('taskbarApps');
const taskbarTime = document.getElementById('taskbarTime');
const searchInput = document.getElementById('searchInput');

// --- Menú inicio móvil ---
const mobileWindowsBtn = document.getElementById('mobileWindowsBtn');
const mobileStartMenu = document.getElementById('mobileStartMenu');

if (mobileWindowsBtn && mobileStartMenu) {
    let startMenuOpen = false;

    function openMobileStartMenu() {
        mobileStartMenu.style.display = 'block';
        setTimeout(() => {
            mobileStartMenu.classList.add('active');
        }, 10);
        startMenuOpen = true;
    }
    function closeMobileStartMenu() {
        mobileStartMenu.classList.remove('active');
        setTimeout(() => {
            mobileStartMenu.style.display = 'none';
        }, 200);
        startMenuOpen = false;
    }
    mobileWindowsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (startMenuOpen) {
            closeMobileStartMenu();
        } else {
            openMobileStartMenu();
        }
    });
    // Cerrar menú al pulsar fuera
    document.addEventListener('click', (e) => {
        if (startMenuOpen && !mobileStartMenu.contains(e.target) && e.target !== mobileWindowsBtn) {
            closeMobileStartMenu();
        }
    });
    // Al pulsar una opción del menú
    mobileStartMenu.querySelectorAll('.mobile-start-app').forEach(app => {
        app.addEventListener('click', (e) => {
            const win = app.getAttribute('data-window');
            if (win) {
                openWindow(win);
            }
            closeMobileStartMenu();
        });
    });
}

// Traducciones
const translations = {
  es: {
    projects: "Proyectos",
    cv: "CV",
    about: "Sobre mí",
    skills: "Habilidades",
    contact: "Contacto",
    portfolioTitle: "Portafolio de Ainhoa",
    portfolioSubtitle: "Tu sistema operativo personal",
    startMenuSearch: "Buscar en el portafolio...",
    searchPlaceholder: "Buscar apps o archivos...",
    contactTitle: "Contáctame",
    namePlaceholder: "Nombre",
    emailPlaceholder: "Correo electrónico",
    messagePlaceholder: "Mensaje",
    sendButton: "Enviar"
  },
  en: {
    projects: "Projects",
    cv: "CV",
    about: "About me",
    skills: "Skills",
    contact: "Contact",
    portfolioTitle: "Ainhoa's Portfolio",
    portfolioSubtitle: "Your personal operating system",
    startMenuSearch: "Search the portfolio...",
    searchPlaceholder: "Search apps or files...",
    contactTitle: "Contact me",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    messagePlaceholder: "Message",
    sendButton: "Send"
  }
};

// Idioma inicial
function getInitialLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved) return saved;
  return navigator.language && navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

function applyTranslations(lang) {
  // Textos
  document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.getAttribute("data-translate");
    const txt = translations[lang]?.[key];
    if (typeof txt === "string") el.textContent = txt;
  });

  // Placeholders
  document.querySelectorAll("[data-translate-placeholder]").forEach(el => {
    const key = el.getAttribute("data-translate-placeholder");
    const txt = translations[lang]?.[key];
    if (typeof txt === "string") el.setAttribute("placeholder", txt);
  });

  // Otros atributos
  document.querySelectorAll("[data-translate-title]").forEach(el => {
    const key = el.getAttribute("data-translate-title");
    const txt = translations[lang]?.[key];
    if (typeof txt === "string") el.setAttribute("title", txt);
  });
  document.querySelectorAll("[data-translate-aria]").forEach(el => {
    const key = el.getAttribute("data-translate-aria");
    const txt = translations[lang]?.[key];
    if (typeof txt === "string") el.setAttribute("aria-label", txt);
  });

  // Indicadores
  const langBtn = document.getElementById("languageToggle");
  if (langBtn) {
    const span = langBtn.querySelector("span");
    if (span) span.textContent = lang.toUpperCase();
  }
  const mobileLangBtn = document.getElementById("mobileLanguageBtn");
  if (mobileLangBtn) {
    const span = mobileLangBtn.querySelector("span");
    if (span) span.textContent = lang === "es" ? "Idioma" : "Language";
  }
  document.documentElement.setAttribute("lang", lang);
}

function setLang(lang) {
  currentLanguage = lang;
  localStorage.setItem(LANG_KEY, lang);
  applyTranslations(lang);
  // Forzar actualización de textos dependientes
  changeLanguage(lang);
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations(getInitialLang());

  const toggle = document.getElementById("languageToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const current = localStorage.getItem(LANG_KEY) || getInitialLang();
      setLang(current === "es" ? "en" : "es");
    });
  }

  const languageMenu = document.getElementById("languageMenu");
  if (languageMenu) {
    languageMenu.addEventListener("click", (e) => {
      const option = e.target.closest(".language-option");
      if (!option) return;
      const newLang = option.dataset.lang;
      if (newLang === "es" || newLang === "en") setLang(newLang);
    });
  }

  const mobileLanguageBtn = document.getElementById("mobileLanguageBtn");
  if (mobileLanguageBtn) {
    mobileLanguageBtn.addEventListener("click", () => {
      const current = localStorage.getItem(LANG_KEY) || getInitialLang();
      setLang(current === "es" ? "en" : "es");
    });
  }
});

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    loadSavedPreferences();
    initializeApp();

    const savedLanguage = localStorage.getItem(LANG_KEY) || getInitialLang();
    setTimeout(() => {
        changeLanguage(savedLanguage);
    }, 100);

    updateTime();
    setInterval(updateTime, 1000);
});

function initializeApp() {
    // Detectar si es móvil
    isMobile = window.innerWidth <= 768;

    if (isMobile) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
        setupDesktopExperience();
    }

    // Doble clic iconos escritorio
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('dblclick', function() {
            const windowType = this.getAttribute('data-window');
            openWindow(windowType);
        });
    });

    // Doble clic menú inicio
    document.querySelectorAll('.start-app').forEach(app => {
        app.addEventListener('dblclick', function() {
            const windowType = this.getAttribute('data-window');
            openWindow(windowType);
            toggleStartMenu();
        });
    });

    // Botones varios
    if (startButton) startButton.addEventListener('click', toggleStartMenu);
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (languageToggle) languageToggle.addEventListener('click', toggleLanguageMenu);

    // Selector idioma
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
            toggleLanguageMenu();
        });
    });

    // Búsqueda
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', handleSearchKeyPress);
        searchInput.addEventListener('focus', function() {
            this.parentElement.style.background = 'var(--bg-secondary)';
            this.parentElement.style.borderColor = 'var(--accent-color)';
        });
        searchInput.addEventListener('blur', function() {
            this.parentElement.style.background = 'var(--search-bg)';
            this.parentElement.style.borderColor = 'var(--search-border)';
        });
    }

    // Cerrar menús al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (startMenu && !startMenu.contains(e.target) && !startButton.contains(e.target)) {
            startMenu.style.display = 'none';
        }
        if (languageMenu && !languageMenu.contains(e.target) && !languageToggle.contains(e.target)) {
            languageMenu.style.display = 'none';
        }
    });

    // Inicializar skills
    initializeSkillLevels();

    // Formulario de contacto (delegado: ver al final del archivo)
    // (Quitamos el listener directo aquí para que funcione también en ventanas clonadas)

    // Botón de encendido
    const powerButton = document.querySelector('.power-button');
    if (powerButton) {
        powerButton.addEventListener('click', function() {
            if (confirm('¿Estás seguro de que quieres cerrar el portafolio?')) {
                window.close();
            }
        });
    }
}

function setupDesktopExperience() {
    const desktopElements = document.querySelectorAll('.desktop-icons, .taskbar');
    desktopElements.forEach(el => el.style.display = 'flex');
}

function openWindow(windowType) {
    const windowId = `${windowType}-window`;
    let windowEl = document.getElementById(windowId);

    if (!windowEl) {
        console.error(`Ventana ${windowId} no encontrada`);
        return;
    }

    if (windowEl.style.display !== 'none') {
        bringToFront(windowEl);
        return;
    }

    const newWindow = windowEl.cloneNode(true);
    const uniqueId = `${windowType}-${++windowCounter}`;
    newWindow.id = uniqueId;

    const windowWidth = 800;
    const windowHeight = 600;

    const desktopElement = document.getElementById('desktop');
    const desktopRect = desktopElement.getBoundingClientRect();
    const desktopWidth = desktopRect.width;
    const desktopHeight = desktopRect.height;

    const left = Math.max(0, (desktopWidth - windowWidth) / 2);
    const top = Math.max(0, (desktopHeight - windowHeight) / 2);

    newWindow.style.left = `${left}px`;
    newWindow.style.top = `${top}px`;
    newWindow.style.display = 'block';
    newWindow.style.zIndex = 1000 + activeWindows.length;

    desktop.appendChild(newWindow);

    setupWindowEvents(newWindow, windowType);
    addToTaskbar(uniqueId, windowType);
    updateWindowTitle(newWindow, windowType);

    activeWindows.push({
        id: uniqueId,
        type: windowType,
        element: newWindow,
        isMaximized: false
    });

    bringToFront(newWindow);

    if (windowType === 'cv') {
        setupCVFunctionalityForWindow(newWindow);
    }
    if (windowType === 'skills') {
        setupSkillsNavigationForWindow(newWindow);
    }
}

function setupWindowEvents(windowEl, windowType) {
    const header = windowEl.querySelector('.window-header');
    const closeBtn = windowEl.querySelector('.close-btn');
    const minimizeBtn = windowEl.querySelector('.minimize-btn');
    const maximizeBtn = windowEl.querySelector('.maximize-btn');

    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    header.addEventListener('mousedown', function(e) {
        if (e.target.closest('.window-controls')) return;

        isDragging = true;
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        header.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;

        windowEl.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });

    document.addEventListener('mouseup', function() {
        if (!isDragging) return;

        isDragging = false;
        header.style.cursor = 'grab';

        const rect = windowEl.getBoundingClientRect();
        windowEl.style.left = rect.left + 'px';
        windowEl.style.top = rect.top + 'px';
        windowEl.style.transform = 'none';
    });

    if (closeBtn) closeBtn.addEventListener('click', function() { closeWindow(windowEl); });
    if (minimizeBtn) minimizeBtn.addEventListener('click', function() { minimizeWindow(windowEl); });
    if (maximizeBtn) maximizeBtn.addEventListener('click', function() { toggleMaximize(windowEl); });

    windowEl.addEventListener('click', function() { bringToFront(windowEl); });

    setupWindowResize(windowEl);
}

function setupWindowResize(windowEl) {
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';
    resizeHandle.style.cssText = `
        position: absolute;
        bottom: 0;
        right: 0;
        width: 15px;
        height: 15px;
        cursor: se-resize;
        background: linear-gradient(-45deg, transparent 30%, var(--border-color) 30%, var(--border-color) 40%, transparent 40%, transparent 60%, var(--border-color) 60%, var(--border-color) 70%, transparent 70%);
        border-radius: 0 0 12px 0;
    `;

    windowEl.appendChild(resizeHandle);

    let isResizing = false;
    let startWidth, startHeight, startX, startY;

    resizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;
        startWidth = windowEl.offsetWidth;
        startHeight = windowEl.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;

        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);

        if (newWidth > 300 && newHeight > 200) {
            windowEl.style.width = newWidth + 'px';
            windowEl.style.height = newHeight + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isResizing = false;
    });
}

function toggleMaximize(windowEl) {
    const windowData = activeWindows.find(w => w.element === windowEl);
    if (!windowData) return;

    const maximizeBtn = windowEl.querySelector('.maximize-btn i');

    if (windowData.isMaximized) {
        windowEl.classList.remove('maximized');
        windowEl.style.left = windowData.originalPosition?.left || '100px';
        windowEl.style.top = windowData.originalPosition?.top || '100px';
        windowEl.style.width = windowData.originalPosition?.width || '400px';
        windowEl.style.height = windowData.originalPosition?.height || '300px';
        windowData.isMaximized = false;
        if (maximizeBtn) maximizeBtn.className = 'fas fa-expand';
    } else {
        windowData.originalPosition = {
            left: windowEl.style.left,
            top: windowEl.style.top,
            width: windowEl.style.width,
            height: windowEl.style.height
        };
        windowEl.classList.add('maximized');
        windowData.isMaximized = true;
        if (maximizeBtn) maximizeBtn.className = 'fas fa-compress';
    }
}

function bringToFront(windowEl) {
    document.querySelectorAll('.window').forEach(w => w.classList.remove('active'));
    windowEl.classList.add('active');

    const maxZ = Math.max(...Array.from(document.querySelectorAll('.window')).map(w => parseInt(w.style.zIndex) || 0));
    windowEl.style.zIndex = maxZ + 1;

    updateTaskbarActive(windowEl.id);
}

function closeWindow(windowEl) {
    const windowId = windowEl.id;
    activeWindows = activeWindows.filter(w => w.id !== windowId);
    removeFromTaskbar(windowId);
    windowEl.remove();
}

function minimizeWindow(windowEl) {
    windowEl.style.display = 'none';
    updateTaskbarActive(windowEl.id, false);
}

function addToTaskbar(windowId, windowType) {
    const existingButton = document.querySelector(`.taskbar-app[data-window-id="${windowId}"]`);
    if (existingButton) {
        existingButton.style.display = 'flex';
        updateTaskbarButtonText(existingButton, windowType);
        return existingButton;
    }

    const taskbarApp = document.createElement('div');
    taskbarApp.className = 'taskbar-app';
    taskbarApp.setAttribute('data-window-id', windowId);
    taskbarApp.setAttribute('data-window-type', windowType);

    const icons = {
        'projects': 'fas fa-folder',
        'cv': 'fas fa-file-pdf',
        'about': 'fas fa-user',
        'skills': 'fas fa-tools',
        'contact': 'fas fa-envelope'
    };

    const iconClass = icons[windowType] || 'fas fa-window';

    taskbarApp.innerHTML = `
        <i class="${iconClass}"></i>
        <span></span>
    `;

    taskbarApp.addEventListener('click', function() {
        const win = document.getElementById(windowId);
        if (win) {
            if (win.style.display === 'none') {
                win.style.display = 'block';
                bringToFront(win);
            } else {
                minimizeWindow(win);
            }
        }
    });

    taskbarApps.appendChild(taskbarApp);
    updateTaskbarButtonText(taskbarApp, windowType);
    return taskbarApp;
}

function updateTaskbarButtonText(button, windowType) {
    const translationKey = windowType === 'cv' ? 'cv' : windowType;
    const span = button.querySelector('span');

    if (span && translations[currentLanguage] && translations[currentLanguage][translationKey]) {
        span.textContent = translations[currentLanguage][translationKey];
    }
}

function removeFromTaskbar(windowId) {
    const taskbarApp = taskbarApps.querySelector(`[data-window-id="${windowId}"]`);
    if (taskbarApp) taskbarApp.remove();
}

function updateTaskbarActive(windowId, isActive = true) {
    document.querySelectorAll('.taskbar-app').forEach(app => app.classList.remove('active'));
    if (isActive) {
        const taskbarApp = taskbarApps.querySelector(`[data-window-id="${windowId}"]`);
        if (taskbarApp) taskbarApp.classList.add('active');
    }
}

function toggleStartMenu() {
    if (startMenu.style.display === 'none' || !startMenu.style.display) {
        startMenu.style.display = 'block';
    } else {
        startMenu.style.display = 'none';
    }
}

function toggleLanguageMenu() {
    if (languageMenu.style.display === 'none' || !languageMenu.style.display) {
        languageMenu.style.display = 'block';
    } else {
        languageMenu.style.display = 'none';
    }
}

function changeLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`El idioma '${lang}' no está soportado`);
        return;
    }
    currentLanguage = lang;

    // Botón idioma escritorio
    const langToggle = document.getElementById('languageToggle');
    if (langToggle) {
        const span = langToggle.querySelector('span');
        if (span) span.textContent = lang.toUpperCase();
    }
    // Botón idioma móvil
    const mobileLangBtn = document.getElementById('mobileLanguageBtn');
    if (mobileLangBtn) {
        const mobileLangText = mobileLangBtn.querySelector('span');
        if (mobileLangText) mobileLangText.textContent = lang === 'es' ? 'Español' : 'English';
    }

    // Placeholders
    if (searchInput) searchInput.placeholder = translations[lang].searchPlaceholder || '';
    const startMenuSearch = document.querySelector('.start-menu-search input');
    if (startMenuSearch) startMenuSearch.placeholder = translations[lang].startMenuSearch || '';

    // Títulos menú inicio
    const startMenuTitle = document.querySelector('.start-menu-header h3');
    if (startMenuTitle) startMenuTitle.textContent = translations[lang].portfolioTitle || '';
    const startMenuSubtitle = document.querySelector('.start-menu-header p');
    if (startMenuSubtitle) startMenuSubtitle.textContent = translations[lang].portfolioSubtitle || '';

    // Opciones idioma
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) option.classList.add('active');
    });

    // data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key] !== undefined) {
            element.textContent = translations[lang][key];
        }
    });
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[lang] && translations[lang][key] !== undefined) {
            element.placeholder = translations[lang][key];
        }
    });
    document.querySelectorAll('[data-translate-title]').forEach(element => {
        const key = element.getAttribute('data-translate-title');
        if (translations[lang] && translations[lang][key] !== undefined) {
            element.title = translations[lang][key];
        }
    });

    updateWindowTitles();

    // Actualizar botones de la barra de tareas
    document.querySelectorAll('.taskbar-app').forEach(button => {
        const windowType = button.getAttribute('data-window-type');
        if (windowType) updateTaskbarButtonText(button, windowType);
    });

    // Refrescar UI dependiente
    document.dispatchEvent(new Event('languageChanged'));
    localStorage.setItem(LANG_KEY, lang);
}

// Actualiza el título de una ventana específica
function updateWindowTitle(windowElement, windowType) {
    const titleElement = windowElement.querySelector('.window-title span');
    if (!titleElement) return;

    const windowTypeMap = {
        'projects': 'projects',
        'cv': 'cv',
        'about': 'about',
        'skills': 'skills',
        'contact': 'contact'
    };
    const translationKey = windowTypeMap[windowType] || windowType;

    if (translations[currentLanguage] && translations[currentLanguage][translationKey]) {
        titleElement.textContent = translations[currentLanguage][translationKey];
    }
}

// Actualiza títulos de todas las ventanas y botones de taskbar (corregido selector)
function updateWindowTitles() {
    document.querySelectorAll('.window').forEach(windowEl => {
        const windowId = windowEl.id;
        const windowType = windowId.replace(/-window.*$/, '');
        updateWindowTitle(windowEl, windowType);

        const taskbarButton = document.querySelector(`.taskbar-app[data-window-type="${windowType}"]`);
        if (taskbarButton) {
            const buttonText = taskbarButton.querySelector('span');
            const titleElement = windowEl.querySelector('.window-title span');
            if (buttonText && titleElement) buttonText.textContent = titleElement.textContent;
        }
    });

    document.querySelectorAll('.taskbar-app').forEach(button => {
        const windowType = button.getAttribute('data-window-type');
        if (windowType) {
            const translationKey = windowType === 'cv' ? 'cv' : windowType;
            if (translations[currentLanguage] && translations[currentLanguage][translationKey]) {
                const buttonText = button.querySelector('span');
                if (buttonText) buttonText.textContent = translations[currentLanguage][translationKey];
            }
        }
    });
}

let searchTimeout;

function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();

    if (searchTimeout) clearTimeout(searchTimeout);

    if (query.length < 2) {
        clearSearchMessage();
        clearSuggestions();
        return;
    }

    const searchableItems = [
        { type: 'projects', keywords: ['proyectos','proyecto','folder','carpeta','código','code','frontend','backend','api','web','app','aplicación','aplicacion','trabajos'], title: 'Proyectos' },
        { type: 'cv', keywords: ['cv','curriculum','curriculum vitae','pdf','descargar','download','resume','vitae','currículum'], title: 'CV - Curriculum Vitae' },
        { type: 'about', keywords: ['sobre mí','sobre mi','about','perfil','profile','usuario','user','información','informacion','mí','mi','acerca'], title: 'Sobre mí' },
        { type: 'skills', keywords: ['skills','habilidades','herramientas','tools','tecnologías','tecnologias','lenguajes','frameworks','java','javascript','css','html','tecnologia','conocimientos'], title: 'Skills' },
        { type: 'contact', keywords: ['contacto','contact','mensaje','message','email','correo','enviar','send','formulario','form'], title: 'Contacto' }
    ];

    const exactMatches = searchableItems.filter(item =>
      item.keywords.some(keyword => keyword === query)
    );

    let partialMatches = [];
    if (exactMatches.length === 0) {
        partialMatches = searchableItems.filter(item =>
          item.keywords.some(keyword => keyword.startsWith(query))
        );
    }

    clearSearchMessage();
    clearSuggestions();

    if (exactMatches.length > 0) {
        const firstMatch = exactMatches[0];
        openWindow(firstMatch.type);
        showSearchMessage(`Abriendo: ${firstMatch.title}`, 'success');
        setTimeout(() => {
            e.target.value = '';
            clearSearchMessage();
        }, 2000);
    } else if (partialMatches.length > 0) {
        showSuggestions(partialMatches, query);
    } else {
        showNotFoundModal(query);
    }
}

function handleSearchKeyPress(e) {
    if (e.key === 'Enter') {
        const query = e.target.value.toLowerCase().trim();
        if (query.length >= 2) handleSearch(e);
    }
}

function showSearchMessage(message, type) {
    clearSearchMessage();

    const searchBar = document.querySelector('.search-bar');
    const messageDiv = document.createElement('div');
    messageDiv.className = `search-message ${type}`;
    messageDiv.textContent = message;

    let messageContainer = document.querySelector('.search-message-container');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'search-message-container';
        messageContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            z-index: 1000;
            margin-top: 4px;
        `;
        searchBar.parentNode.insertBefore(messageContainer, searchBar.nextSibling);
    }

    messageDiv.style.cssText = `
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        animation: slideDown 0.3s ease;
        text-align: center;
        ${type === 'success' ?
            'background: rgba(40, 167, 69, 0.95); color: white; border: 1px solid rgba(40, 167, 69, 0.3);' :
            'background: rgba(220, 53, 69, 0.95); color: white; border: 1px solid rgba(220, 53, 69, 0.3);'
        }
    `;

    messageContainer.appendChild(messageDiv);
}

function clearSearchMessage() {
    const messageContainer = document.querySelector('.search-message-container');
    if (messageContainer) messageContainer.remove();
}

function clearSuggestions() {
    const suggestionsContainer = document.querySelector('.search-suggestions-container');
    if (suggestionsContainer) suggestionsContainer.remove();
}

function showSuggestions(matches, query) {
    clearSuggestions();

    const searchBar = document.querySelector('.search-bar');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions-container';

    const uniqueSuggestions = [];
    matches.forEach(match => {
        match.keywords.forEach(keyword => {
            if (keyword.startsWith(query) && !uniqueSuggestions.includes(keyword)) {
                uniqueSuggestions.push(keyword);
            }
        });
    });

    const limitedSuggestions = uniqueSuggestions.slice(0, 5);

    suggestionsContainer.innerHTML = `
        <div class="suggestions-list">
            ${limitedSuggestions.map(suggestion => `
                <div class="suggestion-item" data-suggestion="${suggestion}">
                    <i class="fas fa-search"></i>
                    <span class="suggestion-text">${suggestion}</span>
                </div>
            `).join('')}
        </div>
    `;

    suggestionsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 1000;
        margin-top: 4px;
        background: var(--bg-secondary);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border: 1px solid var(--border-color);
        overflow: hidden;
        animation: slideDown 0.3s ease;
    `;

    const suggestionsList = suggestionsContainer.querySelector('.suggestions-list');
    suggestionsList.style.cssText = `max-height: 200px; overflow-y: auto;`;

    const suggestionItems = suggestionsContainer.querySelectorAll('.suggestion-item');
    suggestionItems.forEach((item, index) => {
        item.style.cssText = `
            display: flex; align-items: center; gap: 10px; padding: 12px 16px;
            cursor: pointer; transition: all 0.2s ease; border-bottom: 1px solid var(--border-color);
            ${index === suggestionItems.length - 1 ? 'border-bottom: none;' : ''}
        `;
        const icon = item.querySelector('i');
        icon.style.cssText = `color: var(--accent-color); font-size: 14px; width: 16px;`;
        const text = item.querySelector('.suggestion-text');
        text.style.cssText = `color: var(--text-primary); font-size: 14px; flex: 1;`;

        item.addEventListener('mouseenter', function() { this.style.background = 'var(--bg-tertiary)'; });
        item.addEventListener('mouseleave', function() { this.style.background = 'transparent'; });
        item.addEventListener('click', function() {
            const suggestion = this.getAttribute('data-suggestion');
            const searchInput = document.getElementById('searchInput');
            searchInput.value = suggestion;
            searchInput.focus();
            clearSuggestions();
            handleSearch({ target: searchInput });
        });
    });

    searchBar.parentNode.insertBefore(suggestionsContainer, searchBar.nextSibling);

    document.addEventListener('click', function closeSuggestions(e) {
        if (!suggestionsContainer.contains(e.target) && !searchBar.contains(e.target)) {
            clearSuggestions();
            document.removeEventListener('click', closeSuggestions);
        }
    });

    let selectedIndex = -1;
    document.addEventListener('keydown', function handleKeyNavigation(e) {
        if (!suggestionsContainer.parentNode) {
            document.removeEventListener('keydown', handleKeyNavigation);
            return;
        }
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, suggestionItems.length - 1);
                updateSelection();
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                updateSelection();
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) suggestionItems[selectedIndex].click();
                break;
            case 'Escape':
                clearSuggestions();
                document.removeEventListener('keydown', handleKeyNavigation);
                break;
        }
    });

    function updateSelection() {
        suggestionItems.forEach((item, index) => {
            if (index === selectedIndex) {
                item.style.background = 'var(--accent-color)';
                item.querySelector('.suggestion-text').style.color = 'white';
                item.querySelector('i').style.color = 'white';
            } else {
                item.style.background = 'transparent';
                item.querySelector('.suggestion-text').style.color = 'var(--text-primary)';
                item.querySelector('i').style.color = 'var(--accent-color)';
            }
        });
    }
}

function showNotFoundModal(query) {
    const existingModal = document.querySelector('.not-found-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'not-found-modal';
    modal.innerHTML = `
        <div class="not-found-content">
            <div class="not-found-icon"><i class="fas fa-search"></i></div>
            <h3>No se encontró "${query}"</h3>
            <p>Prueba con alguna de estas opciones:</p>
            <div class="suggestions">
                <span class="suggestion">proyectos</span>
                <span class="suggestion">cv</span>
                <span class="suggestion">sobre mí</span>
                <span class="suggestion">skills</span>
                <span class="suggestion">contacto</span>
            </div>
            <button class="close-modal-btn"><i class="fas fa-times"></i></button>
        </div>
    `;

    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center;
        z-index: 10000; animation: fadeIn 0.3s ease;
    `;

    const content = modal.querySelector('.not-found-content');
    content.style.cssText = `
        background: var(--bg-secondary); border-radius: 12px; padding: 30px; text-align: center;
        max-width: 400px; width: 90%; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        border: 1px solid var(--border-color);
    `;

    const icon = modal.querySelector('.not-found-icon');
    icon.style.cssText = `font-size: 48px; color: var(--accent-color); margin-bottom: 20px;`;

    const title = modal.querySelector('h3');
    title.style.cssText = `color: var(--text-primary); margin-bottom: 15px; font-size: 18px;`;

    const description = modal.querySelector('p');
    description.style.cssText = `color: var(--text-secondary); margin-bottom: 20px; font-size: 14px;`;

    const suggestions = modal.querySelector('.suggestions');
    suggestions.style.cssText = `display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 20px;`;

    const suggestionSpans = modal.querySelectorAll('.suggestion');
    suggestionSpans.forEach(span => {
        span.style.cssText = `
            background: var(--accent-color); color: white; padding: 6px 12px;
            border-radius: 20px; font-size: 12px; cursor: pointer; transition: all 0.2s ease;
        `;
        span.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.05)'; this.style.background = '#005a9e'; });
        span.addEventListener('mouseleave', function() { this.style.transform = 'scale(1)'; this.style.background = 'var(--accent-color)'; });
        span.addEventListener('click', function() {
            const searchInput = document.getElementById('searchInput');
            searchInput.value = this.textContent;
            searchInput.focus();
            modal.remove();
            handleSearch({ target: searchInput });
        });
    });

    const closeBtn = modal.querySelector('.close-modal-btn');
    closeBtn.style.cssText = `
        position: absolute; top: 10px; right: 10px; background: none; border: none;
        color: var(--text-secondary); cursor: pointer; font-size: 16px; padding: 5px;
        border-radius: 50%; transition: all 0.2s ease;
    `;
    closeBtn.addEventListener('mouseenter', function() { this.style.background = 'var(--bg-tertiary)'; this.style.color = 'var(--text-primary)'; });
    closeBtn.addEventListener('mouseleave', function() { this.style.background = 'none'; this.style.color = 'var(--text-secondary)'; });
    closeBtn.addEventListener('click', function() { modal.remove(); });

    modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
    document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });

    document.body.appendChild(modal);

    const si = document.getElementById('searchInput');
    si.value = '';
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    currentTheme = isDarkTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    const icon = themeToggle.querySelector('i');
    icon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';

    localStorage.setItem('theme', currentTheme);
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString(currentLanguage === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString(currentLanguage === 'es' ? 'es-ES' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });

    taskbarTime.innerHTML = `<div class="time">${timeString}</div><div class="date">${dateString}</div>`;
}

function initializeSkillLevels() {
    const skillsWindow = document.getElementById('skills-window');
    if (!skillsWindow) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevels = entry.target.querySelectorAll('.skill-level');
                skillLevels.forEach(level => {
                    const percentage = level.getAttribute('data-level');
                    level.style.width = '0%';
                    setTimeout(() => { level.style.width = percentage + '%'; }, 100);
                });
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(skillsWindow);
}

// =============================
// ENVÍO REAL DEL FORMULARIO
// =============================
function handleContactSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const messageInput = form.querySelector('#message');
    const btnSend = form.querySelector('.btn-send');

    let statusEl = form.querySelector('#formStatus');
    if (!statusEl) {
        statusEl = document.createElement('div');
        statusEl.id = 'formStatus';
        statusEl.className = 'form-status';
        form.appendChild(statusEl);
    }

    const t = (typeof UI_TEXT !== 'undefined' && UI_TEXT[currentLanguage]) ? UI_TEXT[currentLanguage] : {
        sending: "Enviando...",
        sent_ok: "¡Mensaje enviado! Te responderé pronto.",
        sent_err: "No se pudo enviar el mensaje.",
        check_fields: "Por favor, revisa los campos marcados.",
        net_err: "Error de red. Inténtalo de nuevo."
    };

    // Validación simple
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    [nameInput, emailInput, messageInput].forEach(el => el && el.classList.remove('is-invalid'));
    let ok = true;
    if (!nameInput || nameInput.value.trim().length < 2) { if (nameInput) nameInput.classList.add('is-invalid'); ok = false; }
    if (!emailInput || !emailRe.test(emailInput.value.trim())) { if (emailInput) emailInput.classList.add('is-invalid'); ok = false; }
    if (!messageInput || messageInput.value.trim().length < 10) { if (messageInput) messageInput.classList.add('is-invalid'); ok = false; }

    statusEl.className = 'form-status';
    statusEl.textContent = '';
    if (!ok) {
        statusEl.textContent = t.check_fields;
        statusEl.classList.add('error');
        return;
    }

    const originalText = btnSend.innerHTML;
    btnSend.disabled = true;
    btnSend.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + t.sending;

    const data = new FormData(form);
    data.append('_replyto', emailInput.value.trim());
    if (!data.get('_subject')) data.append('_subject', 'Nuevo mensaje desde el portafolio');

    fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
    })
    .then(async (res) => {
        let body = null;
        try { body = await res.json(); } catch(_) {}
        if (res.ok) {
            form.reset();
            statusEl.textContent = t.sent_ok;
            statusEl.classList.add('success');
        } else {
            const msg = (body && body.errors && body.errors[0] && body.errors[0].message) ? body.errors[0].message : t.sent_err;
            statusEl.textContent = msg;
            statusEl.classList.add('error');
        }
    })
    .catch(() => {
        statusEl.textContent = t.net_err;
        statusEl.classList.add('error');
    })
    .finally(() => {
        btnSend.disabled = false;
        btnSend.innerHTML = originalText;
    });
}

function loadSavedPreferences() {
    // Tema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDarkTheme = savedTheme === 'dark';
        currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        const icon = themeToggle.querySelector('i');
        if (icon) icon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Idioma
    const savedLanguage = localStorage.getItem(LANG_KEY);
    if (savedLanguage) changeLanguage(savedLanguage);
}

// Atajos de teclado
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (startMenu) startMenu.style.display = 'none';
        if (languageMenu) languageMenu.style.display = 'none';
    }
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        openWindow('projects');
    }
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        toggleLanguageMenu();
    }
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
    if (e.key === 'F11') {
        e.preventDefault();
        const activeWindow = document.querySelector('.window.active');
        if (activeWindow) {
            const maximizeBtn = activeWindow.querySelector('.maximize-btn');
            if (maximizeBtn) maximizeBtn.click();
        }
    }
});

// Prevenir contexto del botón derecho en el escritorio
if (desktop) {
  desktop.addEventListener('contextmenu', function(e) { e.preventDefault(); });
}

// Efectos hover iconos escritorio
document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() { this.style.transform = 'scale(1.05)'; });
    icon.addEventListener('mouseleave', function() { this.style.transform = 'scale(1)'; });
});

// Animación carga inicial
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => { document.body.style.opacity = '1'; }, 100);
});

// --- Funcionalidad móvil ---
function setupMobileExperience() {
    updateMobileTime();
    setInterval(updateMobileTime, 1000);

    document.querySelectorAll('.mobile-app').forEach(app => {
        app.addEventListener('dblclick', function() {
            const windowType = this.getAttribute('data-window');
            openWindow(windowType);
        });
    });

    document.querySelectorAll('.mobile-system-app').forEach(app => {
        app.addEventListener('click', function() {
            const appType = this.classList.contains('messages') ? 'messages' :
                           this.classList.contains('google') ? 'google' : 'phone';
            handleMobileSystemApp(appType);
        });
    });

    const mobilePanel = document.getElementById('mobilePanel');
    if (mobilePanel) {
        const mobilePanelHandle = mobilePanel.querySelector('.mobile-panel-handle');
        if (mobilePanelHandle) {
          mobilePanelHandle.addEventListener('click', function() {
              mobilePanel.classList.toggle('expanded');
          });
        }
    }

    const mobileLanguageBtn = document.getElementById('mobileLanguageBtn');
    const mobileThemeBtn = document.getElementById('mobileThemeBtn');

    if (mobileLanguageBtn) {
      mobileLanguageBtn.addEventListener('click', function() {
          toggleLanguageMenu();
          showMobileLanguageMenu();
      });
    }

    if (mobileThemeBtn) {
      mobileThemeBtn.addEventListener('click', function() {
          toggleTheme();
          const icon = this.querySelector('i');
          const span = this.querySelector('span');
          if (isDarkTheme) {
              if (icon) icon.className = 'fas fa-sun';
              if (span) span.textContent = currentLanguage === 'es' ? 'Claro' : 'Light';
          } else {
              if (icon) icon.className = 'fas fa-moon';
              if (span) span.textContent = currentLanguage === 'es' ? 'Oscuro' : 'Dark';
          }
      });
    }
}

function updateMobileTime() {
    const mobileTime = document.getElementById('mobileTime');
    if (!mobileTime) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString(currentLanguage === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString(currentLanguage === 'es' ? 'es-ES' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });

    mobileTime.querySelector('.time').textContent = timeString;
    mobileTime.querySelector('.date').textContent = dateString;
}

function handleMobileSystemApp(appType) {
    switch(appType) {
        case 'messages':
            showMobileNotification('Mensajes', 'No hay mensajes nuevos');
            break;
        case 'google':
            showMobileNotification('Google', 'Abriendo Google...');
            setTimeout(() => { window.open('https://www.google.com', '_blank'); }, 1000);
            break;
        case 'phone':
            showMobileNotification('Teléfono', 'Llamando...');
            break;
    }
}

function showMobileNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'mobile-notification';
    notification.innerHTML = `
        <div class="notification-header">
            <strong>${title}</strong>
            <button class="notification-close">&times;</button>
        </div>
        <div class="notification-message">${message}</div>
    `;

    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: rgba(0,0,0,0.9); color: white;
        padding: 15px; border-radius: 10px; z-index: 3000; max-width: 250px; animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
    `;

    document.body.appendChild(notification);

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => { notification.remove(); });

    setTimeout(() => { if (notification.parentNode) notification.remove(); }, 3000);
}

function showMobileLanguageMenu() {
    const mobileLanguageMenu = document.createElement('div');
    mobileLanguageMenu.className = 'mobile-language-menu';
    mobileLanguageMenu.innerHTML = `
        <div class="mobile-language-header">
            <h3>Seleccionar idioma</h3>
            <button class="mobile-language-close">&times;</button>
        </div>
        <div class="mobile-language-options">
            <button class="mobile-language-option" data-lang="es"><span>🇪🇸</span><span>Español</span></button>
            <button class="mobile-language-option" data-lang="en"><span>🇺🇸</span><span>English</span></button>
        </div>
    `;

    mobileLanguageMenu.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: rgba(40, 40, 40, 0.95); backdrop-filter: blur(20px); border-radius: 15px;
        padding: 20px; z-index: 2000; min-width: 250px; animation: fadeIn 0.3s ease;
    `;

    document.body.appendChild(mobileLanguageMenu);

    mobileLanguageMenu.querySelector('.mobile-language-close').addEventListener('click', () => { mobileLanguageMenu.remove(); });
    mobileLanguageMenu.querySelectorAll('.mobile-language-option').forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
            mobileLanguageMenu.remove();
        });
    });
}

function detectMobile() {
    isMobile = window.innerWidth <= 768;

    if (isMobile) {
        document.body.classList.add('mobile');
        setupMobileExperience();
    } else {
        document.body.classList.remove('mobile');
        setupDesktopExperience();
    }
}

window.addEventListener('load', detectMobile);
window.addEventListener('resize', detectMobile);

// --- Funcionalidad del CV ---
function setupCVFunctionality() {
    const backToPreviewBtn = document.getElementById('backToPreviewBtn');
    const cvPreview = document.getElementById('cvPreview');
    const cvPdfViewer = document.getElementById('cvPdfViewer');

    if (backToPreviewBtn) {
        backToPreviewBtn.addEventListener('click', function() {
            if (cvPdfViewer) cvPdfViewer.style.display = 'none';
            if (cvPreview) cvPreview.style.display = 'block';
        });
    }
}

function setupCVFunctionalityForWindow(windowEl) {
    const backToPreviewBtn = windowEl.querySelector('#backToPreviewBtn');
    const cvPreview = windowEl.querySelector('#cvPreview');
    const cvPdfViewer = windowEl.querySelector('#cvPdfViewer');

    if (backToPreviewBtn) {
        backToPreviewBtn.addEventListener('click', function() {
            if (cvPdfViewer) cvPdfViewer.style.display = 'none';
            if (cvPreview) cvPreview.style.display = 'block';
        });
    }
}

// --- Skills ---
function setupSkillsNavigationForWindow(windowEl) {
    const categories = windowEl.querySelectorAll('.skills-category');
    const panels = windowEl.querySelectorAll('.skills-panel');

    categories.forEach(category => {
        category.addEventListener('click', () => {
            const targetCategory = category.getAttribute('data-category');

            categories.forEach(cat => cat.classList.remove('active'));
            category.classList.add('active');

            panels.forEach(panel => panel.classList.remove('active'));
            const targetPanel = windowEl.querySelector(`#${targetCategory}-panel`);
            if (targetPanel) targetPanel.classList.add('active');
            else console.error('Panel no encontrado:', `${targetCategory}-panel`);
        });
    });
}

function setupSkillsNavigation() {
    const categories = document.querySelectorAll('.skills-category');
    const panels = document.querySelectorAll('.skills-panel');

    categories.forEach(category => {
        category.addEventListener('click', () => {
            const targetCategory = category.getAttribute('data-category');

            categories.forEach(cat => cat.classList.remove('active'));
            category.classList.add('active');

            panels.forEach(panel => panel.classList.remove('active'));
            const targetPanel = document.getElementById(`${targetCategory}-panel`);
            if (targetPanel) targetPanel.classList.add('active');
            else console.error('Panel no encontrado:', `${targetCategory}-panel`);
        });
    });
}

// Listener delegado para formularios de contacto clonados
document.addEventListener('submit', function(e) {
  const form = e.target;
  if (form && form.id === 'contactForm') {
    handleContactSubmit(e);
  }
}, true);
