# 🖥️ Portafolio Web - Windows 11 Desktop

Un portafolio personal interactivo que simula un escritorio de Windows 11 moderno, donde cada sección se representa como una ventana flotante del sistema operativo con todas las características avanzadas.

## ✨ Características

### 🎨 Interfaz de Usuario Windows 11
- **Escritorio tipo Windows 11**: Simula un escritorio real con fondo degradado moderno
- **Ventanas flotantes**: Cada sección del portafolio se abre como una ventana del sistema
- **Barra de tareas Windows 11**: Con menú inicio, búsqueda, aplicaciones abiertas y reloj en tiempo real
- **Tema oscuro/claro**: Interruptor para cambiar entre temas con persistencia
- **Selector de idioma**: Cambio entre español e inglés
- **Responsive**: Adaptado para dispositivos móviles con experiencia tipo smartphone

### 🖱️ Funcionalidades Avanzadas
- **Ventanas arrastrables**: Puedes mover las ventanas por el escritorio
- **Ventanas maximizables**: Botón para maximizar/restaurar ventanas
- **Redimensionamiento**: Las ventanas se pueden redimensionar desde la esquina
- **Minimizar/Maximizar/Cerrar**: Controles de ventana como en Windows real
- **Múltiples instancias**: Puedes abrir varias ventanas del mismo tipo
- **Barra de tareas dinámica**: Muestra las aplicaciones abiertas con indicador activo
- **Barra de búsqueda**: Busca contenido en las ventanas abiertas
- **Menú inicio mejorado**: Con búsqueda interna y perfil de usuario

### 📁 Secciones del Portafolio

#### 🗂️ Proyectos
- Vista tipo explorador de archivos con diseño moderno
- Dividido en Frontend y Backend
- Cada proyecto incluye:
  - Imagen representativa con iconos
  - Descripción detallada
  - Tecnologías utilizadas con badges
  - Enlaces a código (GitHub) y demo
  - Efectos hover y animaciones

#### 📄 CV - Diego.pdf
- Previsualización del currículum con diseño profesional
- Información de experiencia y formación
- Timeline visual con hitos importantes
- Botón de descarga funcional
- Diseño responsive

#### 🧑‍💻 Sobre mí
- Descripción personal con foto de perfil
- Timeline interactivo con hitos importantes:
  - Formación académica
  - Experiencia laboral (incluyendo FCT)
  - Tecnologías destacadas
- Diseño moderno con efectos visuales

#### 🧰 Skills
- Dashboard visual tipo Windows 11
- Barras de progreso animadas
- Organizado por categorías:
  - **Frontend**: HTML5, CSS3, JavaScript, React
  - **Backend**: Java, C#, Spring Boot, .NET
  - **Herramientas**: Git, VSCode, Figma, SQL Server
- Animaciones suaves al abrir la ventana

#### ✉️ Contacto
- Formulario tipo Outlook con validación
- Enlaces a redes sociales con efectos hover
- Simulación de envío con feedback visual
- Diseño responsive y accesible

## 🚀 Cómo usar

### Instalación
1. Descarga todos los archivos en una carpeta
2. Abre `index.html` en tu navegador web
3. ¡Disfruta explorando el portafolio tipo Windows 11!

### Navegación
- **Iconos del escritorio**: Haz clic en cualquier icono para abrir su ventana
- **Menú inicio**: Haz clic en el botón de Windows para acceder al menú
- **Barra de búsqueda**: Busca contenido en las ventanas abiertas
- **Barra de tareas**: Haz clic en los iconos para restaurar ventanas minimizadas
- **Tema**: Usa el botón de luna/sol para cambiar entre tema claro y oscuro
- **Idioma**: Usa el botón de globo para cambiar entre español e inglés

### Controles de ventana
- **Arrastrar**: Haz clic y arrastra la barra de título para mover la ventana
- **Maximizar**: Botón `□` para maximizar/restaurar la ventana
- **Redimensionar**: Usa la esquina inferior derecha para cambiar el tamaño
- **Minimizar**: Botón `-` para ocultar la ventana
- **Cerrar**: Botón `×` para cerrar la ventana

### Atajos de teclado
- **ESC**: Cerrar menús (inicio, idioma)
- **Ctrl + N**: Abrir ventana de proyectos
- **Ctrl + L**: Abrir selector de idioma
- **Ctrl + T**: Cambiar tema claro/oscuro
- **F11**: Maximizar ventana activa

## 🛠️ Tecnologías utilizadas

