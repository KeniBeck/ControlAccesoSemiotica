function iniciarApp() {
    if (typeof APP_CONFIG === 'undefined') {
        console.error('No se cargó config.js');
        return;
    }

    const pagina = getCurrentPage();
    const esInterna = APP_CONFIG.INTERNAL_PAGES.indexOf(pagina) !== -1;

    window.logout = function() {
        AuthModel.clearSession();
        window.location.href = APP_CONFIG.LOGIN_URL;
    };

    window.getCurrentUser = function() {
        return AuthModel.getSession();
    };

    try {
        if (typeof APP_DATA !== 'undefined' && typeof DataStore !== 'undefined') {
            DataStore.init();
        }
    } catch (err) {
        console.error('DataStore:', err);
    }

    if (esInterna) {
        iniciarPaginaInterna(pagina);
    } else {
        iniciarLogin();
    }
}

function iniciarPaginaInterna(pagina) {
    const layoutOk = new Layout(pagina).init();
    if (!layoutOk) return;

    Footer.load();

    if (pagina === 'dashboard.html' && typeof DashboardController !== 'undefined') {
        new DashboardController();
    } else if (pagina === 'ingreso.html' && typeof IngresoController !== 'undefined') {
        new IngresoController();
    } else if (pagina === 'reportes.html' && typeof ReportesController !== 'undefined') {
        new ReportesController();
    } else if (pagina === 'usuarios.html' && typeof UsuariosController !== 'undefined') {
        new UsuariosController();
    } else if (pagina === 'historial.html' && typeof HistorialController !== 'undefined') {
        new HistorialController();
    }
}

function iniciarLogin() {
    if (typeof AuthModel === 'undefined' || typeof LoginView === 'undefined') {
        console.error('Faltan scripts de login');
        return;
    }
    new LoginController(new LoginView(), AuthModel);
}

if (typeof jQuery !== 'undefined') {
    jQuery(document).ready(iniciarApp);
} else {
    document.addEventListener('DOMContentLoaded', iniciarApp);
}
