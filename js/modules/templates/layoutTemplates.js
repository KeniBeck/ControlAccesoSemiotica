const LAYOUT_TEMPLATES = {
    sidebar: `<div class="sidebar-overlay" id="sidebarOverlay"></div>
<aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
        <img src="images/AccesoSeguroEducativo_logo.svg" alt="Logo" class="sidebar-logo">
        <button type="button" class="sidebar-close" id="sidebarClose">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <nav class="sidebar-nav" id="sidebarNav"></nav>
    <div class="sidebar-footer">
        <button type="button" class="sidebar-logout" id="sidebarLogout">
            <i class="fas fa-sign-out-alt"></i>
            <span>Cerrar sesión</span>
        </button>
    </div>
</aside>`,
    navbar: `<nav class="navbar">
    <div class="container-fluid">
        <button type="button" class="hamburger-btn" id="hamburgerBtn">
            <i class="fas fa-bars"></i>
        </button>
        <div class="navbar-brand">
            <img src="images/AccesoSeguroEducativo_logo.svg" alt="Logo" class="navbar-logo-svg">
            <span class="brand-text">Control de Acceso</span>
        </div>
        <div class="navbar-user">
            <span class="user-label">
                <span id="userName">Usuario</span><br>
                <span id="userRole">Rol</span>
            </span>
            <div class="user-avatar">
                <i class="fas fa-user"></i>
            </div>
        </div>
    </div>
</nav>`,
    footer: `<footer class="footer">
    <div class="footer-content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-3">
                    <div class="footer-brand">
                        <div class="footer-logo">
                            <img src="images/AccesoSeguroEducativo_logo.svg" alt="Logo">
                        </div>
                        <p>Control de acceso</p>
                        <div class="social-icons">
                            <a href="#"><i class="fab fa-facebook-f"></i></a>
                            <a href="#"><i class="fab fa-twitter"></i></a>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="footer-section">
                        <h4>Accesos directos</h4>
                        <ul>
                            <li><a href="dashboard.html">Dashboard</a></li>
                            <li><a href="ingreso.html">Registro de ingreso</a></li>
                            <li><a href="reportes.html">Reportes</a></li>
                            <li><a href="usuarios.html">Usuarios</a></li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="footer-section">
                        <h4>Sistema</h4>
                        <ul>
                            <li><a href="historial.html">Historial de accesos</a></li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-3 offset-md-2">
                    <div class="footer-section">
                        <h4>Contacto</h4>
                        <ul>
                            <li><a href="mailto:soporte@elpoli.edu.co">soporte@elpoli.edu.co</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <svg class="footer-wave" viewBox="0 0 1200 120" preserveAspectRatio="xMidYMid slice">
        <path d="M0,60 Q300,40 600,60 T1200,60 L1200,120 L0,120 Z" fill="#3B82F6" opacity="0.50"/>
        <path d="M0,75 Q400,50 800,75 T1600,75 L1600,120 L0,120 Z" fill="#3B82F6" opacity="0.35"/>
        <path d="M0,90 Q500,65 1000,90 T2000,90 L2000,120 L0,120 Z" fill="#3B82F6" opacity="0.2"/>
    </svg>
</footer>`
};
