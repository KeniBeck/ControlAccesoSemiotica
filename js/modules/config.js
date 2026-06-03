const APP_CONFIG = {
    APP_NAME: 'Control de Acceso',
    DASHBOARD_URL: 'dashboard.html',
    LOGIN_URL: 'index.html',
    SESSION_KEY: 'userSession',
    ACCESOS_KEY: 'accesosRegistrados',
    INTERNAL_PAGES: [
        'dashboard.html', 'ingreso.html', 'reportes.html', 'usuarios.html',
        'historial.html', 'pricing.html', 'perfil.html', 'configuracion.html',
        'ayuda.html', 'acerca.html', 'comentarios.html', 'pago.html'
    ],
    AREAS_ACCESO: ['Bloque A', 'Bloque B', 'Bloque C', 'Laboratorios', 'Biblioteca', 'Entrada principal'],
    ROLE_LABELS: {
        estudiante: 'Estudiante',
        docente: 'Docente',
        admin: 'Administrador'
    },
    NAV_BY_ROLE: {
        estudiante: [
            { label: 'Dashboard',          url: 'dashboard.html',      icon: 'fa-tachometer-alt' },
            { label: 'Registro de ingreso', url: 'ingreso.html',        icon: 'fa-door-open' },
            { label: 'Reportes',           url: 'reportes.html',       icon: 'fa-chart-bar' },
            { label: 'Usuarios',           url: 'usuarios.html',       icon: 'fa-users' },
            { label: 'Historial',          url: 'historial.html',      icon: 'fa-history' },
            { label: 'Licencias',          url: 'pricing.html',        icon: 'fa-tags' },
            { label: 'Comentarios',        url: 'comentarios.html',    icon: 'fa-comments' },
            { label: 'Mi Perfil',          url: 'perfil.html',         icon: 'fa-user-circle' },
            { label: 'Configuración',      url: 'configuracion.html',  icon: 'fa-cog' },
            { label: 'Ayuda',              url: 'ayuda.html',          icon: 'fa-question-circle' },
            { label: 'Acerca de',          url: 'acerca.html',         icon: 'fa-info-circle' }
        ],
        docente: [
            { label: 'Dashboard',          url: 'dashboard.html',      icon: 'fa-tachometer-alt' },
            { label: 'Registro de ingreso', url: 'ingreso.html',        icon: 'fa-door-open' },
            { label: 'Reportes',           url: 'reportes.html',       icon: 'fa-chart-bar' },
            { label: 'Historial',          url: 'historial.html',      icon: 'fa-history' },
            { label: 'Licencias',          url: 'pricing.html',        icon: 'fa-tags' },
            { label: 'Comentarios',        url: 'comentarios.html',    icon: 'fa-comments' },
            { label: 'Mi Perfil',          url: 'perfil.html',         icon: 'fa-user-circle' },
            { label: 'Configuración',      url: 'configuracion.html',  icon: 'fa-cog' },
            { label: 'Ayuda',              url: 'ayuda.html',          icon: 'fa-question-circle' },
            { label: 'Acerca de',          url: 'acerca.html',         icon: 'fa-info-circle' }
        ],
        admin: [
            { label: 'Dashboard',          url: 'dashboard.html',      icon: 'fa-tachometer-alt' },
            { label: 'Registro de ingreso', url: 'ingreso.html',        icon: 'fa-door-open' },
            { label: 'Reportes',           url: 'reportes.html',       icon: 'fa-chart-bar' },
            { label: 'Usuarios',           url: 'usuarios.html',       icon: 'fa-users' },
            { label: 'Historial',          url: 'historial.html',      icon: 'fa-history' },
            { label: 'Licencias',          url: 'pricing.html',        icon: 'fa-tags' },
            { label: 'Comentarios',        url: 'comentarios.html',    icon: 'fa-comments' },
            { label: 'Mi Perfil',          url: 'perfil.html',         icon: 'fa-user-circle' },
            { label: 'Configuración',      url: 'configuracion.html',  icon: 'fa-cog' },
            { label: 'Ayuda',              url: 'ayuda.html',          icon: 'fa-question-circle' },
            { label: 'Acerca de',          url: 'acerca.html',         icon: 'fa-info-circle' }
        ]
    },
    MIN_PASSWORD_LENGTH: 6,
    AUTH_DELAY: 500,
    REDIRECT_DELAY: 1500
};
