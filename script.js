// Variables globales
let activeWindows = [];
let windowCounter = 0;
let isDarkTheme = false;
let currentLanguage = localStorage.getItem('language') || 'es';
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
                // Lógica para abrir la ventana correspondiente
                openWindow(win); // Asume que existe la función openWindow
            }
            closeMobileStartMenu();
        });
    });
}

// Traducciones
const translations = {
    es: {
        searchPlaceholder: "Buscar apps o archivos...",
        startMenuSearch: "Buscar en el portafolio...",
        projects: "Proyectos",
        cv: "CV",
        about: "Sobre mí",
        skills: "Skills",
        contact: "Contacto",
        frontend: "Frontend",
        backend: "Backend",
        tools: "Herramientas",
        sendMessage: "Enviar Mensaje",
        downloadCV: "Descargar CV Completo",
        socialMedia: "Redes Sociales",
        aboutMe: "Sobre mí",
        myTimeline: "Mi Timeline",
        experience: "Experiencia",
        education: "Formación",
        fullStackDeveloper: "Desarrollador Full Stack",
        portfolioDescription: "Portafolio personal con diseño tipo escritorio Windows",
        ecommerceDescription: "Tienda online con carrito de compras y gestión de productos",
        apiDescription: "API para gestión de usuarios y autenticación",
        reportsDescription: "Aplicación de análisis de datos y generación de reportes",
        aboutDescription: "Soy un desarrollador con experiencia en tecnologías frontend y backend. Me especializo en Java, C#, JavaScript y frameworks modernos. Me gusta trabajar en proyectos desafiantes y aprender nuevas tecnologías.",
        contactForm: "Envíame un mensaje",
        name: "Nombre:",
        email: "Email:",
        message: "Mensaje:",
        sendButton: "Enviar Mensaje",
        successMessage: "¡Mensaje enviado con éxito!",
        portfolioTitle: "Portafolio de Diego",
        portfolioSubtitle: "Tu sistema operativo personal",
        socialNetworks: "Redes Sociales",
        portfolioApps: "Apps del Portafolio",
        systemApps: "Apps del Sistema"
    },
    en: {
        searchPlaceholder: "Search apps or files...",
        startMenuSearch: "Search in portfolio...",
        projects: "Projects",
        cv: "CV",
        about: "About",
        skills: "Skills",
        contact: "Contact",
        frontend: "Frontend",
        backend: "Backend",
        tools: "Tools",
        sendMessage: "Send Message",
        downloadCV: "Download Full CV",
        socialMedia: "Social Media",
        aboutMe: "About Me",
        myTimeline: "My Timeline",
        experience: "Experience",
        education: "Education",
        fullStackDeveloper: "Full Stack Developer",
        portfolioDescription: "Personal portfolio with Windows desktop design",
        ecommerceDescription: "Online store with shopping cart and product management",
        apiDescription: "API for user management and authentication",
        reportsDescription: "Data analysis application and report generation",
        aboutDescription: "I am a developer with experience in frontend and backend technologies. I specialize in Java, C#, JavaScript and modern frameworks. I like working on challenging projects and learning new technologies.",
        contactForm: "Send me a message",
        name: "Name:",
        email: "Email:",
        message: "Message:",
        sendButton: "Send Message",
        successMessage: "Message sent successfully!",
        portfolioTitle: "Diego's Portfolio",
        portfolioSubtitle: "Your personal operating system",
        socialNetworks: "Social Networks",
        portfolioApps: "Portfolio Apps",
        systemApps: "System Apps"
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateTime();
    setInterval(updateTime, 1000);
    loadSavedPreferences();
});

function initializeApp() {
    // Detectar si es móvil
    isMobile = window.innerWidth <= 768;
    
    // Aplicar estilos específicos de móvil
    if (isMobile) {
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
        setupDesktopExperience();
    }

    // Event listeners para iconos del escritorio
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const windowType = this.getAttribute('data-window');
            openWindow(windowType);
        });
    });

    // Event listeners para menú inicio
    document.querySelectorAll('.start-app').forEach(app => {
        app.addEventListener('click', function() {
            const windowType = this.getAttribute('data-window');
            openWindow(windowType);
            toggleStartMenu();
        });
    });

    // Botón inicio
    startButton.addEventListener('click', toggleStartMenu);

    // Toggle tema
    themeToggle.addEventListener('click', toggleTheme);

    // Toggle idioma
    languageToggle.addEventListener('click', toggleLanguageMenu);

    // Selector de idioma
    document.querySelectorAll('.language-option').forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
            toggleLanguageMenu();
        });
    });

    // Barra de búsqueda
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
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
        if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
            startMenu.style.display = 'none';
        }
        if (!languageMenu.contains(e.target) && !languageToggle.contains(e.target)) {
            languageMenu.style.display = 'none';
        }
    });

    // Inicializar niveles de skills
    initializeSkillLevels();

    // Formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

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
    // Mostrar elementos de escritorio
    const desktopElements = document.querySelectorAll('.desktop-icons, .taskbar');
    desktopElements.forEach(el => el.style.display = 'flex');
}

