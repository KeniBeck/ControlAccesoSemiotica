class LoginView {
    constructor() {
        this.form = $('#loginForm');
        this.emailInput = $('#email');
        this.passwordInput = $('#password');
        this.togglePasswordBtn = $('#togglePassword');
        this.rememberMeCheckbox = $('#rememberMe');
        this.submitBtn = this.form.find('button[type="submit"]');
        this.btnText = $('#btnText');
        this.btnSpinner = $('#btnSpinner');
        this.toast = $('#loginToast');
        this.toastHeader = this.toast.find('.toast-header');
        this.toastBody = this.toast.find('.toast-body');
    }

    getFormData() {
        return {
            email: this.emailInput.val().trim(),
            password: this.passwordInput.val(),
            rememberMe: this.rememberMeCheckbox.is(':checked')
        };
    }

    showFieldError(fieldId, message) {
        const field = $(`#${fieldId}`);
        field.addClass('is-invalid');
        $(`#${fieldId}Error`).text(message).show();
    }

    clearErrors() {
        this.emailInput.add(this.passwordInput).removeClass('is-invalid');
        $('#emailError, #passwordError').hide();
    }

    displayValidationErrors(errors) {
        this.clearErrors();
        
        if (errors.email) {
            this.showFieldError('email', errors.email);
        }
        if (errors.password) {
            this.showFieldError('password', errors.password);
        }
    }

    disableForm() {
        this.submitBtn.prop('disabled', true);
        this.emailInput.prop('disabled', true);
        this.passwordInput.prop('disabled', true);
        this.rememberMeCheckbox.prop('disabled', true);
    }

    enableForm() {
        this.submitBtn.prop('disabled', false);
        this.emailInput.prop('disabled', false);
        this.passwordInput.prop('disabled', false);
        this.rememberMeCheckbox.prop('disabled', false);
    }

    showLoading() {
        this.disableForm();
        this.btnText.text('Verificando...');
        this.btnSpinner.removeClass('d-none');
    }

    hideLoading() {
        this.enableForm();
        this.btnText.text('Iniciar Sesión');
        this.btnSpinner.addClass('d-none');
    }

    showToast(type, title, message) {
        this.toastBody.text(message);

        const iconClass = type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle';
        const bgClass = type === 'error' ? 'bg-danger' : 'bg-success';
        const currentBgClass = type === 'error' ? 'bg-success' : 'bg-danger';

        this.toastHeader
            .removeClass(currentBgClass)
            .addClass(bgClass)
            .html(`
                <i class="fas ${iconClass} me-2"></i>
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            `);

        const toast = new bootstrap.Toast(this.toast[0]);
        toast.show();
    }

    resetForm() {
        this.form[0].reset();
        this.clearErrors();
    }

    attachEventListeners(callbacks) {
        this.form.on('submit', (e) => {
            e.preventDefault();
            if (callbacks.onSubmit) {
                callbacks.onSubmit();
            }
        });

        this.togglePasswordBtn.on('click', () => {
            this.togglePasswordVisibility();
            if (callbacks.onPasswordToggle) {
                callbacks.onPasswordToggle();
            }
        });

        this.emailInput.add(this.passwordInput).on('input', () => {
            this.clearErrors();
            if (callbacks.onInputChange) {
                callbacks.onInputChange();
            }
        });

        this.passwordInput.on('keypress', (e) => {
            if (e.which === 13) {
                this.form.submit();
            }
        });
    }

    togglePasswordVisibility() {
        const isPassword = this.passwordInput.attr('type') === 'password';
        const newType = isPassword ? 'text' : 'password';
        const icon = this.togglePasswordBtn.find('i');

        this.passwordInput.attr('type', newType);
        icon.toggleClass('fa-eye fa-eye-slash');
    }

    redirect(url, delay) {
        const ms = delay !== undefined ? delay : (APP_CONFIG.REDIRECT_DELAY || 800);
        setTimeout(function() {
            window.location.href = url;
        }, ms);
    }
}
