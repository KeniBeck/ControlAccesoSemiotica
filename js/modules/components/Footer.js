const FOOTER_HTML = `<footer class="footer">
    <div class="footer-content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-3">
                    <div class="footer-brand">
                        <div class="footer-logo"><img src="images/AccesoSeguroEducativo_logo.svg" alt="Logo"></div>
                        <p>Control de acceso</p>
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
                        <ul><li><a href="historial.html">Historial</a></li></ul>
                    </div>
                </div>
                <div class="col-md-3 offset-md-2">
                    <div class="footer-section">
                        <h4>Contacto</h4>
                        <ul><li><a href="mailto:soporte@elpoli.edu.co">soporte@elpoli.edu.co</a></li></ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <svg class="footer-wave" viewBox="0 0 1200 120" preserveAspectRatio="xMidYMid slice">
        <path d="M0,60 Q300,40 600,60 T1200,60 L1200,120 L0,120 Z" fill="#3B82F6" opacity="0.5"/>
    </svg>
</footer>`;

class Footer {
    static load() {
        const root = document.getElementById('app-footer');
        if (root) root.innerHTML = FOOTER_HTML;
    }
}
