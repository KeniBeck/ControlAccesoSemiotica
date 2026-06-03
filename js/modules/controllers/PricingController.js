/**
 * PricingController.js
 * Controlador de la página de Licencias.
 * Sigue el patrón MVC del proyecto (ver DashboardController, etc.)
 */

class PricingController {
    constructor() {
        this.subtotal = 0;
        this.filas = []; // { licencia, valor, cantidad, totalLicencia }
        this.bindEvents();
    }

    bindEvents() {
        // Botones "Agregar" de cada plan
        document.querySelectorAll('.agregar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.onAgregar(e.currentTarget));
        });

        // Botón limpiar tabla
        const btnLimpiar = document.getElementById('btnLimpiar');
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => this.limpiarTabla());
        }

        // Botón confirmar compra
        const btnComprar = document.getElementById('btnComprar');
        if (btnComprar) {
            btnComprar.addEventListener('click', () => this.confirmarCompra());
        }
    }

    onAgregar(btn) {
        const licencia = btn.dataset.licencia;
        const valor    = parseInt(btn.dataset.valor, 10);
        const cantidadInput = btn.closest('.pricing-card').querySelector('.cantidad');
        const cantidad = parseInt(cantidadInput.value, 10);

        if (isNaN(cantidad) || cantidad < 1) {
            this.mostrarAlerta('Ingresa una cantidad válida (mínimo 1).', 'warning');
            cantidadInput.focus();
            return;
        }

        const totalLicencia = valor * cantidad;
        this.filas.push({ licencia, valor, cantidad, totalLicencia });
        this.subtotal += totalLicencia;

        this.renderTabla();
        this.renderTotales();
        this.actualizarBtnComprar();

        cantidadInput.value = 1; // reset
        this.mostrarAlerta(`Plan <strong>${licencia}</strong> agregado al resumen.`, 'success');
    }

    renderTabla() {
        const tbody    = document.getElementById('tablaLicencias');
        const filaVacia = document.getElementById('filaVacia');

        if (!tbody) return;

        if (this.filas.length === 0) {
            tbody.innerHTML = `
                <tr id="filaVacia">
                    <td colspan="5" class="text-muted py-4">
                        <i class="fas fa-inbox fa-2x mb-2 d-block"></i>
                        Aún no has agregado licencias
                    </td>
                </tr>`;
            return;
        }

        tbody.innerHTML = this.filas.map((f, idx) => `
            <tr>
                <td>
                    <span class="badge-status badge-role">${f.licencia}</span>
                </td>
                <td>$${f.valor.toLocaleString('es-CO')}</td>
                <td>${f.cantidad}</td>
                <td><strong>$${f.totalLicencia.toLocaleString('es-CO')}</strong></td>
                <td>
                    <button class="btn btn-sm btn-outline-danger" data-idx="${idx}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Bind botones eliminar fila
        tbody.querySelectorAll('[data-idx]').forEach(btn => {
            btn.addEventListener('click', () => this.eliminarFila(parseInt(btn.dataset.idx, 10)));
        });
    }

    eliminarFila(idx) {
        const fila = this.filas.splice(idx, 1)[0];
        this.subtotal -= fila.totalLicencia;
        this.renderTabla();
        this.renderTotales();
        this.actualizarBtnComprar();
    }

    limpiarTabla() {
        this.filas    = [];
        this.subtotal = 0;
        this.renderTabla();
        this.renderTotales();
        this.actualizarBtnComprar();
    }

    renderTotales() {
        const iva   = this.subtotal * 0.19;
        const total = this.subtotal + iva;

        const fmt = (n) => '$' + n.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const elSub   = document.getElementById('subtotal');
        const elIva   = document.getElementById('iva');
        const elTotal = document.getElementById('total');

        if (elSub)   elSub.textContent   = fmt(this.subtotal);
        if (elIva)   elIva.textContent   = fmt(iva);
        if (elTotal) elTotal.textContent = fmt(total);
    }

    actualizarBtnComprar() {
        const btn = document.getElementById('btnComprar');
        if (btn) btn.disabled = this.filas.length === 0;
    }

    confirmarCompra() {
        if (this.filas.length === 0) return;

        const iva   = this.subtotal * 0.19;
        const total = this.subtotal + iva;
        localStorage.setItem('pago_total', total.toFixed(2));

        window.location.href = 'pago.html';
    }

    /**
     * Muestra un toast/alerta flotante temporal.
     * @param {string} mensaje  HTML del mensaje
     * @param {'success'|'warning'|'danger'} tipo
     */
    mostrarAlerta(mensaje, tipo = 'success') {
        const colores = {
            success: '#10B981',
            warning: '#F59E0B',
            danger:  '#EF4444'
        };

        const toast = document.createElement('div');
        toast.style.cssText = `
            position:fixed; bottom:24px; right:24px; z-index:9999;
            background:${colores[tipo]}; color:#fff;
            padding:14px 20px; border-radius:12px;
            box-shadow:0 4px 20px rgba(0,0,0,0.2);
            font-size:0.9rem; font-weight:600;
            opacity:0; transition:opacity 0.3s ease;
            max-width:320px; line-height:1.4;
        `;
        toast.innerHTML = mensaje;
        document.body.appendChild(toast);

        requestAnimationFrame(() => { toast.style.opacity = '1'; });
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 2800);
    }
}