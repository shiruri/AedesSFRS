const Theme = {
    STORAGE_KEY: 'aedes_theme',
    DARK_CLASS: 'dark-mode',

    init() {
        const savedTheme = localStorage.getItem(this.STORAGE_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            this.enableDark();
        } else {
            this.disableDark();
        }

        this.setupToggle();
    },

    enableDark() {
        document.body.classList.add(this.DARK_CLASS);
        localStorage.setItem(this.STORAGE_KEY, 'dark');
    },

    disableDark() {
        document.body.classList.remove(this.DARK_CLASS);
        localStorage.setItem(this.STORAGE_KEY, 'light');
    },

    toggle() {
        if (document.body.classList.contains(this.DARK_CLASS)) {
            this.disableDark();
        } else {
            this.enableDark();
        }
        this.updateToggleIcon();
    },

    isDark() {
        return document.body.classList.contains(this.DARK_CLASS);
    },

    setupToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            this.updateToggleIcon();
            toggle.addEventListener('click', () => this.toggle());
        }

        const mobileToggle = document.getElementById('theme-toggle-mobile');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggle());
        }
    },

    updateToggleIcon() {
        const toggles = document.querySelectorAll('[id*="theme-toggle"]');
        const isDark = this.isDark();

        toggles.forEach(toggle => {
            if (toggle.tagName === 'BUTTON' || toggle.tagName === 'A') {
                toggle.innerHTML = isDark
                    ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
                    : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
});

window.Theme = Theme;