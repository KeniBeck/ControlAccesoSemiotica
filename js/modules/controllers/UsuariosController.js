class UsuariosController {
    constructor() {
        this.usuarios = DataStore.getUsuarios();
        this.init();
    }

    init() {
        this.updateTime();
        this.renderStats();
        this.renderTable(this.usuarios);
        this.bindEvents();
    }

    updateTime() {
        const el = document.getElementById('pageTime');
        if (!el) return;
        const n = new Date();
        el.textContent = `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')} · ${n.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }

    renderStats() {
        document.getElementById('statTotal').textContent = this.usuarios.length;
        document.getElementById('statActivos').textContent = this.usuarios.filter((u) => u.estado === 'Activo').length;
        document.getElementById('statDocentes').textContent = this.usuarios.filter((u) => u.rol === 'docente').length;
    }

    renderTable(lista) {
        const tbody = document.getElementById('usuariosTableBody');
        if (!lista.length) { tbody.innerHTML = '<tr><td colspan="7">Sin resultados.</td></tr>'; return; }
        tbody.innerHTML = lista.map((u, i) => `
            <tr>
                <td>${String(i + 1).padStart(2, '0')}</td>
                <td>${u.documento}</td>
                <td>${u.nombre}</td>
                <td>${u.email}</td>
                <td><span class="badge-status badge-role">${APP_CONFIG.ROLE_LABELS[u.rol]}</span></td>
                <td><span class="badge-status ${u.estado === 'Activo' ? 'badge-ok' : 'badge-inactive'}">${u.estado}</span></td>
                <td>${DataStore.getUltimoAcceso(u.email)}</td>
            </tr>
        `).join('');
    }

    filtrar() {
        const t = document.getElementById('searchUsuario').value.toLowerCase();
        const rol = document.getElementById('filterRol').value;
        let f = this.usuarios;
        if (t) f = f.filter((u) => u.nombre.toLowerCase().includes(t) || u.email.includes(t) || u.documento.includes(t));
        if (rol !== 'todos') f = f.filter((u) => u.rol === rol);
        this.renderTable(f);
    }

    bindEvents() {
        document.getElementById('searchUsuario').addEventListener('input', () => this.filtrar());
        document.getElementById('filterRol').addEventListener('change', () => this.filtrar());
    }
}