- **HTML5**: Estructura semántica moderna
- **CSS3**: Estilos avanzados con variables CSS, Grid/Flexbox y Glassmorphism
- **JavaScript ES6+**: Funcionalidad interactiva completa
- **Font Awesome**: Iconos vectoriales profesionales
- **Responsive Design**: Adaptable a todos los dispositivos
- **LocalStorage**: Persistencia de preferencias del usuario

## 📱 Responsive Design

El portafolio se adapta automáticamente a diferentes tamaños de pantalla:

### Desktop (Windows 11)
- Experiencia completa de escritorio Windows 11
- Todas las funcionalidades disponibles
- Ventanas flotantes con controles completos

### Tablet
- Iconos reorganizados en grid
- Ventanas adaptadas al tamaño de pantalla
- Barra de tareas optimizada

### Móvil (Smartphone)
- **Experiencia tipo smartphone**: Iconos como aplicaciones móviles
- **Ventanas fullscreen**: Se adaptan al tamaño completo de la pantalla
- **Barra de tareas simplificada**: Solo elementos esenciales
- **Navegación táctil**: Optimizada para pantallas táctiles
- **Búsqueda oculta**: Se oculta para ahorrar espacio

## 🎨 Personalización

### Cambiar contenido
1. **Información personal**: Edita el HTML para cambiar nombres, descripciones, etc.
2. **Proyectos**: Añade o modifica proyectos en la sección correspondiente
3. **Skills**: Actualiza niveles de habilidad en el atributo `data-level`
4. **Enlaces**: Cambia los enlaces a redes sociales y proyectos
5. **CV**: Actualiza la información del currículum

### Cambiar estilos
1. **Colores**: Modifica las variables CSS en `:root`
2. **Fondo**: Cambia el gradiente del escritorio en `.desktop`
3. **Fuentes**: Ajusta la tipografía en `body`
4. **Temas**: Personaliza los colores del tema claro y oscuro

### Añadir nuevas secciones
1. Crea el HTML de la nueva ventana
2. Añade el icono correspondiente al escritorio
3. Actualiza el JavaScript para manejar la nueva ventana
4. Añade el icono en la barra de tareas

## 🔧 Estructura de archivos

```
porfolio/
├── index.html          # Archivo principal con estructura Windows 11
├── styles.css          # Estilos CSS con Glassmorphism y temas
├── script.js           # Funcionalidad JavaScript completa
└── README.md           # Este archivo
```

## 🌟 Características avanzadas

### Persistencia de datos
- **Tema**: El tema elegido se guarda en localStorage
- **Idioma**: La preferencia de idioma se mantiene
- **Posición de ventanas**: Se recuerda la última posición

### Animaciones y efectos
- **Animaciones suaves**: Transiciones fluidas entre estados
- **Efectos hover**: Interacciones visuales mejoradas
- **Glassmorphism**: Efectos de cristal modernos
- **Carga progresiva**: Animación de entrada elegante

### Gestión de ventanas
- **Sistema completo**: Gestión de múltiples ventanas
- **Z-index dinámico**: Ventanas activas siempre al frente
- **Estado persistente**: Mantiene el estado de las ventanas
- **Validación de formularios**: Validación en tiempo real

### Optimización de rendimiento
- **Código optimizado**: JavaScript eficiente y modular
- **CSS optimizado**: Variables CSS para mejor rendimiento
- **Lazy loading**: Carga progresiva de contenido
- **Responsive eficiente**: Adaptación automática sin recargas

## 🎯 Funcionalidades específicas de Windows 11

### Barra de tareas moderna
- **Búsqueda integrada**: Busca en contenido de ventanas
- **Iconos de sistema**: WiFi, volumen, batería
- **Reloj en tiempo real**: Con formato según idioma
- **Menú inicio mejorado**: Con búsqueda y perfil de usuario

### Ventanas avanzadas
- **Maximización**: Ventanas que ocupan toda la pantalla
- **Redimensionamiento**: Control preciso del tamaño
- **Arrastre suave**: Movimiento fluido de ventanas
- **Controles nativos**: Botones como en Windows real

### Experiencia de usuario
- **Atajos de teclado**: Navegación rápida
- **Feedback visual**: Indicadores de estado
- **Accesibilidad**: Navegación por teclado
- **Responsive**: Adaptación automática a dispositivos

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda para personalizar el portafolio, no dudes en contactar.

### Características destacadas
- ✅ Simulación completa de Windows 11
- ✅ Ventanas maximizables y redimensionables
- ✅ Barra de búsqueda funcional
- ✅ Selector de idioma español/inglés
- ✅ Tema oscuro/claro persistente
- ✅ Experiencia móvil tipo smartphone
- ✅ Animaciones y efectos modernos
- ✅ Código optimizado y mantenible

---

**¡Disfruta explorando tu nuevo portafolio tipo Windows 11!** 🎉 