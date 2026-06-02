class ReportesController {
    constructor() {
        this.reportes = DataStore.getReportesDesdeAccesos();
        this.init();
    }

    init() {
        this.updateTime();
        this.renderStats();
        this.renderTable(this.reportes);
        this.renderCharts();
        this.bindEvents();
    }

    updateTime() {
        const el = document.getElementById('pageTime');
        if (!el) return;
        const n = new Date();
        el.textContent = `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')} · ${n.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }

    renderStats() {
        document.getElementById('statTotal').textContent = this.reportes.length;
        const mes = String(new Date().getMonth() + 1).padStart(2, '0');
        document.getElementById('statMes').textContent = this.reportes.filter((r) => r.mes === mes).length;
        document.getElementById('statPendientes').textContent = 0;
    }

    renderTable(lista) {
        const tbody = document.getElementById('reportesTableBody');
        if (!lista.length) { tbody.innerHTML = '<tr><td colspan="4">Sin datos.</td></tr>'; return; }
        tbody.innerHTML = lista.map((r) => `
            <tr>
                <td>${r.fecha}</td>
                <td>${r.tipo}</td>
                <td>${r.area}</td>
                <td><span class="badge-status badge-ok">${r.estado}</span></td>
            </tr>
        `).join('');
    }

    filtrar() {
        const mes = document.getElementById('filterMes').value;
        const tipo = document.getElementById('filterTipo').value;
        let f = this.reportes;
        if (mes !== 'todos') f = f.filter((r) => r.mes === mes);
        if (tipo !== 'todos') f = f.filter((r) => r.tipo.includes(tipo));
        this.renderTable(f);
    }

    renderCharts() {
        const porArea = DataStore.getAccesosPorArea();
        const labels = Object.keys(porArea).slice(0, 4);
        const valores = labels.map((k) => porArea[k]);
        const tipos = DataStore.getAccesosPorTipo();

        const c1 = document.getElementById('reportesTipoChart');
        if (c1) {
            new Chart(c1.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Entradas', 'Salidas'],
                    datasets: [{ data: [tipos.entradas, tipos.salidas], backgroundColor: ['#3B82F6', '#10B981'] }]
                },
                options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
            });
        }

        const c2 = document.getElementById('reportesBloqueChart');
        if (c2) {
            new Chart(c2.getContext('2d'), {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{ label: 'Accesos', data: valores, backgroundColor: '#1E40AF', borderRadius: 6 }]
                },
                options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
            });
        }
    }

    bindEvents() {
        document.getElementById('btnFiltrar').addEventListener('click', () => this.filtrar());
    }
}
