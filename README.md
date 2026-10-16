# 🎨 Los Rostros de Velázquez

> **Un juego interactivo para ejercitar la memoria visual a través de los célebres retratos del maestro del Barroco, Diego Velázquez.**

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=000)
![Phaser](https://img.shields.io/badge/Phaser-v3-EE5535?logo=phaser&logoColor=fff)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=fff)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-E34F26?logo=html5&logoColor=fff)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green.svg)
![Estado](https://img.shields.io/badge/Estado-En_Desarrollo-C88A36)

---

## 📖 Descripción del Proyecto

**Los Rostros de Velázquez** es un videojuego web de tipo *memory match* (emparejamiento de cartas) diseñado con una cuidada estética tenebrista y barroca inspirada en la paleta y técnica de claroscuro de **Diego Rodríguez de Silva y Velázquez** (1599–1660).

El objetivo principal es conectar al jugador con el arte clásico y la pintura universal mientras ejercita su retención cognitiva y agilidad visual. Cada carta presenta un fragmento o retrato tomado del catálogo de obras del artista sevillano, sumergiendo al usuario en un entorno sobrio, elegante y ricamente animado.

---

## ✨ Características Principales

- **🏛️ Introducción Histórica y Artística:** Pantalla introductoria contextualizada con una semblanza biográfica del artista y citas a su impacto en la historia de la pintura universal.
- **📈 13 Niveles de Dificultad Progresiva:** Cada nivel incrementa el número de parejas a emparejar y ajusta de forma matemática los tiempos e intentos disponibles.
- **🧠 Fase de Memorización Previa:** Al inicio de cada nivel, las cartas se descubren durante un lapso proporcional al tamaño del tablero (`2.5s + 0.5s` por cada pareja) para permitir retener sus posiciones antes de voltearse.
- **📐 Tablero Dinámico y Responsivo:** Algoritmo en `Board.js` que calcula en tiempo real la mejor cuadrícula (filas, columnas, tamaños y márgenes) optimizada para la resolución de 1536×864 px con autoescalado `Phaser.Scale.FIT`.
- **🃏 Animaciones Fluidas con Tweens:** Volteo realista de cartas en dos fases con compresión horizontal, efectos de elevación (*hover*), transiciones de fade y marcado atenuado de cartas completadas.
- **⏱️ Desafío con Tiempo e Intentos:** Sistema de cuenta regresiva y conteo finito de intentos con penalización y recompensa por jugada.
- **🎵 Ambientación Sonora y Controles de Audio:** Música de fondo inmersiva, efectos sonoros para aciertos, errores, victoria y derrota, con panel interactivo de silencio (*mute*) y ajuste de volumen en tiempo real.
- **🏆 Pantalla de Victoria Final:** Modal al completar el nivel 13 que presenta la puntuación total acumulada y la opción de reiniciar la partida.

---

## 🎮 Reglas y Mecánicas de Juego

| Parámetro | Regla / Fórmula |
| :--- | :--- |
| **Puntaje por Pareja Acertada** | `+100 puntos` |
| **Penalización por Error** | `-25 puntos` (el puntaje acumulado nunca baja de 0) |
| **Parejas por Nivel** | `Nivel + 1` parejas simultáneas (hasta un máximo de 30 rostros disponibles) |
| **Tiempo de Memorización** | `2.5s + (Parejas × 0.5s)` |
| **Tiempo Límite para Resolver** | `15s + (Parejas × 5s)` |
| **Intentos Permitidos** | `⌈Parejas × 1.4⌉ + 2` |

Si el tiempo llega a `00:00` o los intentos se agotan, el nivel se reinicia automáticamente para un nuevo intento.

---

## 📂 Estructura del Proyecto

El código está estructurado bajo una arquitectura limpia por módulos y escenas de Phaser, completamente en **Vanilla JavaScript (ES Modules)**:

```text
rostros-velazquez/
├── assets/
│   ├── audio/
│   │   ├── bg_sound.mp3          # Banda sonora barroca de fondo
│   │   ├── game_over.wav         # Efecto al agotar intentos o tiempo
│   │   ├── lose_sound.wav        # Efecto de intento fallido
│   │   ├── success.ogg           # Efecto de pareja acertada
│   │   └── victory_sound.wav     # Fanfarria de victoria al completar los 13 niveles
│   ├── fonts/                    # Tipografías locales (opcionales)
│   └── images/
│       ├── faces_spritesheet.png # Spritesheet con los 30 rostros de Velázquez (128x126 px por frame)
│       └── screen.png            # Fondo artístico y telón de escena
├── css/
│   └── styles.css                # Variables temáticas CSS y tipografías (Playfair Display, Jakarta Sans)
├── js/
│   ├── lib/
│   │   └── phaser.min.js         # Librería Phaser 3
│   ├── managers/
│   │   ├── LevelManager.js       # Generación de niveles, tiempos, intentos y algoritmo Fisher-Yates
│   │   └── ScoreManager.js       # Módulo extensible para gestión de puntajes
│   ├── objects/
│   │   ├── Board.js              # Lógica matemática de distribución de la grilla en el canvas
│   │   └── Card.js               # Objeto de carta interactiva con tweens de giro y estados visuales
│   ├── scenes/
│   │   ├── PreloadScene.js       # Precarga de recursos con barra de progreso estilizada
│   │   ├── IntroScene.js         # Reseña biográfica interactiva y arranque del audio
│   │   └── GameScene.js          # Lógica central del juego, HUD, eventos y controles
│   └── main.js                   # Configuración y arranque de la instancia de Phaser.Game
├── index.html                    # Contenedor principal con TailwindCSS v4 y estética tenebrista
├── .gitignore                    # Exclusiones de control de versiones y temporales
└── README.md                     # Documentación del proyecto
```

---

## 🛠️ Tecnologías y Diseño

- **Motor de Videojuego:** [Phaser 3](https://phaser.io/) (`arcade physics`, renderizado responsivo vía Canvas/WebGL).
- **Lógica:** JavaScript Moderno (ES6+ Modules, Clases, Arrow Functions, Tweens).
- **Estilos e Interfaz:**
  - [Tailwind CSS v4](https://tailwindcss.com/) (vía script CDN en el navegador).
  - Vanilla CSS con tokens de diseño personalizados (paleta cálida barroca: Ocre `#C88A36`, Tierra de Siena `#8C4A32`, Dorado `#f2ca50`, Fondo Obsidiana `#100e0c` / `#151311`).
  - Google Fonts: **Playfair Display** (títulos clásicos) y **Plus Jakarta Sans** (legibilidad en interfaz y textos).

---

## 🚀 Instalación y Ejecución

### 1. Clonar el Repositorio
Puedes clonar el repositorio localmente utilizando Git:

```bash
git clone https://github.com/DiegoCMJava/rostros-velazquez.git
cd rostros-velazquez
```

> **Nota:** Si descargas el proyecto en formato `.zip`, descomprímelo y sitúate en la raíz del proyecto.

### 2. Iniciar un Servidor Local
Dado que el juego utiliza **Módulos ES6 nativos de JavaScript** (`import` / `export`), es necesario servir los archivos a través de un servidor web local para evitar las restricciones de CORS del protocolo `file://`:

#### Opción A: Con VS Code (Extensión Live Server)
1. Abre la carpeta `rostros-velazquez` en Visual Studio Code.
2. Haz clic derecho sobre el archivo `index.html` y selecciona **"Open with Live Server"**.

#### Opción B: Con Python
Si dispones de Python instalado, ejecuta en tu terminal dentro de la carpeta:
```bash
# Python 3
python -m http.server 8000
```
Luego abre tu navegador en `http://localhost:8000`.

#### Opción C: Con Node.js (npx)
```bash
npx serve .
```

---

## 👥 Créditos y Reconocimientos

### 👨‍💻 Creador y Desarrollador
- **[DiegoCMJava](https://github.com/DiegoCMJava)** — Concepción, diseño, curaduría y desarrollo del proyecto.

### 🤖 Asistencia e Inteligencia Artificial
El desarrollo, optimización de código, estructuración y documentación de este proyecto contaron con el soporte de:
- **Antigravity** (Google DeepMind)
- **GitHub Copilot**
- **Gemini Web**
- **Meta AI**

### 📚 Recursos y Agradecimientos Externos
- **[Phaser](https://phaser.io/)** — Framework para desarrollo de videojuegos 2D en HTML5.
- **[OpenGameArt.org](https://opengameart.org/)** — Recursos y efectos de sonido utilizados en la ambientación del juego.
- **[Wikipedia](https://es.wikipedia.org/wiki/Diego_Vel%C3%A1zquez)** — Textos biográficos e información contextual sobre Diego Velázquez.
- **Obras Pictóricas de Diego Velázquez** — Patrimonio artístico universal de dominio público conservado en colecciones y pinacotecas como el Museo del Prado de Madrid.
- **[ProyectoCosmos](https://diegocmjava.github.io/proyecto-cosmos/)** — Para conocer más proyectos y experiencias interactivas creadas por el autor.

---

## 📄 Licencia

Este proyecto está bajo la Licencia **MIT**. Puedes consultar el texto completo en el archivo [LICENSE](file:///c:/Users/Usuario/Desktop/Proyectos%20Antigravity/Pruebas/rostros-velazquez/LICENSE).

---

*Desarrollado con dedicación al arte pictórico y a la programación web.*
