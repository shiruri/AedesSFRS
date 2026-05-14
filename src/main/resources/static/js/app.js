const App = {
    showLoading(element) {
        if (element) {
            element.dataset.originalContent = element.innerHTML;
            element.innerHTML = '<span class="spinner"></span> Processing...';
            element.disabled = true;
            element.style.opacity = '0.8';
        }
    },

    hideLoading(element) {
        if (element && element.dataset.originalContent) {
            element.innerHTML = element.dataset.originalContent;
            element.disabled = false;
            element.style.opacity = '1';
            delete element.dataset.originalContent;
        }
    },

    showError(message, containerId = 'alert-container') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            setTimeout(() => {
                container.innerHTML = `
                    <div class="alert alert-error fade-in-up">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        <span>${message}</span>
                    </div>
                `;
            }, 50);
            setTimeout(() => {
                container.innerHTML = '';
            }, 5000);
        }
    },

    showSuccess(message, containerId = 'alert-container') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            setTimeout(() => {
                container.innerHTML = `
                    <div class="alert alert-success fade-in-up">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        <span>${message}</span>
                    </div>
                `;
            }, 50);
            setTimeout(() => {
                container.innerHTML = '';
            }, 5000);
        }
    }
};

const Validator = {
    email(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return 'Email is required';
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return null;
    },

    password(value, minLength = 6) {
        if (!value) return 'Password is required';
        if (value.length < minLength) return `Password must be at least ${minLength} characters`;
        return null;
    },

    confirmPassword(password, confirmPassword) {
        if (!confirmPassword) return 'Please confirm your password';
        if (password !== confirmPassword) return 'Passwords do not match';
        return null;
    },

    required(value, fieldName = 'Field') {
        if (!value || !value.trim()) return `${fieldName} is required`;
        return null;
    },

    username(value) {
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 50) return 'Username must be less than 50 characters';
        return null;
    },

    role(value) {
        const validRoles = ['ADMIN', 'FACULTY', 'STUDENT'];
        if (!value) return 'Please select a role';
        if (!validRoles.includes(value)) return 'Invalid role selected';
        return null;
    },

    validateForm(formData, rules) {
        const errors = {};
        let isValid = true;

        for (const [field, rule] of Object.entries(rules)) {
            const error = rule(formData[field]);
            if (error) {
                errors[field] = error;
                isValid = false;
            }
        }

        return { isValid, errors };
    },

    showFieldError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorEl = document.getElementById(`${inputId}-error`);
        const helperEl = document.getElementById(`${inputId}-helper`);

        if (input) {
            input.classList.add('input-error');
        }
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
        if (helperEl) {
            helperEl.style.display = 'none';
        }
    },

    clearFieldError(inputId) {
        const input = document.getElementById(inputId);
        const errorEl = document.getElementById(`${inputId}-error`);
        const helperEl = document.getElementById(`${inputId}-helper`);

        if (input) {
            input.classList.remove('input-error');
        }
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
        if (helperEl) {
            helperEl.style.display = 'block';
        }
    },

    clearAllErrors(formId) {
        const form = document.getElementById(formId);
        if (form) {
            const inputs = form.querySelectorAll('.input');
            inputs.forEach(input => {
                this.clearFieldError(input.id);
            });
        }
    }
};

window.App = App;
window.Validator = Validator;