function openWindow(windowType) {
    const windowId = `${windowType}-window`;
    let window = document.getElementById(windowId);
    
    if (!window) {
        console.error(`Ventana ${windowId} no encontrada`);
        return;
    }

    // Si la ventana ya está abierta, traerla al frente
    if (window.style.display !== 'none') {
        bringToFront(window);
        return;
    }

    // Crear nueva instancia de ventana
    const newWindow = window.cloneNode(true);
    const uniqueId = `${windowType}-${++windowCounter}`;
    newWindow.id = uniqueId;
    
    // Posición inicial
    const offset = activeWindows.length * 30;
    newWindow.style.left = `${100 + offset}px`;
    newWindow.style.top = `${100 + offset}px`;
    newWindow.style.display = 'block';
    newWindow.style.zIndex = 1000 + activeWindows.length;
    
    desktop.appendChild(newWindow);
    
    // Configurar eventos de la ventana
    setupWindowEvents(newWindow, windowType);
    
    // Añadir a la barra de tareas
    addToTaskbar(uniqueId, windowType);
    
    // Añadir a la lista de ventanas activas
    activeWindows.push({
        id: uniqueId,
        type: windowType,
        element: newWindow,
        isMaximized: false
    });
    
    // Traer al frente
    bringToFront(newWindow);
    
    // Configurar funcionalidad específica del CV
    if (windowType === 'cv') {
        setupCVFunctionalityForWindow(newWindow);
    }
}

function setupWindowEvents(window, windowType) {
    const header = window.querySelector('.window-header');
    const closeBtn = window.querySelector('.close-btn');
    const minimizeBtn = window.querySelector('.minimize-btn');
    const maximizeBtn = window.querySelector('.maximize-btn');
    
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    let originalPosition = {};

    // Hacer ventana arrastrable
    header.addEventListener('mousedown', function(e) {
        if (e.target.closest('.window-controls')) return;
        
        isDragging = true;
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        header.style.cursor = 'grabbing';
        
        // Guardar posición original
        originalPosition = {
            left: window.style.left,
            top: window.style.top,
            width: window.style.width,
            height: window.style.height
        };
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        
        window.style.transform = `translate(${currentX}px, ${currentY}px)`;
    });

    document.addEventListener('mouseup', function() {
        if (!isDragging) return;
        
        isDragging = false;
        header.style.cursor = 'grab';
        
        // Actualizar posición absoluta
        const rect = window.getBoundingClientRect();
        window.style.left = rect.left + 'px';
        window.style.top = rect.top + 'px';
        window.style.transform = 'none';
    });

    // Botón cerrar
    closeBtn.addEventListener('click', function() {
        closeWindow(window);
    });

    // Botón minimizar
    minimizeBtn.addEventListener('click', function() {
        minimizeWindow(window);
    });

    // Botón maximizar
    maximizeBtn.addEventListener('click', function() {
        toggleMaximize(window);
    });

    // Hacer ventana activa al hacer clic
    window.addEventListener('click', function() {
        bringToFront(window);
    });

    // Redimensionar ventana
    setupWindowResize(window);
}

function setupWindowResize(window) {
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
    
    window.appendChild(resizeHandle);
    
    let isResizing = false;
    let startWidth, startHeight, startX, startY;

    resizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;
        startWidth = window.offsetWidth;
        startHeight = window.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        
        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);
        
        if (newWidth > 300 && newHeight > 200) {
            window.style.width = newWidth + 'px';
            window.style.height = newHeight + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isResizing = false;
    });
}

