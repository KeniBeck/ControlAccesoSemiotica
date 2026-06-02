class LoginController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.init();
    }

    init() {
        if (this.model.hasSession()) {
            this.view.redirect(APP_CONFIG.DASHBOARD_URL, 500);
            return;
        }
        this.view.attachEventListeners({ onSubmit: () => this.handleLogin() });
    }

    handleLogin() {
        const data = this.view.getFormData();
        const errors = this.model.validateCredentials(data.email, data.password);
        if (errors) {
            this.view.displayValidationErrors(errors);
            return;
        }
        this.view.showLoading();
        setTimeout(() => this.authenticate(data.email, data.password, data.rememberMe), APP_CONFIG.AUTH_DELAY);
    }

    authenticate(email, password, rememberMe) {
        const user = this.model.authenticate(email, password);
        if (user) {
            this.model.saveSession(user, rememberMe);
            this.view.showToast('success', 'Bienvenido', `Hola ${user.fullName}`);
            this.view.redirect(APP_CONFIG.DASHBOARD_URL);
        } else {
            this.view.hideLoading();
            this.view.showToast('error', 'Error', 'Correo o contraseña inválidos');
        }
    }
}
