class HistorialController {
    constructor() {
        this.init();
    }

    getAccesos() {
        return DataStore.getAccesos();
    }

    init() {
        this.updateTime();
        this.llenarAreas();
        this.renderStats();
        this.renderTable(this.getAccesos());
        this.bindEvents();
    }

    llenarAreas() {
        const s = document.getElementById('filterArea');
        APP_CONFIG.AREAS_ACCESO.forEach((a) => {
            const o = document.createElement('option');
            o.value = a;
            o.textContent = a;
            s.appendChild(o);
        });
    }

    updateTime() {
        const el = document.getElementById('pageTime');
        if (!el) return;
        const n = new Date();
        el.textContent = `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')} · ${n.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }

    renderStats() {
        const s = DataStore.getEstadisticas();
        document.getElementById('statTotal').textContent = s.totalAccesos;
        document.getElementById('statEntradas').textContent = s.entradas;
        document.getElementById('statSalidas').textContent = s.salidas;
    }

    renderTable(lista) {
        const tbody = document.getElementById('historialTableBody');
        if (!lista.length) { tbody.innerHTML = '<tr><td colspan="7">Sin registros.</td></tr>'; return; }
        tbody.innerHTML = lista.map((a) => `
            <tr>
                <td>${a.fecha} ${a.hora}</td>
                <td>${a.documento || '—'}</td>
                <td>${a.nombre}</td>
                <td>${a.area}</td>
                <td><span class="badge-status ${a.tipo === 'Entrada' ? 'badge-ok' : 'badge-pending'}">${a.tipo}</span></td>
                <td><span class="badge-status badge-role">${a.metodo || 'Manual'}</span></td>
                <td>${a.observacion || '—'}</td>
            </tr>
        `).join('');
    }

    filtrar() {
        const t = document.getElementById('searchHistorial').value.toLowerCase();
        const tipo = document.getElementById('filterTipo').value;
        const area = document.getElementById('filterArea').value;
        let f = this.getAccesos();
        if (t) f = f.filter((a) => a.nombre.toLowerCase().includes(t) || (a.documento && a.documento.includes(t)));
        if (tipo !== 'todos') f = f.filter((a) => a.tipo === tipo);
        if (area !== 'todos') f = f.filter((a) => a.area === area);
        this.renderTable(f);
    }

    bindEvents() {
        document.getElementById('searchHistorial').addEventListener('input', () => this.filtrar());
        document.getElementById('filterTipo').addEventListener('change', () => this.filtrar());
        document.getElementById('filterArea').addEventListener('change', () => this.filtrar());
    }
}
