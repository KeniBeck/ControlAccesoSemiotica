/**
 * ComentariosController.js
 * Inserción dinámica de comentarios y calificaciones con jQuery.
 */

class ComentariosController {
    constructor() {
        this.comentarios = [];
        this.init();
    }

    init() {
        // Cargar comentarios guardados
        const saved = localStorage.getItem('app_comentarios');
        if (saved) {
            try { this.comentarios = JSON.parse(saved); } catch(e) { this.comentarios = []; }
        }
        this.renderComentarios();
        this.bindEvents();
        this.renderEstrellas('#nuevaCalificacion');
    }

    bindEvents() {
        $('#formComentario').on('submit', (e) => {
            e.preventDefault();
            this.agregarComentario();
        });

        // Estrellas interactivas
        $(document).on('click', '.star-btn', function() {
            const val = parseInt($(this).data('val'));
            const grupo = $(this).closest('.star-group');
            grupo.find('.star-btn').each(function(i) {
                $(this).toggleClass('active', i < val);
            });
            grupo.data('rating', val);
            $('#ratingValue').val(val);
        });
    }

    renderEstrellas(selector) {
        const wrap = $('<div class="star-group d-flex gap-1">');
        for (let i = 1; i <= 5; i++) {
            wrap.append(`<button type="button" class="star-btn btn btn-sm" data-val="${i}" title="${i} estrella(s)">
                <i class="fas fa-star"></i></button>`);
        }
        $(selector).empty().append(wrap);
    }

    agregarComentario() {
        const texto  = $('#txtComentario').val().trim();
        const rating = parseInt($('#ratingValue').val()) || 0;
        const session = AuthModel.getSession();
        const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        const autor  = profile.nombre || (session ? session.fullName : 'Anónimo');

        if (!texto) {
            $('#txtComentario').addClass('is-invalid');
            return;
        }
        $('#txtComentario').removeClass('is-invalid');

        if (rating === 0) {
            this.showToast('Por favor selecciona una calificación', 'warning');
            return;
        }

        const ahora = new Date();
        const comentario = {
            id: Date.now(),
            autor,
            texto,
            rating,
            fecha: ahora.toLocaleDateString('es-CO'),
            hora:  ahora.toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' })
        };

        this.comentarios.unshift(comentario);
        localStorage.setItem('app_comentarios', JSON.stringify(this.comentarios));

        this.renderComentarios();
        $('#txtComentario').val('');
        $('#ratingValue').val(0);
        this.renderEstrellas('#nuevaCalificacion');
        this.showToast('Comentario agregado exitosamente', 'success');
    }

    renderComentarios() {
        const tbody = $('#tablaComentarios');
        if (!tbody.length) return;

        if (this.comentarios.length === 0) {
            tbody.html(`<tr><td colspan="5" class="text-center text-muted py-4">
                <i class="fas fa-comments fa-2x d-block mb-2"></i>
                Aún no hay comentarios. ¡Sé el primero!</td></tr>`);
            return;
        }

        tbody.empty();
        this.comentarios.forEach((c, idx) => {
            const estrellas = Array.from({length:5}, (_,i) =>
                `<i class="fas fa-star ${i < c.rating ? 'text-warning' : 'text-muted'}"></i>`
            ).join('');

            const fila = $(`<tr>
                <td><strong>${this.escapeHtml(c.autor)}</strong></td>
                <td>${this.escapeHtml(c.texto)}</td>
                <td>${estrellas}</td>
                <td><small>${c.fecha} ${c.hora}</small></td>
                <td><button class="btn btn-sm btn-outline-danger btn-eliminar-comentario" data-idx="${idx}">
                    <i class="fas fa-trash-alt"></i></button></td>
            </tr>`);
            tbody.append(fila);
        });

        // Bind eliminar
        $('.btn-eliminar-comentario').on('click', (e) => {
            const idx = parseInt($(e.currentTarget).data('idx'));
            this.comentarios.splice(idx, 1);
            localStorage.setItem('app_comentarios', JSON.stringify(this.comentarios));
            this.renderComentarios();
        });
    }

    escapeHtml(str) {
        return $('<div>').text(str).html();
    }

    showToast(msg, tipo = 'success') {
        const colors = { success:'#10B981', warning:'#F59E0B', danger:'#EF4444' };
        const t = $('<div>').css({
            position:'fixed', bottom:'24px', right:'24px', zIndex:9999,
            background: colors[tipo] || colors.success, color:'#fff',
            padding:'14px 20px', borderRadius:'12px',
            boxShadow:'0 4px 20px rgba(0,0,0,0.2)',
            fontSize:'0.9rem', fontWeight:600, opacity:0, transition:'opacity 0.3s'
        }).text(msg).appendTo('body');
        setTimeout(() => t.css('opacity',1));
        setTimeout(() => t.css('opacity',0).delay(400).queue(() => t.remove()), 2800);
    }
};
