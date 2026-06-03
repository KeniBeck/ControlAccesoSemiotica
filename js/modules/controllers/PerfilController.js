/**
 * PerfilController.js
 * Maneja el formulario de perfil de usuario con  localStorage.
 */

class PerfilController {
    constructor() {
        this.init();
    }

    init() {
        this.loadProfile();
        this.bindEvents();
    }

    loadProfile() {
        // Primero intenta  localStorage
        const raw = localStorage.getItem('userProfile');
        const session = AuthModel.getSession();

        let profile = raw ? JSON.parse(raw) : {};

        // Pre-fill desde la sesión si no hay datos guardados
        if (!profile.nombre && session) profile.nombre = session.fullName || '';
        if (!profile.email && session) profile.email = session.email || '';

        $('#perfil-nombre').val(profile.nombre || '');
        $('#perfil-email').val(profile.email || '');
        $('#perfil-telefono').val(profile.telefono || '');
        $('#perfil-cargo').val(profile.cargo || '');
        $('#perfil-bio').val(profile.bio || '');

        if (profile.foto) {
            $('#perfil-preview').attr('src', profile.foto).show();
            $('#perfil-avatar-icon').hide();
        }
    }

    bindEvents() {
        // Preview de foto
        $('#perfil-foto').on('change', function () {
            const file = this.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                $('#perfil-preview').attr('src', e.target.result).show();
                $('#perfil-avatar-icon').hide();
            };
            reader.readAsDataURL(file);
        });
        const self = this;
        // Guardar perfil
        $('#formPerfil').on('submit', function (e) {
            e.preventDefault();
            console.log('Guardando perfil...');
            if (!self.validate()) return;
            console.log('Perfil válido, guardando...');

            const profile = {
                nombre: $('#perfil-nombre').val().trim(),
                email: $('#perfil-email').val().trim(),
                telefono: $('#perfil-telefono').val().trim(),
                cargo: $('#perfil-cargo').val().trim(),
                bio: $('#perfil-bio').val().trim(),
                foto: $('#perfil-preview').attr('src') || ''
            };

            console.log('Guardando perfil:', profile);

            localStorage.setItem('userProfile', JSON.stringify(profile));

            // Actualizar nombre en navbar
            const nameEl = document.getElementById('userName');
            if (nameEl) nameEl.textContent = profile.nombre;

            self.showToast('Perfil actualizado correctamente', 'success');
        });
    }

    validate() {
        let ok = true;
        const nombre = $('#perfil-nombre').val().trim();
        const email = $('#perfil-email').val().trim();
        console.log('Validando perfil:', { nombre, email });

        if (!nombre) {
            $('#perfil-nombre').addClass('is-invalid');
            console.warn('Validación fallida: nombre vacío');
            ok = false;
        } else { $('#perfil-nombre').removeClass('is-invalid'); }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            $('#perfil-email').addClass('is-invalid');
            console.warn('Validación fallida: email inválido');
            ok = false;
        } else { $('#perfil-email').removeClass('is-invalid'); }
        console.log('Validación finalizada. OK:', ok);
        return ok;
    }

    showToast(msg, tipo = 'success') {
        const colors = { success: '#10B981', danger: '#EF4444', info: '#3B82F6' };
        const t = $('<div>').css({
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
            background: colors[tipo] || colors.success, color: '#fff',
            padding: '14px 20px', borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            fontSize: '0.9rem', fontWeight: 600, opacity: 0, transition: 'opacity 0.3s'
        }).text(msg).appendTo('body');
        setTimeout(() => t.css('opacity', 1));
        setTimeout(() => t.css('opacity', 0).delay(400).queue(() => t.remove()), 2800);
    }
};
