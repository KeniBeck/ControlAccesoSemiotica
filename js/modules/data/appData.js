const APP_DATA = {
    usuarios: [
        { nombre: 'María García', documento: '1098765432', email: 'estudiante@elpoli.edu.co', rol: 'estudiante', estado: 'Activo' },
        { nombre: 'Juan Pérez', documento: '1001234567', email: 'docente@elpoli.edu.co', rol: 'docente', estado: 'Activo' },
        { nombre: 'Ana Torres', documento: '1002345678', email: 'ana.torres@elpoli.edu.co', rol: 'docente', estado: 'Activo' },
        { nombre: 'Carlos Ruiz', documento: '1003456789', email: 'carlos.ruiz@elpoli.edu.co', rol: 'docente', estado: 'Inactivo' },
        { nombre: 'Laura Méndez', documento: '1090123456', email: 'laura.mendez@elpoli.edu.co', rol: 'estudiante', estado: 'Activo' },
        { nombre: 'Pedro Sánchez', documento: '1091234567', email: 'pedro.sanchez@elpoli.edu.co', rol: 'estudiante', estado: 'Activo' },
        { nombre: 'Administrador', documento: '1000000001', email: 'admin@elpoli.edu.co', rol: 'admin', estado: 'Activo' },
        { nombre: 'Sofía López', documento: '1092345678', email: 'sofia.lopez@elpoli.edu.co', rol: 'estudiante', estado: 'Inactivo' }
    ],
    accesosIniciales: [
        { id: 1, documento: '1001234567', email: 'docente@elpoli.edu.co', nombre: 'Juan Pérez', rol: 'docente', area: 'Bloque A', tipo: 'Entrada', metodo: 'QR', observacion: '', fecha: '02/06/2026', hora: '07:45', registradoPor: 'estudiante@elpoli.edu.co' },
        { id: 2, documento: '1002345678', email: 'ana.torres@elpoli.edu.co', nombre: 'Ana Torres', rol: 'docente', area: 'Bloque B', tipo: 'Entrada', metodo: 'Manual', observacion: '', fecha: '02/06/2026', hora: '08:10', registradoPor: 'estudiante@elpoli.edu.co' },
        { id: 3, documento: '1001234567', email: 'docente@elpoli.edu.co', nombre: 'Juan Pérez', rol: 'docente', area: 'Bloque A', tipo: 'Salida', metodo: 'Manual', observacion: '', fecha: '01/06/2026', hora: '17:30', registradoPor: 'estudiante@elpoli.edu.co' },
        { id: 4, documento: '1002345678', email: 'ana.torres@elpoli.edu.co', nombre: 'Ana Torres', rol: 'docente', area: 'Laboratorios', tipo: 'Entrada', metodo: 'QR', observacion: '', fecha: '01/06/2026', hora: '09:00', registradoPor: 'estudiante@elpoli.edu.co' },
        { id: 5, documento: '1090123456', email: 'laura.mendez@elpoli.edu.co', nombre: 'Laura Méndez', rol: 'estudiante', area: 'Biblioteca', tipo: 'Entrada', metodo: 'Manual', observacion: '', fecha: '01/06/2026', hora: '14:00', registradoPor: 'estudiante@elpoli.edu.co' }
    ],
    loginUsers: {
        'admin@elpoli.edu.co': { password: '123456', fullName: 'Administrador', role: 'admin' },
        'docente@elpoli.edu.co': { password: '123456', fullName: 'Juan Pérez', role: 'docente' },
        'estudiante@elpoli.edu.co': { password: '123456', fullName: 'María García', role: 'estudiante' }
    }
};
