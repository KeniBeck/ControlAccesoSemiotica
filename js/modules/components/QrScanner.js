class QrScanner {
    constructor(elementId, onSuccess) {
        this.elementId = elementId;
        this.onSuccess = onSuccess;
        this.camera = null;
        this.ultimo = '';
        this.tiempo = 0;
    }

    async iniciar() {
        if (typeof Html5Qrcode === 'undefined') throw new Error('Lector QR no disponible');
        const camaras = await Html5Qrcode.getCameras();
        if (!camaras.length) throw new Error('No hay cámara disponible');
        this.camera = new Html5Qrcode(this.elementId);
        await this.camera.start(
            camaras[camaras.length - 1].id,
            { fps: 10, qrbox: { width: 240, height: 240 } },
            (texto) => {
                const ahora = Date.now();
                if (texto === this.ultimo && ahora - this.tiempo < 3000) return;
                this.ultimo = texto;
                this.tiempo = ahora;
                this.onSuccess(texto);
            },
            () => {}
        );
    }

    async detener() {
        if (this.camera) {
            try {
                await this.camera.stop();
                await this.camera.clear();
            } catch (e) {}
            this.camera = null;
        }
    }
}