function toggleMaximize(window) {
    const windowData = activeWindows.find(w => w.element === window);
    if (!windowData) return;

    if (windowData.isMaximized) {
        // Restaurar
        window.classList.remove('maximized');
        window.style.left = windowData.originalPosition?.left || '100px';
        window.style.top = windowData.originalPosition?.top || '100px';
        window.style.width = windowData.originalPosition?.width || '400px';
        window.style.height = windowData.originalPosition?.height || '300px';
        windowData.isMaximized = false;
        
        const maximizeBtn = window.querySelector('.maximize-btn i');
        maximizeBtn.className = 'fas fa-expand';
    } else {
        // Maximizar
        windowData.originalPosition = {
            left: window.style.left,
            top: window.style.top,
            width: window.style.width,
            height: window.style.height
        };
        
        window.classList.add('maximized');
        windowData.isMaximized = true;
        
        const maximizeBtn = window.querySelector('.maximize-btn i');
        maximizeBtn.className = 'fas fa-compress';
    }
}

function bringToFront(window) {
    // Remover clase active de todas las ventanas
    document.querySelectorAll('.window').forEach(w => {
        w.classList.remove('active');
    });
    
    // Añadir clase active a la ventana actual
    window.classList.add('active');
    
    // Traer al frente
    const maxZ = Math.max(...Array.from(document.querySelectorAll('.window')).map(w => parseInt(w.style.zIndex) || 0));
    window.style.zIndex = maxZ + 1;
    
    // Actualizar barra de tareas
    updateTaskbarActive(window.id);
}

function closeWindow(window) {
    const windowId = window.id;
    
    // Remover de la lista de ventanas activas
    activeWindows = activeWindows.filter(w => w.id !== windowId);
    
    // Remover de la barra de tareas
    removeFromTaskbar(windowId);
    
    // Remover del DOM
    window.remove();
}

function minimizeWindow(window) {
    window.style.display = 'none';
    
    // Actualizar barra de tareas
    updateTaskbarActive(window.id, false);
}

function addToTaskbar(windowId, windowType) {
    const taskbarApp = document.createElement('div');
    taskbarApp.className = 'taskbar-app';
    taskbarApp.setAttribute('data-window-id', windowId);
    
    // Icono según el tipo de ventana
    const icons = {
        'projects': 'fas fa-folder',
        'cv': 'fas fa-file-pdf',
        'about': 'fas fa-user',
        'skills': 'fas fa-tools',
        'contact': 'fas fa-envelope'
    };
    
    taskbarApp.innerHTML = `<i class="${icons[windowType]}"></i>`;
    
    // Event listener para restaurar ventana
    taskbarApp.addEventListener('click', function() {
        const window = document.getElementById(windowId);
        if (window) {
            window.style.display = 'block';
            bringToFront(window);
        }
    });
    
    taskbarApps.appendChild(taskbarApp);
}

function removeFromTaskbar(windowId) {
    const taskbarApp = taskbarApps.querySelector(`[data-window-id="${windowId}"]`);
    if (taskbarApp) {
        taskbarApp.remove();
    }
}

function updateTaskbarActive(windowId, isActive = true) {
    // Remover clase active de todas las apps
    document.querySelectorAll('.taskbar-app').forEach(app => {
        app.classList.remove('active');
    });
    
    // Añadir clase active a la app correspondiente
    if (isActive) {
        const taskbarApp = taskbarApps.querySelector(`[data-window-id="${windowId}"]`);
        if (taskbarApp) {
            taskbarApp.classList.add('active');
        }
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
    currentLanguage = lang;
    
    // Actualizar botón de idioma
    const langToggle = document.getElementById('languageToggle');
    langToggle.querySelector('span').textContent = lang.toUpperCase();
    
    // Actualizar placeholders
    if (searchInput) {
        searchInput.placeholder = translations[lang].searchPlaceholder;
    }
    
    // Actualizar menú inicio
    const startMenuSearch = document.querySelector('.start-menu-search input');
    if (startMenuSearch) {
        startMenuSearch.placeholder = translations[lang].startMenuSearch;
    }
    
    // Actualizar títulos
    const startMenuTitle = document.querySelector('.start-menu-header h3');
    if (startMenuTitle) {
        startMenuTitle.textContent = translations[lang].portfolioTitle;
    }
    
    const startMenuSubtitle = document.querySelector('.start-menu-header p');
    if (startMenuSubtitle) {
        startMenuSubtitle.textContent = translations[lang].portfolioSubtitle;
    }
    
    // Actualizar opciones de idioma
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        }
    });
    
    // Guardar preferencia
    localStorage.setItem('language', lang);
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    
    if (query.length < 2) return;
    
    // Buscar en ventanas abiertas
    const matchingWindows = activeWindows.filter(window => {
        const windowTitle = window.element.querySelector('.window-title').textContent.toLowerCase();
        return windowTitle.includes(query);
    });
    
    // Si hay coincidencias, abrir la primera
    if (matchingWindows.length > 0) {
        const window = matchingWindows[0].element;
        window.style.display = 'block';
        bringToFront(window);
    }
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    
    // Actualizar icono
    const icon = themeToggle.querySelector('i');
    icon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
    
    // Guardar preferencia
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString(currentLanguage === 'es' ? 'es-ES' : 'en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    const dateString = now.toLocaleDateString(currentLanguage === 'es' ? 'es-ES' : 'en-US', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
    
    taskbarTime.innerHTML = `
        <div class="time">${timeString}</div>
        <div class="date">${dateString}</div>
    `;
}

