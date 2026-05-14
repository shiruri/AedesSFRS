const Auth = {
    TOKEN_KEY: 'aedes_token',
    USER_KEY: 'aedes_user',

    setToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    },

    getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    },

    removeToken() {
        localStorage.removeItem(this.TOKEN_KEY);
    },

    setUser(user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    },

    getUser() {
        const user = localStorage.getItem(this.USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    removeUser() {
        localStorage.removeItem(this.USER_KEY);
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    login(response) {
        this.setToken(response.token);
        this.setUser(response.userResponse || response.user);
    },

    logout() {
        this.removeToken();
        this.removeUser();
        window.location.href = 'login.html';
    },

    redirectByRole() {
        const user = this.getUser();
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        switch (user.role) {
            case 'ADMIN':
                window.location.href = 'admin/dashboard.html';
                break;
            case 'FACULTY':
                window.location.href = 'faculty/dashboard.html';
                break;
            case 'STUDENT':
                window.location.href = 'student/dashboard.html';
                break;
            default:
                window.location.href = 'dashboard.html';
        }
    },

    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    requireRole(allowedRoles) {
        const user = this.getUser();
        if (!user || !allowedRoles.includes(user.role)) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    async refreshUser() {
        try {
            const user = await API.auth.me();
            this.setUser(user);
            return user;
        } catch (error) {
            this.logout();
            return null;
        }
    }
};

window.Auth = Auth;