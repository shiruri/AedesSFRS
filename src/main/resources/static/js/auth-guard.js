/**
 * AEDES Auth Guard - Protects dashboard pages
 * Include this script in all dashboard pages
 */

(function() {
    /**
     * Require authentication - redirects to login if not authenticated
     */
    function requireAuth() {
        if (!Auth.isAuthenticated()) {
            var origin = window.location.origin;
            var path = window.location.pathname;
            var basePath = path.substring(0, path.lastIndexOf('/dashboard/') + 1);
            window.location.href = origin + basePath + '../index.html';
            return false;
        }
        return true;
    }

    /**
     * Require specific role - shows access denied if not authorized
     * @param {string|string[]} roles - Required role(s)
     * @param {string} [message] - Custom access denied message
     * @returns {boolean} - true if authorized, false otherwise
     */
    function requireRole(roles, message) {
        if (!Auth.hasRole(roles)) {
            var roleLabel = typeof roles === 'string' ? roles : roles.join(' or ');
            var msg = message || 'Only ' + roleLabel.toLowerCase() + ' can access this page.';
            showAccessDenied(msg);
            return false;
        }
        return true;
    }

    /**
     * Show access denied message
     */
    function showAccessDenied(message) {
        var mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = '<div class="card" style="text-align:center;padding:3rem;"><h2>Access Denied</h2><p style="color:var(--txt3);margin-top:.5rem">' + message + '</p><a href="../dashboard.html" class="btn btn-primary" style="margin-top:1rem;display:inline-block">Back to Dashboard</a></div>';
        }
    }

    /**
     * Hide element if user doesn't have role
     * @param {string|string[]} roles - Required role(s)
     * @param {string} selector - CSS selector for element(s) to hide
     */
    function hideIfNotRole(roles, selector) {
        if (!Auth.hasRole(roles)) {
            var elements = document.querySelectorAll(selector);
            elements.forEach(function(el) {
                el.style.display = 'none';
            });
        }
    }

    /**
     * Show element only if user has role
     * @param {string|string[]} roles - Required role(s)
     * @param {string} selector - CSS selector for element(s) to show
     */
    function showIfHasRole(roles, selector) {
        if (!Auth.hasRole(roles)) {
            var elements = document.querySelectorAll(selector);
            elements.forEach(function(el) {
                el.style.display = 'none';
            });
        }
    }

    /**
     * Get current user role
     */
    function getUserRole() {
        var user = Auth.getUser();
        return user ? user.role : null;
    }

    // Expose
    window.AuthGuard = {
        requireAuth: requireAuth,
        requireRole: requireRole,
        showAccessDenied: showAccessDenied,
        hideIfNotRole: hideIfNotRole,
        showIfHasRole: showIfHasRole,
        getUserRole: getUserRole
    };
})();
