# Documentación técnica — SCID / AcesoSeguro Educativo

Proyecto de asignatura — Ingeniería Informática.  
Plataforma web para el control de ingreso y salida de docentes (Policlínico Jaime Isaza Cadavid, sede Apartadó).

---

## 1. Descripción general

La aplicación es un sitio estático (HTML, CSS y JavaScript) organizado en capas tipo MVC. No hay servidor propio: los datos de demostración viven en archivos JS y el registro de accesos se guarda en el navegador con `localStorage`.

---

## 2. Estructura del proyecto

```
proyecto final/
├── index.html              Login
├── dashboard.html          Panel principal
├── ingreso.html            Registro de entrada/salida
├── reportes.html           Reportes derivados de accesos
├── usuarios.html           Listado de usuarios
├── historial.html          Historial de accesos
├── css/
│   ├── variables.css       Colores y variables globales
│   ├── login.css           Estilos del login
│   ├── forms.css, buttons.css, toast.css
│   ├── sidebar.css, navbar.css
│   ├── internal.css        Estilos comunes de páginas internas
│   ├── dashboard.css, ingreso.css
├── js/
│   ├── main.js             Punto de entrada
│   └── modules/
│       ├── config.js       Rutas, menús por rol, constantes
│       ├── data/
│       │   ├── appData.js  Usuarios, accesos iniciales, login
│       │   └── DataStore.js Acceso unificado a los datos
│       ├── models/
│       │   ├── AuthModel.js
│       │   └── AccesoModel.js
│       ├── views/
│       │   └── LoginView.js
│       ├── components/
│       │   ├── Layout.js   Sidebar + navbar
│       │   ├── Footer.js
│       │   └── QrScanner.js
│       ├── controllers/    Un controlador por página
│       └── utils.js
├── partials/               Referencia HTML (opcional)
└── images/
```

---

## 3. Tecnologías utilizadas

| Tecnología | Uso en el proyecto |
|------------|-------------------|
| HTML5 | Estructura de cada página |
| CSS3 | Estilos modulares por sección |
| JavaScript (ES6) | Lógica, controladores y modelos |
| Bootstrap 5 | Grid, utilidades (`d-none`, `row`, `col-*`) |
| jQuery 3.6 | Solo en la pantalla de login (formulario y toast) |
| Font Awesome 6 | Iconos |
| Chart.js | Gráficos en dashboard y reportes |
| html5-qrcode | Lectura de QR en registro (opcional, requiere cámara y HTTPS o localhost) |
| localStorage | Sesión de usuario y lista de accesos registrados |

---

## 4. Cómo se ejecuta la aplicación

Se debe usar un servidor local (no abrir los HTML con doble clic en `file://`).

```bash
cd "proyecto final"
python -m http.server 8000
```

Abrir en el navegador: `http://localhost:8000/index.html`

**Usuarios de prueba** (definidos en `js/modules/data/appData.js`):

| Correo | Contraseña | Rol |
|--------|------------|-----|
| estudiante@elpoli.edu.co | 123456 | Estudiante (portería) |
| docente@elpoli.edu.co | 123456 | Docente |
| admin@elpoli.edu.co | 123456 | Administrador |

---

## 5. Transición entre páginas

### 5.1 Punto de entrada (`main.js`)

Al cargar cualquier HTML, `main.js` ejecuta `iniciarApp()`:

1. Detecta el archivo actual con `getCurrentPage()` (`utils.js`).
2. Si la página está en `APP_CONFIG.INTERNAL_PAGES`, es una página protegida.
3. Si no, se trata como login (`index.html`).

### 5.2 Página de login (`index.html`)

```
Usuario abre index.html
    → main.js → iniciarLogin()
    → new LoginController(LoginView, AuthModel)
```

Si ya existe sesión en `localStorage`, `LoginController` redirige a `dashboard.html`.

### 5.3 Páginas internas (dashboard, ingreso, etc.)

