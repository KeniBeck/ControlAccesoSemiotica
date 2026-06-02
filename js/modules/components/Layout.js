const LAYOUT_HTML = {
    sidebar: `<div class="sidebar-overlay" id="sidebarOverlay"></div>
<aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <img src="images/AccesoSeguroEducativo_logo.svg" alt="Logo" class="sidebar-logo">
        <button type="button" class="sidebar-close" id="sidebarClose"><i class="fas fa-times"></i></button>
    </div>
    <nav class="sidebar-nav" id="sidebarNav"></nav>
    <div class="sidebar-footer">
        <button type="button" class="sidebar-logout" id="sidebarLogout">
            <i class="fas fa-sign-out-alt"></i><span>Cerrar sesión</span>
        </button>
    </div>
</aside>`,
    navbar: `<nav class="navbar">
    <div class="container-fluid">
        <button type="button" class="hamburger-btn" id="hamburgerBtn"><i class="fas fa-bars"></i></button>
        <div class="navbar-brand">
            <img src="images/AccesoSeguroEducativo_logo.svg" alt="Logo" class="navbar-logo-svg">
            <span class="brand-text">Control de Acceso</span>
        </div>
        <div class="navbar-user">
            <span class="user-label"><span id="userName">Usuario</span><br><span id="userRole">Rol</span></span>
            <div class="user-avatar"><i class="fas fa-user"></i></div>
        </div>
    </div>
</nav>`
};

class Layout {
    constructor(activePage) {
        this.activePage = activePage;
    }

    init() {
        const root = document.getElementById('app-layout');
        if (!root) return false;

        const session = AuthModel.getSession();
        if (!session) {
            window.location.href = APP_CONFIG.LOGIN_URL;
            return false;
        }
        this.user = session;

        root.innerHTML = LAYOUT_HTML.sidebar + LAYOUT_HTML.navbar;
        this.renderMenu();
        this.setUserInfo();
        this.bindEvents();
        return true;
    }

    renderMenu() {
        const nav = document.getElementById('sidebarNav');
        if (!nav) return;
        const role = this.user.role || 'estudiante';
        const items = APP_CONFIG.NAV_BY_ROLE[role] || APP_CONFIG.NAV_BY_ROLE.estudiante;
        nav.innerHTML = items.map((item) => {
            const active = this.activePage === item.url ? ' active' : '';
            return `<a href="${item.url}" class="sidebar-link${active}"><i class="fas ${item.icon}"></i><span>${item.label}</span></a>`;
        }).join('');
    }

    setUserInfo() {
        const nameEl = document.getElementById('userName');
        const roleEl = document.getElementById('userRole');
        if (!nameEl || !roleEl) return;
        nameEl.textContent = this.user.fullName || this.user.email.split('@')[0];
        roleEl.textContent = APP_CONFIG.ROLE_LABELS[this.user.role] || 'Usuario';
    }

    bindEvents() {
        this.sidebar = document.getElementById('sidebar');
        this.overlay = document.getElementById('sidebarOverlay');
        const btn = document.getElementById('hamburgerBtn');
        const close = document.getElementById('sidebarClose');
        const logout = document.getElementById('sidebarLogout');

        if (btn) btn.addEventListener('click', () => {
            this.sidebar.classList.contains('is-open') ? this.closeSidebar() : this.openSidebar();
        });
        if (close) close.addEventListener('click', () => this.closeSidebar());
        if (this.overlay) this.overlay.addEventListener('click', () => this.closeSidebar());
        if (logout) logout.addEventListener('click', () => {
            AuthModel.clearSession();
            window.location.href = APP_CONFIG.LOGIN_URL;
        });
    }

    openSidebar() {
        if (!this.sidebar || !this.overlay) return;
        this.sidebar.classList.add('is-open');
        this.overlay.classList.add('is-visible');
        document.body.classList.add('sidebar-open');
    }

    closeSidebar() {
        if (!this.sidebar || !this.overlay) return;
        this.sidebar.classList.remove('is-open');
        this.overlay.classList.remove('is-visible');
        document.body.classList.remove('sidebar-open');
    }
}
