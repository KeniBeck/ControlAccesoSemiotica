class AuthModel {
    static validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static validateCredentials(email, password) {
        const errors = {};
        if (!email.trim()) errors.email = 'El correo es requerido';
        else if (!this.validateEmail(email)) errors.email = 'Correo inválido';
        if (!password) errors.password = 'La contraseña es requerida';
        else if (password.length < APP_CONFIG.MIN_PASSWORD_LENGTH) {
            errors.password = `Mínimo ${APP_CONFIG.MIN_PASSWORD_LENGTH} caracteres`;
        }
        return Object.keys(errors).length ? errors : null;
    }

    static authenticate(email, password) {
        const user = APP_DATA.loginUsers[email];
        if (user && user.password === password) {
            return { email, fullName: user.fullName, role: user.role, loginTime: new Date().toISOString() };
        }
        return null;
    }

    static saveSession(user, rememberMe) {
        localStorage.setItem(APP_CONFIG.SESSION_KEY, JSON.stringify({ ...user, rememberMe }));
    }

    static getSession() {
        try {
            const s = localStorage.getItem(APP_CONFIG.SESSION_KEY);
            return s ? JSON.parse(s) : null;
        } catch (e) {
            this.clearSession();
            return null;
        }
    }

    static clearSession() {
        localStorage.removeItem(APP_CONFIG.SESSION_KEY);
    }

    static hasSession() {
        return this.getSession() !== null;
    }
}