```
Usuario abre dashboard.html (ejemplo)
    → main.js → DataStore.init()
    → new Layout('dashboard.html').init()
         → AuthModel.getSession()
         → Si no hay sesión → redirección a index.html
         → Si hay sesión → inserta sidebar + navbar en #app-layout
    → Footer.load() → inserta pie en #app-footer
    → new DashboardController()
```

La navegación entre secciones es por enlaces normales (`<a href="reportes.html">`). Cada cambio de página vuelve a ejecutar todo el flujo anterior.

### 5.4 Diagrama simplificado

```
index.html ──login OK──► dashboard.html
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
   ingreso.html        reportes.html         usuarios.html
         │                    │                    │
         └────────────────────┴────────────────────┘
                              │
                        historial.html
```

---

## 6. Autenticación

### 6.1 Flujo de login

1. El usuario envía el formulario.
2. `LoginView` obtiene correo y contraseña.
3. `LoginController` llama a `AuthModel.validateCredentials()`.
4. Si es válido, `AuthModel.authenticate()` compara con `APP_DATA.loginUsers`.
5. Si coincide, `AuthModel.saveSession()` guarda un objeto en `localStorage` con clave `userSession`.
6. `LoginView.redirect()` envía al usuario a `dashboard.html` tras un breve retraso.

### 6.2 Contenido de la sesión

```javascript
{
  email: "estudiante@elpoli.edu.co",
  fullName: "María García",
  role: "estudiante",
  loginTime: "2026-06-02T...",
  rememberMe: true/false
}
```

### 6.3 Protección de rutas

`Layout.js` en cada página interna llama a `AuthModel.getSession()`. Si devuelve `null`, hace `window.location.href = 'index.html'`.

### 6.4 Cerrar sesión

El botón del sidebar ejecuta `AuthModel.clearSession()` y redirige al login. También existe `window.logout()` definido en `main.js`.

---

## 7. localStorage

| Clave | Definida en | Contenido |
|-------|-------------|-----------|
| `userSession` | `APP_CONFIG.SESSION_KEY` | JSON con datos del usuario logueado |
| `accesosRegistrados` | `APP_CONFIG.ACCESOS_KEY` | Array JSON con todos los registros de ingreso/salida |

### Inicialización de accesos

`DataStore.init()` → `AccesoModel.initStorage()`:

- Si `accesosRegistrados` está vacío, copia `APP_DATA.accesosIniciales`.
- Si ya hay datos, no los sobrescribe.

### Registro de un acceso

`IngresoController.registrar()` → `DataStore.registrarAcceso()` → `AccesoModel.registrar()`:

- Crea un objeto con documento, nombre, área, tipo (Entrada/Salida), método (Manual/QR), fecha, hora y operador.
- Lo agrega al inicio del array y guarda en `localStorage`.

Dashboard, historial y reportes leen el mismo array a través de `DataStore.getAccesos()`.

---

## 8. Datos centralizados (`appData.js` y `DataStore.js`)

Para no repetir información en cada página:

- **`APP_DATA.usuarios`**: personas del sistema (documento, correo, rol).
- **`APP_DATA.accesosIniciales`**: registros de ejemplo al primer uso.
- **`APP_DATA.loginUsers`**: credenciales del login.

`DataStore.js` expone métodos usados por los controladores:

- `getUsuarios()`, `getAccesos()`, `getUsuarioPorDocumento()`
- `registrarAcceso()`, `getEstadisticas()`, `getTopDocentes()`
- `getReportesDesdeAccesos()` (convierte accesos en filas de reporte)

---

## 9. Estilos CSS

### 9.1 Variables (`variables.css`)

Define colores institucionales:

```css
--primary-blue: #1E40AF;
--neutral-gray: #6B7280;
--neutral-dark: #111827;
```

### 9.2 Por tipo de página

