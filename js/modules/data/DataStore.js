class DataStore {
    static init() {
        AccesoModel.initStorage();
    }

    static getUsuarios() {
        return APP_DATA.usuarios;
    }

    static getAccesos() {
        return AccesoModel.getAll();
    }

    static getUsuarioPorDocumento(documento) {
        return APP_DATA.usuarios.find((u) => u.documento === documento.trim());
    }

    static getUsuarioPorQr(codigo) {
        const doc = AccesoModel.extraerDocumento(codigo);
        return doc ? this.getUsuarioPorDocumento(doc) : null;
    }

    static registrarAcceso(datos) {
        const registro = AccesoModel.registrar(datos);
        return registro;
    }

    static getUltimoAcceso(email) {
        const lista = this.getAccesos().filter((a) => a.email === email);
        if (!lista.length) return '—';
        return `${lista[0].fecha} ${lista[0].hora}`;
    }

    static getEstadisticas() {
        const accesos = this.getAccesos();
        const docentes = accesos.filter((a) => a.rol === 'docente');
        const docsUnicos = new Set(docentes.map((a) => a.documento));

        return {
            totalAccesos: accesos.length,
            entradas: accesos.filter((a) => a.tipo === 'Entrada').length,
            salidas: accesos.filter((a) => a.tipo === 'Salida').length,
            docentesActivos: docsUnicos.size,
            porQr: accesos.filter((a) => a.metodo === 'QR').length
        };
    }

    static getTopDocentes(limite) {
        const conteo = {};
        this.getAccesos()
            .filter((a) => a.rol === 'docente')
            .forEach((a) => {
                conteo[a.documento] = conteo[a.documento] || { nombre: a.nombre, total: 0 };
                conteo[a.documento].total++;
            });

        return Object.values(conteo)
            .sort((a, b) => b.total - a.total)
            .slice(0, limite || 4)
            .map((d, i, arr) => {
                const max = arr[0]?.total || 1;
                return { ...d, porcentaje: Math.round((d.total / max) * 100) };
            });
    }

    static getAccesosPorArea() {
        const conteo = {};
        APP_CONFIG.AREAS_ACCESO.forEach((a) => { conteo[a] = 0; });
        this.getAccesos().forEach((a) => {
            if (conteo[a.area] !== undefined) conteo[a.area]++;
        });
        return conteo;
    }

    static getAccesosPorTipo() {
        const accesos = this.getAccesos();
        return {
            entradas: accesos.filter((a) => a.tipo === 'Entrada').length,
            salidas: accesos.filter((a) => a.tipo === 'Salida').length
        };
    }

    static getReportesDesdeAccesos() {
        return this.getAccesos().map((a) => ({
            fecha: a.fecha,
            tipo: `Registro ${a.tipo}`,
            area: a.area,
            estado: 'Completado',
            mes: a.fecha.split('/')[1] || '06',
            nombre: a.nombre
        }));
    }
}
