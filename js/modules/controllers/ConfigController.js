/**
 * ConfigController.js
 * Maneja el dark mode y el tamaño de fuente usando localStorage.
 * Se inicializa en TODAS las páginas (desde main.js).
 */

const CONFIG_KEYS = {
    DARK_MODE: 'app_dark_mode',
    FONT_SIZE: 'app_font_size'
};

class ConfigController {
    constructor() {
        this.init();
        this.initPage();
    }

    init() {
        this.applyGlobal();
    }

    /** Aplica las preferencias guardadas al cargar cualquier página */
    applyGlobal() {
        console.log('Aplicando configuración global...');
        const dark = localStorage.getItem(CONFIG_KEYS.DARK_MODE) === 'true';
        const size = localStorage.getItem(CONFIG_KEYS.FONT_SIZE);

        if (dark) $('body').addClass('dark-mode');
        if (size) $('html').css('font-size', size + 'px');
        console.log('Dark mode:', dark, 'Font size:', size);
    }

    /** Inicializa los controles en la página de configuración */
    initPage() {
        this.applyGlobal();

        const isDark = localStorage.getItem(CONFIG_KEYS.DARK_MODE) === 'true';
        const curSize = parseInt(localStorage.getItem(CONFIG_KEYS.FONT_SIZE)) || 16;

        // Sync toggle
        $('#darkModeToggle').prop('checked', isDark);

        // Sync slider / input
        $('#fontSizeRange').val(curSize);
        $('#fontSizeValue').text(curSize + 'px');
        $('#fontSizeInput').val(curSize);

        // Dark mode toggle
        $('#darkModeToggle').on('change', function () {
            const enabled = $(this).is(':checked');
            localStorage.setItem(CONFIG_KEYS.DARK_MODE, enabled);
            $('body').toggleClass('dark-mode', enabled);
        });

        // Slider live
        $('#fontSizeRange').on('input', function () {
            const v = $(this).val();
            $('#fontSizeValue').text(v + 'px');
            $('#fontSizeInput').val(v);
            $('html').css('font-size', v + 'px');
        });

        // Input numérico
        $('#fontSizeInput').on('input', function () {
            let v = parseInt($(this).val()) || 16;
            v = Math.min(24, Math.max(12, v));
            $('#fontSizeRange').val(v);
            $('#fontSizeValue').text(v + 'px');
            $('html').css('font-size', v + 'px');
        });

        // Guardar tamaño
        $('#btnSaveFontSize').on('click', function () {
            const v = $('#fontSizeRange').val();
            localStorage.setItem(CONFIG_KEYS.FONT_SIZE, v);
            ConfigController.showToast('Tamaño de fuente guardado (' + v + 'px)', 'success');
        });

        // Reset
        $('#btnResetConfig').on('click', function () {
            localStorage.removeItem(CONFIG_KEYS.DARK_MODE);
            localStorage.removeItem(CONFIG_KEYS.FONT_SIZE);
            $('body').removeClass('dark-mode');
            $('html').css('font-size', '16px');
            $('#darkModeToggle').prop('checked', false);
            $('#fontSizeRange').val(16);
            $('#fontSizeValue').text('16px');
            $('#fontSizeInput').val(16);
            ConfigController.showToast('Configuración restablecida', 'info');
        });
    }

    showToast(msg, tipo = 'success') {
        const colors = { success: '#10B981', info: '#3B82F6', danger: '#EF4444' };
        const t = $('<div>').css({
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
            background: colors[tipo] || colors.success,
            color: '#fff', padding: '14px 20px', borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)', fontSize: '0.9rem',
            fontWeight: 600, opacity: 0, transition: 'opacity 0.3s ease'
        }).text(msg).appendTo('body');
        setTimeout(() => t.css('opacity', 1));
        setTimeout(() => t.css('opacity', 0).delay(400).queue(() => t.remove()), 2800);
    }
};