| Archivo | Aplica a |
|---------|----------|
| `login.css` | Solo `index.html` |
| `internal.css` | Tarjetas, tablas, stats, footer en páginas internas |
| `sidebar.css` | Menú lateral y overlay |
| `navbar.css` | Barra superior (bordes redondeados inferiores) |
| `dashboard.css` | Tabla de docentes y gráficos del dashboard |
| `ingreso.css` | Formulario y pestañas de registro |

### 9.3 Bootstrap

Se usa para:

- Rejilla (`container-fluid`, `row`, `col-lg-6`)
- Ocultar paneles (`d-none` en pestaña QR vs documento)
- Componentes del login (`form-control`, `toast`, `spinner`)

El diseño visual principal está en los CSS propios del proyecto.

---

## 10. Uso de jQuery

jQuery se usa **únicamente en el login** (`LoginView.js`):

- Selección de campos: `$('#email')`, `$('#loginForm')`
- Eventos: `.on('submit', ...)`, `.on('click', ...)`
- Clases de validación: `.addClass('is-invalid')`
- Toast de Bootstrap: `new bootstrap.Toast(...)`

El resto de páginas usan JavaScript vanilla (`document.getElementById`, `addEventListener`, `innerHTML`).

`main.js` usa `jQuery(document).ready(iniciarApp)` por compatibilidad; si jQuery no cargara, usa `DOMContentLoaded`.

---

## 11. Layout modular (sidebar y footer)

### Sidebar y navbar

El HTML no trae el menú escrito en cada página. Solo existe:

```html
<div id="app-layout"></div>
```

`Layout.js` contiene la constante `LAYOUT_HTML` con el markup del sidebar y navbar. Al iniciar, hace:

```javascript
root.innerHTML = LAYOUT_HTML.sidebar + LAYOUT_HTML.navbar;
```

Luego genera los enlaces del menú según el rol (`APP_CONFIG.NAV_BY_ROLE`) y marca activa la página actual.

### Footer

Igual con `<div id="app-footer"></div>` y `Footer.js` con `FOOTER_HTML`.

---

## 12. Página de registro (`ingreso.html`)

1. Pestaña **Por documento** (por defecto): buscar por número de documento en `APP_DATA.usuarios`.
2. Pestaña **Escanear carné**: cámara + librería html5-qrcode (formato de carné: `POLI-DOC-{documento}`).
3. Formulario común: área, tipo Entrada/Salida, observación.
4. Al guardar, actualiza `localStorage` y la lista de últimos registros.

---

## 13. Menú según rol

Configurado en `config.js` → `NAV_BY_ROLE`:

- **Estudiante**: Dashboard, Registro, Reportes, Usuarios, Historial
- **Docente**: Dashboard, Registro, Reportes, Historial
- **Admin**: Igual que estudiante (sin página de configuración)

---

## 14. Orden de scripts (páginas internas)

Ejemplo `dashboard.html`:

1. Bootstrap, jQuery, Chart.js (CDN)
2. `config.js`
3. `appData.js`
4. `utils.js`
5. `AccesoModel.js`
6. `DataStore.js`
7. `AuthModel.js`
8. `Layout.js`, `Footer.js`
9. Controlador de la página
10. `main.js`

Si falta algún archivo o el orden cambia, pueden fallar el menú o el login.

---

## 15. Limitaciones del prototipo

- No hay base de datos real; los datos persisten solo en el navegador del equipo.
- Las credenciales están visibles en el código fuente (`appData.js`).
- El lector QR requiere permiso de cámara y entorno `http://localhost` o HTTPS.
- No hay API REST; la integración con backend sería una fase posterior del proyecto.

---

## 16. Posible ampliación (backend)

1. Sustituir `AuthModel.authenticate()` por `fetch` a un API de login.
2. Guardar accesos en base de datos en lugar de `localStorage`.
3. Emitir token JWT y validarlo en cada petición.
4. Generar QR de carné desde el servidor con el documento del docente.

---

*Documentación alineada con el estado actual del código del proyecto.*
