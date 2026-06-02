class DashboardController {
    constructor() {
        this.stats = DataStore.getEstadisticas();
        this.init();
    }

    init() {
        this.renderStats();
        this.renderTopDocentes();
        this.updateTimestamp();
        this.renderCharts();
    }

    renderStats() {
        const s = this.stats;
        const el = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
        el('statTotal', s.totalAccesos);
        el('statDocentes', s.docentesActivos);
        el('statEntradas', s.entradas);
        el('statQr', s.porQr);
    }

    renderTopDocentes() {
        const tbody = document.getElementById('topDocentesBody');
        if (!tbody) return;
        const colores = ['#3B82F6', '#10B981', '#A78BFA', '#F59E0B'];
        const lista = DataStore.getTopDocentes(4);

        if (!lista.length) {
            tbody.innerHTML = '<div class="teachers-row"><span class="col-num">—</span><span class="col-name">Sin registros aún</span><span></span><span></span></div>';
            return;
        }

        tbody.innerHTML = lista.map((d, i) => `
            <div class="teachers-row">
                <span class="col-num">${String(i + 1).padStart(2, '0')}</span>
                <span class="col-name">${d.nombre}</span>
                <span class="col-popularity"><div class="popularity-bar" style="background:${colores[i]};width:${d.porcentaje}%"></div></span>
                <span class="col-percent"><span class="percent-badge">${d.total} acc.</span></span>
            </div>
        `).join('');
    }

    updateTimestamp() {
        const el = document.getElementById('dashboardTime');
        if (!el) return;
        const n = new Date();
        el.textContent = `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')} · ${n.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    }

    renderCharts() {
        const porArea = DataStore.getAccesosPorArea();
        const areas = Object.keys(porArea).slice(0, 4);
        const valores = areas.map((a) => porArea[a]);

        const ctx1 = document.getElementById('recurrenceChart');
        if (ctx1) {
            new Chart(ctx1.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: areas,
                    datasets: [{ label: 'Accesos', data: valores, backgroundColor: '#3B82F6', borderRadius: 6 }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }

        const tipos = DataStore.getAccesosPorTipo();
        const ctx2 = document.getElementById('patternsChart');
        if (ctx2) {
            new Chart(ctx2.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Entradas', 'Salidas'],
                    datasets: [{
                        label: 'Movimientos',
                        data: [tipos.entradas, tipos.salidas],
                        borderColor: '#A78BFA',
                        backgroundColor: 'rgba(167,139,250,0.1)',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' } },
                    scales: { y: { beginAtZero: true } }
                }
            });
        }
    }
}
