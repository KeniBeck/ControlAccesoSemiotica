class IngresoController {
    constructor() {
        this.session = AuthModel.getSession();
        this.metodoActual = 'Manual';
        this.usuarioActual = null;
        this.qrScanner = null;
        this.init();
    }

    init() {
        if (!this.session) return;
        this.updateTime();
        this.llenarAreas();
        this.renderRecientes();
        this.cambiarTab('manual');
        this.bindEvents();
        const op = document.getElementById('operadorNombre');
        if (op) op.textContent = this.session.fullName || this.session.email;
    }

    updateTime() {
        const el = document.getElementById('pageTime');
        if (el) el.textContent = formatFechaHora();
    }

    llenarAreas() {
        const select = document.getElementById('area');
        if (!select) return;
        APP_CONFIG.AREAS_ACCESO.forEach((a) => {
            const o = document.createElement('option');
            o.value = a;
            o.textContent = a;
            select.appendChild(o);
        });
    }

    cambiarTab(tab) {
        document.querySelectorAll('.ingreso-tab').forEach((b) => {
            b.classList.toggle('active', b.dataset.tab === tab);
        });
        const panelQr = document.getElementById('panelQr');
        const panelManual = document.getElementById('panelManual');
        if (panelQr) panelQr.classList.toggle('d-none', tab !== 'qr');
        if (panelManual) panelManual.classList.toggle('d-none', tab !== 'manual');
        this.metodoActual = tab === 'qr' ? 'QR' : 'Manual';
        if (tab !== 'qr') this.detenerCamara();
    }

    async iniciarCamara() {
        const estado = document.getElementById('qrEstado');
        if (!estado) return;
        try {
            estado.textContent = 'Iniciando cámara...';
            estado.className = 'qr-estado';
            if (!this.qrScanner) {
                this.qrScanner = new QrScanner('qrReader', (c) => this.onQrLeido(c));
            }
            await this.qrScanner.iniciar();
            estado.textContent = 'Enfoca el QR del carné.';
        } catch (e) {
            estado.textContent = 'Cámara no disponible. Usa la pestaña Por documento.';
            estado.className = 'qr-estado qr-estado-error';
        }
    }

    async detenerCamara() {
        if (this.qrScanner) await this.qrScanner.detener();
        const e = document.getElementById('qrEstado');
        if (e) e.textContent = 'Cámara detenida.';
    }

    onQrLeido(codigo) {
        const u = DataStore.getUsuarioPorQr(codigo);
        if (u) {
            this.cargarUsuario(u, 'QR');
            this.mostrarMensaje(`Identificado: ${u.nombre}`, 'ok');
        } else {
            this.mostrarMensaje('QR no reconocido.', 'error');
        }
    }

    buscarPorDocumento() {
        const input = document.getElementById('documento');
        if (!input) return;
        const doc = input.value.trim();
        if (!doc) {
            this.limpiarPersona();
            return;
        }
        const u = DataStore.getUsuarioPorDocumento(doc);
        if (u) {
            this.cargarUsuario(u, 'Manual');
            this.mostrarMensaje(`Listo: ${u.nombre}. Completa área y registra.`, 'ok');
        } else {
            this.limpiarPersona();
            this.mostrarMensaje('Documento no está en el sistema.', 'error');
        }
    }

    cargarUsuario(u, metodo) {
        this.usuarioActual = u;
        this.metodoActual = metodo;
        const doc = document.getElementById('documento');
        const nombre = document.getElementById('nombre');
        const rol = document.getElementById('rol');
        const email = document.getElementById('email');
        if (doc) doc.value = u.documento;
        if (nombre) nombre.value = u.nombre;
        if (rol) rol.value = APP_CONFIG.ROLE_LABELS[u.rol] || u.rol;
        if (email) email.value = u.email;
    }

    limpiarPersona() {
        this.usuarioActual = null;
        const nombre = document.getElementById('nombre');
        const rol = document.getElementById('rol');
        const email = document.getElementById('email');
        if (nombre) nombre.value = '';
        if (rol) rol.value = '';
        if (email) email.value = '';
    }

    registrar(e) {
        e.preventDefault();
        const areaEl = document.getElementById('area');
        const tipoEl = document.getElementById('tipo');
        const area = areaEl ? areaEl.value : '';
        const tipo = tipoEl ? tipoEl.value : 'Entrada';

        if (!this.usuarioActual) {
            this.mostrarMensaje('Primero busca el documento en la pestaña Por documento.', 'error');
            this.cambiarTab('manual');
            return;
        }
        if (!area) {
            this.mostrarMensaje('Selecciona el área de acceso.', 'error');
            return;
        }

        const n = new Date();
        DataStore.registrarAcceso({
            documento: this.usuarioActual.documento,
            email: this.usuarioActual.email,
            nombre: this.usuarioActual.nombre,
            rol: this.usuarioActual.rol,
            area: area,
            tipo: tipo,
            metodo: this.metodoActual,
            observacion: document.getElementById('observacion') ? document.getElementById('observacion').value.trim() : '',
            fecha: n.toLocaleDateString('es-CO'),
            hora: `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`,
            registradoPor: this.session.email
        });

        this.mostrarMensaje(`${tipo} registrada correctamente.`, 'ok');
        const obs = document.getElementById('observacion');
        const doc = document.getElementById('documento');
        if (obs) obs.value = '';
        if (areaEl) areaEl.value = '';
        if (doc) doc.value = '';
        this.limpiarPersona();
        this.renderRecientes();
    }

    renderRecientes() {
        const lista = document.getElementById('listaRecientes');
        if (!lista) return;
        const items = AccesoModel.getRecientes(5);
        if (!items.length) {
            lista.innerHTML = '<p class="reciente-vacio">Sin registros.</p>';
            return;
        }
        lista.innerHTML = items.map((a) => `
            <div class="reciente-item">
                <div class="reciente-top">
                    <strong>${a.nombre}</strong>
                    <span class="reciente-tipo ${a.tipo === 'Entrada' ? 'tipo-entrada' : 'tipo-salida'}">${a.tipo}</span>
                </div>
                <p class="reciente-detalle">${a.area} · ${a.fecha} ${a.hora}</p>
            </div>
        `).join('');
    }

    mostrarMensaje(texto, tipo) {
        const box = document.getElementById('formMensaje');
        if (!box) return;
        if (!texto) {
            box.className = 'form-mensaje';
            box.textContent = '';
            return;
        }
        box.className = `form-mensaje mensaje-${tipo}`;
        box.textContent = texto;
    }

    bindEvents() {
        const self = this;

        document.querySelectorAll('.ingreso-tab').forEach((b) => {
            b.addEventListener('click', () => self.cambiarTab(b.dataset.tab));
        });

        const btnBuscar = document.getElementById('btnBuscarDoc');
        const inputDoc = document.getElementById('documento');
        if (btnBuscar) btnBuscar.addEventListener('click', () => self.buscarPorDocumento());
        if (inputDoc) {
            inputDoc.addEventListener('blur', () => self.buscarPorDocumento());
            inputDoc.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    self.buscarPorDocumento();
                }
            });
        }

        const btnCamOn = document.getElementById('btnIniciarCamara');
        const btnCamOff = document.getElementById('btnDetenerCamara');
        if (btnCamOn) btnCamOn.addEventListener('click', () => self.iniciarCamara());
        if (btnCamOff) btnCamOff.addEventListener('click', () => self.detenerCamara());

        const form = document.getElementById('ingresoForm');
        if (form) form.addEventListener('submit', (e) => self.registrar(e));

        window.addEventListener('beforeunload', () => self.detenerCamara());
    }
}
