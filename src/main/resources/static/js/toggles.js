// AEDES theme toggler — fast, shared across all pages
(function() {
    var key = 'aedes-theme';
    var st = localStorage.getItem(key);
    var pd = window.matchMedia('(prefers-color-scheme:dark)').matches;
    if (st === 'dark' || (!st && pd)) document.documentElement.classList.add('dark-mode');

    function ready(fn) {
        if (document.readyState !== 'loading') { fn(); return; }
        document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function() {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;
        btn.addEventListener('click', function() {
            var isDark = document.documentElement.classList.toggle('dark-mode');
            document.body.classList.toggle('dark-mode', isDark);
            localStorage.setItem(key, isDark ? 'dark' : 'light');
        });
    });
})();
