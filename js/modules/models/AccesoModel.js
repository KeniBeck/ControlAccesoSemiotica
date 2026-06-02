class AccesoModel {
    static getAll() {
        try {
            const data = localStorage.getItem(APP_CONFIG.ACCESOS_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }

    static saveAll(lista) {
        localStorage.setItem(APP_CONFIG.ACCESOS_KEY, JSON.stringify(lista));
    }

    static initStorage() {
        if (this.getAll().length > 0) return;
        if (typeof APP_DATA === 'undefined' || !APP_DATA.accesosIniciales) return;
        this.saveAll(APP_DATA.accesosIniciales);
    }

    static registrar(datos) {
        const accesos = this.getAll();
        const nuevo = {
            id: Date.now(),
            documento: datos.documento,
            email: datos.email,
            nombre: datos.nombre,
            rol: datos.rol,
            area: datos.area,
            tipo: datos.tipo,
            metodo: datos.metodo || 'Manual',
            observacion: datos.observacion || '',
            fecha: datos.fecha,
            hora: datos.hora,
            registradoPor: datos.registradoPor
        };
        accesos.unshift(nuevo);
        this.saveAll(accesos);
        return nuevo;
    }

    static extraerDocumento(codigo) {
        const texto = codigo.trim();
        if (texto.startsWith('POLI-DOC-')) return texto.replace('POLI-DOC-', '');
        try {
            const json = JSON.parse(texto);
            return json.documento || json.doc || null;
        } catch (e) {
            if (/^\d{6,12}$/.test(texto)) return texto;
        }
        return null;
    }

    static codigoQr(usuario) {
        return `POLI-DOC-${usuario.documento}`;
    }

    static getRecientes(limite) {
        return this.getAll().slice(0, limite || 5);
    }
}
