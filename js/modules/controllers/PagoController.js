/**
 * PagoController.js
 * Formulario de pago con tarjeta de crédito.
 * Validaciones con jQuery.  Datos del total vienen de localStorage (set por PricingController).
 */

class PagoController {
    constructor() {
        this.total = 0;
        this.init();
    }

    init() {
        // Leer total guardado desde pricing
        this.total = parseFloat(localStorage.getItem('pago_total') || '0');

        const session = AuthModel.getSession();
        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');

        // Pre-fill nombre desde perfil o sesión
        const nombre = profile.nombre || (session ? session.fullName : '');
        $('#pago-nombre').val(nombre);

        // Mostrar total
        $('#pago-total-display').text('$' + this.total.toLocaleString('es-CO', {minimumFractionDigits:2}));

        // Llenar select mes
        const selectMes = $('#pago-mes');
        for (let i = 1; i <= 12; i++) {
            selectMes.append(`<option value="${i}">${String(i).padStart(2,'0')}</option>`);
        }

        // Llenar select año
        const selectAnio = $('#pago-anio');
        for (let y = 2025; y <= 2040; y++) {
            selectAnio.append(`<option value="${y}">${y}</option>`);
        }

        this.bindEvents();
    }

    bindEvents() {
        // Cuotas → calcular valor cuota
        $('#pago-cuotas').on('input', () => this.calcularCuota());

        // Número de tarjeta → detectar franquicia
        $('#pago-tarjeta').on('input change', function() {
            let val = $(this).val().replace(/[^0-9]/g, '');
            // Formatear en grupos de 4 con guión
            val = val.substring(0, 16);
            const groups = val.match(/.{1,4}/g) || [];
            $(this).val(groups.join('-'));
            PagoController.detectarFranquicia(val.charAt(0));
        });

        // Submit
        $('#formPago').on('submit', (e) => {
            e.preventDefault();
            if (this.validate()) this.mostrarResumen();
        });
    }

    calcularCuota() {
        const cuotas = parseInt($('#pago-cuotas').val()) || 0;
        if (cuotas > 0 && this.total > 0) {
            const valorCuota = this.total / cuotas;
            $('#pago-valor-cuota').val('$' + valorCuota.toLocaleString('es-CO', {minimumFractionDigits:2}));
        } else {
            $('#pago-valor-cuota').val('');
        }
    }

    detectarFranquicia(primer) {
        const franquicias = {
            '4': { nombre: 'Visa',            color: '#1A1F71', icono: '💳' },
            '5': { nombre: 'MasterCard',      color: '#EB001B', icono: '💳' },
            '3': { nombre: 'American Express', color: '#007BC1', icono: '💳' },
            '7': { nombre: 'Diners Club',     color: '#004A97', icono: '💳' }
        };

        const f = franquicias[primer];
        if (f) {
            $('#franquicia-nombre').text(f.nombre);
            $('#franquicia-badge').css('background', f.color).show();
            $('#franquicia-icono').text(f.icono);
        } else {
            $('#franquicia-badge').hide();
            $('#franquicia-nombre').text('');
        }
    }

    validate() {
        let ok = true;

        const cuotas = parseInt($('#pago-cuotas').val());
        if (!cuotas || cuotas < 1 || cuotas > 10) {
            $('#pago-cuotas').addClass('is-invalid');
            ok = false;
        } else { $('#pago-cuotas').removeClass('is-invalid'); }

        const nombre = $('#pago-nombre').val().trim();
        if (!nombre) {
            $('#pago-nombre').addClass('is-invalid');
            ok = false;
        } else { $('#pago-nombre').removeClass('is-invalid'); }

        // Tarjeta: 16 dígitos en formato XXXX-XXXX-XXXX-XXXX
        const tarjeta = $('#pago-tarjeta').val();
        const tarjetaClean = tarjeta.replace(/-/g, '');
        if (!/^\d{16}$/.test(tarjetaClean)) {
            $('#pago-tarjeta').addClass('is-invalid');
            ok = false;
        } else { $('#pago-tarjeta').removeClass('is-invalid'); }

        // CVV: 4 dígitos
        const cvv = $('#pago-cvv').val();
        if (!/^\d{4}$/.test(cvv)) {
            $('#pago-cvv').addClass('is-invalid');
            ok = false;
        } else { $('#pago-cvv').removeClass('is-invalid'); }

        const mes  = $('#pago-mes').val();
        const anio = $('#pago-anio').val();
        if (!mes)  { $('#pago-mes').addClass('is-invalid');  ok = false; }
        else       { $('#pago-mes').removeClass('is-invalid'); }
        if (!anio) { $('#pago-anio').addClass('is-invalid'); ok = false; }
        else       { $('#pago-anio').removeClass('is-invalid'); }

        const dir = $('#pago-direccion').val().trim();
        if (!dir) {
            $('#pago-direccion').addClass('is-invalid');
            ok = false;
        } else { $('#pago-direccion').removeClass('is-invalid'); }

        const ciudad = $('#pago-ciudad').val().trim();
        if (!ciudad) {
            $('#pago-ciudad').addClass('is-invalid');
            ok = false;
        } else { $('#pago-ciudad').removeClass('is-invalid'); }

        return ok;
    }

    mostrarResumen() {
        const ahora    = new Date();
        const fecha    = ahora.toLocaleDateString('es-CO', { year:'numeric', month:'long', day:'numeric' });
        const hora     = ahora.toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
        const cuotas   = parseInt($('#pago-cuotas').val());
        const valorCuota = (this.total / cuotas).toLocaleString('es-CO', {minimumFractionDigits:2});
        const tarjeta  = $('#pago-tarjeta').val().replace(/-/g,'');
        const ultimos  = tarjeta.slice(-4);
        const franquicia = $('#franquicia-nombre').text() || 'Tarjeta';

        $('#resumen-fecha').text(fecha);
        $('#resumen-hora').text(hora);
        $('#resumen-total').text('$' + this.total.toLocaleString('es-CO', {minimumFractionDigits:2}));
        $('#resumen-cuotas').text(cuotas);
        $('#resumen-valor-cuota').text('$' + valorCuota);
        $('#resumen-ultimos').text('**** **** **** ' + ultimos);
        $('#resumen-franquicia').text(franquicia + ' 💳');

        const modal = new bootstrap.Modal(document.getElementById('modalResumen'));
        modal.show();
    }
};
