function getCurrentPage() {
    const href = window.location.href.split('?')[0].split('#')[0];
    const partes = href.split('/');
    let pagina = partes[partes.length - 1];
    if (!pagina || !pagina.endsWith('.html')) return 'index.html';
    return pagina;
}

function formatFechaHora() {
    const n = new Date();
    const h = String(n.getHours()).padStart(2, '0');
    const m = String(n.getMinutes()).padStart(2, '0');
    const fecha = n.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
    return `${h}:${m} · ${fecha}`;
}