function initializeSkillLevels() {
    // Animar barras de progreso cuando se abra la ventana de skills
    const skillsWindow = document.getElementById('skills-window');
    if (skillsWindow) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillLevels = entry.target.querySelectorAll('.skill-level');
                    skillLevels.forEach(level => {
                        const percentage = level.getAttribute('data-level');
                        level.style.width = '0%';
                        setTimeout(() => {
                            level.style.width = percentage + '%';
                        }, 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(skillsWindow);
    }
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Simular envío
    const btnSend = e.target.querySelector('.btn-send');
    const originalText = btnSend.innerHTML;
    
    btnSend.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btnSend.disabled = true;
    
    setTimeout(() => {
        // Mostrar mensaje de éxito
        const successMsg = currentLanguage === 'es' ? 
            `¡Mensaje enviado con éxito!\n\nDe: ${name}\nEmail: ${email}\nMensaje: ${message}` :
            `Message sent successfully!\n\nFrom: ${name}\nEmail: ${email}\nMessage: ${message}`;
        
        alert(successMsg);
        
        // Restaurar botón
        btnSend.innerHTML = originalText;
        btnSend.disabled = false;
        
        // Limpiar formulario
        e.target.reset();
    }, 2000);
}

function loadSavedPreferences() {
    // Cargar tema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDarkTheme = savedTheme === 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const icon = themeToggle.querySelector('i');
        icon.className = isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Cargar idioma
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        changeLanguage(savedLanguage);
    }
}

// Atajos de teclado
document.addEventListener('keydown', function(e) {
    // ESC para cerrar menús
    if (e.key === 'Escape') {
        startMenu.style.display = 'none';
        languageMenu.style.display = 'none';
    }
    
    // Ctrl + N para nueva ventana (ejemplo: abrir proyectos)
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        openWindow('projects');
    }
    
    // Ctrl + L para cambiar idioma
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        toggleLanguageMenu();
    }
    
    // Ctrl + T para cambiar tema
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
    
    // F11 para maximizar ventana activa
    if (e.key === 'F11') {
        e.preventDefault();
        const activeWindow = document.querySelector('.window.active');
        if (activeWindow) {
            const maximizeBtn = activeWindow.querySelector('.maximize-btn');
            if (maximizeBtn) {
                maximizeBtn.click();
            }
        }
    }
});

// Prevenir contexto del botón derecho en el escritorio
desktop.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Efectos de hover para iconos del escritorio
document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Animación de carga inicial
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// --- Funcionalidad móvil ---
function setupMobileExperience() {
    // Actualizar hora móvil
    updateMobileTime();
    setInterval(updateMobileTime, 1000);
    
    // Apps del portafolio móviles
    document.querySelectorAll('.mobile-app').forEach(app => {
        app.addEventListener('click', function() {
            const windowType = this.getAttribute('data-window');
            openWindow(windowType);
        });
    });
    
    // Apps del sistema móviles
    document.querySelectorAll('.mobile-system-app').forEach(app => {
        app.addEventListener('click', function() {
            const appType = this.classList.contains('messages') ? 'messages' :
                           this.classList.contains('google') ? 'google' : 'phone';
            handleMobileSystemApp(appType);
        });
    });
    
    // Panel deslizable
    const mobilePanel = document.getElementById('mobilePanel');
    const mobilePanelHandle = mobilePanel.querySelector('.mobile-panel-handle');
    
    mobilePanelHandle.addEventListener('click', function() {
        mobilePanel.classList.toggle('expanded');
    });
    
    // Controles del panel móvil
    const mobileLanguageBtn = document.getElementById('mobileLanguageBtn');
    const mobileThemeBtn = document.getElementById('mobileThemeBtn');
    
    mobileLanguageBtn.addEventListener('click', function() {
        toggleLanguageMenu();
        // Mostrar menú de idioma en móvil
        showMobileLanguageMenu();
    });
    
    mobileThemeBtn.addEventListener('click', function() {
        toggleTheme();
        // Actualizar icono del botón
        const icon = this.querySelector('i');
        const span = this.querySelector('span');
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
            span.textContent = 'Claro';
        } else {
            icon.className = 'fas fa-moon';
            span.textContent = 'Oscuro';
        }
    });
}

function updateMobileTime() {
    const mobileTime = document.getElementById('mobileTime');
    if (mobileTime) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const dateString = now.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
        
        mobileTime.querySelector('.time').textContent = timeString;
        mobileTime.querySelector('.date').textContent = dateString;
    }
}

function handleMobileSystemApp(appType) {
    switch(appType) {
        case 'messages':
            showMobileNotification('Mensajes', 'No hay mensajes nuevos');
            break;
        case 'google':
            showMobileNotification('Google', 'Abriendo Google...');
            setTimeout(() => {
                window.open('https://www.google.com', '_blank');
            }, 1000);
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
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px;
        border-radius: 10px;
        z-index: 3000;
        max-width: 250px;
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

function showMobileLanguageMenu() {
    // Crear menú de idioma para móvil
    const mobileLanguageMenu = document.createElement('div');
    mobileLanguageMenu.className = 'mobile-language-menu';
    mobileLanguageMenu.innerHTML = `
        <div class="mobile-language-header">
            <h3>Seleccionar idioma</h3>
            <button class="mobile-language-close">&times;</button>
        </div>
        <div class="mobile-language-options">
            <button class="mobile-language-option" data-lang="es">
                <span>🇪🇸</span>
                <span>Español</span>
            </button>
            <button class="mobile-language-option" data-lang="en">
                <span>🇺🇸</span>
                <span>English</span>
            </button>
        </div>
    `;
    
    mobileLanguageMenu.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(40, 40, 40, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 15px;
        padding: 20px;
        z-index: 2000;
        min-width: 250px;
        animation: fadeIn 0.3s ease;
    `;
    
    document.body.appendChild(mobileLanguageMenu);
    
    // Event listeners
    mobileLanguageMenu.querySelector('.mobile-language-close').addEventListener('click', () => {
        mobileLanguageMenu.remove();
    });
    
    mobileLanguageMenu.querySelectorAll('.mobile-language-option').forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            changeLanguage(lang);
            mobileLanguageMenu.remove();
        });
    });
}

// Detectar dispositivo móvil y ajustar experiencia
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

// Detectar móvil al cargar y al cambiar tamaño
window.addEventListener('load', detectMobile);
window.addEventListener('resize', detectMobile);

// --- Funcionalidad del CV ---
function setupCVFunctionality() {
    const viewPdfBtn = document.getElementById('viewPdfBtn');
    const backToPreviewBtn = document.getElementById('backToPreviewBtn');
    const cvPreview = document.getElementById('cvPreview');
    const cvPdfViewer = document.getElementById('cvPdfViewer');
    
    if (viewPdfBtn) {
        viewPdfBtn.addEventListener('click', function() {
            cvPreview.style.display = 'none';
            cvPdfViewer.style.display = 'block';
        });
    }
    
    if (backToPreviewBtn) {
        backToPreviewBtn.addEventListener('click', function() {
            cvPdfViewer.style.display = 'none';
            cvPreview.style.display = 'block';
        });
    }
}

// Configurar funcionalidad del CV para una ventana específica
function setupCVFunctionalityForWindow(window) {
    const viewPdfBtn = window.querySelector('#viewPdfBtn');
    const backToPreviewBtn = window.querySelector('#backToPreviewBtn');
    const cvPreview = window.querySelector('#cvPreview');
    const cvPdfViewer = window.querySelector('#cvPdfViewer');
    
    if (viewPdfBtn) {
        viewPdfBtn.addEventListener('click', function() {
            cvPreview.style.display = 'none';
            cvPdfViewer.style.display = 'block';
        });
    }
    
    if (backToPreviewBtn) {
        backToPreviewBtn.addEventListener('click', function() {
            cvPdfViewer.style.display = 'none';
            cvPreview.style.display = 'block';
        });
    }
} 